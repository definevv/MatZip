import { Router } from 'express';
import { select } from '../sparqlClient';

export const search = Router();

/* =========================
   공통 유틸
========================= */

const STOP = [
  '을','를','이','가','은','는','의','과','와','에서',
  '있는','가지','메뉴','음식점','식당','가게','집','로','으로','한'
];

function extractKeyword(input: string): string {
  const s = String(input || '').trim();
  const m = s.match(/["“”](.+?)["“”]/);
  if (m) return m[1].trim();

  const tokens = s
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(t => t && !STOP.includes(t));

  if (!tokens.length) return s;
  tokens.sort((a, b) => b.length - a.length);
  return tokens[0];
}

function esc(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}

/* =========================
   메뉴 검색 → 음식점
   (음식점명 우선 판별)
========================= */
async function searchByMenu(keyword: string) {
  const q = esc(keyword.toLowerCase());

  const sparql = `
PREFIX rdfs:   <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <http://schema.org/>
PREFIX kofd:   <https://knowledgemap.kr/kofd/def/>

SELECT DISTINCT
  ?rest
  ?restName
  ?menuName
  ?addr
  ?x
  ?y
WHERE {
  GRAPH <https://knowledgemap.kr/kofd/graph/menu> {
    ?menu a kofd:Menu ;
          schema:name ?menuName ;
          kofd:inMenu ?rest .

    FILTER(CONTAINS(LCASE(STR(?menuName)), "${q}"))

    ?rest a kofd:Restaurant ;
          schema:name ?restName .

    OPTIONAL { ?rest schema:address ?addr }
    OPTIONAL { ?rest kofd:x5174 ?x }
    OPTIONAL { ?rest kofd:y5174 ?y }
  }
}
LIMIT 50
`;

  const rows = await select<any>(sparql);

  return rows.map(r => {
    const restName = r.restName ?? '';
    const isRestaurantMatch =
      restName.toLowerCase().includes(keyword.toLowerCase());

    return {
      id: String(r.rest),
      name: restName,
      address: r.addr ?? '',
      x: r.x ? Number(r.x) : null,
      y: r.y ? Number(r.y) : null,

      // ⭐ 핵심
      matchType: isRestaurantMatch ? 'RESTAURANT' : 'MENU',
      matchDetail: isRestaurantMatch ? null : r.menuName,
    };
  });
}

/* =========================
   중복 병합 (음식점 기준)
========================= */

const RANK = {
  RESTAURANT: 2,
  MENU: 1,
};

function mergeByRestaurant(items: any[]) {
  const map = new Map<string, any>();

  for (const item of items) {
    if (!map.has(item.id)) {
      map.set(item.id, item);
      continue;
    }

    const prev = map.get(item.id);
    if (RANK[item.matchType] > RANK[prev.matchType]) {
      map.set(item.id, { ...prev, ...item });
    }
  }

  return [...map.values()];
}

/* =========================
   GET /api/search
========================= */
search.get('/', async (req, res) => {
  const raw = String(req.query.q || '').trim();
  if (!raw) return res.json([]);

  const keyword = extractKeyword(raw);

  try {
    const results = await searchByMenu(keyword);
    const merged = mergeByRestaurant(results);
    res.json(merged);
  } catch (e: any) {
    console.error('[search] error:', e?.message);
    res.status(500).json({ error: e?.message || 'search failed' });
  }
});

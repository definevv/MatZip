// src/routes/search.ts
import { Router } from 'express';
import { select } from '../sparqlClient';

export const search = Router();

const STOP = ['을','를','이','가','은','는','의','과','와','에서','있는','가지','메뉴','음식점','식당','가게','집','로','으로','한'];

function extractKeyword(input: string): string {
  const s = String(input || '').trim();
  const m = s.match(/["“”](.+?)["“”]/);
  if (m) return m[1].trim();

  const tokens = s.replace(/[^\p{L}\p{N}\s]/gu, ' ')
                  .split(/\s+/)
                  .filter(t => t && !STOP.includes(t));
  if (!tokens.length) return s;
  tokens.sort((a, b) => b.length - a.length);
  return tokens[0];
}

// SPARQL literal escape (", \, newline 등)
function escapeSparqlLiteral(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}

const SPARQL = `
PREFIX schema: <http://schema.org/>
SELECT ?rest ?name WHERE {
  GRAPH <https://knowledgemap.kr/kofd/graph/menu> {
    ?rest schema:name ?name .
    FILTER(CONTAINS(LCASE(STR(?name)), "월미간장게장"))
  }
} LIMIT 10
`;

search.get('/', async (req, res) => {
  const raw = String(req.query.q || '').trim();
  const kw  = extractKeyword(raw);
  const q   = kw.toLowerCase();

  // ❶ 치환 + 이스케이프 확실히
  const sparqlFinal = SPARQL.replaceAll('{{KW}}', escapeSparqlLiteral(q));

  try {
    const rows = await select<any>(sparqlFinal);

    // 디버그
    if (rows.length === 0) {
      console.log('[SPARQL OUT rows] 0');
      console.log('[KW]', kw);
      console.log('[QUERY]\n' + sparqlFinal);
    }

    const out = rows.map((r: any) => ({
      id: String(r.rest),
      name: r.name ?? '',
      address: r.addr ?? '',
      category: r.cuisine ?? '',
      review_count: 0,
      description: '',
      menu: [] as string[],
    }));

    res.json(out);
  } catch (e: any) {
    console.error('[search] sparql error:', e?.message);
    console.error('--- RAW KW / FINAL ---', { raw, kw, final: sparqlFinal.slice(0, 500) + '...' });
    res.status(500).json({ error: e?.message || 'sparql failed' });
  }
});

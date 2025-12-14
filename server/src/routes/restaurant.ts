// server/src/routes/restaurant.ts
import { Router } from 'express';
import { select } from '../sparqlClient';

export const restaurant = Router();

restaurant.get('/', async (req, res) => {
  const id = String(req.query.id || '');
  if (!id) return res.status(400).json({ error: 'id required' });

  const sparql = `
PREFIX schema: <http://schema.org/>
PREFIX kofd:   <https://knowledgemap.kr/kofd/def/>

SELECT ?name ?addr ?x ?y ?menuName WHERE {
  GRAPH <https://knowledgemap.kr/kofd/graph/menu> {

    BIND(<${id}> AS ?rest)

    ?rest a kofd:Restaurant ;
          schema:name ?name .

    OPTIONAL { ?rest schema:address ?addr }
    OPTIONAL { ?rest kofd:x5174 ?x }
    OPTIONAL { ?rest kofd:y5174 ?y }

    # ✅ 메뉴 붙이기
    OPTIONAL {
      ?menu a kofd:Menu ;
            schema:name ?menuName ;
            kofd:inMenu ?rest .
    }
  }
}
`;

  try {
    const rows = await select<any>(sparql);
    if (!rows.length) return res.status(404).json(null);

    // ✅ rows 여러 줄(메뉴 개수만큼) → 1개 객체로 합치기
    const base = rows[0];
    const menu = rows
      .map((r) => r.menuName)
      .filter(Boolean);

    const uniqueMenu = Array.from(new Set(menu));

    res.json({
      id,
      name: base.name ?? '',
      address: base.addr ?? '',
      x: base.x ? Number(base.x) : null,
      y: base.y ? Number(base.y) : null,
      menu: uniqueMenu,
    });
  } catch (e: any) {
    console.error('[restaurant] error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

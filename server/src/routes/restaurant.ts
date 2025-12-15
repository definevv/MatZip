import { Router } from 'express';
import { select } from '../sparqlClient';
import { convertTMToWGS84 } from '../utils/convertTMToWGS84';

export const restaurant = Router();

restaurant.get('/', async (req, res) => {
  const id = String(req.query.id || '');
  if (!id) {
    return res.status(400).json({ error: 'id required' });
  }

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
    if (!rows.length) {
      return res.status(404).json(null);
    }

    /** =========================
     *  기본 정보
     ========================= */
    const base = rows[0];

    /** =========================
     *  메뉴 병합 (중복 제거)
     ========================= */
    const menu = Array.from(
      new Set(
        rows
          .map((r) => r.menuName)
          .filter(Boolean)
      )
    );

    /** =========================
     *  좌표 변환 (TM → WGS84)
     ========================= */
    let lat: number | null = null;
    let lng: number | null = null;

    if (base.x && base.y) {
      try {
        const converted = await convertTMToWGS84(
          Number(base.x),
          Number(base.y)
        );
        lat = converted.lat;
        lng = converted.lng;
      } catch (e) {
        console.error('[restaurant] coord convert error:', e);
      }
    }

    /** =========================
     *  응답
     ========================= */
    res.json({
      id,
      name: base.name ?? '',
      address: base.addr ?? '',
      lat,
      lng,
      menu,
    });
  } catch (e: any) {
    console.error('[restaurant] error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

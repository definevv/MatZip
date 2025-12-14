// utils/fuseki-graph.ts

const FUSEKI_URL = "http://203.234.62.168:3030/kofd/sparql";

export async function fetchGraphData(restaurantUri: string) {
  const query = `
PREFIX kofd: <https://knowledgemap.kr/kofd/def/>
PREFIX kprd: <https://knowledgemap.kr/kofd/review/>
PREFIX schema: <https://schema.org/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
FROM <https://knowledgemap.kr/kofd/graph/menu>
FROM <https://knowledgemap.kr/kofd/graph/review>

SELECT ?menu ?menuName ?feature ?featureLabel
WHERE {
  OPTIONAL {
    ?menu a kofd:Menu ;
          kofd:inMenu <${restaurantUri}> ;
          schema:name ?menuName .
  }

  # 리뷰(feature) 연결
  OPTIONAL {
    <${restaurantUri}> ?p ?reviewNode .
    FILTER(STRSTARTS(STR(?p), STR(kprd:)))

    ?reviewNode kprd:targetFeature ?feature .
    OPTIONAL { ?feature rdfs:label ?featureLabel }
  }
}
`;

  const url = FUSEKI_URL + "?query=" + encodeURIComponent(query);

  const res = await fetch(url, {
    headers: { Accept: "application/sparql-results+json" }
  });

  // JSON parse 실패 방지
  if (!res.ok) {
    const text = await res.text();
    console.error("Fuseki Error Response:", text);
    throw new Error("Fuseki 쿼리 에러: " + text);
  }

  const json = await res.json();
  const results = json.results.bindings;

  const nodes: any[] = [];
  const links: any[] = [];

  // 레스토랑 노드
  nodes.push({
    id: restaurantUri,
    label: "Restaurant",
    group: "restaurant"
  });

  for (const row of results) {
    // 메뉴
    if (row.menu) {
      const menuUri = row.menu.value;
      const menuName = row.menuName?.value ?? "메뉴";

      if (!nodes.find(n => n.id === menuUri)) {
        nodes.push({ id: menuUri, label: menuName, group: "menu" });
      }

      links.push({
        source: restaurantUri,
        target: menuUri,
        label: "메뉴"
      });
    }

    // 리뷰 Feature
    if (row.feature) {
      const fUri = row.feature.value;
      const fLabel = row.featureLabel?.value ?? "Feature";

      if (!nodes.find(n => n.id === fUri)) {
        nodes.push({ id: fUri, label: fLabel, group: "feature" });
      }

      links.push({
        source: restaurantUri,
        target: fUri,
        label: "리뷰특성"
      });
    }
  }

  return { nodes, links };
}
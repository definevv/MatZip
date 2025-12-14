export async function runFusekiQuery(query: string) {
  const endpoint = "http://203.234.62.168:3030/kofd/sparql";

  // 🔥 GET 방식으로 변경
  const url = endpoint + "?query=" + encodeURIComponent(query);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/sparql-results+json"
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error("Fuseki 오류: " + text);
  }

  return response.json();
}


// 🔍 일반 검색 (라벨 기반)
export async function searchRestaurants(keyword: string) {
  const query = `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX kofd: <https://knowledgemap.kr/kofd/def/>

SELECT ?uri ?label
WHERE {
  ?uri a kofd:Restaurant ;
       rdfs:label ?label .
  FILTER(CONTAINS(?label, "${keyword}"))
}
LIMIT 50
`;

  const json = await runFusekiQuery(query);

  return json.results.bindings.map((r: any) => ({
    id: r.uri.value,
    name: r.label.value,
  }));
}



// 🔥 상세 조회
export async function getRestaurantDetail(uri: string) {
  const query = `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <https://schema.org/>
PREFIX kprd: <https://knowledgemap.kr/kofd/review/>

SELECT ?label ?address ?score ?feature
WHERE {
  <${uri}> rdfs:label ?label .
  OPTIONAL { <${uri}> schema:address ?address . }

  OPTIONAL {
    <${uri}> kprd:hasQualityEval [
      kprd:targetFeature ?feature ;
      kprd:scoreValue ?score
    ] .
  }
}
`;

  const json = await runFusekiQuery(query);

  return {
    name: json.results.bindings[0]?.label?.value || "",
    address: json.results.bindings[0]?.address?.value || "",
    scores: json.results.bindings.map((b: any) => ({
      feature: b.feature?.value,
      score: b.score?.value,
    })),
  };
}

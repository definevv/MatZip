// src/utils/fuseki-detail.ts
const FUSEKI_QUERY_URL = "http://203.234.62.168:3030/kofd/sparql";

export async function getRestaurantDetail(uri: string) {
  const query = `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX kprd: <https://knowledgemap.kr/kofd/review/>

SELECT ?p ?o WHERE {
  <${uri}> ?p ?o .
}
`;

  const url = FUSEKI_QUERY_URL + "?query=" + encodeURIComponent(query);

  const res = await fetch(url, {
    headers: { Accept: "application/sparql-results+json" },
  });

  const json = await res.json();
  const bindings = json.results.bindings;

  let name = "";
  let address = "";
  let menus: string[] = [];
  let lat: number | undefined;
  let lng: number | undefined;

  bindings.forEach((b: any) => {
    const p = b.p.value;
    const o = b.o.value;

    if (p.endsWith("label")) name = o;
    if (p.endsWith("hasAddress")) address = o;
    if (p.endsWith("hasMenu")) menus.push(o); // o는 menu URI

    if (p.endsWith("lat")) lat = parseFloat(o);
    if (p.endsWith("lng")) lng = parseFloat(o);
  });

  // 메뉴 URI → 메뉴 이름(label) 조회 (2단계 쿼리 가능)
  // 여기서는 TTL 내용에 따라 간단 처리 (직접 label 포함되어 있으면 메뉴 이름으로 사용)
  menus = menus.map((m) => m.replace("http://", "").split("/").pop() ?? m);

  return {
    id: uri,
    name,
    address,
    menus,
    lat,
    lng,
  };
  
}

import fetch from 'node-fetch';

const ENDPOINT = 'http://203.234.62.168:3030/kofd/sparql';

export async function select<T = any>(query: string): Promise<T[]> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': 'application/sparql-results+json',
    },
    body: new URLSearchParams({
      query,
    }).toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fuseki error ${res.status}: ${text}`);
  }

  const json = await res.json();

  return json.results.bindings.map((row: any) => {
    const obj: any = {};
    for (const k in row) {
      obj[k] = row[k].value;
    }
    return obj;
  });
}

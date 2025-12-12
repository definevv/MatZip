import 'dotenv/config';
import SparqlClient from 'sparql-http-client';

const base = process.env.FUSEKI_URL!;
const dataset = process.env.FUSEKI_DATASET!;
const queryPath = process.env.FUSEKI_QUERY || '/sparql';
const updatePath = process.env.FUSEKI_UPDATE || '/update';

export const sparql = new SparqlClient({
  endpointUrl: `${base}/${dataset}${queryPath}`,
  updateUrl: `${base}/${dataset}${updatePath}`,
  user: process.env.FUSEKI_USER,
  password: process.env.FUSEKI_PASSWORD
});

export async function select<T = Record<string, any>>(query: string): Promise<T[]> {
  const stream = await (sparql as any).query.select(query, {
    headers: { accept: 'application/sparql-results+json' }
  });
  const rows: T[] = [];
  for await (const row of stream) {
    const obj: any = {};
    for (const [k, v] of Object.entries(row)) obj[k] = (v as any).value;
    rows.push(obj);
  }
  return rows;
}

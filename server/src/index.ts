// server/src/index.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { search } from './routes/search';
import { select } from './sparqlClient';
import { restaurant } from './routes/restaurant';


const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(morgan('dev'));
app.use('/api/restaurant', restaurant);

// 헬스체크
app.get('/api/health', (_, res) => res.json({ ok: true }));

// Fuseki 연결 확인
app.get('/api/fuseki/ping', async (_, res) => {
  try {
    const rows = await select<{ n: string }>(
      `SELECT (COUNT(*) AS ?n) WHERE { ?s ?p ?o }`
    );
    res.json({ connected: true, triples: Number(rows[0]?.n ?? 0) });
  } catch (e: any) {
    res.status(500).json({ connected: false, error: e?.message });
  }
});

// 🔍 검색 엔진
app.use('/api/search', search);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`API on http://localhost:${port}`);
});

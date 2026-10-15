import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { contactRouter } from './src/routes/contact.js';
import { verifyTransport } from './src/mailer.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(cors({ origin: origins, methods: ['POST', 'GET'] }));
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/contact', contactRouter);

app.use((_req, res) => res.status(404).json({ ok: false, error: 'Bulunamadı.' }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ ok: false, error: 'Mesaj çok uzun.' });
  }
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ ok: false, error: 'Geçersiz istek.' });
  }
  console.error('[server]', err);
  return res.status(500).json({ ok: false, error: 'Sunucu hatası.' });
});

app.listen(PORT, async () => {
  console.log(`✔ Estepink API → http://localhost:${PORT}`);
  await verifyTransport();
});

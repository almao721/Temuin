const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const path    = require('path');

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routers ───────────────────────────────────────────────────────────────────
// router lama (sudah ada)
const mainRouter = require('./router');
app.use('/', mainRouter);

// router baru - admin
const adminRouter     = require('./src/router/adminRouter');
const kuisionerRouter = require('./src/router/kuisionerRouter');

app.use('/api/admin',     adminRouter);
app.use('/api/kuisioner', kuisionerRouter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server Temuin berjalan', timestamp: new Date() });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route tidak ditemukan' });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server Temuin berjalan di http://localhost:${PORT}`);
  console.log(`📋 Health : http://localhost:${PORT}/health`);
  console.log(`🔑 Auth   : http://localhost:${PORT}/api/auth/login`);
  console.log(`👮 Admin  : http://localhost:${PORT}/api/admin/dashboard/stats\n`);
});

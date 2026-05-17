const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const path       = require('path');

dotenv.config();

const db = require('./src/config/db');
global.db = db;

// ── Pastikan kolom schema ada ──────────────────────────────────────────────────
const ensureSchema = async () => {
  try {
    const [laporanColumns] = await db.execute("SHOW COLUMNS FROM laporan LIKE 'status'");
    if (laporanColumns.length === 0) {
      console.log('🚧 Menambahkan kolom status ke tabel laporan...');
      await db.execute(
        "ALTER TABLE laporan ADD COLUMN status ENUM('aktif','selesai','ditolak') NOT NULL DEFAULT 'aktif' AFTER kategori_id"
      );
    }

    const [kategoriColumns] = await db.execute("SHOW COLUMNS FROM kategori LIKE 'pertanyaan'");
    if (kategoriColumns.length === 0) {
      console.log('🚧 Menambahkan kolom pertanyaan ke tabel kategori...');
      await db.execute("ALTER TABLE kategori ADD COLUMN pertanyaan TEXT NULL AFTER icon_url");
    }

    // Pastikan kategori dasar ada
    const ensureCategoryExists = async (nama_kategori, deskripsi) => {
      const [rows] = await db.execute(
        'SELECT id FROM kategori WHERE nama_kategori = ? LIMIT 1',
        [nama_kategori]
      );
      if (rows.length === 0) {
        await db.execute(
          'INSERT INTO kategori (nama_kategori, deskripsi, status) VALUES (?, ?, 1)',
          [nama_kategori, deskripsi]
        );
      }
    };
    await ensureCategoryExists('Pribadi', 'Barang pribadi seperti dompet, kunci, identitas');
    await ensureCategoryExists('Kunci', 'Kunci motor, rumah, atau brankas');
  } catch (error) {
    console.error('Gagal memeriksa/memperbarui schema awal:', error);
  }
};

ensureSchema();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin:         process.env.FRONTEND_URL || 'http://localhost:3000',
  methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials:    true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// ── ROUTES — urutan penting: spesifik dulu, wildcard (/) paling bawah ─────────
app.use('/api/auth',      require('./src/router/authRouter'));
app.use('/api/admin',     require('./src/router/adminRouter'));
app.use('/api/kuisioner', require('./src/router/kuisionerRouter'));
app.use('/',              require('./src/router'));   // ← harus paling bawah

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server Temuin berjalan di http://localhost:${PORT}`);
  console.log(`📋 Health   : http://localhost:${PORT}/health`);
  console.log(`🔐 Auth     : POST http://localhost:${PORT}/api/auth/login`);
  console.log(`👮 Admin    : GET  http://localhost:${PORT}/api/admin/dashboard/stats`);
  console.log(`📝 Kuisioner: POST http://localhost:${PORT}/api/kuisioner`);
});
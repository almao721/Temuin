const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const path       = require('path');

dotenv.config();

const db = require('./src/config/db');
global.db = db;

// ── Verifikasi koneksi DB ──────────────────────────────────────────────────────
const verifyDB = async () => {
  try {
    await db.execute('SELECT 1');
    console.log('✅ Database terhubung');

    // Pastikan tabel kuisioner_laporan ada
    const [kuisionerTables] = await db.execute("SHOW TABLES LIKE 'kuisioner_laporan'");
    if (kuisionerTables.length === 0) {
      console.log('🚧 Membuat tabel kuisioner_laporan...');
      await db.execute(`
        CREATE TABLE IF NOT EXISTS kuisioner_laporan (
          id               INT          NOT NULL AUTO_INCREMENT,
          laporan_id       INT          NOT NULL UNIQUE,
          jenis_barang     VARCHAR(100) NOT NULL,
          warna_barang     VARCHAR(100) DEFAULT NULL,
          deskripsi_detail TEXT         DEFAULT NULL,
          brand_merk       VARCHAR(150) DEFAULT NULL,
          waktu_terakhir   VARCHAR(200) DEFAULT NULL,
          lokasi_terakhir  VARCHAR(255) DEFAULT NULL,
          created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          FOREIGN KEY (laporan_id) REFERENCES laporan (id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
      `);
    }

    // Pastikan kolom pertanyaan ada di tabel kategori
    const [kategoriColumns] = await db.execute("SHOW COLUMNS FROM kategori LIKE 'pertanyaan'");
    if (kategoriColumns.length === 0) {
      console.log('🚧 Menambahkan kolom pertanyaan ke tabel kategori...');
      await db.execute("ALTER TABLE kategori ADD COLUMN pertanyaan TEXT NULL AFTER icon_url");
    }

    // Pastikan tabel notifikasi ada
    const [notifTables] = await db.execute("SHOW TABLES LIKE 'notifikasi'");
    if (notifTables.length === 0) {
      console.log('🚧 Membuat tabel notifikasi...');
      await db.execute(`
        CREATE TABLE IF NOT EXISTS notifikasi (
          id          INT          NOT NULL AUTO_INCREMENT,
          user_id     INT          NOT NULL,
          laporan_id  INT          NOT NULL,
          pesan       TEXT         NOT NULL,
          is_read     TINYINT(1)   DEFAULT 0,
          created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          INDEX idx_user_read (user_id, is_read)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('✅ Tabel notifikasi berhasil dibuat');
    }
  } catch (error) {
    console.error('❌ Gagal verifikasi database:', error.message);
  }
};

verifyDB();

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
const express  = require('express');
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');
const moment   = require('moment');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');

const UserModel             = require('../../models/userModel');
const LokasiModel           = require('../../models/lokasi');
const KategoriModel         = require('../../models/kategori');
const LaporanModel          = require('../../models/laporan');
const LaporanPenemuanModel  = require('../../models/laporanPenemuan');
const LaporanKehilanganModel = require('../../models/laporanKehilangan');

const response = require('../../utils/response');
const db       = require('../config/db');

const router = express.Router();

const parseNumericId = (value) => {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number' && Number.isInteger(value)) return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const resolveKategoriId = async (value) => {
  const numericId = parseNumericId(value);
  if (numericId) return numericId;
  if (!value) return null;
  const kategori = await KategoriModel.findByName(String(value));
  return kategori?.id || null;
};

const resolveLokasiId = async (value) => {
  const numericId = parseNumericId(value);
  if (numericId) return numericId;
  if (!value) return null;
  const lokasi = await LokasiModel.findByName(String(value));
  return lokasi?.id || null;
};

// ── Token blacklist (logout) ───────────────────────────────────────────────────
const tokenBlacklist = new Set();

// ── Middleware verifyToken ─────────────────────────────────────────────────────
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      return response.error(res, 'Token tidak ditemukan', 401);

    const token = authHeader.split(' ')[1];
    if (tokenBlacklist.has(token))
      return response.error(res, 'Sesi telah berakhir, silakan login kembali', 401);

    req.user  = jwt.verify(token, process.env.JWT_SECRET);
    req.token = token;
    next();
  } catch {
    return response.error(res, 'Token tidak valid', 401);
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) return response.error(res, 'Unauthorized', 401);
  if (!roles.includes(req.user.role))
    return response.error(res, 'Anda tidak memiliki akses', 403);
  next();
};

// ── Upload (foto barang) ───────────────────────────────────────────────────────
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits:     { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase())
            && /jpeg|jpg|png|gif|webp/.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Hanya file gambar yang diperbolehkan'));
  },
});

// ══════════════════════════════════════════════════════════════════════════════
//  CATATAN: Route /api/auth/* dan /api/admin/* sudah dipindah ke file terpisah
//  (authRouter.js dan adminRouter.js) dan didaftarkan di server.js.
//  File index.js ini hanya menangani route SISWA / umum.
// ══════════════════════════════════════════════════════════════════════════════

// ── LOGOUT ─────────────────────────────────────────────────────────────────────
// Tetap di sini karena pakai tokenBlacklist lokal
router.post('/api/auth/logout', verifyToken, (req, res) => {
  tokenBlacklist.add(req.token);
  if (tokenBlacklist.size > 1000) {
    tokenBlacklist.delete(tokenBlacklist.values().next().value);
  }
  response.success(res, null, 'Logout berhasil');
});

// ── GET /api/auth/me ───────────────────────────────────────────────────────────
router.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.user_id);
    if (!user) return response.error(res, 'User tidak ditemukan', 404);
    response.success(res, user, 'Berhasil mengambil data user');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

// ── LOKASI ─────────────────────────────────────────────────────────────────────
router.get('/api/lokasi', async (req, res) => {
  try {
    const lokasi = await LokasiModel.getAll();
    response.success(res, lokasi, 'Berhasil mengambil data lokasi');
  } catch (error) {
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.get('/api/lokasi/:id', async (req, res) => {
  try {
    const lokasi = await LokasiModel.findById(req.params.id);
    if (!lokasi) return response.error(res, 'Lokasi tidak ditemukan', 404);
    response.success(res, lokasi, 'Berhasil mengambil data lokasi');
  } catch (error) {
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

// ── KATEGORI (publik) ──────────────────────────────────────────────────────────
router.get('/api/kategori', async (req, res) => {
  try {
    const kategori = await KategoriModel.getAll();
    response.success(res, kategori, 'Berhasil mengambil data kategori');
  } catch (error) {
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.get('/api/kategori/:id', async (req, res) => {
  try {
    const kategori = await KategoriModel.findById(req.params.id);
    if (!kategori) return response.error(res, 'Kategori tidak ditemukan', 404);
    response.success(res, kategori, 'Berhasil mengambil data kategori');
  } catch (error) {
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

// ── LAPORAN SISWA ──────────────────────────────────────────────────────────────
// GET semua laporan milik user yang login
router.get('/api/laporan', verifyToken, async (req, res) => {
  try {
    const laporan = await LaporanModel.findByUserId(req.user.user_id);
    response.success(res, laporan, 'Berhasil mengambil data laporan');
  } catch (error) {
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.get('/api/laporan/type/:tipe', async (req, res) => {
  try {
    const tipe = req.params.tipe;
    if (!['kehilangan', 'penemuan'].includes(tipe))
      return response.error(res, 'Tipe laporan tidak valid', 400);

    const laporan = await LaporanModel.getByType(tipe);
    response.success(res, laporan, 'Berhasil mengambil laporan publik');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

// ── NOTIFIKASI ────────────────────────────────────────────────────────────────
// GET /api/notifikasi — ambil notifikasi milik user yang login
router.get('/api/notifikasi', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, laporan_id, pesan, is_read, created_at FROM notifikasi WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.user.user_id]
    );
    const [[{ unread }]] = await db.execute(
      'SELECT COUNT(*) AS unread FROM notifikasi WHERE user_id = ? AND is_read = 0',
      [req.user.user_id]
    );
    response.success(res, { notifications: rows, unread }, 'OK');
  } catch (error) {
    console.error(error);
    response.error(res, 'Gagal mengambil notifikasi', 500, error.message);
  }
});

// PATCH /api/notifikasi/:id/read — tandai satu notifikasi sudah dibaca
router.patch('/api/notifikasi/:id/read', verifyToken, async (req, res) => {
  try {
    await db.execute(
      'UPDATE notifikasi SET is_read = 1 WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.user_id]
    );
    response.success(res, null, 'Notifikasi ditandai sudah dibaca');
  } catch (error) {
    response.error(res, 'Gagal update notifikasi', 500, error.message);
  }
});

// PATCH /api/notifikasi/read-all — tandai semua notifikasi sudah dibaca
router.patch('/api/notifikasi/read-all', verifyToken, async (req, res) => {
  try {
    await db.execute(
      'UPDATE notifikasi SET is_read = 1 WHERE user_id = ? AND is_read = 0',
      [req.user.user_id]
    );
    response.success(res, null, 'Semua notifikasi ditandai sudah dibaca');
  } catch (error) {
    response.error(res, 'Gagal update notifikasi', 500, error.message);
  }
});

// POST laporan kehilangan (dengan upload foto opsional)
router.post('/api/laporan/kehilangan', verifyToken, upload.single('foto'), async (req, res) => {
  try {
    const {
      kategori_id, kategori, kategori_name, barang_tipe, lokasi_id,
      lokasi, lokasi_terakhir, lokasi_name,
      keterangan_lainnya, waktu_insiden
    } = req.body;

    const resolvedKategoriId = await resolveKategoriId(kategori_id ?? kategori ?? kategori_name);
    const resolvedLokasiId = await resolveLokasiId(lokasi_id ?? lokasi ?? lokasi_terakhir ?? lokasi_name);

    if (!resolvedKategoriId || !barang_tipe || !resolvedLokasiId)
      return response.error(res, 'kategori_id, lokasi_id, dan barang_tipe wajib diisi', 400);

    const [laporanResult] = await db.execute(
      "INSERT INTO laporan (user_id, kategori_id, lokasi_id, tipe_laporan, status) VALUES (?, ?, ?, 'kehilangan', 'proses')",
      [req.user.user_id, resolvedKategoriId, resolvedLokasiId]
    );
    const laporan_id = laporanResult.insertId;

    // Format waktu_insiden untuk MySQL
    let waktuFormatted = moment().format('YYYY-MM-DD HH:mm:ss');
    if (waktu_insiden) {
      const parsed = moment(waktu_insiden);
      waktuFormatted = parsed.isValid() ? parsed.format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss');
    }

    await db.execute(`
      INSERT INTO laporan_kehilangan
        (laporan_id, barang_tipe, keterangan_lainnya, waktu_insiden)
      VALUES (?, ?, ?, ?)
    `, [laporan_id, barang_tipe, keterangan_lainnya || '', waktuFormatted]);

    // ── Auto-save kuisioner dari data keterangan_lainnya ──────────────────────
    try {
      let kuis = {};
      try { kuis = JSON.parse(keterangan_lainnya || '{}'); } catch { kuis = {}; }
      const jenis   = kuis.nama || kuis.jenis || barang_tipe || '';
      const warna   = kuis.warna || req.body.warna_barang || '';
      const detail  = kuis.ciri || kuis.deskripsi || kuis.wallpaper || kuis.isi || kuis.kondisi || '';
      const brand   = kuis.merek || kuis.brand || kuis.merk_logo || req.body.brand_merk || '';
      const waktu   = kuis.waktu || waktuFormatted;
      const lok     = kuis.lokasi || req.body.lokasi_terakhir || '';

      await db.execute(`
        INSERT INTO kuisioner_laporan
          (laporan_id, jenis_barang, warna_barang, deskripsi_detail, brand_merk, waktu_terakhir, lokasi_terakhir)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [laporan_id, jenis, warna, detail, brand, waktu, lok]);
    } catch (kuisErr) {
      console.error('Gagal auto-save kuisioner:', kuisErr.message);
    }

    response.success(res, { laporan_id }, 'Laporan kehilangan berhasil dibuat', 201);
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

// POST laporan penemuan (dengan upload foto)
router.post('/api/laporan/penemuan', verifyToken, upload.single('foto'), async (req, res) => {
  try {
    const { kategori_id, kategori, kategori_name, lokasi_id, lokasi, lokasi_name, nama_barang, deskripsi, waktu_insiden } = req.body;
    const foto_barang = req.file ? `/uploads/${req.file.filename}` : null;

    const resolvedKategoriId = await resolveKategoriId(kategori_id ?? kategori ?? kategori_name);
    const resolvedLokasiId = await resolveLokasiId(lokasi_id ?? lokasi ?? lokasi_name);

    if (!resolvedKategoriId || !resolvedLokasiId || !nama_barang)
      return response.error(res, 'kategori_id, lokasi_id, dan nama_barang wajib diisi', 400);

    const [laporanResult] = await db.execute(
      "INSERT INTO laporan (user_id, kategori_id, lokasi_id, tipe_laporan, status) VALUES (?, ?, ?, 'penemuan', 'proses')",
      [req.user.user_id, resolvedKategoriId, resolvedLokasiId]
    );
    const laporan_id = laporanResult.insertId;

    // DB: kategori & deskripsi & waktu_insiden are NOT NULL
    const kategoriNama = (await KategoriModel.findById(resolvedKategoriId))?.nama_kategori || 'lainnya';
    await db.execute(`
      INSERT INTO laporan_penemuan (laporan_id, nama_barang, kategori, deskripsi, foto_barang, waktu_insiden)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [laporan_id, nama_barang, kategoriNama, deskripsi || '', foto_barang, waktu_insiden || new Date()]);

    response.success(res, { laporan_id }, 'Laporan penemuan berhasil dibuat', 201);
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

// GET detail laporan by id
router.get('/api/laporan/:id', verifyToken, async (req, res) => {
  try {
    const laporan = await LaporanModel.findById(req.params.id);
    if (!laporan) return response.error(res, 'Laporan tidak ditemukan', 404);

    if (laporan.user_id !== req.user.user_id && req.user.role !== 'pegawai')
      return response.error(res, 'Anda tidak memiliki akses', 403);

    response.success(res, laporan, 'Berhasil mengambil laporan');
  } catch (error) {
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

// DELETE laporan milik sendiri
router.delete('/api/laporan/:id', verifyToken, async (req, res) => {
  try {
    const laporan = await LaporanModel.findById(req.params.id);
    if (!laporan) return response.error(res, 'Laporan tidak ditemukan', 404);

    if (laporan.user_id !== req.user.user_id && req.user.role !== 'pegawai')
      return response.error(res, 'Anda tidak memiliki akses', 403);

    await LaporanModel.delete(req.params.id);
    response.success(res, null, 'Laporan berhasil dihapus');
  } catch (error) {
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

// ── USER ROUTES (admin/pegawai only) ──────────────────────────────────────────
router.get('/api/users', verifyToken, authorizeRoles('pegawai'), async (req, res) => {
  try {
    const users = await UserModel.getAll();
    response.success(res, users, 'Berhasil mengambil data user');
  } catch (error) {
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.get('/api/users/:id', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return response.error(res, 'User tidak ditemukan', 404);
    response.success(res, user, 'Berhasil mengambil data user');
  } catch (error) {
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.post('/api/users', verifyToken, authorizeRoles('pegawai'), async (req, res) => {
  try {
    const { nis_nip, password, role } = req.body;
    if (!nis_nip || !password || !role)
      return response.error(res, 'NIS/NIP, password, dan role wajib diisi', 400);

    const existing = await UserModel.findByNisNip(nis_nip);
    if (existing) return response.error(res, 'NIS/NIP sudah terdaftar', 409);

    const hashed = await bcrypt.hash(password, 10);
    const result = await UserModel.create({ nis_nip, password: hashed, role });
    response.success(res, { user_id: result.insertId }, 'User berhasil dibuat', 201);
  } catch (error) {
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.put('/api/users/:id', verifyToken, authorizeRoles('pegawai'), async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return response.error(res, 'User tidak ditemukan', 404);

    const { nis_nip, role, is_active } = req.body;
    await UserModel.update(req.params.id, {
      nis_nip:   nis_nip   || user.nis_nip,
      role:      role      || user.role,
      is_active: is_active !== undefined ? is_active : user.is_active,
    });
    response.success(res, null, 'User berhasil diupdate');
  } catch (error) {
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.delete('/api/users/:id', verifyToken, authorizeRoles('pegawai'), async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return response.error(res, 'User tidak ditemukan', 404);
    await UserModel.delete(req.params.id);
    response.success(res, null, 'User berhasil dihapus');
  } catch (error) {
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.patch('/api/users/:id/toggle-active', verifyToken, authorizeRoles('pegawai'), async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return response.error(res, 'User tidak ditemukan', 404);
    await UserModel.toggleActive(req.params.id);
    response.success(res, null, 'Status user berhasil diubah');
  } catch (error) {
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.patch('/api/users/:id/reset-password', verifyToken, authorizeRoles('pegawai'), async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return response.error(res, 'Password baru wajib diisi', 400);

    const user = await UserModel.findById(req.params.id);
    if (!user) return response.error(res, 'User tidak ditemukan', 404);

    const hashed = await bcrypt.hash(password, 10);
    await UserModel.updatePassword(req.params.id, hashed);
    response.success(res, null, 'Password berhasil direset');
  } catch (error) {
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

module.exports = router;
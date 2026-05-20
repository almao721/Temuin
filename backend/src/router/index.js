const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import models - path ke folder models (../models)
const UserModel = require('../models/userModel');
const LokasiModel = require('../models/lokasi');
const KategoriModel = require('../models/kategori');
const LaporanModel = require('../models/laporan');
const LaporanPenemuanModel = require('../models/laporanPenemuan');
const LaporanKehilanganModel = require('../models/laporanKehilangan');

// Import response helper
const response = require('../utils/response');

const router = express.Router();
// ── Helper: resolve ID dari nama atau angka ───────────────────────────────────
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
  const kat = await KategoriModel.findByName(String(value));
  return kat?.id || null;
};

const resolveLokasiId = async (value) => {
  const numericId = parseNumericId(value);
  if (numericId) return numericId;
  if (!value) return null;
  const lok = await LokasiModel.findByName(String(value));
  return lok?.id || null;
};



// ============ TOKEN BLACKLIST (untuk logout) ============
// Menyimpan token yang sudah di-logout agar tidak bisa dipakai lagi
const tokenBlacklist = new Set();

// ============ MIDDLEWARE ============
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.error(res, 'Token tidak ditemukan', 401);
    }

    const token = authHeader.split(' ')[1];

    // Cek apakah token sudah di-logout
    if (tokenBlacklist.has(token)) {
      return response.error(res, 'Sesi telah berakhir, silakan login kembali', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    req.token = token; // simpan token untuk keperluan logout
    next();
  } catch (error) {
    return response.error(res, 'Token tidak valid', 401);
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return response.error(res, 'Unauthorized', 401);
    }
    if (!roles.includes(req.user.role)) {
      return response.error(res, 'Anda tidak memiliki akses', 403);
    }
    next();
  };
};

// Upload configuration
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

// ============ AUTH ROUTES ============
router.post('/api/auth/login', async (req, res) => {
  try {
    const { nis_nip, password } = req.body;

    if (!nis_nip || !password) {
      return response.error(res, 'NIS/NIP dan password wajib diisi', 400);
    }

    const user = await UserModel.findByNisNip(nis_nip);

    if (!user) {
      return response.error(res, 'NIS/NIP atau password salah', 401);
    }

    if (user.is_active !== 1) {
      return response.error(res, 'Akun Anda tidak aktif', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.error(res, 'NIS/NIP atau password salah', 401);
    }

    const token = jwt.sign(
      { user_id: user.user_id, nis_nip: user.nis_nip, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    response.success(res, {
      token,
      user: {
        user_id: user.user_id,
        nis_nip: user.nis_nip,
        role: user.role
      }
    }, 'Login berhasil');

  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.post('/api/auth/register', async (req, res) => {
  try {
    const { nis_nip, password, role = 'siswa' } = req.body;

    if (!nis_nip || !password) {
      return response.error(res, 'NIS/NIP dan password wajib diisi', 400);
    }

    const existingUser = await UserModel.findByNisNip(nis_nip);
    if (existingUser) {
      return response.error(res, 'NIS/NIP sudah terdaftar', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await UserModel.create({
      nis_nip,
      password: hashedPassword,
      role
    });

    response.success(res, { user_id: result.insertId }, 'Registrasi berhasil', 201);

  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});


// ============ LOGOUT ============
// POST /api/auth/logout - Logout user (invalidate token)
router.post('/api/auth/logout', verifyToken, (req, res) => {
  // Masukkan token ke blacklist supaya tidak bisa dipakai lagi
  tokenBlacklist.add(req.token);

  // Bersihkan blacklist jika sudah terlalu banyak (lebih dari 1000 entry)
  if (tokenBlacklist.size > 1000) {
    const firstToken = tokenBlacklist.values().next().value;
    tokenBlacklist.delete(firstToken);
  }

  response.success(res, null, 'Logout berhasil');
});

// GET /api/auth/me - Ambil data user yang sedang login
router.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.user_id);

    if (!user) {
      return response.error(res, 'User tidak ditemukan', 404);
    }

    response.success(res, user, 'Berhasil mengambil data user');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

// ============ RESET PASSWORD (Admin) ============
// PATCH /api/users/:id/reset-password - Reset password siswa oleh admin
router.patch('/api/users/:id/reset-password', verifyToken, authorizeRoles('pegawai'), async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return response.error(res, 'Password baru wajib diisi', 400);
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return response.error(res, 'User tidak ditemukan', 404);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.updatePassword(id, hashedPassword);

    response.success(res, null, 'Password berhasil direset');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

// ============ LOKASI ROUTES ============
router.get('/api/lokasi', async (req, res) => {
  try {
    const lokasi = await LokasiModel.getAll();
    response.success(res, lokasi, 'Berhasil mengambil data lokasi');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.get('/api/lokasi/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const lokasi = await LokasiModel.findById(id);

    if (!lokasi) {
      return response.error(res, 'Lokasi tidak ditemukan', 404);
    }

    response.success(res, lokasi, 'Berhasil mengambil data lokasi');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

// ============ KATEGORI ROUTES ============
router.get('/api/kategori', async (req, res) => {
  try {
    const kategori = await KategoriModel.getAll();
    response.success(res, kategori, 'Berhasil mengambil data kategori');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.get('/api/kategori/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const kategori = await KategoriModel.findById(id);

    if (!kategori) {
      return response.error(res, 'Kategori tidak ditemukan', 404);
    }

    response.success(res, kategori, 'Berhasil mengambil data kategori');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

// ============ LAPORAN ROUTES ============
router.get('/api/laporan', async (req, res) => {
  try {
    const laporan = await LaporanModel.getAll();
    response.success(res, laporan, 'Berhasil mengambil data laporan');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.get('/api/laporan/type/:type', async (req, res) => {
  try {
    const { type } = req.params;

    if (!['penemuan', 'kehilangan'].includes(type)) {
      return response.error(res, 'Tipe laporan tidak valid', 400);
    }

    const laporan = await LaporanModel.getByType(type);
    response.success(res, laporan, `Berhasil mengambil data laporan ${type}`);
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.get('/api/laporan/my', verifyToken, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const laporan = await LaporanModel.getByUserId(user_id);
    response.success(res, laporan, 'Berhasil mengambil data laporan Anda');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.get('/api/laporan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const laporan = await LaporanModel.findById(id);

    if (!laporan) {
      return response.error(res, 'Laporan tidak ditemukan', 404);
    }

    response.success(res, laporan, 'Berhasil mengambil data laporan');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

// ✅ FIXED: Route laporan penemuan
router.post('/api/laporan/penemuan', verifyToken, upload.single('foto_barang'), async (req, res) => {
  try {
    const {
      nama_barang,
      kategori_id,
      lokasi_id,
      deskripsi,
      detail_lokasi,
      waktu_insiden
    } = req.body;

    const user_id = req.user.user_id;

    // Validasi field wajib
    if (!nama_barang || !kategori_id || !lokasi_id || !waktu_insiden) {
      return response.error(res, 'Field wajib tidak boleh kosong (nama_barang, kategori_id, lokasi_id, waktu_insiden)', 400);
    }

    // ✅ FIX 1: Parse ke integer supaya FK tidak gagal
    const lokasi_id_int = parseInt(lokasi_id);
    const kategori_id_int = parseInt(kategori_id);

    if (isNaN(lokasi_id_int) || isNaN(kategori_id_int)) {
      return response.error(res, 'lokasi_id dan kategori_id harus berupa angka', 400);
    }

    // ✅ FIX 2: Validasi lokasi ada di database
    const lokasi = await LokasiModel.findById(lokasi_id_int);
    if (!lokasi) {
      return response.error(res, `Lokasi dengan id ${lokasi_id_int} tidak ditemukan. Cek GET /api/lokasi untuk daftar lokasi yang tersedia.`, 404);
    }

    // ✅ FIX 3: Validasi kategori ada di database
    const kategori = await KategoriModel.findById(kategori_id_int);
    if (!kategori) {
      return response.error(res, `Kategori dengan id ${kategori_id_int} tidak ditemukan. Cek GET /api/kategori untuk daftar kategori yang tersedia.`, 404);
    }

    // Insert ke tabel laporan utama
    const laporanResult = await LaporanModel.createMain({
      tipe_laporan: 'penemuan',
      lokasi_id: lokasi_id_int,     // ✅ integer
      user_id,
      kategori_id: kategori_id_int  // ✅ integer
    });

    const laporan_id = laporanResult.insertId;
    const foto_barang = req.file ? `/uploads/${req.file.filename}` : null;

    // Insert ke tabel laporan_penemuan
    await LaporanPenemuanModel.create({
      nama_barang,
      kategori: req.body.kategori || 'lainnya',
      deskripsi,
      foto_barang,
      detail_lokasi,
      waktu_insiden: moment(waktu_insiden).format('YYYY-MM-DD HH:mm:ss'),
      laporan_id
    });

    response.success(res, { laporan_id }, 'Laporan penemuan berhasil dibuat', 201);

  } catch (error) {
    console.error('ERROR /api/laporan/penemuan:', error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

// ✅ FIXED: Route laporan kehilangan
router.post('/api/laporan/kehilangan', verifyToken, async (req, res) => {
  try {
    const {
      barang_tipe,
      // Support ID (angka) dari form user
      kategori_id,
      lokasi_id,
      // Support nama (string) dari form admin
      kategori_name,
      lokasi_terakhir,
      keterangan_lainnya,
      waktu_insiden,
      // Field tambahan dari form admin
      warna_barang,
      brand_merk,
    } = req.body;

    const user_id = req.user.user_id;

    if (!barang_tipe) {
      return response.error(res, 'barang_tipe wajib diisi', 400);
    }

    // Resolve kategori: coba dari ID dulu, kalau tidak ada cari dari nama
    const resolvedKategoriId = await resolveKategoriId(kategori_id || kategori_name);
    if (!resolvedKategoriId) {
      return response.error(res, 'Kategori tidak ditemukan. Isi kategori_id atau kategori_name', 400);
    }

    // Resolve lokasi: coba dari ID dulu, kalau tidak ada cari dari nama
    const resolvedLokasiId = await resolveLokasiId(lokasi_id || lokasi_terakhir);
    if (!resolvedLokasiId) {
      return response.error(res, 'Lokasi tidak ditemukan. Isi lokasi_id atau lokasi_terakhir', 400);
    }

    // Insert laporan utama
    const laporanResult = await LaporanModel.createMain({
      tipe_laporan: 'kehilangan',
      lokasi_id: resolvedLokasiId,
      user_id,
      kategori_id: resolvedKategoriId,
    });

    const laporan_id = laporanResult.insertId;

    // Insert detail kehilangan
    await LaporanKehilanganModel.create({
      barang_tipe,
      keterangan_lainnya: keterangan_lainnya || '',
      waktu_insiden: moment(waktu_insiden || new Date()).format('YYYY-MM-DD HH:mm:ss'),
      laporan_id,
    });

    response.success(res, { laporan_id }, 'Laporan kehilangan berhasil dibuat', 201);

  } catch (error) {
    console.error('ERROR /api/laporan/kehilangan:', error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.delete('/api/laporan/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const laporan = await LaporanModel.findById(id);

    if (!laporan) {
      return response.error(res, 'Laporan tidak ditemukan', 404);
    }

    if (laporan.user_id !== req.user.user_id && req.user.role !== 'pegawai') {
      return response.error(res, 'Anda tidak memiliki akses untuk menghapus laporan ini', 403);
    }

    await LaporanModel.delete(id);
    response.success(res, null, 'Laporan berhasil dihapus');

  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

// ============ USER ROUTES (Admin only) ============
router.get('/api/users', verifyToken, authorizeRoles('pegawai'), async (req, res) => {
  try {
    const users = await UserModel.getAll();
    response.success(res, users, 'Berhasil mengambil data user');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.get('/api/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user) {
      return response.error(res, 'User tidak ditemukan', 404);
    }

    response.success(res, user, 'Berhasil mengambil data user');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.post('/api/users', verifyToken, authorizeRoles('pegawai'), async (req, res) => {
  try {
    const { nis_nip, password, role } = req.body;

    if (!nis_nip || !password || !role) {
      return response.error(res, 'NIS/NIP, password, dan role wajib diisi', 400);
    }

    const existingUser = await UserModel.findByNisNip(nis_nip);
    if (existingUser) {
      return response.error(res, 'NIS/NIP sudah terdaftar', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await UserModel.create({ nis_nip, password: hashedPassword, role });

    response.success(res, { user_id: result.insertId }, 'User berhasil dibuat', 201);
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.put('/api/users/:id', verifyToken, authorizeRoles('pegawai'), async (req, res) => {
  try {
    const { id } = req.params;
    const { nis_nip, role, is_active } = req.body;

    const user = await UserModel.findById(id);
    if (!user) {
      return response.error(res, 'User tidak ditemukan', 404);
    }

    await UserModel.update(id, {
      nis_nip: nis_nip || user.nis_nip,
      role: role || user.role,
      is_active: is_active !== undefined ? is_active : user.is_active
    });

    response.success(res, null, 'User berhasil diupdate');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.delete('/api/users/:id', verifyToken, authorizeRoles('pegawai'), async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user) {
      return response.error(res, 'User tidak ditemukan', 404);
    }

    await UserModel.delete(id);
    response.success(res, null, 'User berhasil dihapus');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

router.patch('/api/users/:id/toggle-active', verifyToken, authorizeRoles('pegawai'), async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user) {
      return response.error(res, 'User tidak ditemukan', 404);
    }

    await UserModel.toggleActive(id);
    response.success(res, null, 'Status user berhasil diubah');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500, error.message);
  }
});

// ============ HEALTH CHECK ============
router.get('/health', (req, res) => {
  response.success(res, { status: 'OK', timestamp: new Date() }, 'Server is running');
});

// ============ 404 HANDLER ============
router.use('*', (req, res) => {
  response.error(res, 'Route tidak ditemukan', 404);
});

module.exports = router;
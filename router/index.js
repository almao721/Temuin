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

// ============ MIDDLEWARE ============
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.error(res, 'Token tidak ditemukan', 401);
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
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
    response.error(res, 'Terjadi kesalahan pada server', 500);
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
    response.error(res, 'Terjadi kesalahan pada server', 500);
  }
});

// ============ LOKASI ROUTES ============
router.get('/api/lokasi', async (req, res) => {
  try {
    const lokasi = await LokasiModel.getAll();
    response.success(res, lokasi, 'Berhasil mengambil data lokasi');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500);
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
    response.error(res, 'Terjadi kesalahan pada server', 500);
  }
});

// ============ KATEGORI ROUTES ============
router.get('/api/kategori', async (req, res) => {
  try {
    const kategori = await KategoriModel.getAll();
    response.success(res, kategori, 'Berhasil mengambil data kategori');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500);
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
    response.error(res, 'Terjadi kesalahan pada server', 500);
  }
});

// ============ LAPORAN ROUTES ============
router.get('/api/laporan', async (req, res) => {
  try {
    const laporan = await LaporanModel.getAll();
    response.success(res, laporan, 'Berhasil mengambil data laporan');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500);
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
    response.error(res, 'Terjadi kesalahan pada server', 500);
  }
});

router.get('/api/laporan/my', verifyToken, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const laporan = await LaporanModel.getByUserId(user_id);
    response.success(res, laporan, 'Berhasil mengambil data laporan Anda');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500);
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
    response.error(res, 'Terjadi kesalahan pada server', 500);
  }
});

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
    
    if (!nama_barang || !kategori_id || !lokasi_id || !waktu_insiden) {
      return response.error(res, 'Field wajib tidak boleh kosong', 400);
    }
    
    const laporanResult = await LaporanModel.createMain({
      tipe_laporan: 'penemuan',
      lokasi_id,
      user_id,
      kategori_id
    });
    
    const laporan_id = laporanResult.insertId;
    const foto_barang = req.file ? `/uploads/${req.file.filename}` : null;
    
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
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500);
  }
});

router.post('/api/laporan/kehilangan', verifyToken, async (req, res) => {
  try {
    const {
      barang_tipe,
      kategori_id,
      lokasi_id,
      keterangan_lainnya,
      waktu_insiden
    } = req.body;
    
    const user_id = req.user.user_id;
    
    if (!barang_tipe || !kategori_id || !lokasi_id || !waktu_insiden) {
      return response.error(res, 'Field wajib tidak boleh kosong', 400);
    }
    
    const laporanResult = await LaporanModel.createMain({
      tipe_laporan: 'kehilangan',
      lokasi_id,
      user_id,
      kategori_id
    });
    
    const laporan_id = laporanResult.insertId;
    
    await LaporanKehilanganModel.create({
      barang_tipe,
      keterangan_lainnya,
      waktu_insiden: moment(waktu_insiden).format('YYYY-MM-DD HH:mm:ss'),
      laporan_id
    });
    
    response.success(res, { laporan_id }, 'Laporan kehilangan berhasil dibuat', 201);
    
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500);
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
    response.error(res, 'Terjadi kesalahan pada server', 500);
  }
});

// ============ USER ROUTES (Admin only) ============
router.get('/api/users', verifyToken, authorizeRoles('pegawai'), async (req, res) => {
  try {
    const users = await UserModel.getAll();
    response.success(res, users, 'Berhasil mengambil data user');
  } catch (error) {
    console.error(error);
    response.error(res, 'Terjadi kesalahan pada server', 500);
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
    response.error(res, 'Terjadi kesalahan pada server', 500);
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
    response.error(res, 'Terjadi kesalahan pada server', 500);
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
    response.error(res, 'Terjadi kesalahan pada server', 500);
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
    response.error(res, 'Terjadi kesalahan pada server', 500);
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
    response.error(res, 'Terjadi kesalahan pada server', 500);
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
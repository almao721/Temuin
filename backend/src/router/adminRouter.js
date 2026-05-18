const express  = require('express');
const router   = express.Router();
const jwt      = require('jsonwebtoken');
const response = require('../../utils/response');

const adminController    = require('../controller/adminController');
const kategoriController = require('../controller/kategoriController');
const lokasiController   = require('../controller/lokasiController');

// ── Middleware verifyAdmin ─────────────────────────────────────────────────────
const verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer '))
      return response.error(res, 'Token tidak ditemukan', 401);

    const token   = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin' && decoded.role !== 'pegawai')
      return response.error(res, 'Hanya admin yang dapat mengakses endpoint ini', 403);

    req.user = decoded;
    next();
  } catch {
    response.error(res, 'Token tidak valid atau sudah kadaluarsa', 401);
  }
};

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
router.get('/dashboard/stats',  verifyAdmin, adminController.getDashboardStats);
router.get('/dashboard/grafik', verifyAdmin, adminController.getGrafikBulanan);

// ── LAPORAN KEHILANGAN ────────────────────────────────────────────────────────
router.get('/laporan/kehilangan',  verifyAdmin, adminController.getLaporanKehilangan);
router.post('/laporan/kehilangan', verifyAdmin, adminController.createLaporanKehilangan);

// ── LAPORAN DITEMUKAN ─────────────────────────────────────────────────────────
router.get('/laporan/penemuan',  verifyAdmin, adminController.getLaporanPenemuan);
router.post('/laporan/penemuan', verifyAdmin, adminController.createLaporanPenemuan);

// Aksi laporan (berlaku untuk kehilangan & penemuan)
router.patch('/laporan/:id/status', verifyAdmin, adminController.updateStatusLaporan);
router.delete('/laporan/:id',       verifyAdmin, adminController.deleteLaporan);

// ── SISWA / PENGGUNA ──────────────────────────────────────────────────────────
router.get('/siswa',                      verifyAdmin, adminController.getDaftarSiswa);
router.post('/siswa',                     verifyAdmin, adminController.tambahSiswa);
router.put('/siswa/:id',                  verifyAdmin, adminController.updateSiswa);
router.patch('/siswa/:id/toggle-active',  verifyAdmin, adminController.toggleAktifSiswa);
router.patch('/siswa/:id/reset-password', verifyAdmin, adminController.resetPasswordSiswa);
router.delete('/siswa/:id',               verifyAdmin, adminController.deleteSiswa);

// ── KATEGORI ──────────────────────────────────────────────────────────────────
router.get('/kategori',                verifyAdmin, adminController.getKategoriAdmin);
router.get('/kategori/:id',            verifyAdmin, kategoriController.getKategoriById);
router.post('/kategori',               verifyAdmin, kategoriController.createKategori);
router.put('/kategori/:id',            verifyAdmin, kategoriController.updateKategori);
router.put('/kategori/:id/pertanyaan', verifyAdmin, adminController.updatePertanyaanKategori);
router.delete('/kategori/:id',         verifyAdmin, kategoriController.deleteKategori);

// ── LOKASI ────────────────────────────────────────────────────────────────────
// FIX: nama method disesuaikan dengan lokasiController
router.get('/lokasi',        verifyAdmin, lokasiController.getAllLokasi);   // ✅ fix
router.post('/lokasi',       verifyAdmin, lokasiController.createLokasi);  // ✅ fix
router.delete('/lokasi/:id', verifyAdmin, lokasiController.deleteLokasi);  // ✅ fix

// ── KUISIONER ─────────────────────────────────────────────────────────────────
router.get('/kuisioner',             verifyAdmin, adminController.getAllKuisioner);
router.get('/kuisioner/rekap',       verifyAdmin, adminController.getRekapKuisioner);
router.get('/kuisioner/:laporan_id', verifyAdmin, adminController.getKuisionerByLaporan);
router.delete('/kuisioner/:id',      verifyAdmin, adminController.deleteKuisioner);

module.exports = router;
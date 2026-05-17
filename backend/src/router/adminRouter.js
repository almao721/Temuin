const express  = require('express');
const router   = express.Router();
const jwt      = require('jsonwebtoken');
const response = require('../../utils/response');

const adminController    = require('../controller/adminController');
const kategoriController = require('../controller/kategoriController');
const lokasiController   = require('../controller/lokasiController');

// ── Middleware verifyAdmin ─────────────────────────────────────────────────────
// Role yang diizinkan: 'pegawai' dan 'admin'
const verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer '))
      return response.error(res, 'Token tidak ditemukan', 401);

    const token   = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Izinkan role 'pegawai' DAN 'admin'
    if (decoded.role !== 'pegawai' && decoded.role !== 'admin')
      return response.error(res, 'Hanya admin yang dapat mengakses endpoint ini', 403);

    req.user = decoded;
    next();
  } catch {
    response.error(res, 'Token tidak valid atau sudah kadaluarsa', 401);
  }
};

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
// GET /api/admin/dashboard/stats?timeframe=bulan+ini&tipe=All&tahun=2025
router.get('/dashboard/stats',  verifyAdmin, adminController.getDashboardStats);
// GET /api/admin/dashboard/grafik?tahun=2025
router.get('/dashboard/grafik', verifyAdmin, adminController.getGrafikBulanan);

// ── LAPORAN KEHILANGAN ────────────────────────────────────────────────────────
// GET    /api/admin/laporan/kehilangan?page&limit&search&status&kategori
router.get('/laporan/kehilangan',  verifyAdmin, adminController.getLaporanKehilangan);
// POST   /api/admin/laporan/kehilangan
router.post('/laporan/kehilangan', verifyAdmin, adminController.createLaporanKehilangan);

// ── LAPORAN DITEMUKAN ─────────────────────────────────────────────────────────
// GET    /api/admin/laporan/penemuan?page&limit&search&status&kategori
router.get('/laporan/penemuan',  verifyAdmin, adminController.getLaporanPenemuan);
// POST   /api/admin/laporan/penemuan
router.post('/laporan/penemuan', verifyAdmin, adminController.createLaporanPenemuan);

// Aksi: update status & hapus (berlaku untuk kedua tipe laporan)
// PATCH  /api/admin/laporan/:id/status   body: { status }
router.patch('/laporan/:id/status', verifyAdmin, adminController.updateStatusLaporan);
// DELETE /api/admin/laporan/:id
router.delete('/laporan/:id',       verifyAdmin, adminController.deleteLaporan);

// ── SISWA / PENGGUNA ──────────────────────────────────────────────────────────
// GET    /api/admin/siswa?page&limit&search&status
router.get('/siswa',                      verifyAdmin, adminController.getDaftarSiswa);
// POST   /api/admin/siswa   { nis_nip, password }
router.post('/siswa',                     verifyAdmin, adminController.tambahSiswa);
// PUT    /api/admin/siswa/:id
router.put('/siswa/:id',                  verifyAdmin, adminController.updateSiswa);
// PATCH  /api/admin/siswa/:id/toggle-active
router.patch('/siswa/:id/toggle-active',  verifyAdmin, adminController.toggleAktifSiswa);
// PATCH  /api/admin/siswa/:id/reset-password   { password }
router.patch('/siswa/:id/reset-password', verifyAdmin, adminController.resetPasswordSiswa);
// DELETE /api/admin/siswa/:id
router.delete('/siswa/:id',               verifyAdmin, adminController.deleteSiswa);

// ── KATEGORI ──────────────────────────────────────────────────────────────────
// GET    /api/admin/kategori
router.get('/kategori',                    verifyAdmin, kategoriController.getAllKategori);
// GET    /api/admin/kategori/:id
router.get('/kategori/:id',                verifyAdmin, kategoriController.getKategoriById);
// POST   /api/admin/kategori   { nama_kategori, deskripsi?, icon_url? }
router.post('/kategori',                   verifyAdmin, kategoriController.createKategori);
// PUT    /api/admin/kategori/:id
router.put('/kategori/:id',                verifyAdmin, kategoriController.updateKategori);
// PUT    /api/admin/kategori/:id/pertanyaan   { pertanyaan: [...] }
router.put('/kategori/:id/pertanyaan',     verifyAdmin, kategoriController.updatePertanyaan);
// DELETE /api/admin/kategori/:id
router.delete('/kategori/:id',             verifyAdmin, kategoriController.deleteKategori);

// ── LOKASI ────────────────────────────────────────────────────────────────────
// GET    /api/admin/lokasi
router.get('/lokasi',        verifyAdmin, lokasiController.getAllLokasi);
// POST   /api/admin/lokasi   { nama_lokasi, tipe_lokasi?, icon? }
router.post('/lokasi',       verifyAdmin, lokasiController.createLokasi);
// DELETE /api/admin/lokasi/:id
router.delete('/lokasi/:id', verifyAdmin, lokasiController.deleteLokasi);

// ── KUISIONER ─────────────────────────────────────────────────────────────────
// GET    /api/admin/kuisioner
router.get('/kuisioner',              verifyAdmin, adminController.getAllKuisioner);
// GET    /api/admin/kuisioner/rekap   ← harus sebelum /:laporan_id
router.get('/kuisioner/rekap',        verifyAdmin, adminController.getRekapKuisioner);
// GET    /api/admin/kuisioner/:laporan_id
router.get('/kuisioner/:laporan_id',  verifyAdmin, adminController.getKuisionerByLaporan);
// DELETE /api/admin/kuisioner/:id
router.delete('/kuisioner/:id',       verifyAdmin, adminController.deleteKuisioner);

module.exports = router;
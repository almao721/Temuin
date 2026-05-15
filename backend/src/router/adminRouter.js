const express = require('express');
const router  = express.Router();

const adminController = require('../controller/adminController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Semua route admin wajib login dan role = 'pegawai'
const adminOnly = [verifyToken, authorizeRoles('pegawai')];

// ── DASHBOARD ──────────────────────────────────────────────────────────────
router.get('/dashboard/stats',        adminOnly, adminController.getDashboardStats);
router.get('/dashboard/grafik',       adminOnly, adminController.getGrafikBulanan);
router.get('/dashboard/per-kategori', adminOnly, adminController.getLaporanPerKategori);
router.get('/dashboard/filter',       adminOnly, adminController.getDashboardFiltered);

// ── LAPORAN KEHILANGAN ─────────────────────────────────────────────────────
router.get('/laporan/kehilangan',     adminOnly, adminController.getLaporanKehilangan);

// ── LAPORAN PENEMUAN ───────────────────────────────────────────────────────
router.get('/laporan/penemuan',       adminOnly, adminController.getLaporanPenemuan);

// ── LAPORAN DETAIL & AKSI ─────────────────────────────────────────────────
router.get   ('/laporan/:id',          adminOnly, adminController.getLaporanDetail);
router.patch ('/laporan/:id/status',   adminOnly, adminController.updateStatusLaporan);
router.delete('/laporan/:id',          adminOnly, adminController.deleteLaporan);

// ── DAFTAR SISWA ──────────────────────────────────────────────────────────
router.get   ('/siswa',                     adminOnly, adminController.getDaftarSiswa);
router.post  ('/siswa',                     adminOnly, adminController.tambahSiswa);
router.put   ('/siswa/:id',                 adminOnly, adminController.updateSiswa);
router.patch ('/siswa/:id/toggle-active',   adminOnly, adminController.toggleAktifSiswa);
router.patch ('/siswa/:id/reset-password',  adminOnly, adminController.resetPasswordSiswa);
router.delete('/siswa/:id',                 adminOnly, adminController.deleteSiswa);

// ── KUISIONER LAPORAN ─────────────────────────────────────────────────────
router.get   ('/kuisioner',              adminOnly, adminController.getAllKuisioner);
router.get   ('/kuisioner/rekap',        adminOnly, adminController.getRekapKuisioner);
router.get   ('/kuisioner/:laporan_id',  adminOnly, adminController.getKuisionerByLaporan);
router.delete('/kuisioner/:id',          adminOnly, adminController.deleteKuisioner);

// ── KATEGORI (CRUD) ────────────────────────────────────────────────────────
router.get   ('/kategori',     adminOnly, adminController.getAllKategori);
router.post  ('/kategori',     adminOnly, adminController.createKategori);
router.put   ('/kategori/:id', adminOnly, adminController.updateKategori);
router.delete('/kategori/:id', adminOnly, adminController.deleteKategori);

module.exports = router;

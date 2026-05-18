const bcrypt         = require('bcryptjs');
const AdminModel     = require('../../models/adminModel');
const KuisionerModel = require('../../models/kuisionerModel');
const UserModel      = require('../../models/userModel');
const response       = require('../../utils/response');

const adminController = {

  // ── DASHBOARD ──────────────────────────────────────────────────────────────

  // GET /api/admin/dashboard/stats
  // Response: { pengguna_aktif, sum_kehilangan, sum_ditemukan, total_laporan }
  getDashboardStats: async (req, res) => {
    try {
      const { timeframe, tipe, tahun } = req.query;
      const data = await AdminModel.getDashboardStats({ timeframe, tipe, tahun });
      response.success(res, data, 'Berhasil mengambil statistik dashboard');
    } catch (err) {
      console.error('[adminController.getDashboardStats]', err);
      response.error(res, 'Gagal mengambil statistik', 500, err.message);
    }
  },

  // GET /api/admin/dashboard/grafik?tahun=2026
  // Response: [{ month, kehilangan, ditemukan }] ← dua garis untuk LineChart
  getGrafikBulanan: async (req, res) => {
    try {
      const { tahun } = req.query;
      // Pakai getLaporanPerBulanDua agar sesuai format yang dibutuhkan ControlCenter.tsx
      const data = await AdminModel.getLaporanPerBulanDua({ tahun });
      response.success(res, data, 'Berhasil mengambil data grafik');
    } catch (err) {
      console.error('[adminController.getGrafikBulanan]', err);
      response.error(res, 'Gagal mengambil grafik', 500, err.message);
    }
  },

  // ── LAPORAN KEHILANGAN ─────────────────────────────────────────────────────

  // GET /api/admin/laporan/kehilangan?page&limit&search&status
  getLaporanKehilangan: async (req, res) => {
    try {
      const { page = 1, limit = 10, search, status } = req.query;
      const result = await AdminModel.getLaporanKehilangan({ page: +page, limit: +limit, search, status });
      response.paginate(res, result.data, result.page, result.limit, result.total, 'Berhasil mengambil laporan kehilangan');
    } catch (err) {
      console.error('[adminController.getLaporanKehilangan]', err);
      response.error(res, 'Gagal mengambil laporan kehilangan', 500, err.message);
    }
  },

  // POST /api/admin/laporan/kehilangan
  // Body: { user_id, kategori_id/kategori_name, lokasi_id/lokasi_name, barang_tipe, keterangan_lainnya, waktu_insiden }
  createLaporanKehilangan: async (req, res) => {
    try {
      const {
        user_id, kategori_id, kategori_name, kategori,
        lokasi_id, lokasi_name, lokasi,
        barang_tipe, keterangan_lainnya, waktu_insiden
      } = req.body;

      const db = require('../config/db');
      const KategoriModel = require('../../models/kategori');
      const LokasiModel   = require('../../models/lokasi');
      const moment        = require('moment');

      // Resolve nama → ID
      let resolvedKatId = kategori_id;
      if (!resolvedKatId) {
        const catName = kategori_name || kategori;
        if (catName) { const cat = await KategoriModel.findByName(catName); resolvedKatId = cat?.id; }
      }
      let resolvedLokId = lokasi_id;
      if (!resolvedLokId) {
        const locName = lokasi_name || lokasi;
        if (locName) { const loc = await LokasiModel.findByName(locName); resolvedLokId = loc?.id; }
      }

      if (!user_id || !resolvedKatId || !resolvedLokId || !barang_tipe)
        return response.error(res, 'user_id, kategori_id, lokasi_id, dan barang_tipe wajib diisi', 400);

      const [laporanResult] = await db.execute(
        "INSERT INTO laporan (user_id, kategori_id, lokasi_id, tipe_laporan, status) VALUES (?, ?, ?, 'kehilangan', 'proses')",
        [user_id, resolvedKatId, resolvedLokId]
      );
      const laporan_id = laporanResult.insertId;

      let waktuFormatted = moment().format('YYYY-MM-DD HH:mm:ss');
      if (waktu_insiden) {
        const parsed = moment(waktu_insiden);
        waktuFormatted = parsed.isValid() ? parsed.format('YYYY-MM-DD HH:mm:ss') : waktuFormatted;
      }

      await db.execute(`
        INSERT INTO laporan_kehilangan
          (laporan_id, barang_tipe, keterangan_lainnya, waktu_insiden)
        VALUES (?, ?, ?, ?)
      `, [laporan_id, barang_tipe, keterangan_lainnya || '', waktuFormatted]);

      response.success(res, { laporan_id }, 'Laporan kehilangan berhasil dibuat', 201);
    } catch (err) {
      console.error('[adminController.createLaporanKehilangan]', err);
      response.error(res, 'Gagal membuat laporan kehilangan', 500, err.message);
    }
  },

  // ── LAPORAN PENEMUAN ───────────────────────────────────────────────────────

  // GET /api/admin/laporan/penemuan?page&limit&search&status
  getLaporanPenemuan: async (req, res) => {
    try {
      const { page = 1, limit = 10, search, status } = req.query;
      const result = await AdminModel.getLaporanPenemuan({ page: +page, limit: +limit, search, status });
      response.paginate(res, result.data, result.page, result.limit, result.total, 'Berhasil mengambil laporan penemuan');
    } catch (err) {
      console.error('[adminController.getLaporanPenemuan]', err);
      response.error(res, 'Gagal mengambil laporan penemuan', 500, err.message);
    }
  },

  // POST /api/admin/laporan/penemuan
  // Body: { user_id, kategori_id, lokasi_id, nama_barang, deskripsi, foto_barang, waktu_insiden }
  createLaporanPenemuan: async (req, res) => {
    try {
      const { user_id, kategori_id, lokasi_id, nama_barang, deskripsi, foto_barang, waktu_insiden } = req.body;

      if (!user_id || !kategori_id || !lokasi_id || !nama_barang)
        return response.error(res, 'user_id, kategori_id, lokasi_id, dan nama_barang wajib diisi', 400);

      const db = require('../config/db');
      const [laporanResult] = await db.execute(
        "INSERT INTO laporan (user_id, kategori_id, lokasi_id, tipe_laporan, status) VALUES (?, ?, ?, 'penemuan', 'proses')",
        [user_id, kategori_id, lokasi_id]
      );
      const laporan_id = laporanResult.insertId;

      // DB: kategori & deskripsi & waktu_insiden are NOT NULL in laporan_penemuan
      const KategoriModel = require('../../models/kategori');
      const kategoriData = await KategoriModel.findById(kategori_id);
      const kategoriNama = kategoriData?.nama_kategori || 'lainnya';
      await db.execute(
        'INSERT INTO laporan_penemuan (laporan_id, nama_barang, kategori, deskripsi, foto_barang, waktu_insiden) VALUES (?, ?, ?, ?, ?, ?)',
        [laporan_id, nama_barang, kategoriNama, deskripsi || '', foto_barang, waktu_insiden || new Date()]
      );

      response.success(res, { laporan_id }, 'Laporan penemuan berhasil dibuat', 201);
    } catch (err) {
      console.error('[adminController.createLaporanPenemuan]', err);
      response.error(res, 'Gagal membuat laporan penemuan', 500, err.message);
    }
  },

  // PATCH /api/admin/laporan/:id/status   body: { status: 'proses'|'selesai'|'ditolak' }
  updateStatusLaporan: async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) return response.error(res, 'Status wajib diisi', 400);
      await AdminModel.updateStatusLaporan(req.params.id, status);

      // ── Kirim notifikasi ke pemilik laporan ────────────────────────────────
      try {
        const db = require('../config/db');
        const [[laporan]] = await db.execute(
          'SELECT user_id, tipe_laporan FROM laporan WHERE id = ?', [req.params.id]
        );
        if (laporan) {
          const statusLabel = {
            proses: '🔄 Sedang Diproses',
            selesai: '✅ Selesai',
            ditolak: '❌ Ditolak',
            'sudah diambil': '📦 Sudah Diambil',
            'belum diambil': '⏳ Belum Diambil',
          }[status] || status;

          const tipe = laporan.tipe_laporan === 'penemuan' ? 'penemuan' : 'kehilangan';
          const pesan = `Laporan ${tipe} #${req.params.id} statusnya diperbarui menjadi: ${statusLabel}`;

          await db.execute(
            'INSERT INTO notifikasi (user_id, laporan_id, pesan) VALUES (?, ?, ?)',
            [laporan.user_id, req.params.id, pesan]
          );
        }
      } catch (notifErr) {
        console.error('Gagal kirim notifikasi:', notifErr.message);
      }

      response.success(res, null, `Status laporan berhasil diubah menjadi "${status}"`);
    } catch (err) {
      console.error('[adminController.updateStatusLaporan]', err);
      response.error(res, err.message || 'Gagal mengubah status', 400);
    }
  },

  // DELETE /api/admin/laporan/:id
  deleteLaporan: async (req, res) => {
    try {
      await AdminModel.deleteLaporan(req.params.id);
      response.success(res, null, 'Laporan berhasil dihapus');
    } catch (err) {
      console.error('[adminController.deleteLaporan]', err);
      response.error(res, 'Gagal menghapus laporan', 500, err.message);
    }
  },

  // ── DAFTAR SISWA ───────────────────────────────────────────────────────────

  // GET /api/admin/siswa?page&limit&search&status
  getDaftarSiswa: async (req, res) => {
    try {
      const { page = 1, limit = 10, search, status } = req.query;
      const result = await AdminModel.getDaftarSiswa({ page: +page, limit: +limit, search, status });
      response.paginate(res, result.data, result.page, result.limit, result.total, 'Berhasil mengambil daftar siswa');
    } catch (err) {
      console.error('[adminController.getDaftarSiswa]', err);
      response.error(res, 'Gagal mengambil daftar siswa', 500, err.message);
    }
  },

  // POST /api/admin/siswa   { nis_nip, password }
  tambahSiswa: async (req, res) => {
    try {
      const { nis_nip, password } = req.body;
      if (!nis_nip || !password) return response.error(res, 'NIS/NIP dan password wajib diisi', 400);

      const existing = await UserModel.findByNisNip(nis_nip);
      if (existing) return response.error(res, 'NIS/NIP sudah terdaftar', 409);

      const hashed = await bcrypt.hash(password, 10);
      const result = await UserModel.create({ nis_nip, password: hashed, role: 'siswa' });
      response.success(res, { user_id: result.insertId }, 'Siswa berhasil ditambahkan', 201);
    } catch (err) {
      console.error('[adminController.tambahSiswa]', err);
      response.error(res, 'Gagal menambah siswa', 500, err.message);
    }
  },

  // PUT /api/admin/siswa/:id
  updateSiswa: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) return response.error(res, 'Siswa tidak ditemukan', 404);
      const { nis_nip, is_active } = req.body;
      await UserModel.update(req.params.id, {
        nis_nip:   nis_nip   ?? user.nis_nip,
        role:      user.role,
        is_active: is_active ?? user.is_active,
      });
      response.success(res, null, 'Data siswa berhasil diupdate');
    } catch (err) {
      console.error('[adminController.updateSiswa]', err);
      response.error(res, 'Gagal mengupdate siswa', 500, err.message);
    }
  },

  // PATCH /api/admin/siswa/:id/toggle-active
  toggleAktifSiswa: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) return response.error(res, 'Siswa tidak ditemukan', 404);
      await UserModel.toggleActive(req.params.id);
      const newStatus = user.is_active === 1 ? 'dinonaktifkan' : 'diaktifkan';
      response.success(res, null, `Siswa berhasil ${newStatus}`);
    } catch (err) {
      console.error('[adminController.toggleAktifSiswa]', err);
      response.error(res, 'Gagal mengubah status siswa', 500, err.message);
    }
  },

  // PATCH /api/admin/siswa/:id/reset-password   { password }
  resetPasswordSiswa: async (req, res) => {
    try {
      const { password } = req.body;
      if (!password) return response.error(res, 'Password baru wajib diisi', 400);
      const user = await UserModel.findById(req.params.id);
      if (!user) return response.error(res, 'Siswa tidak ditemukan', 404);
      const hashed = await bcrypt.hash(password, 10);
      await UserModel.updatePassword(req.params.id, hashed);
      response.success(res, null, 'Password berhasil direset');
    } catch (err) {
      console.error('[adminController.resetPasswordSiswa]', err);
      response.error(res, 'Gagal reset password', 500, err.message);
    }
  },

  // DELETE /api/admin/siswa/:id
  deleteSiswa: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) return response.error(res, 'Siswa tidak ditemukan', 404);
      await UserModel.delete(req.params.id);
      response.success(res, null, 'Siswa berhasil dihapus');
    } catch (err) {
      console.error('[adminController.deleteSiswa]', err);
      response.error(res, 'Gagal menghapus siswa', 500, err.message);
    }
  },

  // ── KUISIONER ──────────────────────────────────────────────────────────────

  getAllKuisioner: async (req, res) => {
    try {
      const data = await KuisionerModel.getAll();
      response.success(res, data, 'Berhasil mengambil data kuisioner');
    } catch (err) {
      console.error('[adminController.getAllKuisioner]', err);
      response.error(res, 'Gagal mengambil kuisioner', 500, err.message);
    }
  },

  getRekapKuisioner: async (req, res) => {
    try {
      const data = await AdminModel.getRekapKuisioner();
      response.success(res, data, 'Berhasil mengambil rekap kuisioner');
    } catch (err) {
      console.error('[adminController.getRekapKuisioner]', err);
      response.error(res, 'Gagal mengambil rekap kuisioner', 500, err.message);
    }
  },

  getKuisionerByLaporan: async (req, res) => {
    try {
      const data = await KuisionerModel.findByLaporanId(req.params.laporan_id);
      if (!data) return response.error(res, 'Kuisioner tidak ditemukan', 404);
      response.success(res, data, 'Berhasil mengambil kuisioner');
    } catch (err) {
      console.error('[adminController.getKuisionerByLaporan]', err);
      response.error(res, 'Gagal mengambil kuisioner', 500, err.message);
    }
  },

  deleteKuisioner: async (req, res) => {
    try {
      await KuisionerModel.delete(req.params.id);
      response.success(res, null, 'Kuisioner berhasil dihapus');
    } catch (err) {
      console.error('[adminController.deleteKuisioner]', err);
      response.error(res, 'Gagal menghapus kuisioner', 500, err.message);
    }
  },

  // ── KATEGORI ──────────────────────────────────────────────────────────────

  // GET /api/admin/kategori
  getKategoriAdmin: async (req, res) => {
    try {
      const data = await AdminModel.getKategoriWithPertanyaan();
      response.success(res, data, 'Berhasil mengambil kategori');
    } catch (err) {
      console.error('[adminController.getKategoriAdmin]', err);
      response.error(res, 'Gagal mengambil kategori', 500, err.message);
    }
  },

  // PUT /api/admin/kategori/:id/pertanyaan   { pertanyaan: [...] }
  updatePertanyaanKategori: async (req, res) => {
    try {
      const { pertanyaan } = req.body;
      if (!Array.isArray(pertanyaan))
        return response.error(res, 'pertanyaan harus berupa array', 400);
      await AdminModel.updatePertanyaan(req.params.id, pertanyaan);
      response.success(res, null, 'Pertanyaan berhasil disimpan');
    } catch (err) {
      console.error('[adminController.updatePertanyaanKategori]', err);
      response.error(res, 'Gagal menyimpan pertanyaan', 500, err.message);
    }
  },
};

module.exports = adminController;
const bcrypt         = require('bcryptjs');
const AdminModel     = require('../../models/adminModel');
const KuisionerModel = require('../../models/kuisionerModel');
const UserModel      = require('../../models/userModel');
const LaporanModel   = require('../../models/laporan');
const response       = require('../../utils/response');

const adminController = {

  // ── DASHBOARD ──────────────────────────────────────────────────────────────

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

  getGrafikBulanan: async (req, res) => {
    try {
      const { tipe, tahun } = req.query;
      const data = await AdminModel.getLaporanPerBulan({ tipe, tahun });
      response.success(res, data, 'Berhasil mengambil data grafik');
    } catch (err) {
      console.error('[adminController.getGrafikBulanan]', err);
      response.error(res, 'Gagal mengambil grafik', 500, err.message);
    }
  },

  // ── LAPORAN KEHILANGAN ─────────────────────────────────────────────────────

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

  createLaporanKehilangan: async (req, res) => {
    try {
      const { judul, deskripsi, lokasi, kategori_id } = req.body;
      if (!judul || !deskripsi || !lokasi || !kategori_id)
        return response.error(res, 'Semua field wajib diisi', 400);

      const newLaporan = await LaporanModel.create({
        judul, deskripsi, lokasi, kategori_id,
        tipe: 'kehilangan',
        status: 'baru',
        created_by: req.user.id,
      });
      response.success(res, newLaporan, 'Laporan kehilangan berhasil dibuat', 201);
    } catch (err) {
      console.error('[adminController.createLaporanKehilangan]', err);
      response.error(res, 'Gagal membuat laporan kehilangan', 500, err.message);
    }
  },

  // ── LAPORAN PENEMUAN ───────────────────────────────────────────────────────

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

  createLaporanPenemuan: async (req, res) => {
    try {
      const { judul, deskripsi, lokasi, kategori_id } = req.body;
      if (!judul || !deskripsi || !lokasi || !kategori_id)
        return response.error(res, 'Semua field wajib diisi', 400);

      const newLaporan = await LaporanModel.create({
        judul, deskripsi, lokasi, kategori_id,
        tipe: 'penemuan',
        status: 'baru',
        created_by: req.user.id,
      });
      response.success(res, newLaporan, 'Laporan penemuan berhasil dibuat', 201);
    } catch (err) {
      console.error('[adminController.createLaporanPenemuan]', err);
      response.error(res, 'Gagal membuat laporan penemuan', 500, err.message);
    }
  },

  updateStatusLaporan: async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) return response.error(res, 'Status wajib diisi', 400);
      await AdminModel.updateStatusLaporan(req.params.id, status);
      response.success(res, null, `Status laporan berhasil diubah menjadi "${status}"`);
    } catch (err) {
      console.error('[adminController.updateStatusLaporan]', err);
      response.error(res, err.message || 'Gagal mengubah status', 400);
    }
  },

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

  getKategoriAdmin: async (req, res) => {
    try {
      const data = await AdminModel.getKategoriWithPertanyaan();
      response.success(res, data, 'Berhasil mengambil kategori');
    } catch (err) {
      console.error('[adminController.getKategoriAdmin]', err);
      response.error(res, 'Gagal mengambil kategori', 500, err.message);
    }
  },

  updatePertanyaanKategori: async (req, res) => {
    try {
      const { id } = req.params;
      const { pertanyaan } = req.body;
      if (!Array.isArray(pertanyaan))
        return response.error(res, 'pertanyaan harus berupa array', 400);
      await AdminModel.updatePertanyaan(id, pertanyaan);
      response.success(res, null, 'Pertanyaan berhasil disimpan');
    } catch (err) {
      console.error('[adminController.updatePertanyaanKategori]', err);
      response.error(res, 'Gagal menyimpan pertanyaan', 500, err.message);
    }
  },

};

module.exports = adminController;
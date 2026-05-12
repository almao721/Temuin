const AdminModel    = require('../../models/adminModel');
const LaporanModel  = require('../../models/laporan');
const UserModel     = require('../../models/userModel');
const KuisionerModel = require('../../models/kuisionerModel');
const KategoriModel = require('../../models/kategori');
const response      = require('../../utils/response');

const adminController = {

  // ══════════════════════════════════════════════════════════════
  //  DASHBOARD
  // ══════════════════════════════════════════════════════════════

  // GET /api/admin/dashboard/stats
  getDashboardStats: async (req, res) => {
    try {
      const stats = await AdminModel.getDashboardStats();
      response.success(res, stats, 'Berhasil mengambil statistik dashboard');
    } catch (err) {
      console.error(err);
      response.error(res, 'Gagal mengambil statistik', 500, err.message);
    }
  },

  // GET /api/admin/dashboard/grafik?tipe=kehilangan&tahun=2024
  getGrafikBulanan: async (req, res) => {
    try {
      const { tipe, tahun } = req.query;
      const data = await AdminModel.getLaporanPerBulan(tipe, tahun ? +tahun : null);
      response.success(res, data, 'Berhasil mengambil data grafik');
    } catch (err) {
      console.error(err);
      response.error(res, 'Gagal mengambil grafik', 500, err.message);
    }
  },

  // GET /api/admin/dashboard/per-kategori
  getLaporanPerKategori: async (req, res) => {
    try {
      const data = await AdminModel.getLaporanPerKategori();
      response.success(res, data, 'Berhasil mengambil laporan per kategori');
    } catch (err) {
      console.error(err);
      response.error(res, 'Gagal mengambil data', 500, err.message);
    }
  },

  // GET /api/admin/dashboard/filter?tipe=All&tanggal_mulai=&tanggal_akhir=
  getDashboardFiltered: async (req, res) => {
    try {
      const { tipe, tanggal_mulai, tanggal_akhir } = req.query;
      const data = await AdminModel.getDashboardFiltered({ tipe, tanggal_mulai, tanggal_akhir });
      response.success(res, data, 'Berhasil mengambil data dashboard');
    } catch (err) {
      console.error(err);
      response.error(res, 'Gagal mengambil data', 500, err.message);
    }
  },

  // ══════════════════════════════════════════════════════════════
  //  LAPORAN KEHILANGAN (Admin)
  // ══════════════════════════════════════════════════════════════

  // GET /api/admin/laporan/kehilangan?page=1&limit=10&search=&status=&tanggal_mulai=&tanggal_akhir=
  getLaporanKehilangan: async (req, res) => {
    try {
      const { page = 1, limit = 10, search, status, kategori_id, tanggal_mulai, tanggal_akhir } = req.query;
      const result = await LaporanModel.getAll({
        tipe: 'kehilangan', page: +page, limit: +limit,
        search, status, kategori_id, tanggal_mulai, tanggal_akhir,
      });
      response.paginate(res, result.data, result.page, result.limit, result.total, 'Berhasil mengambil laporan kehilangan');
    } catch (err) {
      console.error(err);
      response.error(res, 'Gagal mengambil laporan kehilangan', 500, err.message);
    }
  },

  // GET /api/admin/laporan/penemuan?page=1&limit=10&search=...
  getLaporanPenemuan: async (req, res) => {
    try {
      const { page = 1, limit = 10, search, status, kategori_id, tanggal_mulai, tanggal_akhir } = req.query;
      const result = await LaporanModel.getAll({
        tipe: 'penemuan', page: +page, limit: +limit,
        search, status, kategori_id, tanggal_mulai, tanggal_akhir,
      });
      response.paginate(res, result.data, result.page, result.limit, result.total, 'Berhasil mengambil laporan penemuan');
    } catch (err) {
      console.error(err);
      response.error(res, 'Gagal mengambil laporan penemuan', 500, err.message);
    }
  },

  // GET /api/admin/laporan/:id
  getLaporanDetail: async (req, res) => {
    try {
      const laporan = await LaporanModel.findById(req.params.id);
      if (!laporan) return response.error(res, 'Laporan tidak ditemukan', 404);

      // Sertakan kuisioner jika ada
      const kuisioner = await KuisionerModel.findByLaporanId(laporan.id).catch(() => null);
      response.success(res, { ...laporan, kuisioner }, 'Berhasil mengambil detail laporan');
    } catch (err) {
      console.error(err);
      response.error(res, 'Gagal mengambil detail laporan', 500, err.message);
    }
  },

  // PATCH /api/admin/laporan/:id/status  body: { status: 'selesai'|'proses'|'ditolak' }
  updateStatusLaporan: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) return response.error(res, 'Status wajib diisi', 400);

      const laporan = await LaporanModel.findById(id);
      if (!laporan) return response.error(res, 'Laporan tidak ditemukan', 404);

      await LaporanModel.updateStatus(id, status);
      response.success(res, null, `Status laporan berhasil diubah menjadi "${status}"`);
    } catch (err) {
      console.error(err);
      response.error(res, err.message || 'Gagal mengubah status', 500);
    }
  },

  // DELETE /api/admin/laporan/:id
  deleteLaporan: async (req, res) => {
    try {
      const laporan = await LaporanModel.findById(req.params.id);
      if (!laporan) return response.error(res, 'Laporan tidak ditemukan', 404);

      await LaporanModel.delete(req.params.id);
      response.success(res, null, 'Laporan berhasil dihapus');
    } catch (err) {
      console.error(err);
      response.error(res, 'Gagal menghapus laporan', 500, err.message);
    }
  },

  // ══════════════════════════════════════════════════════════════
  //  DAFTAR SISWA (Admin)
  // ══════════════════════════════════════════════════════════════

  // GET /api/admin/siswa?page=1&limit=10&search=&status=
  getDaftarSiswa: async (req, res) => {
    try {
      const { page = 1, limit = 10, search, status } = req.query;
      const allUsers = await UserModel.getAll();

      let filtered = allUsers.filter(u => u.role === 'siswa');
      if (search) {
        filtered = filtered.filter(u => u.nis_nip.includes(search));
      }
      if (status !== undefined && status !== '') {
        filtered = filtered.filter(u => u.is_active === +status);
      }

      const total  = filtered.length;
      const offset = (page - 1) * limit;
      const data   = filtered.slice(offset, offset + +limit);

      response.paginate(res, data, +page, +limit, total, 'Berhasil mengambil daftar siswa');
    } catch (err) {
      console.error(err);
      response.error(res, 'Gagal mengambil daftar siswa', 500, err.message);
    }
  },

  // POST /api/admin/siswa  body: { nis_nip, password }
  tambahSiswa: async (req, res) => {
    try {
      const bcrypt = require('bcryptjs');
      const { nis_nip, password } = req.body;

      if (!nis_nip || !password) return response.error(res, 'NIS dan password wajib diisi', 400);

      const existing = await UserModel.findByNisNip(nis_nip);
      if (existing) return response.error(res, 'NIS sudah terdaftar', 409);

      const hashed = await bcrypt.hash(password, 10);
      const result = await UserModel.create({ nis_nip, password: hashed, role: 'siswa' });
      response.success(res, { user_id: result.insertId }, 'Siswa berhasil ditambahkan', 201);
    } catch (err) {
      console.error(err);
      response.error(res, 'Gagal menambah siswa', 500, err.message);
    }
  },

  // PUT /api/admin/siswa/:id  body: { nis_nip, is_active }
  updateSiswa: async (req, res) => {
    try {
      const { id } = req.params;
      const { nis_nip, is_active } = req.body;

      const user = await UserModel.findById(id);
      if (!user) return response.error(res, 'Siswa tidak ditemukan', 404);

      await UserModel.update(id, {
        nis_nip:   nis_nip   !== undefined ? nis_nip   : user.nis_nip,
        role:      user.role,
        is_active: is_active !== undefined ? is_active : user.is_active,
      });
      response.success(res, null, 'Data siswa berhasil diupdate');
    } catch (err) {
      console.error(err);
      response.error(res, 'Gagal mengupdate siswa', 500, err.message);
    }
  },

  // PATCH /api/admin/siswa/:id/toggle-active
  toggleAktifSiswa: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) return response.error(res, 'Siswa tidak ditemukan', 404);

      await UserModel.toggleActive(req.params.id);
      const newStatus = user.is_active === 1 ? 'nonaktif' : 'aktif';
      response.success(res, null, `Siswa berhasil di${newStatus}kan`);
    } catch (err) {
      console.error(err);
      response.error(res, 'Gagal mengubah status siswa', 500, err.message);
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
      console.error(err);
      response.error(res, 'Gagal menghapus siswa', 500, err.message);
    }
  },

  // PATCH /api/admin/siswa/:id/reset-password  body: { password }
  resetPasswordSiswa: async (req, res) => {
    try {
      const bcrypt = require('bcryptjs');
      const { password } = req.body;
      if (!password) return response.error(res, 'Password baru wajib diisi', 400);

      const user = await UserModel.findById(req.params.id);
      if (!user) return response.error(res, 'Siswa tidak ditemukan', 404);

      const hashed = await bcrypt.hash(password, 10);
      await UserModel.updatePassword(req.params.id, hashed);
      response.success(res, null, 'Password berhasil direset');
    } catch (err) {
      console.error(err);
      response.error(res, 'Gagal reset password', 500, err.message);
    }
  },

  // ══════════════════════════════════════════════════════════════
  //  KUISIONER LAPORAN (Admin)
  // ══════════════════════════════════════════════════════════════

  // GET /api/admin/kuisioner
  getAllKuisioner: async (req, res) => {
    try {
      const data = await KuisionerModel.getAll();
      response.success(res, data, 'Berhasil mengambil data kuisioner');
    } catch (err) {
      console.error(err);
      response.error(res, 'Gagal mengambil kuisioner', 500, err.message);
    }
  },

  // GET /api/admin/kuisioner/rekap
  getRekapKuisioner: async (req, res) => {
    try {
      const data = await KuisionerModel.getRekapPerKategori();
      response.success(res, data, 'Berhasil mengambil rekap kuisioner');
    } catch (err) {
      console.error(err);
      response.error(res, 'Gagal mengambil rekap kuisioner', 500, err.message);
    }
  },

  // GET /api/admin/kuisioner/:laporan_id
  getKuisionerByLaporan: async (req, res) => {
    try {
      const data = await KuisionerModel.findByLaporanId(req.params.laporan_id);
      if (!data) return response.error(res, 'Kuisioner tidak ditemukan', 404);
      response.success(res, data, 'Berhasil mengambil kuisioner');
    } catch (err) {
      console.error(err);
      response.error(res, 'Gagal mengambil kuisioner', 500, err.message);
    }
  },

  // DELETE /api/admin/kuisioner/:id
  deleteKuisioner: async (req, res) => {
    try {
      await KuisionerModel.delete(req.params.id);
      response.success(res, null, 'Kuisioner berhasil dihapus');
    } catch (err) {
      console.error(err);
      response.error(res, 'Gagal menghapus kuisioner', 500, err.message);
    }
  },

  // ══════════════════════════════════════════════════════════════
  //  KATEGORI (Admin CRUD)
  // ══════════════════════════════════════════════════════════════

  // GET /api/admin/kategori
  getAllKategori: async (req, res) => {
    try {
      const data = await KategoriModel.getAll();
      response.success(res, data, 'Berhasil mengambil kategori');
    } catch (err) {
      response.error(res, 'Gagal mengambil kategori', 500, err.message);
    }
  },

  // POST /api/admin/kategori  body: { nama_kategori, deskripsi, icon_url }
  createKategori: async (req, res) => {
    try {
      const { nama_kategori, deskripsi, icon_url } = req.body;
      if (!nama_kategori) return response.error(res, 'Nama kategori wajib diisi', 400);
      const result = await KategoriModel.create({ nama_kategori, deskripsi, icon_url });
      response.success(res, { id: result.insertId }, 'Kategori berhasil ditambahkan', 201);
    } catch (err) {
      response.error(res, 'Gagal menambah kategori', 500, err.message);
    }
  },

  // PUT /api/admin/kategori/:id
  updateKategori: async (req, res) => {
    try {
      const { id } = req.params;
      const kat = await KategoriModel.findById(id);
      if (!kat) return response.error(res, 'Kategori tidak ditemukan', 404);

      const { nama_kategori, deskripsi, icon_url, status } = req.body;
      await KategoriModel.update(id, {
        nama_kategori: nama_kategori || kat.nama_kategori,
        deskripsi:     deskripsi !== undefined ? deskripsi : kat.deskripsi,
        icon_url:      icon_url  !== undefined ? icon_url  : kat.icon_url,
        status:        status    !== undefined ? status    : kat.status,
      });
      response.success(res, null, 'Kategori berhasil diupdate');
    } catch (err) {
      response.error(res, 'Gagal mengupdate kategori', 500, err.message);
    }
  },

  // DELETE /api/admin/kategori/:id
  deleteKategori: async (req, res) => {
    try {
      const kat = await KategoriModel.findById(req.params.id);
      if (!kat) return response.error(res, 'Kategori tidak ditemukan', 404);
      await KategoriModel.delete(req.params.id);
      response.success(res, null, 'Kategori berhasil dihapus');
    } catch (err) {
      response.error(res, 'Gagal menghapus kategori', 500, err.message);
    }
  },
};

module.exports = adminController;

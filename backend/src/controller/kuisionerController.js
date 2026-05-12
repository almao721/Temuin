const KuisionerModel = require('../../models/kuisionerModel');
const LaporanModel   = require('../../models/laporan');
const response       = require('../../utils/response');

const kuisionerController = {

  // POST /api/kuisioner
  // Body: { laporan_id, jenis_barang, warna_barang, deskripsi_detail, brand_merk, waktu_terakhir, lokasi_terakhir }
  create: async (req, res) => {
    try {
      const {
        laporan_id,
        jenis_barang,
        warna_barang,
        deskripsi_detail,
        brand_merk,
        waktu_terakhir,
        lokasi_terakhir,
      } = req.body;

      if (!laporan_id || !jenis_barang) {
        return response.error(res, 'laporan_id dan jenis_barang wajib diisi', 400);
      }

      // Pastikan laporan milik user yg login
      const laporan = await LaporanModel.findById(laporan_id);
      if (!laporan) return response.error(res, 'Laporan tidak ditemukan', 404);

      if (laporan.user_id !== req.user.user_id && req.user.role !== 'pegawai') {
        return response.error(res, 'Tidak berhak mengisi kuisioner laporan ini', 403);
      }

      // Cek apakah sudah ada kuisioner
      const existing = await KuisionerModel.findByLaporanId(laporan_id);
      if (existing) return response.error(res, 'Kuisioner untuk laporan ini sudah ada', 409);

      const result = await KuisionerModel.create({
        laporan_id, jenis_barang, warna_barang,
        deskripsi_detail, brand_merk, waktu_terakhir, lokasi_terakhir,
      });

      response.success(res, { id: result.insertId }, 'Kuisioner berhasil disimpan', 201);
    } catch (err) {
      console.error(err);
      response.error(res, 'Gagal menyimpan kuisioner', 500, err.message);
    }
  },

  // GET /api/kuisioner/:laporan_id  (user bisa lihat kuisionernya sendiri)
  getByLaporan: async (req, res) => {
    try {
      const laporan = await LaporanModel.findById(req.params.laporan_id);
      if (!laporan) return response.error(res, 'Laporan tidak ditemukan', 404);

      if (laporan.user_id !== req.user.user_id && req.user.role !== 'pegawai') {
        return response.error(res, 'Tidak berhak melihat kuisioner ini', 403);
      }

      const data = await KuisionerModel.findByLaporanId(req.params.laporan_id);
      if (!data) return response.error(res, 'Kuisioner belum diisi', 404);

      response.success(res, data, 'Berhasil mengambil kuisioner');
    } catch (err) {
      console.error(err);
      response.error(res, 'Gagal mengambil kuisioner', 500, err.message);
    }
  },

  // PUT /api/kuisioner/:id  (update kuisioner)
  update: async (req, res) => {
    try {
      const {
        jenis_barang, warna_barang, deskripsi_detail,
        brand_merk, waktu_terakhir, lokasi_terakhir,
      } = req.body;

      await KuisionerModel.update(req.params.id, {
        jenis_barang, warna_barang, deskripsi_detail,
        brand_merk, waktu_terakhir, lokasi_terakhir,
      });

      response.success(res, null, 'Kuisioner berhasil diupdate');
    } catch (err) {
      console.error(err);
      response.error(res, 'Gagal mengupdate kuisioner', 500, err.message);
    }
  },
};

module.exports = kuisionerController;

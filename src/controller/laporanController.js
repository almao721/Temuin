const LaporanModel = require('../../models/Laporan');
const LaporanPenemuanModel = require('../../models/LaporanPenemuan');
const LaporanKehilanganModel = require('../../models/LaporanKehilangan');
const response = require('../../utils/response');
const moment = require('moment');

const laporanController = {
  // Create laporan penemuan
  createPenemuan: async (req, res) => {
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
  },
  
  // Create laporan kehilangan
  createKehilangan: async (req, res) => {
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
  },
  
  // Get all laporan
  getAllLaporan: async (req, res) => {
    try {
      const laporan = await LaporanModel.getAll();
      response.success(res, laporan, 'Berhasil mengambil data laporan');
    } catch (error) {
      console.error(error);
      response.error(res, 'Terjadi kesalahan pada server', 500);
    }
  },
  
  // Get laporan by ID
  getLaporanById: async (req, res) => {
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
  },
  
  // Get laporan by type
  getLaporanByType: async (req, res) => {
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
  },
  
  // Get my laporan
  getMyLaporan: async (req, res) => {
    try {
      const user_id = req.user.user_id;
      const laporan = await LaporanModel.getByUserId(user_id);
      response.success(res, laporan, 'Berhasil mengambil data laporan Anda');
    } catch (error) {
      console.error(error);
      response.error(res, 'Terjadi kesalahan pada server', 500);
    }
  },
  
  // Delete laporan
  deleteLaporan: async (req, res) => {
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
  }
};

module.exports = laporanController;
const LokasiModel = require('../../models/Lokasi');
const response = require('../../utils/response');

const lokasiController = {
  getAllLokasi: async (req, res) => {
    try {
      const lokasi = await LokasiModel.getAll();
      response.success(res, lokasi, 'Berhasil mengambil data lokasi');
    } catch (error) {
      console.error(error);
      response.error(res, 'Terjadi kesalahan pada server', 500);
    }
  },
  
  getLokasiById: async (req, res) => {
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
  },
  
  createLokasi: async (req, res) => {
    try {
      const { nama_lokasi, tipe_lokasi, icon } = req.body;
      
      if (!nama_lokasi || !tipe_lokasi) {
        return response.error(res, 'Nama lokasi dan tipe lokasi wajib diisi', 400);
      }
      
      const result = await LokasiModel.create({ nama_lokasi, tipe_lokasi, icon });
      response.success(res, { id: result.insertId }, 'Lokasi berhasil ditambahkan', 201);
      
    } catch (error) {
      console.error(error);
      response.error(res, 'Terjadi kesalahan pada server', 500);
    }
  },
  
  updateLokasi: async (req, res) => {
    try {
      const { id } = req.params;
      const { nama_lokasi, tipe_lokasi, icon, status } = req.body;
      
      const lokasi = await LokasiModel.findById(id);
      if (!lokasi) {
        return response.error(res, 'Lokasi tidak ditemukan', 404);
      }
      
      await LokasiModel.update(id, {
        nama_lokasi: nama_lokasi || lokasi.nama_lokasi,
        tipe_lokasi: tipe_lokasi || lokasi.tipe_lokasi,
        icon: icon !== undefined ? icon : lokasi.icon,
        status: status !== undefined ? status : lokasi.status
      });
      
      response.success(res, null, 'Lokasi berhasil diupdate');
    } catch (error) {
      console.error(error);
      response.error(res, 'Terjadi kesalahan pada server', 500);
    }
  },
  
  deleteLokasi: async (req, res) => {
    try {
      const { id } = req.params;
      const lokasi = await LokasiModel.findById(id);
      
      if (!lokasi) {
        return response.error(res, 'Lokasi tidak ditemukan', 404);
      }
      
      await LokasiModel.delete(id);
      response.success(res, null, 'Lokasi berhasil dihapus');
      
    } catch (error) {
      console.error(error);
      response.error(res, 'Terjadi kesalahan pada server', 500);
    }
  }
};

module.exports = lokasiController;
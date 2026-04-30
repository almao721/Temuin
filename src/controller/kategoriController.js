const KategoriModel = require('../../models/Kategori');
const response = require('../../utils/response');

const kategoriController = {
  getAllKategori: async (req, res) => {
    try {
      const kategori = await KategoriModel.getAll();
      response.success(res, kategori, 'Berhasil mengambil data kategori');
    } catch (error) {
      console.error(error);
      response.error(res, 'Terjadi kesalahan pada server', 500);
    }
  },
  
  getKategoriById: async (req, res) => {
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
  },
  
  createKategori: async (req, res) => {
    try {
      const { nama_kategori, deskripsi, icon_url } = req.body;
      
      if (!nama_kategori) {
        return response.error(res, 'Nama kategori wajib diisi', 400);
      }
      
      const result = await KategoriModel.create({ nama_kategori, deskripsi, icon_url });
      response.success(res, { id: result.insertId }, 'Kategori berhasil ditambahkan', 201);
      
    } catch (error) {
      console.error(error);
      response.error(res, 'Terjadi kesalahan pada server', 500);
    }
  },
  
  updateKategori: async (req, res) => {
    try {
      const { id } = req.params;
      const { nama_kategori, deskripsi, icon_url, status } = req.body;
      
      const kategori = await KategoriModel.findById(id);
      if (!kategori) {
        return response.error(res, 'Kategori tidak ditemukan', 404);
      }
      
      await KategoriModel.update(id, {
        nama_kategori: nama_kategori || kategori.nama_kategori,
        deskripsi: deskripsi !== undefined ? deskripsi : kategori.deskripsi,
        icon_url: icon_url !== undefined ? icon_url : kategori.icon_url,
        status: status !== undefined ? status : kategori.status
      });
      
      response.success(res, null, 'Kategori berhasil diupdate');
    } catch (error) {
      console.error(error);
      response.error(res, 'Terjadi kesalahan pada server', 500);
    }
  },
  
  deleteKategori: async (req, res) => {
    try {
      const { id } = req.params;
      const kategori = await KategoriModel.findById(id);
      
      if (!kategori) {
        return response.error(res, 'Kategori tidak ditemukan', 404);
      }
      
      await KategoriModel.delete(id);
      response.success(res, null, 'Kategori berhasil dihapus');
      
    } catch (error) {
      console.error(error);
      response.error(res, 'Terjadi kesalahan pada server', 500);
    }
  }
};

module.exports = kategoriController;
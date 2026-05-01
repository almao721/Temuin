const db = require('../src/config/db');

const laporanPenemuanModel = {
  create: async (penemuanData) => {
    const { nama_barang, kategori, deskripsi, foto_barang, detail_lokasi, waktu_insiden, laporan_id } = penemuanData;
    const [result] = await db.execute(
      `INSERT INTO laporan_penemuan 
       (nama_barang, kategori, deskripsi, foto_barang, detail_lokasi, waktu_insiden, laporan_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nama_barang, kategori, deskripsi, foto_barang, detail_lokasi, waktu_insiden, laporan_id]
    );
    return result;
  }
};

module.exports = laporanPenemuanModel;
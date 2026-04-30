const db = require('../src/config/db');

const laporanKehilanganModel = {
  create: async (kehilanganData) => {
    const { barang_tipe, keterangan_lainnya, waktu_insiden, laporan_id } = kehilanganData;
    const [result] = await db.execute(
      `INSERT INTO laporan_kelilingan 
       (barang_tipe, keterangan_lainnya, waktu_insiden, laporan_id) 
       VALUES (?, ?, ?, ?)`,
      [barang_tipe, keterangan_lainnya, waktu_insiden, laporan_id]
    );
    return result;
  }
};

module.exports = laporanKehilanganModel;
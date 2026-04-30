const db = require('../src/config/db');

const lokasiModel = {
  getAll: async () => {
    const [rows] = await db.execute(
      'SELECT id, nama_lokasi, tipe_lokasi, icon, status FROM lokasi WHERE status = 1 ORDER BY nama_lokasi'
    );
    return rows;
  },
  
  findById: async (id) => {
    const [rows] = await db.execute(
      'SELECT id, nama_lokasi, tipe_lokasi, icon, status FROM lokasi WHERE id = ?',
      [id]
    );
    return rows[0];
  }
};

module.exports = lokasiModel;
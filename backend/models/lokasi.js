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
  },
  
  create: async (data) => {
    const { nama_lokasi, tipe_lokasi, icon } = data;
    const [result] = await db.execute(
      'INSERT INTO lokasi (nama_lokasi, tipe_lokasi, icon, status) VALUES (?, ?, ?, 1)',
      [nama_lokasi, tipe_lokasi, icon]
    );
    return result;
  },
  
  update: async (id, data) => {
    const { nama_lokasi, tipe_lokasi, icon, status } = data;
    const [result] = await db.execute(
      'UPDATE lokasi SET nama_lokasi = ?, tipe_lokasi = ?, icon = ?, status = ? WHERE id = ?',
      [nama_lokasi, tipe_lokasi, icon, status, id]
    );
    return result;
  },
  
  delete: async (id) => {
    const [result] = await db.execute('DELETE FROM lokasi WHERE id = ?', [id]);
    return result;
  }
};

module.exports = lokasiModel;
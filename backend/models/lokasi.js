const db = require('../src/config/db');

const LokasiModel = {
  getAll: async () => {
    const [rows] = await db.execute(
      'SELECT id, nama_lokasi, tipe_lokasi, icon, status FROM lokasi ORDER BY id ASC'
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.execute(
      'SELECT id, nama_lokasi, tipe_lokasi, icon, status FROM lokasi WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  findByName: async (nama_lokasi) => {
    const [rows] = await db.execute(
      'SELECT id, nama_lokasi, tipe_lokasi, icon, status FROM lokasi WHERE LOWER(nama_lokasi) = LOWER(?) LIMIT 1',
      [nama_lokasi]
    );
    return rows[0] || null;
  },

  create: async ({ nama_lokasi, tipe_lokasi, icon }) => {
    const [result] = await db.execute(
      'INSERT INTO lokasi (nama_lokasi, tipe_lokasi, icon) VALUES (?, ?, ?)',
      [nama_lokasi, tipe_lokasi || null, icon || null]
    );
    return result;
  },

  update: async (id, { nama_lokasi, tipe_lokasi, icon, status }) => {
    const [result] = await db.execute(
      'UPDATE lokasi SET nama_lokasi = ?, tipe_lokasi = ?, icon = ?, status = ? WHERE id = ?',
      [nama_lokasi, tipe_lokasi || null, icon || null, status !== undefined ? status : 1, id]
    );
    return result;
  },

  delete: async (id) => {
    const [result] = await db.execute('DELETE FROM lokasi WHERE id = ?', [id]);
    return result;
  },
};

module.exports = LokasiModel;
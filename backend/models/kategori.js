const db = require('../src/config/db');

const kategoriModel = {
  getAll: async () => {
    const [rows] = await db.execute(
      'SELECT id, nama_kategori, deskripsi, icon_url, status FROM kategori WHERE status = 1 ORDER BY nama_kategori'
    );
    return rows;
  },
  
  findById: async (id) => {
    const [rows] = await db.execute(
      'SELECT id, nama_kategori, deskripsi, icon_url, status FROM kategori WHERE id = ?',
      [id]
    );
    return rows[0];
  }
};

module.exports = kategoriModel;
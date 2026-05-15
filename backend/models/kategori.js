const db = require('../src/config/db');

const kategoriModel = {
  getAll: async () => {
    const [rows] = await db.execute(
      'SELECT id, nama_kategori, deskripsi, icon_url, status FROM kategori WHERE status = 1 ORDER BY nama_kategori'
    );
    return rows;
  },

  getAllAdmin: async () => {
    const [rows] = await db.execute(
      'SELECT id, nama_kategori, deskripsi, icon_url, status FROM kategori ORDER BY nama_kategori'
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.execute(
      'SELECT id, nama_kategori, deskripsi, icon_url, status FROM kategori WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  create: async ({ nama_kategori, deskripsi, icon_url }) => {
    const [result] = await db.execute(
      'INSERT INTO kategori (nama_kategori, deskripsi, icon_url, status) VALUES (?, ?, ?, 1)',
      [nama_kategori, deskripsi || null, icon_url || null]
    );
    return result;
  },

  update: async (id, { nama_kategori, deskripsi, icon_url, status }) => {
    const [result] = await db.execute(
      'UPDATE kategori SET nama_kategori=?, deskripsi=?, icon_url=?, status=? WHERE id=?',
      [nama_kategori, deskripsi, icon_url, status, id]
    );
    return result;
  },

  delete: async (id) => {
    // Soft delete (nonaktifkan)
    const [result] = await db.execute('UPDATE kategori SET status=0 WHERE id=?', [id]);
    return result;
  },
};

module.exports = kategoriModel;

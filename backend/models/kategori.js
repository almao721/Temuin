const db = require('../src/config/db');

const parsePertanyaan = (pertanyaan) => {
  if (!pertanyaan) return [];
  if (Array.isArray(pertanyaan)) return pertanyaan;

  try {
    return JSON.parse(pertanyaan);
  } catch {
    return [];
  }
};

const kategoriModel = {
  getAll: async () => {
    const [rows] = await db.execute(
      'SELECT id, nama_kategori, deskripsi, pertanyaan, status FROM kategori WHERE status = 1 ORDER BY nama_kategori ASC'
    );
    return rows.map((row) => ({
      id: row.id,
      nama_kategori: row.nama_kategori,
      deskripsi: row.deskripsi,
      status: row.status,
      pertanyaan: parsePertanyaan(row.pertanyaan),
    }));
  },

  findById: async (id) => {
    const [rows] = await db.execute(
      'SELECT id, nama_kategori, deskripsi, icon_url, pertanyaan, status FROM kategori WHERE id = ?',
      [id]
    );
    const row = rows[0];
    if (!row) return null;

    return {
      id: row.id,
      nama_kategori: row.nama_kategori,
      deskripsi: row.deskripsi,
      icon_url: row.icon_url,
      status: row.status,
      pertanyaan: parsePertanyaan(row.pertanyaan),
    };
  },

  findByName: async (nama_kategori) => {
    const [rows] = await db.execute(
      'SELECT id, nama_kategori, deskripsi, icon_url, pertanyaan, status FROM kategori WHERE LOWER(nama_kategori) = LOWER(?) LIMIT 1',
      [nama_kategori]
    );
    const row = rows[0];
    if (!row) return null;

    return {
      id: row.id,
      nama_kategori: row.nama_kategori,
      deskripsi: row.deskripsi,
      icon_url: row.icon_url,
      status: row.status,
      pertanyaan: parsePertanyaan(row.pertanyaan),
    };
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

  // TAMBAHAN: method untuk update pertanyaan
  updatePertanyaan: async (kategoriId, pertanyaan) => {
    const pertanyaanJson = JSON.stringify(pertanyaan);
    const [result] = await db.execute(
      'UPDATE kategori SET pertanyaan = ? WHERE id = ?',
      [pertanyaanJson, kategoriId]
    );
    return result;
  },

  delete: async (id) => {
    const [result] = await db.execute('UPDATE kategori SET status=0 WHERE id=?', [id]);
    return result;
  },
};

module.exports = kategoriModel;
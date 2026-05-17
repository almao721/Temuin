const db = require('../src/config/db');

const kuisionerModel = {

  // Buat kuisioner baru setelah laporan kehilangan dibuat
  create: async ({ laporan_id, jenis_barang, warna_barang, deskripsi_detail, brand_merk, waktu_terakhir, lokasi_terakhir }) => {
    const [result] = await db.execute(`
      INSERT INTO kuisioner_laporan
        (laporan_id, jenis_barang, warna_barang, deskripsi_detail, brand_merk, waktu_terakhir, lokasi_terakhir)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [laporan_id, jenis_barang, warna_barang, deskripsi_detail, brand_merk, waktu_terakhir, lokasi_terakhir]);
    return result;
  },

  // Ambil kuisioner berdasarkan laporan_id
  findByLaporanId: async (laporan_id) => {
    const [rows] = await db.execute(
      'SELECT * FROM kuisioner_laporan WHERE laporan_id = ?',
      [laporan_id]
    );
    return rows[0] || null;
  },

  // Ambil kuisioner berdasarkan id
  findById: async (id) => {
    const [rows] = await db.execute(
      'SELECT * FROM kuisioner_laporan WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  // Update kuisioner berdasarkan id
  update: async (id, data) => {
    const fields = [];
    const values = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (!fields.length) return null;

    values.push(id);
    const [result] = await db.execute(
      `UPDATE kuisioner_laporan SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result;
  },

  // Ambil semua kuisioner (admin)
  getAll: async () => {
    const [rows] = await db.execute(`
      SELECT
        kl.*,
        l.tipe_laporan,
        l.status,
        u.nis_nip,
        k.nama_kategori
      FROM kuisioner_laporan kl
      JOIN laporan l  ON kl.laporan_id = l.id
      JOIN user u     ON l.user_id     = u.user_id
      JOIN kategori k ON l.kategori_id = k.id
      ORDER BY kl.id DESC
    `).catch(() => []);
    return rows;
  },

  getRekap: async () => {
    const [rows] = await db.execute(`
      SELECT
        k.nama_kategori AS kategori,
        l.tipe_laporan,
        COUNT(*) AS jumlah,
        SUM(CASE WHEN l.status = 'aktif' THEN 1 ELSE 0 END) AS aktif,
        SUM(CASE WHEN l.status = 'selesai' THEN 1 ELSE 0 END) AS selesai,
        SUM(CASE WHEN l.status = 'ditolak' THEN 1 ELSE 0 END) AS ditolak
      FROM kuisioner_laporan kl
      JOIN laporan l  ON kl.laporan_id = l.id
      JOIN kategori k ON l.kategori_id = k.id
      GROUP BY k.nama_kategori, l.tipe_laporan
      ORDER BY k.nama_kategori, l.tipe_laporan
    `).catch(() => []);
    return rows;
  },

  delete: async (id) => {
    const [result] = await db.execute('DELETE FROM kuisioner_laporan WHERE id = ?', [id]);
    return result;
  },
};

module.exports = kuisionerModel;

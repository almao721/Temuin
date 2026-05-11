const db = require('../src/config/db');

const laporanModel = {
  createMain: async (laporanData) => {
    const { tipe_laporan, lokasi_id, user_id, kategori_id } = laporanData;
    const [result] = await db.execute(
      'INSERT INTO laporan (tipe_laporan, lokasi_id, user_id, kategori_id) VALUES (?, ?, ?, ?)',
      [tipe_laporan, lokasi_id, user_id, kategori_id]
    );
    return result;
  },
  
  getAll: async () => {
    const [rows] = await db.execute(`
      SELECT 
        l.id, l.tipe_laporan, l.lokasi_id, l.user_id, l.kategori_id,
        lok.nama_lokasi, k.nama_kategori, u.nis_nip, u.role as user_role,
        p.nama_barang, p.deskripsi as penemuan_deskripsi, p.foto_barang,
        kh.barang_tipe, kh.keterangan_lainnya,
        COALESCE(p.waktu_insiden, kh.waktu_insiden) as waktu_insiden
      FROM laporan l
      JOIN lokasi lok ON l.lokasi_id = lok.id
      JOIN kategori k ON l.kategori_id = k.id
      JOIN user u ON l.user_id = u.user_id
      LEFT JOIN laporan_penemuan p ON l.id = p.laporan_id
      LEFT JOIN laporan_kehilangan kh ON l.id = kh.laporan_id
      ORDER BY l.id DESC
    `);
    return rows;
  },
  
  getByUserId: async (user_id) => {
    const [rows] = await db.execute(`
      SELECT 
        l.id, l.tipe_laporan, lok.nama_lokasi, k.nama_kategori,
        COALESCE(p.nama_barang, kh.barang_tipe) as nama_barang,
        COALESCE(p.deskripsi, kh.keterangan_lainnya) as keterangan,
        COALESCE(p.waktu_insiden, kh.waktu_insiden) as waktu_insiden
      FROM laporan l
      JOIN lokasi lok ON l.lokasi_id = lok.id
      JOIN kategori k ON l.kategori_id = k.id
      LEFT JOIN laporan_penemuan p ON l.id = p.laporan_id
      LEFT JOIN laporan_kehilangan kh ON l.id = kh.laporan_id
      WHERE l.user_id = ?
      ORDER BY l.id DESC
    `, [user_id]);
    return rows;
  },
  
  getByType: async (tipe_laporan) => {
    const [rows] = await db.execute(`
      SELECT 
        l.id, l.tipe_laporan, lok.nama_lokasi, k.nama_kategori, u.nis_nip,
        COALESCE(p.nama_barang, kh.barang_tipe) as barang,
        COALESCE(p.deskripsi, kh.keterangan_lainnya) as keterangan,
        COALESCE(p.foto_barang, '') as foto_barang,
        COALESCE(p.waktu_insiden, kh.waktu_insiden) as waktu_insiden
      FROM laporan l
      JOIN lokasi lok ON l.lokasi_id = lok.id
      JOIN kategori k ON l.kategori_id = k.id
      JOIN user u ON l.user_id = u.user_id
      LEFT JOIN laporan_penemuan p ON l.id = p.laporan_id
      LEFT JOIN laporan_kehilangan kh ON l.id = kh.laporan_id
      WHERE l.tipe_laporan = ?
      ORDER BY l.id DESC
    `, [tipe_laporan]);
    return rows;
  },
  
  findById: async (id) => {
    const [rows] = await db.execute(`
      SELECT l.*, lok.nama_lokasi, k.nama_kategori, u.nis_nip, u.user_id
      FROM laporan l
      JOIN lokasi lok ON l.lokasi_id = lok.id
      JOIN kategori k ON l.kategori_id = k.id
      JOIN user u ON l.user_id = u.user_id
      WHERE l.id = ?
    `, [id]);
    return rows[0];
  },
  
  delete: async (id) => {
    await db.execute('DELETE FROM laporan_penemuan WHERE laporan_id = ?', [id]);
    await db.execute('DELETE FROM laporan_kehilangan WHERE laporan_id = ?', [id]);
    const [result] = await db.execute('DELETE FROM laporan WHERE id = ?', [id]);
    return result;
  }
};

module.exports = laporanModel;
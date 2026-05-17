const db = require('../src/config/db');

const laporanModel = {

  // ── Create ─────────────────────────────────────────────────────────────────
  createMain: async (laporanData) => {
    const { tipe_laporan, lokasi_id, user_id, kategori_id } = laporanData;
    const [result] = await db.execute(
      "INSERT INTO laporan (tipe_laporan, lokasi_id, user_id, kategori_id, status, created_at) VALUES (?, ?, ?, ?, 'proses', NOW())",
      [tipe_laporan, lokasi_id, user_id, kategori_id]
    );
    return { id: result.insertId, insertId: result.insertId };
  },

  // ── Read all dengan filter & pagination (admin) ────────────────────────────
getAll: async ({ tipe, status, kategori_id, tanggal_mulai, tanggal_akhir, search, page = 1, limit = 10 } = {}) => {
  let where = 'WHERE 1=1';
  const params = [];

  if (tipe && ['kehilangan', 'penemuan'].includes(tipe)) {
    where += ' AND l.tipe_laporan = ?'; 
    params.push(tipe);
  }
  if (status) {
    where += ' AND l.status = ?'; 
    params.push(status);
  }
  if (kategori_id) {
    where += ' AND l.kategori_id = ?'; 
    params.push(kategori_id);
  }
  if (tanggal_mulai) {
    where += ' AND DATE(l.created_at) >= ?'; 
    params.push(tanggal_mulai);
  }
  if (tanggal_akhir) {
    where += ' AND DATE(l.created_at) <= ?'; 
    params.push(tanggal_akhir);
  }
  if (search) {
    where += ' AND (u.nis_nip LIKE ? OR COALESCE(p.nama_barang, kh.barang_tipe) LIKE ? OR lok.nama_lokasi LIKE ?)';
    const s = '%' + search + '%';
    params.push(s, s, s);
  }

  const offset = (page - 1) * limit;
  
  // Hitung total
  const countParams = [...params];
  const [[{ total }]] = await db.execute(
    `SELECT COUNT(*) AS total FROM laporan l
     JOIN user u ON l.user_id = u.user_id
     JOIN lokasi lok ON l.lokasi_id = lok.id
     JOIN kategori k ON l.kategori_id = k.id
     LEFT JOIN laporan_penemuan p ON l.id = p.laporan_id
     LEFT JOIN laporan_kehilangan kh ON l.id = kh.laporan_id
     ${where}`,
    countParams
  );

  // Ambil data dengan pagination
  const dataParams = [...params, limit, offset];
  const [rows] = await db.execute(`
    SELECT
      l.id, l.tipe_laporan, l.status, l.created_at,
      u.nis_nip, u.user_id,
      lok.nama_lokasi, lok.id AS lokasi_id,
      k.nama_kategori, k.id AS kategori_id,
      COALESCE(p.nama_barang, kh.barang_tipe)           AS nama_barang,
      COALESCE(p.deskripsi,  kh.keterangan_lainnya)     AS deskripsi,
      COALESCE(p.foto_barang, '')                        AS foto_barang,
      COALESCE(p.waktu_insiden, kh.waktu_insiden)        AS waktu_insiden,
      p.detail_lokasi
    FROM laporan l
    JOIN user u      ON l.user_id = u.user_id
    JOIN lokasi lok  ON l.lokasi_id = lok.id
    JOIN kategori k  ON l.kategori_id = k.id
    LEFT JOIN laporan_penemuan p ON l.id = p.laporan_id
    LEFT JOIN laporan_kehilangan kh ON l.id = kh.laporan_id
    ${where}
    ORDER BY l.id DESC
    LIMIT ? OFFSET ?
  `, dataParams);

  return { data: rows, total, page: +page, limit: +limit, total_pages: Math.ceil(total / limit) };
},

  getByType: async (tipe_laporan) => {
    const [rows] = await db.execute(`
      SELECT l.id, l.tipe_laporan, l.status, l.created_at,
             lok.nama_lokasi, k.nama_kategori, u.nis_nip,
             COALESCE(p.nama_barang, kh.barang_tipe)       AS barang,
             COALESCE(p.deskripsi, kh.keterangan_lainnya)  AS keterangan,
             COALESCE(p.foto_barang, '')                    AS foto_barang,
             COALESCE(p.waktu_insiden, kh.waktu_insiden)   AS waktu_insiden
      FROM laporan l
      JOIN lokasi lok  ON l.lokasi_id = lok.id
      JOIN kategori k  ON l.kategori_id = k.id
      JOIN user u      ON l.user_id = u.user_id
      LEFT JOIN laporan_penemuan p ON l.id = p.laporan_id
      LEFT JOIN laporan_kehilangan kh ON l.id = kh.laporan_id
      WHERE l.tipe_laporan = ?
      ORDER BY l.id DESC
    `, [tipe_laporan]);
    return rows;
  },

  getByUserId: async (user_id) => {
    const [rows] = await db.execute(`
      SELECT l.id, l.tipe_laporan, l.status, l.created_at,
             lok.nama_lokasi, k.nama_kategori,
             COALESCE(p.nama_barang, kh.barang_tipe)        AS nama_barang,
             COALESCE(p.deskripsi, kh.keterangan_lainnya)   AS keterangan,
             COALESCE(p.waktu_insiden, kh.waktu_insiden)    AS waktu_insiden
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

  findById: async (id) => {
    const [rows] = await db.execute(`
      SELECT l.*, lok.nama_lokasi, k.nama_kategori,
             u.nis_nip, u.user_id,
             p.nama_barang, p.deskripsi AS penemuan_deskripsi,
             p.foto_barang, p.detail_lokasi, p.waktu_insiden AS waktu_penemuan,
             kh.barang_tipe, kh.keterangan_lainnya, kh.waktu_insiden AS waktu_kehilangan
      FROM laporan l
      JOIN lokasi lok ON l.lokasi_id = lok.id
      JOIN kategori k ON l.kategori_id = k.id
      JOIN user u ON l.user_id = u.user_id
      LEFT JOIN laporan_penemuan p ON l.id = p.laporan_id
      LEFT JOIN laporan_kehilangan kh ON l.id = kh.laporan_id
      WHERE l.id = ?
    `, [id]);
    return rows[0];
  },

  updateStatus: async (id, status) => {
    const allowed = ['proses', 'selesai', 'ditolak'];
    if (!allowed.includes(status)) throw new Error('Status tidak valid');
    const [result] = await db.execute(
      'UPDATE laporan SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );
    return result;
  },

  delete: async (id) => {
    await db.execute('DELETE FROM laporan_penemuan   WHERE laporan_id = ?', [id]);
    await db.execute('DELETE FROM laporan_kehilangan WHERE laporan_id = ?', [id]);
    await db.execute('DELETE FROM kuisioner_laporan  WHERE laporan_id = ?', [id]).catch(() => {});
    const [result] = await db.execute('DELETE FROM laporan WHERE id = ?', [id]);
    return result;
  },
};

module.exports = laporanModel;
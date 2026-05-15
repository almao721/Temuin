const db = require('../src/config/db');

const kuisionerModel = {

  // Simpan jawaban kuisioner setelah user lapor kehilangan
  create: async (data) => {
    const {
      laporan_id,
      jenis_barang,   // Dompet / Gelang / Cincin / Kalung / dll
      warna_barang,
      deskripsi_detail,
      brand_merk,
      waktu_terakhir,
      lokasi_terakhir,
    } = data;

    const [result] = await db.execute(`
      INSERT INTO kuisioner_laporan
        (laporan_id, jenis_barang, warna_barang, deskripsi_detail,
         brand_merk, waktu_terakhir, lokasi_terakhir, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `, [laporan_id, jenis_barang, warna_barang, deskripsi_detail,
        brand_merk, waktu_terakhir, lokasi_terakhir]);

    return result;
  },

  // Ambil kuisioner berdasarkan laporan_id
  findByLaporanId: async (laporan_id) => {
    const [rows] = await db.execute(
      'SELECT * FROM kuisioner_laporan WHERE laporan_id = ?',
      [laporan_id]
    );
    return rows[0];
  },

  // Ambil semua kuisioner (admin) dengan info laporan
  getAll: async () => {
    const [rows] = await db.execute(`
      SELECT
        kl.*,
        l.tipe_laporan, l.status,
        u.nis_nip,
        lok.nama_lokasi,
        k.nama_kategori
      FROM kuisioner_laporan kl
      JOIN laporan l   ON kl.laporan_id = l.id
      JOIN user u      ON l.user_id = u.user_id
      JOIN lokasi lok  ON l.lokasi_id = lok.id
      JOIN kategori k  ON l.kategori_id = k.id
      ORDER BY kl.id DESC
    `);
    return rows;
  },

  // Rekap per kategori (Daftar Kuisioner Laporan di admin)
  getRekapPerKategori: async () => {
    const [rows] = await db.execute(`
      SELECT
        k.nama_kategori AS kategori,
        COUNT(kl.id)    AS total_kuisioner,
        SUM(l.status = 'selesai')  AS selesai,
        SUM(l.status != 'selesai' OR l.status IS NULL) AS proses
      FROM kategori k
      LEFT JOIN laporan l ON k.id = l.kategori_id
      LEFT JOIN kuisioner_laporan kl ON l.id = kl.laporan_id
      GROUP BY k.id, k.nama_kategori
      ORDER BY total_kuisioner DESC
    `);
    return rows;
  },

  update: async (id, data) => {
    const { jenis_barang, warna_barang, deskripsi_detail, brand_merk, waktu_terakhir, lokasi_terakhir } = data;
    const [result] = await db.execute(`
      UPDATE kuisioner_laporan
      SET jenis_barang=?, warna_barang=?, deskripsi_detail=?,
          brand_merk=?, waktu_terakhir=?, lokasi_terakhir=?
      WHERE id = ?
    `, [jenis_barang, warna_barang, deskripsi_detail, brand_merk, waktu_terakhir, lokasi_terakhir, id]);
    return result;
  },

  delete: async (id) => {
    const [result] = await db.execute('DELETE FROM kuisioner_laporan WHERE id = ?', [id]);
    return result;
  },
};

module.exports = kuisionerModel;

const db = require('../src/config/db');

const adminModel = {

  // ── Dashboard statistik utama ──────────────────────────────────────────────
  getDashboardStats: async () => {
    const [[totalLaporan]]      = await db.execute('SELECT COUNT(*) AS total FROM laporan');
    const [[laporanKehilangan]] = await db.execute("SELECT COUNT(*) AS total FROM laporan WHERE tipe_laporan = 'kehilangan'");
    const [[laporanPenemuan]]   = await db.execute("SELECT COUNT(*) AS total FROM laporan WHERE tipe_laporan = 'penemuan'");
    const [[totalUser]]         = await db.execute("SELECT COUNT(*) AS total FROM user WHERE role = 'siswa'");

    return {
      total_laporan:      totalLaporan.total,
      laporan_kehilangan: laporanKehilangan.total,
      laporan_penemuan:   laporanPenemuan.total,
      total_siswa:        totalUser.total,
    };
  },

  // ── Grafik laporan per bulan (12 bulan terakhir) ────────────────────────────
  getLaporanPerBulan: async (tipe = null, tahun = null) => {
    const targetTahun = tahun || new Date().getFullYear();
    let query = `
      SELECT
        MONTH(created_at)  AS bulan,
        YEAR(created_at)   AS tahun,
        COUNT(*)           AS total
      FROM laporan
      WHERE YEAR(created_at) = ?
    `;
    const params = [targetTahun];

    if (tipe && ['kehilangan', 'penemuan'].includes(tipe)) {
      query += ' AND tipe_laporan = ?';
      params.push(tipe);
    }

    query += ' GROUP BY YEAR(created_at), MONTH(created_at) ORDER BY bulan ASC';

    const [rows] = await db.execute(query, params);

    // Lengkapi 12 bulan, bulan yang kosong = 0
    const bulanNama = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    const hasil = bulanNama.map((nama, i) => {
      const found = rows.find(r => r.bulan === i + 1);
      return { bulan: nama, total: found ? found.total : 0 };
    });

    return hasil;
  },

  // ── Laporan per kategori ───────────────────────────────────────────────────
  getLaporanPerKategori: async () => {
    const [rows] = await db.execute(`
      SELECT
        k.nama_kategori AS kategori,
        COUNT(l.id)     AS total,
        SUM(l.tipe_laporan = 'kehilangan') AS kehilangan,
        SUM(l.tipe_laporan = 'penemuan')  AS penemuan
      FROM kategori k
      LEFT JOIN laporan l ON k.id = l.kategori_id
      GROUP BY k.id, k.nama_kategori
      ORDER BY total DESC
    `);
    return rows;
  },

  // ── Status laporan (open / selesai) ────────────────────────────────────────
  getLaporanByStatus: async () => {
    const [rows] = await db.execute(`
      SELECT
        status,
        COUNT(*) AS total
      FROM laporan
      GROUP BY status
    `);
    return rows;
  },

  // ── Filter dashboard (tipe, tanggal, tipe range) ──────────────────────────
  getDashboardFiltered: async ({ tipe, tanggal_mulai, tanggal_akhir }) => {
    let where = 'WHERE 1=1';
    const params = [];

    if (tipe && tipe !== 'All') {
      where += ' AND l.tipe_laporan = ?';
      params.push(tipe.toLowerCase());
    }
    if (tanggal_mulai) {
      where += ' AND l.created_at >= ?';
      params.push(tanggal_mulai + ' 00:00:00');
    }
    if (tanggal_akhir) {
      where += ' AND l.created_at <= ?';
      params.push(tanggal_akhir + ' 23:59:59');
    }

    const [[stats]] = await db.execute(`
      SELECT
        COUNT(*)                                       AS total_laporan,
        SUM(l.tipe_laporan = 'kehilangan')             AS laporan_kehilangan,
        SUM(l.tipe_laporan = 'penemuan')               AS laporan_penemuan,
        SUM(l.status = 'selesai')                      AS laporan_selesai,
        SUM(l.status IS NULL OR l.status = 'proses')   AS laporan_proses
      FROM laporan l
      ${where}
    `, params);

    return stats;
  },
};

module.exports = adminModel;

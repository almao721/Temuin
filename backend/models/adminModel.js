const db = require('../src/config/db');

const adminModel = {

  // ── STATISTIK DASHBOARD ────────────────────────────────────────────────────
  getDashboardStats: async ({ timeframe, tipe, tahun } = {}) => {
    const targetTahun = tahun || new Date().getFullYear();

    let timeCondition = '';
    if (timeframe === 'hari ini') {
      timeCondition = "AND DATE(l.created_at) = CURDATE()";
    } else if (timeframe === 'minggu ini') {
      timeCondition = "AND YEARWEEK(l.created_at, 1) = YEARWEEK(CURDATE(), 1)";
    } else if (timeframe === 'bulan ini') {
      timeCondition = "AND MONTH(l.created_at) = MONTH(CURDATE()) AND YEAR(l.created_at) = YEAR(CURDATE())";
    } else if (timeframe === 'tahun ini') {
      timeCondition = `AND YEAR(l.created_at) = ${targetTahun}`;
    }

    let tipeCondition = '';
    if (tipe && tipe !== 'All') {
      tipeCondition = `AND l.tipe_laporan = '${tipe.toLowerCase()}'`;
    }

    const [[statsRow]] = await db.execute(`
      SELECT
        COUNT(*) AS total_laporan,
        SUM(l.tipe_laporan = 'kehilangan') AS sum_kehilangan,
        SUM(l.tipe_laporan = 'penemuan') AS sum_ditemukan
      FROM laporan l
      WHERE 1=1 ${timeCondition} ${tipeCondition}
    `);

    const [[userRow]] = await db.execute(
      "SELECT COUNT(*) AS total_pengguna FROM user WHERE role != 'guru' AND is_active = 1"
    );

    return {
      pengguna_aktif: userRow.total_pengguna,
      sum_kehilangan: statsRow.sum_kehilangan || 0,
      sum_ditemukan:  statsRow.sum_ditemukan  || 0,
      total_laporan:  statsRow.total_laporan  || 0,
    };
  },

  // ── GRAFIK LAPORAN PER BULAN ───────────────────────────────────────────────
  getLaporanPerBulan: async ({ tipe, tahun } = {}) => {
    const targetTahun = tahun || new Date().getFullYear();

    let tipeCondition = '';
    const params = [targetTahun];
    if (tipe && tipe !== 'All') {
      tipeCondition = "AND tipe_laporan = ?";
      params.push(tipe.toLowerCase());
    }

    const [rows] = await db.execute(`
      SELECT
        MONTH(created_at) AS bulan,
        COUNT(*) AS total
      FROM laporan
      WHERE YEAR(created_at) = ? ${tipeCondition}
      GROUP BY MONTH(created_at)
      ORDER BY bulan ASC
    `, params);

    const namaBulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    return namaBulan.map((nama, i) => {
      const found = rows.find(r => r.bulan === i + 1);
      return { bulan: nama, total: found ? Number(found.total) : 0 };
    });
  },

  // ── LAPORAN KEHILANGAN (admin table) ──────────────────────────────────────
  getLaporanKehilangan: async ({ search, status, page = 1, limit = 10 } = {}) => {
    let where = "WHERE l.tipe_laporan = 'kehilangan'";
    const params = [];

    if (search) {
      where += " AND (u.nis_nip LIKE ? OR k.nama_kategori LIKE ? OR kh.barang_tipe LIKE ?)";
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    if (status && status !== 'semua') {
      where += " AND l.status = ?";
      params.push(status);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // HITUNG TOTAL - params untuk COUNT
    const paramsCount = [...params];
    const [[{ total }]] = await db.execute(`
      SELECT COUNT(*) AS total
      FROM laporan l
      LEFT JOIN user u ON l.user_id = u.user_id
      LEFT JOIN kategori k ON l.kategori_id = k.id
      LEFT JOIN laporan_kehilangan kh ON l.id = kh.laporan_id
      ${where}
    `, paramsCount);

    // AMBIL DATA - params untuk DATA (dengan limit/offset)
    const paramsData = [...params, limitNum, offset];
    const query = `
      SELECT
        l.id,
        COALESCE(kh.barang_tipe, '-') AS barang,
        COALESCE(u.nis_nip, '-') AS pelapor,
        l.created_at AS tanggal,
        COALESCE(lok.nama_lokasi, 'Tidak diketahui') AS lokasi,
        COALESCE(k.nama_kategori, '-') AS kategori,
        l.status,
        kh.keterangan_lainnya AS deskripsi,
        kh.waktu_insiden,
        NULL AS warna_barang,
        NULL AS merek,
        NULL AS score
      FROM laporan l
      LEFT JOIN user u ON l.user_id = u.user_id
      LEFT JOIN kategori k ON l.kategori_id = k.id
      LEFT JOIN laporan_kehilangan kh ON l.id = kh.laporan_id
      LEFT JOIN lokasi lok ON l.lokasi_id = lok.id
      ${where}
      ORDER BY l.id DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await db.execute(query, paramsData);

    return {
      data: rows,
      total,
      page: parseInt(page),
      limit: limitNum,
      total_pages: Math.ceil(total / limitNum),
    };
  },

  // ── LAPORAN DITEMUKAN (admin table) ───────────────────────────────────────
  getLaporanPenemuan: async ({ search, status, page = 1, limit = 10 } = {}) => {
    try {
      let where = "WHERE l.tipe_laporan = 'penemuan'";
      const params = [];

      if (search) {
        where += " AND (u.nis_nip LIKE ? OR k.nama_kategori LIKE ? OR lp.nama_barang LIKE ?)";
        const s = `%${search}%`;
        params.push(s, s, s);
      }
      if (status && status !== 'semua') {
        where += " AND l.status = ?";
        params.push(status);
      }

      const offset = (parseInt(page) - 1) * parseInt(limit);
      const limitNum = parseInt(limit);

      // HITUNG TOTAL
      const paramsCount = [...params];
      const [[{ total }]] = await db.execute(`
        SELECT COUNT(*) AS total
        FROM laporan l
        LEFT JOIN user u ON l.user_id = u.user_id
        LEFT JOIN kategori k ON l.kategori_id = k.id
        LEFT JOIN laporan_penemuan lp ON l.id = lp.laporan_id
        ${where}
      `, paramsCount);

      // AMBIL DATA
      const paramsData = [...params, limitNum, offset];
      const query = `
        SELECT
          l.id,
          COALESCE(lp.nama_barang, '-') AS barang,
          COALESCE(u.nis_nip, '-') AS penemu,
          l.created_at,
          COALESCE(lok.nama_lokasi, lp.detail_lokasi, 'Tidak diketahui') AS lokasi,
          COALESCE(k.nama_kategori, lp.kategori, '-') AS kategori,
          l.status,
          lp.deskripsi,
          lp.foto_barang,
          lp.waktu_insiden
        FROM laporan l
        LEFT JOIN user u ON l.user_id = u.user_id
        LEFT JOIN kategori k ON l.kategori_id = k.id
        LEFT JOIN laporan_penemuan lp ON l.id = lp.laporan_id
        LEFT JOIN lokasi lok ON l.lokasi_id = lok.id
        ${where}
        ORDER BY l.id DESC
        LIMIT ? OFFSET ?
      `;
      const [rows] = await db.execute(query, paramsData);

      return {
        data: rows,
        total,
        page: parseInt(page),
        limit: limitNum,
        total_pages: Math.ceil(total / limitNum),
      };
    } catch (err) {
      console.error('Error getLaporanPenemuan:', err);
      return { data: [], total: 0, page: 1, limit: 10, total_pages: 0 };
    }
  },

  // ── UPDATE STATUS LAPORAN ──────────────────────────────────────────────────
  updateStatusLaporan: async (id, status) => {
    const allowed = ['aktif', 'selesai', 'ditolak'];
    if (!allowed.includes(status)) throw new Error('Status tidak valid. Gunakan: aktif | selesai | ditolak');

    const [result] = await db.execute(
      'UPDATE laporan SET status = ? WHERE id = ?',
      [status, id]
    );
    return result;
  },

  // ── HAPUS LAPORAN ──────────────────────────────────────────────────────────
  deleteLaporan: async (id) => {
    await db.execute('DELETE FROM laporan_penemuan WHERE laporan_id = ?', [id]);
    await db.execute('DELETE FROM laporan_kehilangan WHERE laporan_id = ?', [id]);
    await db.execute('DELETE FROM kuisioner_laporan WHERE laporan_id = ?', [id]).catch(() => {});
    const [result] = await db.execute('DELETE FROM laporan WHERE id = ?', [id]);
    return result;
  },

  // ── DAFTAR SISWA ──────────────────────────────────────────────────────────
  getDaftarSiswa: async ({ search, status, page = 1, limit = 10 } = {}) => {
    let where = "WHERE role = 'siswa'";
    const params = [];

    if (search && search !== '') {
      where += " AND nis_nip LIKE ?";
      params.push(`%${search}%`);
    }
    
    if (status !== undefined && status !== '' && status !== 'Semua' && status !== 'all') {
      where += " AND is_active = ?";
      const activeValue = (status === '1' || status === 1 || status === 'active') ? 1 : 0;
      params.push(activeValue);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // HITUNG TOTAL - params untuk COUNT (tanpa limit/offset)
    const paramsCount = [...params];
    const countQuery = `SELECT COUNT(*) AS total FROM user ${where}`;
    const [countRows] = await db.execute(countQuery, paramsCount);
    const total = countRows[0]?.total || 0;

    // AMBIL DATA - params untuk DATA (dengan limit/offset)
    const paramsData = [limitNum, offset];
    const dataQuery = `
      SELECT user_id, nis_nip, role, is_active, created_at
      FROM user
      ${where}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await db.execute(dataQuery, paramsData);

    return {
      data: rows,
      total,
      page: parseInt(page),
      limit: limitNum,
      total_pages: Math.ceil(total / limitNum),
    };
  },

  // ── REKAP KUISIONER PER KATEGORI ──────────────────────────────────────────
  getRekapKuisioner: async () => {
    const [rows] = await db.execute(`
      SELECT
        k.nama_kategori AS kategori,
        COUNT(kl.id) AS total,
        SUM(l.status = 'selesai') AS selesai,
        SUM(l.status != 'selesai' OR l.status IS NULL) AS proses
      FROM kategori k
      LEFT JOIN laporan l ON k.id = l.kategori_id
      LEFT JOIN kuisioner_laporan kl ON l.id = kl.laporan_id
      GROUP BY k.id, k.nama_kategori
      ORDER BY total DESC
    `).catch(async () => {
      const [r] = await db.execute(`
        SELECT
          k.nama_kategori AS kategori,
          COUNT(l.id) AS total,
          SUM(l.status = 'selesai') AS selesai,
          SUM(l.status != 'selesai' OR l.status IS NULL) AS proses
        FROM kategori k
        LEFT JOIN laporan l ON k.id = l.kategori_id
        GROUP BY k.id, k.nama_kategori
        ORDER BY total DESC
      `);
      return r;
    });
    return rows;
  },

  // ── GET /api/admin/kategori - dengan pertanyaan ──────────────────────────
  getKategoriWithPertanyaan: async () => {
    const [rows] = await db.execute(
      'SELECT id, nama_kategori AS nama, deskripsi, pertanyaan FROM kategori WHERE status = 1 ORDER BY nama_kategori ASC'
    );
    return rows.map(row => ({
      ...row,
      pertanyaan: (() => {
        try { return JSON.parse(row.pertanyaan || '[]'); } catch { return []; }
      })(),
    }));
  },

  // ── PUT /api/admin/kategori/:id/pertanyaan ────────────────────────────────
  updatePertanyaan: async (id, pertanyaan) => {
    const [result] = await db.execute(
      'UPDATE kategori SET pertanyaan = ? WHERE id = ?',
      [JSON.stringify(pertanyaan), id]
    );
    return result;
  },

};

module.exports = adminModel;
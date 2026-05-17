"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Trash2,
  Plus,
  Search,
  SlidersHorizontal,
  FileText,
  X,
  Eye,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ── Status Labels ─────────────────────────────────────────────────────────────
const statusLabels: Record<string, string> = {
  aktif:   'Diproses',   // nilai di DB = 'aktif'
  selesai: 'Selesai',
  ditolak: 'Ditolak',
};

// ── Normalize Status ke Backend ───────────────────────────────────────────────
const normalizeStatusToBackend = (status: string): string => {
  const v = String(status).toLowerCase();
  if (['aktif', 'proses', 'pending', 'diproses'].includes(v)) return 'aktif';
  if (['selesai', 'done', 'completed'].includes(v)) return 'selesai';
  if (['ditolak', 'rejected'].includes(v)) return 'ditolak';
  return 'aktif';
};

export default function LaporanKehilangan() {
  const [openFilter, setOpenFilter] = useState(false);
  const [openTambah, setOpenTambah] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [search, setSearch] = useState("");

  const [categories, setCategories] = useState<string[]>([
    "Aksesoris", "Pribadi", "Kunci", "Elektronik", "Pakaian", "Lainnya",
  ]);

  const lokasiList = [
    "Gedung A Lantai 1", "Gedung A Lantai 2", "Gedung A Lantai 3",
    "Gedung B Lantai 1", "Gedung B Lantai 2", "Gedung B Lantai 3",
    "Gedung C", "Gedung D", "Gedung E", "Lobby", "Kantin",
    "Lapangan", "Parkiran", "Musholla",
  ];

  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lokasiDB, setLokasiDB] = useState<any[]>([]);
  const [kategoriDB, setKategoriDB] = useState<any[]>([]);

  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // ── Map Report ──────────────────────────────────────────────────────────────
  const mapReport = (row: any) => ({
    id: row.id,
    barang: row.barang || '-',
    pelapor: row.pelapor || '-',
    tanggal: row.tanggal ? new Date(row.tanggal).toLocaleDateString('id-ID') : '-',
    lokasi: row.lokasi || '-',
    kategori: row.kategori || '-',
    status: statusLabels[row.status] || row.status || 'Diproses',
    score: row.score || '0/0',
    survey: {
      q1: row.barang || '-',
      q2: row.warna_barang || '-',
      q3: row.deskripsi || '-',
      q4: row.merek || '-',
      q5: row.waktu_insiden ? new Date(row.waktu_insiden).toLocaleString('id-ID') : '-',
      q6: row.lokasi || '-',
    },
  });

  // ── Fetch Reports ───────────────────────────────────────────────────────────
  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE}/api/admin/laporan/kehilangan?page=1&limit=50`, {
        method: 'GET',
        headers,
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Gagal memuat laporan');

      const rows = Array.isArray(payload.data) ? payload.data : [];
      const mapped = rows.map(mapReport);

      setReports(mapped);
      
      const kategoriSet = new Set<string>();
      mapped.forEach((item: any) => {
        if (item.kategori && typeof item.kategori === 'string') {
          kategoriSet.add(item.kategori);
        }
      });
      
      setCategories(['Semua', ...Array.from(kategoriSet)]);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat laporan');
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch Lokasi & Kategori untuk dropdown ──────────────────────────────────
 const fetchLokasiDanKategori = async () => {
  try {
    const token = getToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const [lokRes, katRes] = await Promise.all([
      fetch(`${API_BASE}/api/admin/lokasi`, { headers }),
      fetch(`${API_BASE}/api/admin/kategori`, { headers })
    ]);
    
    const lokData = await lokRes.json();
    const katData = await katRes.json();
    
    if (lokData.success) setLokasiDB(Array.isArray(lokData.data) ? lokData.data : []);
    if (katData.success) setKategoriDB(Array.isArray(katData.data) ? katData.data : []);
  } catch (err) {
    console.error("Gagal fetch lokasi/kategori:", err);
  }
};

  useEffect(() => {
    fetchReports();
    fetchLokasiDanKategori();
  }, []);

  // ── Update Status ───────────────────────────────────────────────────────────
  const updateReportStatus = async (reportId: number | string, status: string) => {
    const token = getToken();
    if (!token) {
      alert('Token admin tidak tersedia. Silakan login ulang.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/api/admin/laporan/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: normalizeStatusToBackend(status) }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Gagal mengubah status');

      setReports((current) =>
        current.map((item) => (item.id === reportId ? { ...item, status } : item))
      );
    } catch (error) {
      console.error(error);
      alert('Gagal memperbarui status laporan.');
    }
  };

  // ── Hapus Laporan ───────────────────────────────────────────────────────────
  const hapusLaporan = async (id: number | string) => {
    const token = getToken();
    if (!token) {
      setReports((current) => current.filter((report) => report.id !== id));
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/api/admin/laporan/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Gagal menghapus laporan');

      setReports((current) => current.filter((report) => report.id !== id));
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus laporan.');
    }
  };

  // ── Form Data ───────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    barang: "",
    pelapor: "",
    tanggal: "",
    lokasi: "",
    kategori: "Aksesoris",
    status: "Pending",
    warna: "",
    deskripsi: "",
    merek: "",
  });

  // ── Filter Laporan ──────────────────────────────────────────────────────────
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const cocokKategori = selectedCategory === "Semua" || report.kategori === selectedCategory;
      const cocokStatus = selectedStatus === "Semua" || report.status === selectedStatus;
      const cocokSearch = report.barang.toLowerCase().includes(search.toLowerCase()) ||
                          report.pelapor.toLowerCase().includes(search.toLowerCase());
      return cocokKategori && cocokStatus && cocokSearch;
    });
  }, [reports, selectedCategory, selectedStatus, search]);

  // ── Tambah Laporan (POST ke API) ────────────────────────────────────────────
  const tambahLaporan = async () => {
  if (!formData.barang || !formData.pelapor) {
    alert('Nama barang dan NIS/NIP pelapor wajib diisi');
    return;
  }

  const token = getToken();
  if (!token) { 
    alert('Silakan login ulang'); 
    return; 
  }

  try {
    const payload = {
      barang_tipe: formData.barang,
      kategori_nama: formData.kategori,
      lokasi_nama: formData.lokasi,
      waktu_insiden: formData.tanggal ? new Date(formData.tanggal).toISOString() : new Date().toISOString(),
      detail_data: {
        warna: formData.warna,
        deskripsi: formData.deskripsi,
        merek: formData.merek,
        pelapor_nis: formData.pelapor
      }
    };

    const res = await fetch(`${API_BASE}/api/laporan/kehilangan`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(payload),
    });
    
    const result = await res.json();
    if (result.success) {
      alert('Laporan berhasil ditambahkan!');
      setFormData({
        barang: "", pelapor: "", tanggal: "", lokasi: "",
        kategori: "Aksesoris", status: "Pending", warna: "", deskripsi: "", merek: "",
      });
      setOpenTambah(false);
      fetchReports();
    } else {
      alert(result.message || 'Gagal menambah laporan');
    }
  } catch (err: any) {
    console.error(err);
    alert(err.message || 'Gagal menambah laporan');
  }
};

  return (
    <>
      <div className="mx-auto flex h-[calc(100vh-110px)] w-full max-w-7xl flex-col lg:h-[calc(100vh-40px)]">
        {/* Header */}
        <div className="mb-5 rounded-[32px] bg-gradient-to-r from-[#651A27] to-[#8D303C] p-7 text-white shadow-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-wide text-white">Control Panel</h1>
              <p className="mt-2 text-sm text-white/90">Kelola laporan kehilangan</p>
            </div>
            <button onClick={() => setOpenFilter(true)} className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#651A27] shadow-lg duration-300 hover:scale-[1.03]">
              <SlidersHorizontal size={18} /> Filter
            </button>
          </div>
        </div>

        {/* Tabel Laporan */}
        <div className="flex h-full flex-col overflow-hidden rounded-[30px] border border-[#651A27]/10 bg-white shadow-2xl">
          <div className="border-b border-[#651A27]/10 px-5 py-5 md:px-7">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#651A27]/10 text-[#651A27]">
                  <FileText size={22} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#2F2F2F]">Laporan Kehilangan</h1>
                  <p className="text-sm text-[#6B6B6B]">Data laporan barang hilang</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center gap-2 rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 shadow-sm">
                  <Search size={18} className="text-[#651A27]" />
                  <input type="text" placeholder="Cari laporan..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent text-sm text-[#2F2F2F] outline-none placeholder:text-[#8A8A8A] sm:w-[240px]" />
                </div>
                <button onClick={() => setOpenTambah(true)} className="flex items-center justify-center gap-2 rounded-2xl bg-[#651A27] px-5 py-3 text-sm font-semibold text-white shadow-lg duration-300 hover:scale-[1.03]">
                  <Plus size={18} /> Tambah
                </button>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-5 md:p-7">
            <div className="overflow-auto rounded-3xl border border-[#651A27]/10">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-[#F7ECEE]">
                  <tr className="text-xs uppercase tracking-wide text-[#651A27]">
                    <th className="px-4 py-4 text-left">ID</th>
                    <th className="px-4 py-4 text-left">Nama Barang</th>
                    <th className="px-4 py-4 text-left">Pelapor</th>
                    <th className="px-4 py-4 text-left">Lokasi</th>
                    <th className="px-4 py-4 text-left">Survey</th>
                    <th className="px-4 py-4 text-center">Status</th>
                    <th className="px-4 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="border-t border-[#651A27]/10 transition-all duration-300 hover:bg-[#651A27]/5">
                      <td className="px-4 py-4 font-bold text-[#651A27]">{report.id}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#651A27]/10 text-[#651A27]">
                            <FileText size={18} />
                          </div>
                          <p className="font-bold text-[#2F2F2F]">{report.barang}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">{report.pelapor}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{report.lokasi}</td>
                      <td className="px-4 py-4">
                        <div className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${report.score === "4/6" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {report.score}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="relative inline-block">
                            <select value={report.status} onChange={(e) => updateReportStatus(report.id, e.target.value)} className={`appearance-none rounded-full border px-5 py-2 pr-10 text-xs font-bold outline-none ${report.status === "Selesai" ? "border-green-200 bg-green-100 text-green-700" : report.status === "Diproses" ? "border-blue-200 bg-blue-100 text-blue-700" : "border-yellow-200 bg-yellow-100 text-yellow-700"}`}>
                              <option>Pending</option><option>Diproses</option><option>Selesai</option>
                            </select>
                            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-700">▼</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => { setSelectedReport(report); setOpenDetail(true); }} className="rounded-xl bg-[#651A27]/10 p-2 text-[#651A27] duration-300 hover:scale-110 hover:bg-[#651A27] hover:text-white">
                            <Eye size={17} />
                          </button>
                          <button onClick={() => hapusLaporan(report.id)} className="rounded-xl bg-red-100 p-2 text-red-600 duration-300 hover:scale-110 hover:bg-red-600 hover:text-white">
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Laporan */}
      {openTambah && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl">
            <button onClick={() => setOpenTambah(false)} className="absolute -right-4 -top-4 rounded-full bg-white p-2.5 text-[#651A27] shadow-2xl"><X size={18} /></button>
            <h2 className="mb-5 text-2xl font-bold text-[#651A27]">Tambah Laporan</h2>
            <div className="grid gap-4">
              <input type="text" placeholder="Nama Barang" value={formData.barang} onChange={(e) => setFormData({ ...formData, barang: e.target.value })} className="rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 text-sm text-[#2F2F2F] outline-none" />
              <input type="text" placeholder="NIS/NIP Pelapor" value={formData.pelapor} onChange={(e) => setFormData({ ...formData, pelapor: e.target.value })} className="rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 text-sm text-[#2F2F2F] outline-none" />
              <input type="text" placeholder="Warna Barang" value={formData.warna} onChange={(e) => setFormData({ ...formData, warna: e.target.value })} className="rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 text-sm text-[#2F2F2F] outline-none" />
              <input type="text" placeholder="Brand / Merek" value={formData.merek} onChange={(e) => setFormData({ ...formData, merek: e.target.value })} className="rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 text-sm text-[#2F2F2F] outline-none" />
              <input type="date" value={formData.tanggal} onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })} className="rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 text-sm text-[#2F2F2F] outline-none" />
              <select value={formData.lokasi} onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })} className="rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 text-sm text-[#2F2F2F] outline-none">
                <option value="">Pilih Lokasi</option>
                {lokasiList.map((item) => <option key={item}>{item}</option>)}
                {lokasiDB.map((item) => <option key={item.id}>{item.nama_lokasi}</option>)}
              </select>
              <select value={formData.kategori} onChange={(e) => setFormData({ ...formData, kategori: e.target.value })} className="rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 text-sm text-[#2F2F2F] outline-none">
                {categories.filter(c => c !== "Semua").map((item) => <option key={item}>{item}</option>)}
                {kategoriDB.map((item) => <option key={item.id}>{item.nama_kategori}</option>)}
              </select>
              <textarea rows={3} placeholder="Deskripsi Barang" value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} className="resize-none rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 text-sm text-[#2F2F2F] outline-none" />
              <button onClick={tambahLaporan} className="rounded-2xl bg-[#651A27] py-3 text-sm font-semibold text-white shadow-lg">Tambahkan Laporan</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {openDetail && selectedReport && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl">
            <button onClick={() => setOpenDetail(false)} className="absolute -right-4 -top-4 rounded-full bg-white p-2.5 text-[#651A27] shadow-2xl"><X size={18} /></button>
            <h2 className="mb-5 text-2xl font-bold text-[#651A27]">Hasil Survey</h2>
            <div className="space-y-3">
              {[{ title: "1. Barang apa yang kamu hilangkan?", value: selectedReport.survey.q1 },
                { title: "2. Warna pada barang anda?", value: selectedReport.survey.q2 },
                { title: "3. Deskripsi barang", value: selectedReport.survey.q3 },
                { title: "4. Brand / Merek", value: selectedReport.survey.q4 },
                { title: "5. Waktu terakhir terlihat", value: selectedReport.survey.q5 },
                { title: "6. Lokasi terakhir terlihat", value: selectedReport.survey.q6 }].map((item, index) => (
                <div key={index} className="rounded-2xl bg-[#FFF7F8] p-4">
                  <p className="text-xs font-semibold text-[#651A27]">{item.title}</p>
                  <p className="mt-1 text-sm text-[#2F2F2F]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Filter */}
      {openFilter && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl">
            <button onClick={() => setOpenFilter(false)} className="absolute -right-4 -top-4 rounded-full bg-white p-2.5 text-[#651A27] shadow-2xl"><X size={18} /></button>
            <h2 className="mb-5 text-xl font-bold text-[#651A27]">Filter Laporan</h2>
            <div className="space-y-4">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 text-sm text-[#2F2F2F] outline-none">
                <option>Semua</option>{categories.filter(c => c !== "Semua").map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 text-sm text-[#2F2F2F] outline-none">
                <option>Semua</option><option>Pending</option><option>Diproses</option><option>Selesai</option>
              </select>
              <button onClick={() => setOpenFilter(false)} className="w-full rounded-2xl bg-[#651A27] py-3 text-sm font-semibold text-white">Terapkan Filter</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
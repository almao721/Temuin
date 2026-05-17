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
  Image as ImageIcon,
  Upload,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const statusLabels: Record<string, string> = {
  proses: 'Belum Diambil',
  selesai: 'Sudah Diambil',
  ditolak: 'Ditolak',
};

const normalizeStatusToBackend = (status: string) => {
  if (status === 'Belum Diambil') return 'proses';
  if (status === 'Sudah Diambil') return 'selesai';
  return 'proses';
};

export default function LaporanDitemukan() {
  const [error, setError] = useState<string | null>(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [openTambah, setOpenTambah] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([
    "Aksesoris", "Pribadi", "Kunci", "Elektronik", "Pakaian", "Lainnya",
  ]);

  const lokasiList = [
    "Gedung A Lantai 1", "Gedung A Lantai 2", "Gedung A Lantai 3",
    "Gedung B Lantai 1", "Gedung B Lantai 2", "Gedung B Lantai 3",
    "Gedung C", "Gedung D Lantai 1", "Gedung D Lantai 2", "Gedung D Lantai 3",
    "Gedung E", "Kantin", "Lapangan Basket", "Lobby", "Parkiran",
    "Musholla Lantai 1", "Musholla Lantai 2", "Gerbang Depan SMK Telkom Makassar",
    "Mess", "Hati Martin Edwards"
  ];

  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const mapReport = (row: any) => ({
    id: row.id,
    barang: row.nama_barang || row.barang || '-',
    penemu: row.penemu || row.nis_nip || '-',
    tanggal: row.created_at ? new Date(row.created_at).toLocaleDateString('id-ID') : '-',
    lokasi: row.lokasi || '-',
    kategori: row.kategori || '-',
    status: statusLabels[row.status] || row.status || 'Belum Diambil',
    deskripsi: row.deskripsi || '-',
    foto: row.foto_barang || '',
  });

const fetchReports = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    console.log("Token yang dikirim:", token); // Debug
    
    const response = await fetch(`${API_BASE}/api/admin/laporan/penemuan?page=1&limit=50`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const payload = await response.json();
    console.log("Response:", payload);
    
    if (!response.ok) throw new Error(payload.message || 'Gagal memuat laporan');
    
    const rows = Array.isArray(payload.data) ? payload.data : [];
    const mapped = rows.map(mapReport);
    setReports(mapped);
  } catch (err: any) {
    console.error(err);
    setError(err?.message || 'Gagal memuat laporan');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchReports();
  }, []);

  const updateStatus = async (id: number | string, status: string) => {
    const token = getToken();
    try {
      const response = await fetch(`${API_BASE}/api/admin/laporan/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: normalizeStatusToBackend(status) })
      });
      if (response.ok) {
        fetchReports();
      } else {
        alert('Gagal memperbarui status');
      }
    } catch (error) {
      console.error(error);
      alert('Gagal memperbarui status');
    }
  };

  const hapusLaporan = async (id: number | string) => {
    if (!confirm('Yakin ingin menghapus laporan ini?')) return;
    const token = getToken();
    try {
      const response = await fetch(`${API_BASE}/api/admin/laporan/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        fetchReports();
      } else {
        alert('Gagal menghapus laporan');
      }
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus laporan');
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const cocokKategori = selectedCategory === "Semua" || report.kategori === selectedCategory;
      const cocokStatus = selectedStatus === "Semua" || report.status === selectedStatus;
      const cocokSearch = report.barang.toLowerCase().includes(search.toLowerCase()) ||
                          report.penemu.toLowerCase().includes(search.toLowerCase());
      return cocokKategori && cocokStatus && cocokSearch;
    });
  }, [reports, selectedCategory, selectedStatus, search]);

  const [formData, setFormData] = useState({
    barang: "",
    penemu: "",
    tanggal: "",
    lokasi: "",
    kategori: "Aksesoris",
    deskripsi: "",
    foto: "",
  });

  const tambahLaporan = async () => {
    if (!formData.barang || !formData.penemu || !formData.tanggal || !formData.lokasi) {
      alert('Harap isi semua field yang wajib');
      return;
    }

    const token = getToken();
    try {
      const response = await fetch(`${API_BASE}/api/admin/laporan/penemuan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          nama_barang: formData.barang,
          kategori: formData.kategori,
          lokasi_nama: formData.lokasi,
          deskripsi: formData.deskripsi,
          foto_barang: formData.foto,
          waktu_insiden: new Date(formData.tanggal).toISOString(),
          penemu: formData.penemu
        })
      });
      if (response.ok) {
        fetchReports();
        setOpenTambah(false);
        setFormData({
          barang: "", penemu: "", tanggal: "", lokasi: "", kategori: "Aksesoris",
          deskripsi: "", foto: "",
        });
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal menambahkan laporan');
      }
    } catch (error) {
      console.error(error);
      alert('Gagal menambahkan laporan');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, foto: imageUrl });
    }
  };

  if (loading) return <div className="p-8 text-center">Memuat laporan ditemukan...</div>;

  return (
    <>
      <div className="mx-auto flex h-[calc(100vh-120px)] w-full max-w-7xl flex-col lg:h-[calc(100vh-40px)]">
        <div className="mb-5 rounded-[32px] bg-gradient-to-r from-[#651A27] to-[#8D303C] p-7 text-white shadow-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-wide text-white">Control Panel</h1>
              <p className="mt-2 text-sm text-white/80">Kelola laporan barang ditemukan</p>
            </div>
            <button onClick={() => setOpenFilter(true)} className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#651A27] shadow-lg duration-300 hover:scale-[1.04]">
              <SlidersHorizontal size={18} /> Filter
            </button>
          </div>
        </div>

        <div className="flex h-full flex-col overflow-hidden rounded-[30px] border border-[#651A27]/10 bg-white shadow-2xl">
          <div className="border-b border-[#651A27]/10 px-5 py-5 md:px-7">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#651A27]/10 text-[#651A27]">
                  <FileText size={22} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#2F2F2F]">Laporan Ditemukan</h1>
                  <p className="text-sm text-[#666666]">Data barang ditemukan</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center gap-2 rounded-2xl border border-[#651A27]/15 bg-white px-4 py-3 shadow-sm">
                  <Search size={18} className="text-[#651A27]" />
                  <input type="text" placeholder="Cari laporan..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent text-sm text-[#2F2F2F] outline-none placeholder:text-[#8A8A8A] sm:w-[240px]" />
                </div>
                <button onClick={() => setOpenTambah(true)} className="flex items-center justify-center gap-2 rounded-2xl bg-[#651A27] px-5 py-3 text-sm font-semibold text-white shadow-lg duration-300 hover:scale-[1.04]">
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
                    <th className="px-4 py-4 text-left">Penemu</th>
                    <th className="px-4 py-4 text-left">Lokasi</th>
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
                      <td className="px-4 py-4 text-sm text-[#4B4B4B]">{report.penemu}</td>
                      <td className="px-4 py-4 text-sm text-[#4B4B4B]">{report.lokasi}</td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="relative inline-block">
                            <select
                              value={report.status}
                              onChange={(e) => updateStatus(report.id, e.target.value)}
                              className={`appearance-none rounded-full border px-5 py-2 pr-10 text-xs font-bold outline-none ${
                                report.status === "Sudah Diambil"
                                  ? "border-green-200 bg-green-100 text-green-700"
                                  : "border-yellow-200 bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              <option>Belum Diambil</option>
                              <option>Sudah Diambil</option>
                            </select>
                            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#555]">▼</div>
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
          <div className="relative w-full max-w-md rounded-[28px] bg-white p-5 shadow-2xl">
            <button onClick={() => setOpenTambah(false)} className="absolute -right-3 -top-3 rounded-full bg-white p-2.5 text-[#651A27] shadow-xl duration-300 hover:rotate-90"><X size={18} /></button>
            <h2 className="mb-5 text-2xl font-bold text-[#651A27]">Tambah Barang</h2>
            <div className="grid gap-4">
              <input type="text" placeholder="Nama Barang" value={formData.barang} onChange={(e) => setFormData({ ...formData, barang: e.target.value })} className="rounded-2xl border border-[#651A27]/20 bg-[#FAF6F7] px-4 py-3 text-sm text-[#2F2F2F] outline-none" />
              <input type="text" placeholder="Nama Penemu" value={formData.penemu} onChange={(e) => setFormData({ ...formData, penemu: e.target.value })} className="rounded-2xl border border-[#651A27]/20 bg-[#FAF6F7] px-4 py-3 text-sm text-[#2F2F2F] outline-none" />
              <input type="date" value={formData.tanggal} onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })} className="rounded-2xl border border-[#651A27]/20 bg-[#FAF6F7] px-4 py-3 text-sm text-[#2F2F2F] outline-none" />
              <select value={formData.lokasi} onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })} className="rounded-2xl border border-[#651A27]/20 bg-[#FAF6F7] px-4 py-3 text-sm text-[#2F2F2F] outline-none">
                <option>Pilih Lokasi</option>
                {lokasiList.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={formData.kategori} onChange={(e) => setFormData({ ...formData, kategori: e.target.value })} className="rounded-2xl border border-[#651A27]/20 bg-[#FAF6F7] px-4 py-3 text-sm text-[#2F2F2F] outline-none">
                {categories.filter(c => c !== "Semua").map((item) => <option key={item}>{item}</option>)}
              </select>
              <textarea rows={3} placeholder="Deskripsi Barang" value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} className="resize-none rounded-2xl border border-[#651A27]/20 bg-[#FAF6F7] px-4 py-3 text-sm text-[#2F2F2F] outline-none" />
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#651A27]/20 bg-[#FAF6F7] px-4 py-5 text-center">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                {formData.foto ? (
                  <img src={formData.foto} alt="Preview" className="h-28 w-full rounded-2xl object-cover" />
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#651A27]/10 text-[#651A27]"><Upload size={22} /></div>
                    <p className="mt-3 text-sm font-semibold text-[#651A27]">Upload Foto Barang</p>
                  </>
                )}
              </label>
              <button onClick={tambahLaporan} className="rounded-2xl bg-[#651A27] py-3 text-sm font-semibold text-white shadow-lg duration-300 hover:scale-[1.02]">Tambahkan Barang</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Filter */}
      {openFilter && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl">
            <button onClick={() => setOpenFilter(false)} className="absolute -right-3 -top-3 rounded-full bg-white p-2.5 text-[#651A27] shadow-xl duration-300 hover:rotate-90"><X size={18} /></button>
            <h2 className="mb-5 text-xl font-bold text-[#651A27]">Filter Laporan</h2>
            <div className="space-y-4">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full rounded-2xl border border-[#651A27]/20 bg-[#FAF6F7] px-4 py-3 text-sm text-[#2F2F2F] outline-none">
                <option>Semua</option>
                {categories.filter(c => c !== "Semua").map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full rounded-2xl border border-[#651A27]/20 bg-[#FAF6F7] px-4 py-3 text-sm text-[#2F2F2F] outline-none">
                <option>Semua</option><option>Belum Diambil</option><option>Sudah Diambil</option>
              </select>
              <button onClick={() => setOpenFilter(false)} className="w-full rounded-2xl bg-[#651A27] py-3 text-sm font-semibold text-white">Terapkan Filter</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {openDetail && selectedReport && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl">
            <button onClick={() => setOpenDetail(false)} className="absolute -right-3 -top-3 rounded-full bg-white p-2.5 text-[#651A27] shadow-xl duration-300 hover:rotate-90"><X size={18} /></button>
            <h2 className="mb-5 text-2xl font-bold text-[#651A27]">Detail Barang</h2>
            <div className="overflow-hidden rounded-2xl border border-[#651A27]/10">
              {selectedReport.foto ? (
                <img src={selectedReport.foto} alt={selectedReport.barang} className="h-[170px] w-full object-cover" />
              ) : (
                <div className="flex h-[170px] items-center justify-center bg-[#FAF6F7] text-[#651A27]"><ImageIcon size={50} /></div>
              )}
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-[#FAF6F7] p-4"><p className="text-xs font-semibold text-[#651A27]">Nama Barang</p><p className="mt-1 text-sm text-[#2F2F2F]">{selectedReport.barang}</p></div>
              <div className="rounded-2xl bg-[#FAF6F7] p-4"><p className="text-xs font-semibold text-[#651A27]">Deskripsi</p><p className="mt-1 text-sm text-[#2F2F2F]">{selectedReport.deskripsi}</p></div>
              <div className="rounded-2xl bg-[#FAF6F7] p-4"><p className="text-xs font-semibold text-[#651A27]">Lokasi</p><p className="mt-1 text-sm text-[#2F2F2F]">{selectedReport.lokasi}</p></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
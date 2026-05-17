// ─────────────────────────────────────────────────────────────────────────────
//  api.ts  –  Koneksi frontend martinedwards ke backend Temuin
//  Lokasi: martinedwards/app/lib/api.ts
// ─────────────────────────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function api(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res  = await fetch(`${BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan');
  return data;
}

// ─── HELPER ──────────────────────────────────────────────────────────────────
export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
}

export function getUser(): { user_id: number; nis_nip: string; role: string } | null {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem('user') || ''); } catch { return null; }
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export async function apiLogin(nis_nip: string, password: string) {
  const res = await api('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ nis_nip, password }),
  });
  if (res.success) {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user',  JSON.stringify(res.data.user));
  }
  return res;
}

export async function apiLogout() {
  try {
    await api('/api/auth/logout', { method: 'POST' });
  } catch {
    // tetap lanjut
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

export async function apiMe() {
  return api('/api/auth/me');
}

export async function apiHealth() {
  return api('/health');
}

// ─── LOKASI ───────────────────────────────────────────────────────────────────
export async function apiGetLokasi() {
  return api('/api/lokasi');
}

// ─── KATEGORI (publik) ────────────────────────────────────────────────────────
export async function apiGetKategori() {
  return api('/api/kategori');
}

// ─── LAPORAN SISWA ────────────────────────────────────────────────────────────
export async function apiGetLaporanPublik(tipe: 'kehilangan' | 'penemuan') {
  return api(`/api/laporan/type/${tipe}`);
}

export async function apiGetLaporanSaya() {
  return api('/api/laporan/my');
}

export async function apiLaporKehilangan(body: {
  barang_tipe: string;
  kategori_id: string;
  lokasi_id: string;
  keterangan_lainnya: string;
  waktu_insiden: string;
}) {
  return api('/api/laporan/kehilangan', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function apiLaporPenemuan(formData: FormData) {
  const token = getToken();
  const res = await fetch(`${BASE}/api/laporan/penemuan`, {
    method:  'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body:    formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal membuat laporan');
  return data;
}

export async function apiHapusLaporan(id: number) {
  return api(`/api/laporan/${id}`, { method: 'DELETE' });
}

// ─── KUISIONER ────────────────────────────────────────────────────────────────
export async function apiSimpanKuisioner(body: {
  laporan_id: number;
  jenis_barang: string;
  warna_barang: string;
  deskripsi_detail: string;
  brand_merk: string;
  waktu_terakhir: string;
  lokasi_terakhir: string;
}) {
  return api('/api/kuisioner', { method: 'POST', body: JSON.stringify(body) });
}

export async function apiGetKuisioner(laporan_id: number) {
  return api(`/api/kuisioner/${laporan_id}`);
}

// ═════════════════════════════════════════════════════════════════════════════
//  ADMIN API
// ═════════════════════════════════════════════════════════════════════════════

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
// GET /api/admin/dashboard/stats?timeframe=bulan+ini&tipe=All&tahun=2025
export async function apiAdminDashboardStats(params?: {
  timeframe?: string;
  tipe?: string;
  tahun?: number;
}) {
  const q = new URLSearchParams();
  if (params?.timeframe) q.set('timeframe', params.timeframe);
  if (params?.tipe)      q.set('tipe', params.tipe);
  if (params?.tahun)     q.set('tahun', String(params.tahun));
  return api(`/api/admin/dashboard/stats?${q}`);
}

// GET /api/admin/dashboard/grafik?tahun=2025
// Response: [{ month, kehilangan, ditemukan }]
export async function apiAdminGrafik(tahun?: number) {
  const q = tahun ? `?tahun=${tahun}` : '';
  return api(`/api/admin/dashboard/grafik${q}`);
}

// ─── LAPORAN KEHILANGAN (admin) ───────────────────────────────────────────────
// GET /api/admin/laporan/kehilangan?page&limit&search&status&kategori
export async function apiAdminGetKehilangan(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  kategori?: string;
}) {
  const q = new URLSearchParams();
  if (params?.page)     q.set('page',     String(params.page));
  if (params?.limit)    q.set('limit',    String(params.limit));
  if (params?.search)   q.set('search',   params.search);
  if (params?.status)   q.set('status',   params.status);
  if (params?.kategori) q.set('kategori', params.kategori);
  return api(`/api/admin/laporan/kehilangan?${q}`);
}

// POST /api/admin/laporan/kehilangan
export async function apiAdminTambahKehilangan(body: {
  user_id: number;
  kategori_id: number;
  barang_tipe: string;
  warna_barang?: string;
  keterangan_lainnya?: string;
  brand_merk?: string;
  waktu_insiden?: string;
  lokasi_terakhir?: string;
}) {
  return api('/api/admin/laporan/kehilangan', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// ─── LAPORAN DITEMUKAN (admin) ────────────────────────────────────────────────
// GET /api/admin/laporan/penemuan?page&limit&search&status&kategori
export async function apiAdminGetPenemuan(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  kategori?: string;
}) {
  const q = new URLSearchParams();
  if (params?.page)     q.set('page',     String(params.page));
  if (params?.limit)    q.set('limit',    String(params.limit));
  if (params?.search)   q.set('search',   params.search);
  if (params?.status)   q.set('status',   params.status);
  if (params?.kategori) q.set('kategori', params.kategori);
  return api(`/api/admin/laporan/penemuan?${q}`);
}

// POST /api/admin/laporan/penemuan
export async function apiAdminTambahPenemuan(body: {
  user_id: number;
  kategori_id: number;
  lokasi_id: number;
  nama_barang: string;
  deskripsi?: string;
  foto_barang?: string;
  waktu_insiden?: string;
}) {
  return api('/api/admin/laporan/penemuan', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// ─── AKSI LAPORAN ─────────────────────────────────────────────────────────────
// PATCH /api/admin/laporan/:id/status   body: { status: 'aktif'|'selesai'|'ditolak' }
export async function apiAdminUpdateStatus(id: number | string, status: string) {
  return api(`/api/admin/laporan/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// DELETE /api/admin/laporan/:id
export async function apiAdminHapusLaporan(id: number | string) {
  return api(`/api/admin/laporan/${id}`, { method: 'DELETE' });
}

// ─── SISWA / PENGGUNA (admin) ─────────────────────────────────────────────────
// GET /api/admin/siswa?page&limit&search&status
export async function apiAdminGetSiswa(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  const q = new URLSearchParams();
  if (params?.page)   q.set('page',   String(params.page));
  if (params?.limit)  q.set('limit',  String(params.limit));
  if (params?.search) q.set('search', params.search);
  if (params?.status !== undefined && params?.status !== 'Semua')
    q.set('status', params.status);
  return api(`/api/admin/siswa?${q}`);
}

// POST /api/admin/siswa   { nis_nip, password }
export async function apiAdminTambahSiswa(body: { nis_nip: string; password: string }) {
  return api('/api/admin/siswa', { method: 'POST', body: JSON.stringify(body) });
}

// PUT /api/admin/siswa/:id   { nis_nip?, is_active? }
export async function apiAdminUpdateSiswa(id: number | string, body: {
  nis_nip?: string;
  is_active?: number;
}) {
  return api(`/api/admin/siswa/${id}`, { method: 'PUT', body: JSON.stringify(body) });
}

// PATCH /api/admin/siswa/:id/toggle-active
export async function apiAdminToggleAktif(id: number | string) {
  return api(`/api/admin/siswa/${id}/toggle-active`, { method: 'PATCH' });
}

// PATCH /api/admin/siswa/:id/reset-password   { password }
export async function apiAdminResetPassword(id: number | string, password: string) {
  return api(`/api/admin/siswa/${id}/reset-password`, {
    method: 'PATCH',
    body: JSON.stringify({ password }),
  });
}

// DELETE /api/admin/siswa/:id
export async function apiAdminHapusSiswa(id: number | string) {
  return api(`/api/admin/siswa/${id}`, { method: 'DELETE' });
}

// ─── KATEGORI (admin) ─────────────────────────────────────────────────────────
// GET /api/admin/kategori
export async function apiAdminGetKategori() {
  return api('/api/admin/kategori');
}

// POST /api/admin/kategori   { nama_kategori, deskripsi?, icon_url? }
export async function apiAdminTambahKategori(body: {
  nama_kategori: string;
  deskripsi?: string;
  icon_url?: string;
}) {
  return api('/api/admin/kategori', { method: 'POST', body: JSON.stringify(body) });
}

// PUT /api/admin/kategori/:id/pertanyaan   { pertanyaan: [{value, type}] }
export async function apiAdminSimpanPertanyaan(id: number | string, pertanyaan: any[]) {
  return api(`/api/admin/kategori/${id}/pertanyaan`, {
    method: 'PUT',
    body: JSON.stringify({ pertanyaan }),
  });
}

// DELETE /api/admin/kategori/:id
export async function apiAdminHapusKategori(id: number | string) {
  return api(`/api/admin/kategori/${id}`, { method: 'DELETE' });
}

// ─── LOKASI (admin) ───────────────────────────────────────────────────────────
// GET /api/admin/lokasi
export async function apiAdminGetLokasi() {
  return api('/api/admin/lokasi');
}
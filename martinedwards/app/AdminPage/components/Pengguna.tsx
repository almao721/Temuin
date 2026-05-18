"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Users, Eye, EyeOff, Pencil, Trash2, X, UserPlus, Key, Shield, GraduationCap, Briefcase, User } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ── Avatar Component ─────────────────────────────────────────────────────────
const roleConfig: Record<string, { color: string; bg: string; icon: any; label: string }> = {
  Siswa:   { color: '#1d4ed8', bg: '#dbeafe', icon: GraduationCap, label: 'Siswa' },
  Guru:    { color: '#7c3aed', bg: '#ede9fe', icon: Briefcase,     label: 'Guru' },
  Pegawai: { color: '#0f766e', bg: '#ccfbf1', icon: Briefcase,     label: 'Pegawai' },
  Admin:   { color: '#b91c1c', bg: '#fee2e2', icon: Shield,        label: 'Admin' },
};

function UserAvatar({ nisnip, status }: { nisnip: string; status: string }) {
  const cfg = roleConfig[status] || roleConfig.Siswa;
  const Icon = cfg.icon;
  const initials = nisnip.slice(-2);
  return (
    <div style={{ background: cfg.bg, color: cfg.color }} className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-extrabold select-none flex-shrink-0">
      {initials}
    </div>
  );
}

export default function Pengguna() {
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [showPassword, setShowPassword] = useState<number | null>(null);
  const [openDelete, setOpenDelete]   = useState(false);
  const [selectedDelete, setSelectedDelete] = useState<any>(null);
  const [openTambah, setOpenTambah]   = useState(false);
  const [openEdit, setOpenEdit]       = useState(false);
  const [openReset, setOpenReset]     = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers]             = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPwd, setShowNewPwd]   = useState(false);

  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = getToken();
      if (!token) return;
      const res  = await fetch(`${API_BASE}/api/admin/siswa?page=1&limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success || json.data) {
        const rows = Array.isArray(json.data) ? json.data : [];
        setUsers(rows.map((u: any) => ({
          id:       u.user_id,
          nama:     u.nis_nip,
          nisnip:   u.nis_nip,
          password: '(tersimpan aman)',
          plainPwd: '',           // admin-set plaintext sementara
          status:   u.role === 'admin' ? 'Admin' : u.role === 'guru' ? 'Guru' : u.role === 'pegawai' ? 'Pegawai' : 'Siswa',
          is_active: u.is_active,
        })));
      }
    } catch (err) { console.error('Gagal fetch users:', err); }
    finally { setLoadingUsers(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const [formData, setFormData] = useState({ nama: "", nisnip: "", password: "", status: "siswa", kelas: "" });
  const [editData, setEditData] = useState({ id: 0, nisnip: "", status: "siswa" });

  const filteredUsers = useMemo(() => users.filter(u => {
    const cocokSearch = u.nisnip.includes(search);
    const cocokStatus = filterStatus === "Semua" || u.status === filterStatus;
    return cocokSearch && cocokStatus;
  }), [users, search, filterStatus]);

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const tambahUser = async () => {
    if (!formData.nisnip || !formData.password) { alert('NIS/NIP dan password wajib diisi'); return; }
    const token = getToken();
    try {
      const res    = await fetch(`${API_BASE}/api/admin/siswa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nis_nip: formData.nisnip, password: formData.password }),
      });
      const result = await res.json();
      if (result.success) {
        alert('Pengguna berhasil ditambahkan');
        setFormData({ nama: "", nisnip: "", password: "", status: "siswa", kelas: "" });
        setOpenTambah(false);
        fetchUsers();
      } else { alert(result.message || 'Gagal'); }
    } catch { alert('Gagal menambah pengguna'); }
  };

  const hapusUser = async (id: number) => {
    const token = getToken();
    try {
      const res    = await fetch(`${API_BASE}/api/admin/siswa/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) { alert('Dihapus'); fetchUsers(); }
      else { alert(result.message || 'Gagal'); }
    } catch { alert('Gagal'); }
    setOpenDelete(false);
  };

  const resetPassword = async () => {
    if (!newPassword) { alert('Password baru wajib diisi'); return; }
    const token = getToken();
    try {
      const res    = await fetch(`${API_BASE}/api/admin/siswa/${selectedUser.id}/reset-password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: newPassword }),
      });
      const result = await res.json();
      if (result.success) {
        // Simpan plaintext sementara agar bisa ditampilkan
        setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, plainPwd: newPassword } : u));
        alert(`Password berhasil direset menjadi: ${newPassword}`);
        setNewPassword(""); setOpenReset(false);
      } else { alert(result.message || 'Gagal'); }
    } catch { alert('Gagal reset password'); }
  };

  return (
    <>
      <div className="mx-auto flex h-[calc(100vh-120px)] w-full max-w-7xl flex-col lg:h-[calc(100vh-40px)]">
        {/* ── Header ── */}
        <div className="mb-5 rounded-[32px] bg-gradient-to-r from-[#651A27] to-[#8D303C] p-7 text-white shadow-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-wide">Control Panel</h1>
              <p className="mt-1 text-sm text-white/75">Kelola akun pengguna sistem Temuin</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="rounded-2xl bg-white/20 backdrop-blur px-4 py-2.5 text-sm font-semibold text-white outline-none border border-white/30"
              >
                <option className="text-black" value="Semua">Semua</option>
                <option className="text-black" value="Siswa">Siswa</option>
                <option className="text-black" value="Guru">Guru</option>
                <option className="text-black" value="Pegawai">Pegawai</option>
              </select>
              <button
                onClick={() => setOpenTambah(true)}
                className="flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-bold text-[#651A27] shadow-lg hover:scale-[1.04] duration-300"
              >
                <UserPlus size={17} /> Tambah Pengguna
              </button>
            </div>
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="flex h-full flex-col overflow-hidden rounded-[30px] border border-[#651A27]/10 bg-white shadow-2xl">
          {/* Toolbar */}
          <div className="border-b border-[#651A27]/10 px-6 py-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#651A27]/10 text-[#651A27]">
                  <Users size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">Kelola Pengguna</h2>
                  <p className="text-xs text-gray-500">{filteredUsers.length} pengguna ditemukan</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-[#651A27]/15 bg-[#FAF6F7] px-4 py-2.5">
                <Search size={17} className="text-[#651A27]" />
                <input type="text" placeholder="Cari NIS/NIP..." value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-400 sm:w-[220px]" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="min-h-0 flex-1 overflow-auto p-5">
            {loadingUsers ? (
              <div className="flex h-40 items-center justify-center text-sm text-gray-400">Memuat data...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center gap-2 text-gray-400">
                <Users size={36} strokeWidth={1.5} />
                <p className="text-sm">Belum ada pengguna terdaftar</p>
              </div>
            ) : (
              <div className="overflow-auto rounded-3xl border border-[#651A27]/10">
                <table className="w-full min-w-[860px]">
                  <thead className="bg-[#F7ECEE]">
                    <tr className="text-xs uppercase tracking-widest text-[#651A27]">
                      <th className="px-5 py-4 text-left">Pengguna</th>
                      <th className="px-5 py-4 text-left">NIS / NIP</th>
                      <th className="px-5 py-4 text-left">Password</th>
                      <th className="px-5 py-4 text-center">Role</th>
                      <th className="px-5 py-4 text-center">Status</th>
                      <th className="px-5 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => {
                      const cfg = roleConfig[user.status] || roleConfig.Siswa;
                      const Icon = cfg.icon;
                      const isRevealed = showPassword === user.id;
                      const displayPwd = user.plainPwd
                        ? (isRevealed ? user.plainPwd : '••••••••')
                        : (isRevealed ? '(gunakan Reset Password)' : '••••••••');
                      return (
                        <tr key={user.id} className="border-t border-[#651A27]/8 hover:bg-[#FFF7F8] transition-colors duration-200">
                          {/* Avatar + name */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <UserAvatar nisnip={user.nisnip} status={user.status} />
                              <div>
                                <p className="font-bold text-sm text-black">{user.nisnip}</p>
                                <p className="text-xs text-gray-400">{cfg.label}</p>
                              </div>
                            </div>
                          </td>
                          {/* NIS */}
                          <td className="px-5 py-4 text-sm font-mono text-gray-700">{user.nisnip}</td>
                          {/* Password */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-mono ${isRevealed ? 'text-[#651A27] font-semibold' : 'text-gray-500 tracking-widest'}`}>
                                {displayPwd}
                              </span>
                              <button
                                onClick={() => setShowPassword(isRevealed ? null : user.id)}
                                className={`rounded-xl p-1.5 duration-200 ${isRevealed ? 'bg-[#651A27] text-white' : 'bg-[#651A27]/10 text-[#651A27] hover:bg-[#651A27] hover:text-white'}`}
                                title={isRevealed ? "Sembunyikan" : "Lihat password"}
                              >
                                {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                            </div>
                          </td>
                          {/* Role badge */}
                          <td className="px-5 py-4 text-center">
                            <div className="flex justify-center">
                              <span style={{ background: cfg.bg, color: cfg.color }}
                                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold">
                                <Icon size={12} />
                                {user.status}
                              </span>
                            </div>
                          </td>
                          {/* Active status */}
                          <td className="px-5 py-4 text-center">
                            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${user.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                              {user.is_active ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </td>
                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex justify-center gap-2">
                              {/* Reset Password */}
                              <button
                                onClick={() => { setSelectedUser(user); setNewPassword(""); setShowNewPwd(false); setOpenReset(true); }}
                                className="group flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 border border-amber-200 hover:bg-amber-500 hover:text-white hover:border-amber-500 duration-200"
                                title="Reset Password"
                              >
                                <Key size={13} /> Reset
                              </button>
                              {/* Delete */}
                              <button
                                onClick={() => { setSelectedDelete(user); setOpenDelete(true); }}
                                className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 duration-200"
                                title="Hapus"
                              >
                                <Trash2 size={13} /> Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modal Tambah ─────────────────────────────────────────────────────── */}
      {openTambah && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-[28px] bg-white p-7 shadow-2xl">
            <button onClick={() => setOpenTambah(false)}
              className="absolute right-5 top-5 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-[#651A27] hover:text-white duration-200">
              <X size={16} />
            </button>
            {/* Header Modal */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#651A27]/10 text-[#651A27]">
                <UserPlus size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#651A27]">Tambah Pengguna</h2>
                <p className="text-xs text-gray-400">Daftarkan akun baru ke sistem</p>
              </div>
            </div>
            <div className="grid gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">NIS / NIP *</label>
                <input type="text" placeholder="Masukkan NIS atau NIP" value={formData.nisnip}
                  onChange={e => { const v = e.target.value.replace(/\D/g, ""); setFormData({ ...formData, nisnip: v }); }}
                  className="w-full rounded-2xl border border-[#651A27]/20 bg-[#FAF6F7] px-4 py-3 text-sm outline-none focus:border-[#651A27] duration-200" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Password *</label>
                <input type="text" placeholder="Buat password" value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-2xl border border-[#651A27]/20 bg-[#FAF6F7] px-4 py-3 text-sm outline-none focus:border-[#651A27] duration-200" />
              </div>
              <button onClick={tambahUser}
                className="mt-2 w-full rounded-2xl bg-gradient-to-r from-[#651A27] to-[#8D303C] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#651A27]/30 hover:scale-[1.02] duration-300">
                Tambahkan Pengguna
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Reset Password ─────────────────────────────────────────────── */}
      {openReset && selectedUser && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-[28px] bg-white p-7 shadow-2xl">
            <button onClick={() => setOpenReset(false)}
              className="absolute right-5 top-5 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-[#651A27] hover:text-white duration-200">
              <X size={16} />
            </button>
            {/* User preview */}
            <div className="mb-6 flex items-center gap-3">
              <UserAvatar nisnip={selectedUser.nisnip} status={selectedUser.status} />
              <div>
                <p className="font-bold text-sm text-black">{selectedUser.nisnip}</p>
                <p className="text-xs text-gray-400">{selectedUser.status}</p>
              </div>
            </div>
            <div className="mb-2 flex items-center gap-2 text-[#651A27]">
              <Key size={18} />
              <h2 className="text-lg font-bold">Reset Password</h2>
            </div>
            <p className="mb-5 text-xs text-gray-400">Password baru akan langsung aktif dan terlihat di sini.</p>
            <div className="relative mb-4">
              <input
                type={showNewPwd ? "text" : "password"}
                placeholder="Masukkan password baru"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full rounded-2xl border border-[#651A27]/20 bg-[#FAF6F7] px-4 py-3 pr-12 text-sm outline-none focus:border-[#651A27] duration-200"
              />
              <button onClick={() => setShowNewPwd(!showNewPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#651A27]">
                {showNewPwd ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {newPassword && (
              <div className="mb-4 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3">
                <p className="text-xs font-semibold text-amber-700">Password baru:</p>
                <p className="mt-0.5 text-sm font-bold text-amber-900 font-mono">{newPassword}</p>
              </div>
            )}
            <button onClick={resetPassword}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 hover:scale-[1.02] duration-300">
              Simpan Password Baru
            </button>
          </div>
        </div>
      )}

      {/* ── Modal Hapus ─────────────────────────────────────────────────────── */}
      {openDelete && selectedDelete && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[28px] bg-white p-7 shadow-2xl text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Trash2 size={28} />
            </div>
            <h2 className="text-lg font-bold text-black">Hapus Pengguna?</h2>
            <p className="mt-2 text-sm text-gray-500">
              Akun <span className="font-bold text-[#651A27]">{selectedDelete.nisnip}</span> akan dihapus permanen.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setOpenDelete(false)}
                className="w-full rounded-2xl bg-gray-100 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200 duration-200">
                Batal
              </button>
              <button onClick={() => hapusUser(selectedDelete.id)}
                className="w-full rounded-2xl bg-gradient-to-r from-red-500 to-red-600 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/30 hover:scale-[1.02] duration-300">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
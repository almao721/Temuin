"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Bell, Box, CircleAlert, House, User, Inbox, LogOut, CheckCheck } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Notif {
  id: number;
  laporan_id: number;
  pesan: string;
  is_read: number;
  created_at: string;
}

interface NavbarProps {
  isLoggedIn?: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notif[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (isLoggedIn !== undefined) {
      setIsLogin(isLoggedIn);
      return;
    }
    const token = localStorage.getItem("token");
    setIsLogin(!!token);
  }, [searchParams, isLoggedIn]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [isLoggedIn, isLogin]);

  // ── Fetch notifikasi ────────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/notifikasi`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data?.notifications || []);
        setUnreadCount(data.data?.unread || 0);
      }
    } catch (err) {
      console.error('Gagal fetch notifikasi:', err);
    }
  }, []);

  useEffect(() => {
    if (isLogin) {
      fetchNotifications();
      // Poll setiap 30 detik
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isLogin, fetchNotifications]);

  // Refresh saat buka dropdown
  useEffect(() => {
    if (isNotifOpen && isLogin) fetchNotifications();
  }, [isNotifOpen, isLogin, fetchNotifications]);

  const markAllRead = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/notifikasi/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
    } catch { /* ignore */ }
  };

  const markOneRead = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/notifikasi/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* ignore */ }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Baru saja';
    if (mins < 60) return `${mins} menit lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
  };

  const handleNavClick = (id: string) => {
    if (pathname !== "/UserPage") {
      router.push(`/UserPage#${id}`);
    } else {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLogin(false);
    setUser(null);
    router.push("/login");
  };

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <div className="hidden md:flex fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-full justify-center px-5">
        <div className="w-full max-w-6xl bg-[#46141A] backdrop-blur-md rounded-full px-7 py-3 flex items-center justify-between shadow-xl border border-white/5">
          <div className="flex items-center">
            <a href="/UserPage" className="group">
              <img src="/Assets/logo.png" alt="logo" className="w-[50px] object-contain transition-transform duration-300 group-hover:scale-110" />
            </a>
          </div>
          
          <div className="flex items-center gap-10 text-white text-[14px] font-medium uppercase tracking-wider">
            <button onClick={() => handleNavClick("beranda")} className="hover:text-[#F2B6BE] transition-all">Beranda</button>
            <button onClick={() => handleNavClick("form")} className="hover:text-[#F2B6BE] transition-all">Kehilangan/Menemukan</button>
            <button onClick={() => handleNavClick("about")} className="hover:text-[#F2B6BE] transition-all">Tentang Kami</button>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* NOTIFIKASI */}
            <div className="relative">
              <button
                onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                className="relative"
              >
                <Bell
                  className={`cursor-pointer transition-all duration-300 hover:scale-110 ${isNotifOpen ? 'text-[#F2B6BE]' : 'text-white'}`}
                  size={20}
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1 animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {isNotifOpen && (
                <div className="absolute right-0 md:right-[-20px] top-12 w-[360px] bg-[#1A0507] text-white rounded-[24px] p-5 shadow-2xl border border-white/10 z-[110]" style={{ animation: 'fadeSlideIn 0.2s ease-out' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold">Notifikasi</h4>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-[#F2B6BE] hover:text-white transition-colors">
                        <CheckCheck size={14} /> Tandai semua
                      </button>
                    )}
                  </div>

                  {!isLogin ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center opacity-40">
                      <Inbox size={32} className="mb-2" />
                      <p className="text-xs uppercase font-bold tracking-widest">Harap Login Terlebih Dahulu</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center opacity-40">
                      <Inbox size={32} className="mb-2" />
                      <p className="text-xs uppercase font-bold tracking-widest">Belum ada notifikasi</p>
                    </div>
                  ) : (
                    <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                      {notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => { if (!n.is_read) markOneRead(n.id); }}
                          className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                            n.is_read 
                              ? 'bg-white/5 opacity-60' 
                              : 'bg-[#8B3039]/20 hover:bg-[#8B3039]/30 border border-[#8B3039]/30'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{n.pesan}</p>
                          <p className="text-[10px] text-white/40 mt-1.5 font-medium">{timeAgo(n.created_at)}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-[1px] h-6 bg-white/20" />

            {/* PROFILE DESKTOP */}
            {isLogin ? (
              <div className="relative">
                <button
                  onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md bg-[#8B3039] hover:scale-105"
                >
                  <User className="text-white" size={20} fill="white" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-12 w-[240px] bg-[#1A0507] text-white rounded-[24px] p-5 shadow-2xl border border-white/10 animate-in fade-in slide-in-from-top-2 z-[110]">
                    <div className="flex flex-col">
                      {/* ✅ Tampilkan NIS dari localStorage */}
                      <h3 className="font-bold text-lg leading-tight">
                        {user ? `NIS: ${user.nis_nip}` : 'Pengguna'}
                      </h3>
                      <p className="text-white/40 text-xs font-bold mt-1 tracking-widest uppercase">
                        {user ? user.role : 'Belum login'}
                      </p>
                      
                      <div className="h-[1px] bg-white/10 w-full my-4" />
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-between w-full bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-3 rounded-xl transition-all duration-300 group"
                      >
                        <span className="text-xs font-bold uppercase tracking-wider">Keluar</span>
                        <LogOut size={16} className="opacity-70 group-hover:opacity-100" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a href="/login" className="bg-white text-[#46141A] px-6 py-2 rounded-full font-bold text-sm hover:bg-[#F2B6BE] transition-all shadow-md">
                Masuk
              </a>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE NAVBAR */}
      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] w-[92%]">
        <div className="bg-[#46141A] rounded-full px-6 py-4 flex items-center justify-between shadow-xl border border-white/5">
          <button onClick={() => handleNavClick("beranda")}><House className="text-white" size={22} /></button>
          <button onClick={() => handleNavClick("form")}><Box className="text-white" size={22} /></button>
          <button onClick={() => handleNavClick("about")}><CircleAlert className="text-white" size={22} /></button>
          {/* Bell mobile with badge */}
          <button onClick={() => { setIsNotifOpen(!isNotifOpen); }} className="relative">
            <Bell className="text-white" size={22} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white px-0.5">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <a href={isLogin ? "/UserPage/Profile" : "/login"} className="bg-white/10 p-2 rounded-full">
            <User className="text-white" size={22} />
          </a>
        </div>
        {/* Mobile notif dropdown */}
        {isNotifOpen && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[95%] bg-[#1A0507] text-white rounded-[24px] p-5 shadow-2xl border border-white/10 z-[110]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-bold">Notifikasi</h4>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-[#F2B6BE]">Tandai semua</button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center py-4 opacity-40">
                <Inbox size={28} className="mb-1" />
                <p className="text-[10px] uppercase font-bold">Belum ada notifikasi</p>
              </div>
            ) : (
              <div className="max-h-[240px] overflow-y-auto space-y-2">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => { if (!n.is_read) markOneRead(n.id); }}
                    className={`w-full text-left p-3 rounded-xl text-sm ${n.is_read ? 'bg-white/5 opacity-60' : 'bg-[#8B3039]/20 border border-[#8B3039]/30'}`}
                  >
                    <p>{n.pesan}</p>
                    <p className="text-[10px] text-white/40 mt-1">{timeAgo(n.created_at)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Bell, Box, CircleAlert, House, User, Inbox, LogOut } from "lucide-react";

interface NavbarProps {
  isLoggedIn?: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (isLoggedIn !== undefined) {
      setIsLogin(isLoggedIn);
      return;
    }
    // ✅ PERBAIKAN: cek "token" bukan "isLoggedIn"
    const token = localStorage.getItem("token");
    setIsLogin(!!token);
  }, [searchParams, isLoggedIn]);

  // Ambil data user dari localStorage
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
    // ✅ PERBAIKAN: hapus "token" dan "user" (bukan "isLoggedIn")
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
              <Bell
                onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                className={`cursor-pointer transition-all duration-300 hover:scale-110 ${isNotifOpen ? 'text-[#F2B6BE]' : 'text-white'}`}
                size={20}
              />
              {isNotifOpen && (
                <div className="absolute right-0 md:right-[-20px] top-12 w-[320px] bg-[#1A0507] text-white rounded-[24px] p-6 shadow-2xl border border-white/10 animate-in fade-in slide-in-from-top-2 z-[110]">
                  <h4 className="text-lg font-bold mb-4">Notifikasi</h4>
                  <div className="flex flex-col items-center justify-center py-6 text-center opacity-40">
                    <Inbox size={32} className="mb-2" />
                    <p className="text-xs uppercase font-bold tracking-widest">
                      {isLogin ? "Belum ada notifikasi" : "Harap Login Terlebih Dahulu"}
                    </p>
                  </div>
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
          <a href={isLogin ? "/UserPage/Profile" : "/login"} className="bg-white/10 p-2 rounded-full">
            <User className="text-white" size={22} />
          </a>
        </div>
      </div>
    </>
  );
}
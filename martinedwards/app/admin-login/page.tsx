"use client";

import { ArrowLeft, Eye, EyeOff, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiLogin } from "../lib/api";

export default function AdminLoginPage() {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [errors, setErrors] = useState({ userId: "", password: "" });
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async () => {
    const newErrors = { userId: "", password: "" };
    let isValid = true;
    if (!userId.trim()) { newErrors.userId = "NIP / NIS wajib diisi!"; isValid = false; }
    if (!password.trim()) { newErrors.password = "Kata sandi wajib diisi!"; isValid = false; }
    setErrors(newErrors);
    if (!isValid) return;

    // Bersihkan sesi admin lama
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    try {
      const res = await apiLogin(userId, password);
      const role = String(res.data?.user?.role || "").toLowerCase();

      if (role !== "admin" && role !== "pegawai") {
        alert("Akun ini bukan akun admin. Silakan login di halaman user.");
        return;
      }

      // Simpan dengan key TERPISAH untuk admin
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUser", JSON.stringify(res.data.user));

      setOpen(false);
      setIsExiting(true);
      setTimeout(() => router.push("/AdminPage"), 1200);
    } catch (error: any) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      alert(error.message || "Login gagal");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#561C24]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_#561C24_0%,_#8B3039_35%,_#C26067_65%,_#561C24_100%)] bg-[length:400%_400%] animate-[gradientMove_14s_linear_infinite]" />

      {/* Shape kiri */}
      <div className={`absolute z-0 rounded-[230px] bg-[linear-gradient(180deg,_#C26067_0%,_#8B3039_100%)] shadow-[0_0_35px_rgba(0,0,0,0.18)] rotate-[35deg] duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "w-[1100px] h-[1100px] -left-[820px] bottom-[-420px]" : "w-[1100px] h-[1100px] -left-[220px] bottom-[-120px]"}`} />
      {/* Shape kanan */}
      <div className={`absolute z-0 rounded-[220px] bg-[linear-gradient(180deg,_#561C24_0%,_#C26067_100%)] shadow-[0_0_40px_rgba(0,0,0,0.22)] rotate-[35deg] duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "w-[1200px] h-[1450px] -right-[1000px] top-[-650px]" : "w-[2200px] h-[1450px] -right-[950px] top-[-250px]"}`} />

      <div className={`relative z-10 flex items-center justify-center min-h-screen px-5 duration-[1000ms] ease-out ${open && !isExiting ? "opacity-100 scale-100" : "opacity-0 scale-90 blur-sm"}`}>
        <div className="relative w-full max-w-[430px]">
          <div className="relative bg-[#F5F5F5] rounded-[30px] px-10 py-14 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">

            {/* Back */}
            <button onClick={() => router.push("/")} className="hidden md:flex absolute top-2 -left-16 w-11 h-11 rounded-full bg-white/15 backdrop-blur-md items-center justify-center text-white hover:bg-white/30">
              <ArrowLeft size={22} />
            </button>

            {/* Admin badge */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 bg-[#8B3039]/10 rounded-full px-4 py-2">
                <Shield size={16} className="text-[#8B3039]" />
                <span className="text-xs font-bold text-[#8B3039] uppercase tracking-wider">Admin Portal</span>
              </div>
            </div>

            <h1 className="text-center text-5xl font-bold text-black">Masuk</h1>
            <p className="text-center text-gray-400 mt-4 text-sm">Login khusus untuk Admin & Pegawai</p>

            <div className="mt-8 flex flex-col gap-5 text-black">
              {/* NIP */}
              <div className="flex flex-col gap-1.5">
                <input type="text" inputMode="numeric" placeholder="NIP / NIS Admin"
                  value={userId}
                  onChange={e => { if (/^\d*$/.test(e.target.value)) { setUserId(e.target.value); setErrors(p => ({ ...p, userId: "" })); } }}
                  className={`w-full h-[60px] rounded-2xl border ${errors.userId ? "border-red-500" : "border-black/30"} px-5 outline-none focus:border-[#8B3039] duration-300`}
                />
                {errors.userId && <span className="text-red-500 text-[11px] ml-2 font-medium">{errors.userId}</span>}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="Kata sandi"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: "" })); }}
                    className={`w-full h-[60px] rounded-2xl border ${errors.password ? "border-red-500" : "border-black/30"} px-5 pr-14 outline-none focus:border-[#8B3039] duration-300`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B3039]">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <span className="text-red-500 text-[11px] ml-2 font-medium">{errors.password}</span>}
              </div>
            </div>

            <button onClick={handleLogin} className="w-full h-[60px] rounded-2xl bg-[#A94A58] text-white font-semibold mt-10 hover:bg-[#8B3039] active:scale-95 duration-300 shadow-lg">
              Masuk sebagai Admin
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              Bukan admin?{" "}
              <button onClick={() => router.push("/login")} className="text-[#8B3039] font-semibold hover:underline">
                Login sebagai Siswa
              </button>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

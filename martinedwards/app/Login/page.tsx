"use client";

import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [open, setOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // State Input
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  
  // State UI
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ userId: "", password: "" });

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Filter NIS/NIP: Cuma angka
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setUserId(value);
      setErrors((prev) => ({ ...prev, userId: "" }));
    }
  };

  const handleLogin = () => {
    const newErrors = { userId: "", password: "" };
    let isValid = true;

    if (!userId.trim()) {
      newErrors.userId = "NIS / NIP wajib diisi!";
      isValid = false;
    }
    if (!password.trim()) {
      newErrors.password = "Kata sandi wajib diisi!";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      // Simpan status login buat Navbar & Form di UserPage
      localStorage.setItem("isLoggedIn", "true");
      
      setOpen(false);
      setIsExiting(true);
      
      setTimeout(() => {
        router.push("/UserPage");
      }, 1200); 
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#561C24]">

      {/* BACKGROUND ANIMASI - GAK BERUBAH */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_#561C24_0%,_#8B3039_35%,_#C26067_65%,_#561C24_100%)] bg-[length:400%_400%] animate-[gradientMove_14s_linear_infinite]" />

      {/* SHAPE KIRI - TETAP SAMA */}
      <div
        className={`absolute z-0 rounded-[120px] md:rounded-[230px] bg-[linear-gradient(180deg,_#C26067_0%,_#8B3039_100%)] shadow-[0_0_35px_rgba(0,0,0,0.18)] rotate-[35deg] duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)]
        ${
          open
            ? "w-[700px] h-[700px] md:w-[1100px] md:h-[1100px] -left-[520px] md:-left-[820px] bottom-[-280px] md:bottom-[-420px]"
            : "w-[700px] h-[700px] md:w-[1100px] md:h-[1100px] -left-[120px] md:-left-[220px] bottom-[-80px] md:bottom-[-120px]"
        }`}
      />

      {/* SHAPE KANAN - TETAP SAMA */}
      <div
        className={`absolute z-0 rounded-[120px] md:rounded-[220px] bg-[linear-gradient(180deg,_#561C24_0%,_#C26067_100%)] shadow-[0_0_40px_rgba(0,0,0,0.22)] rotate-[35deg] duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)]
        ${
          open
            ? "w-[850px] h-[900px] md:w-[1200px] md:h-[1450px] -right-[620px] md:-right-[1000px] top-[-320px] md:top-[-650px]"
            : "w-[1400px] h-[900px] md:w-[2200px] md:h-[1450px] -right-[720px] md:-right-[950px] top-[-120px] md:top-[-250px]"
        }`}
      />

      {/* CARD CONTENT - DENGAN SCALE & BLUR */}
      <div
        className={`relative z-10 flex items-center justify-center min-h-screen px-5 duration-[1000ms] ease-out ${
          open && !isExiting ? "opacity-100 scale-100" : "opacity-0 scale-90 blur-sm"
        }`}
      >
        <div className="relative w-full max-w-[430px]">
          <div className="relative bg-[#F5F5F5] rounded-[28px] md:rounded-[30px] px-6 py-10 md:px-10 md:py-14 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
            
            <button onClick={() => router.push("/UserPage")} className="hidden md:flex absolute top-2 -left-16 w-11 h-11 rounded-full bg-white/15 backdrop-blur-md items-center justify-center text-white transition-all hover:bg-white/30"><ArrowLeft size={22} /></button>

            <h1 className="text-center text-3xl md:text-5xl font-bold text-black font-sans">Masuk</h1>
            <p className="text-center text-gray-400 mt-4 text-sm">Silahkan masuk untuk melanjutkan ke akun anda</p>

            <div className="mt-8 flex flex-col gap-5 text-black">
              {/* NIS / NIP + ALERT BAWAH */}
              <div className="flex flex-col gap-1.5">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="NIS / NIP"
                  value={userId}
                  onChange={handleIdChange}
                  className={`w-full h-[60px] rounded-2xl border ${errors.userId ? 'border-red-500' : 'border-black/30'} px-5 outline-none focus:border-[#8B3039] duration-300`}
                />
                {errors.userId && <span className="text-red-500 text-[11px] ml-2 font-medium">{errors.userId}</span>}
              </div>

              {/* PASSWORD + MATA + ALERT BAWAH */}
              <div className="flex flex-col gap-1.5">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Kata sandi"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    className={`w-full h-[60px] rounded-2xl border ${errors.password ? 'border-red-500' : 'border-black/30'} px-5 pr-14 outline-none focus:border-[#8B3039] duration-300`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B3039] transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <span className="text-red-500 text-[11px] ml-2 font-medium">{errors.password}</span>}
                <div className="flex justify-end px-1">
                  <button onClick={() => setForgotOpen(true)} className="mt-1 text-[12px] font-semibold text-[#8B3039] hover:underline">
                    Lupa kata sandi?
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full h-[60px] rounded-2xl bg-[#A94A58] text-white font-semibold mt-10 hover:bg-[#8B3039] active:scale-95 duration-300 shadow-lg shadow-maroon/20"
            >
              Masuk
            </button>
          </div>
        </div>
      </div>

      {/* POPUP MODAL - ISINYA SESUAI PESANMU */}
      {forgotOpen && (
        <div onClick={() => setForgotOpen(false)} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-5 animate-fadeIn">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[420px] rounded-[28px] bg-white px-7 py-10 shadow-2xl text-center animate-popup">
            <h2 className="text-xl font-bold text-black font-sans">Lupa Kata Sandi?</h2>
            <p className="mt-5 text-gray-600 leading-relaxed text-sm md:text-base">
              Silahkan ke ruangan admin atau hubungi kami melalui IG : <span className="font-semibold text-[#8B3039]">@Temuin.kita</span> untuk memproses password atau akun anda.
            </p>
            <p className="mt-8 text-xs text-gray-400">Tekan dimana pun untuk kembali</p>
          </div>
        </div>
      )}

      {/* STYLE ANIMASI - TETAP SAMA */}
      <style jsx>{`
        @keyframes gradientMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popup { from { opacity: 0; transform: scale(0.8) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease; }
        .animate-popup { animation: popup 0.35s ease; }
      `}</style>
    </div>
  );
}
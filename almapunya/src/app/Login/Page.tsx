"use client";

import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [open, setOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#561C24]">

      {/* BG */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_#561C24_0%,_#8B3039_35%,_#C26067_65%,_#561C24_100%)] bg-[length:400%_400%] animate-[gradientMove_14s_linear_infinite]" />

      {/* SHAPE KIRI */}
      <div
        className={`absolute z-0 rounded-[120px] md:rounded-[230px] bg-[linear-gradient(180deg,_#C26067_0%,_#8B3039_100%)] shadow-[0_0_35px_rgba(0,0,0,0.18)] rotate-[35deg] duration-[1700ms] ease-[cubic-bezier(0.22,1,0.36,1)]
        ${
          open
            ? "w-[700px] h-[700px] md:w-[1100px] md:h-[1100px] -left-[520px] md:-left-[820px] bottom-[-280px] md:bottom-[-420px]"
            : "w-[700px] h-[700px] md:w-[1100px] md:h-[1100px] -left-[120px] md:-left-[220px] bottom-[-80px] md:bottom-[-120px]"
        }`}
      />

      {/* SHAPE KANAN */}
      <div
        className={`absolute z-0 rounded-[120px] md:rounded-[220px] bg-[linear-gradient(180deg,_#561C24_0%,_#C26067_100%)] shadow-[0_0_40px_rgba(0,0,0,0.22)] rotate-[35deg] duration-[1700ms] ease-[cubic-bezier(0.22,1,0.36,1)]
        ${
          open
            ? "w-[850px] h-[900px] md:w-[1200px] md:h-[1450px] -right-[620px] md:-right-[1000px] top-[-320px] md:top-[-650px]"
            : "w-[1400px] h-[900px] md:w-[2200px] md:h-[1450px] -right-[720px] md:-right-[950px] top-[-120px] md:top-[-250px]"
        }`}
      />

      {/* BLUR */}
      <div className="absolute top-[-100px] left-[5%] w-[250px] h-[250px] md:w-[450px] md:h-[450px] rounded-full bg-[#C26067]/30 blur-3xl" />

      <div className="absolute bottom-[-120px] right-[5%] w-[250px] h-[250px] md:w-[450px] md:h-[450px] rounded-full bg-[#8B3039]/30 blur-3xl" />

      {/* CONTENT */}
      <div
        className={`relative z-10 flex items-center justify-center min-h-screen px-5 duration-[1200ms] ease-out ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <div className="relative w-full max-w-[430px]">

          {/* CARD */}
          <div className="relative bg-[#F5F5F5] rounded-[28px] md:rounded-[30px] px-6 py-10 md:px-10 md:py-14 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">

            {/* ARROW DESKTOP */}
            <button
              onClick={() => router.push("../UserPage")}
              className="hidden md:flex absolute top-2 -left-16 w-11 h-11 rounded-full bg-white/15 backdrop-blur-md items-center justify-center text-white hover:scale-110 duration-300"
            >
              <ArrowLeft size={22} />
            </button>

            {/* ARROW MOBILE */}
            <button
              onClick={() => router.push("../UserPage")}
              className="md:hidden absolute top-6 left-6 w-9 h-9 rounded-full bg-[#EFEFEF] flex items-center justify-center text-black"
            >
              <ArrowLeft size={18} />
            </button>

            <h1 className="text-center text-3xl md:text-5xl font-bold text-black">
              Masuk
            </h1>

            <p className="text-center text-gray-400 mt-4 text-sm md:text-base">
              Silahkan masuk untuk melanjutkan ke akun anda
            </p>

            {/* INPUT */}
            <div className="mt-8 md:mt-10 flex flex-col gap-4 md:gap-5">

              <input
                type="text"
                placeholder="NIS / NIP"
                className="w-full h-[56px] md:h-[65px] rounded-2xl border border-black/30 px-5 outline-none bg-transparent text-black placeholder:text-gray-400 focus:border-[#8B3039] duration-300"
              />

              <div>
                <input
                  type="password"
                  placeholder="Kata sandi"
                  className="w-full h-[56px] md:h-[65px] rounded-2xl border border-black/30 px-5 outline-none bg-transparent text-black placeholder:text-gray-400 focus:border-[#8B3039] duration-300"
                />

                {/* LUPA PASSWORD */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setForgotOpen(true)}
                    className="mt-3 text-sm text-[#8B3039] hover:underline"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
              </div>
            </div>

              <button
                onClick={() => router.push("../UserPage/TampilanAwalUser")}
                className="w-full h-[56px] md:h-[62px] rounded-2xl bg-[#A94A58] text-white font-semibold text-base md:text-lg mt-8 md:mt-10 hover:scale-[1.02] hover:bg-[#8B3039] duration-300"
              >
                Masuk
              </button>
          </div>
        </div>
      </div>

      {/* MODAL LUPA PASSWORD */}
      {forgotOpen && (
        <div
          onClick={() => setForgotOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-5 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[420px] rounded-[28px] bg-white px-7 py-10 shadow-2xl text-center animate-popup"
          >

            <p className="mt-5 text-gray-600 leading-relaxed text-sm md:text-base">
              Silahkan ke ruangan admin atau hubungi kami melalui IG :
              <span className="font-semibold text-[#8B3039]">
                {" "}
                @Temuin.kita
              </span>{" "}
              untuk memproses password atau akun anda.
            </p>

            <p className="mt-8 text-xs text-gray-400">
              Tekan dimana pun untuk kembali login di akun anda
            </p>
          </div>
        </div>
      )}

      {/* ANIMATION */}
      <style>{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          25% {
            background-position: 50% 100%;
          }
          50% {
            background-position: 100% 50%;
          }
          75% {
            background-position: 50% 0%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes popup {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }

        .animate-popup {
          animation: popup 0.35s ease;
        }
      `}</style>
    </div>
  );
}
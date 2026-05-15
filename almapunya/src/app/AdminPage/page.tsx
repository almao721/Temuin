"use client";

export default function AnimatedBgPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* BACKGROUND ANIMASI */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>

        <div className="wave wave-1"></div>
        <div className="wave wave-2"></div>
      </div>

      {/* ISI KONTEN DI DALAM BACKGROUND */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-4xl rounded-3xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-2xl p-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#8D303C] mb-4">
            Selamat Datang
          </h1>

          <p className="text-gray-600 text-base md:text-lg mb-8">
            Ini contoh isi konten di atas background animasi yang bergerak.
          </p>

          <button className="px-8 py-3 rounded-full bg-[#8D303C] text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl duration-300">
            Mulai Sekarang
          </button>
        </div>
      </div>

      <style jsx>{`
        .blob {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 9999px;
          filter: blur(70px);
          opacity: 0.55;
          animation: float 12s ease-in-out infinite alternate;
        }

        .blob-1 {
          background: #8d303c;
          top: -120px;
          left: -100px;
          animation-duration: 13s;
        }

        .blob-2 {
          background: rgba(141, 48, 60, 0.55);
          bottom: -140px;
          right: -120px;
          animation-duration: 15s;
        }

        .blob-3 {
          background: rgba(141, 48, 60, 0.28);
          top: 35%;
          left: 55%;
          animation-duration: 18s;
        }

        .blob-4 {
          background: rgba(255, 255, 255, 0.8);
          top: 20%;
          right: 20%;
          animation-duration: 16s;
        }

        .wave {
          position: absolute;
          width: 120%;
          height: 220px;
          left: -10%;
          border-radius: 50%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(141, 48, 60, 0.25),
            rgba(255, 255, 255, 0.7),
            rgba(141, 48, 60, 0.18),
            transparent
          );
          filter: blur(18px);
          animation: waveMove 9s ease-in-out infinite alternate;
        }

        .wave-1 {
          top: 18%;
          transform: rotate(-8deg);
        }

        .wave-2 {
          bottom: 16%;
          transform: rotate(8deg);
          animation-duration: 11s;
        }

        @keyframes float {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(80px, -60px) scale(1.15);
          }
          100% {
            transform: translate(-60px, 80px) scale(0.95);
          }
        }

        @keyframes waveMove {
          0% {
            transform: translateX(-80px) rotate(-8deg);
          }
          100% {
            transform: translateX(80px) rotate(8deg);
          }
        }
      `}</style>
    </main>
  );
}
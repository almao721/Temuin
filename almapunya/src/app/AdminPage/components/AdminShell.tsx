"use client";

import Navbar from "../Navbar/page";

type AdminShellProps = {
  children: React.ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-[#8D303C]/50 blur-[90px] animate-blob1"></div>

        <div className="absolute top-40 -right-32 h-[480px] w-[480px] rounded-full bg-[#8D303C]/40 blur-[100px] animate-blob2"></div>

        <div className="absolute bottom-[-120px] left-1/3 h-[500px] w-[500px] rounded-full bg-[#8D303C]/30 blur-[110px] animate-blob3"></div>

        <div className="absolute top-1/2 left-[-20%] h-40 w-[140%] rotate-[-8deg] bg-gradient-to-r from-transparent via-[#8D303C]/35 to-transparent blur-2xl animate-wave"></div>

        <div className="absolute bottom-1/4 left-[-20%] h-40 w-[140%] rotate-[8deg] bg-gradient-to-r from-transparent via-[#8D303C]/30 to-transparent blur-2xl animate-wave2"></div>
      </div>

      <div className="relative z-20">
        <Navbar />
      </div>

      <section className="relative z-10 min-h-screen px-4 py-5 pt-20 lg:pl-[286px] lg:pr-8 lg:pt-5">
        {children}
      </section>

      <style>{`
        @keyframes blob1 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(150px, 100px) scale(1.25);
          }
          100% {
            transform: translate(50px, 180px) scale(0.9);
          }
        }

        @keyframes blob2 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-170px, 110px) scale(1.2);
          }
          100% {
            transform: translate(-90px, -100px) scale(1);
          }
        }

        @keyframes blob3 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-130px, -140px) scale(1.3);
          }
          100% {
            transform: translate(140px, -80px) scale(0.95);
          }
        }

        @keyframes wave {
          0% {
            transform: translateX(-180px) rotate(-8deg);
          }
          100% {
            transform: translateX(180px) rotate(-8deg);
          }
        }

        @keyframes wave2 {
          0% {
            transform: translateX(180px) rotate(8deg);
          }
          100% {
            transform: translateX(-180px) rotate(8deg);
          }
        }

        .animate-blob1 {
          animation: blob1 4s ease-in-out infinite alternate;
        }

        .animate-blob2 {
          animation: blob2 4.5s ease-in-out infinite alternate;
        }

        .animate-blob3 {
          animation: blob3 5s ease-in-out infinite alternate;
        }

        .animate-wave {
          animation: wave 3s ease-in-out infinite alternate;
        }

        .animate-wave2 {
          animation: wave2 3.5s ease-in-out infinite alternate;
        }
      `}</style>
    </main>
  );
}
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Navbar from "../Navbar/page";
import Beranda from "./Beranda/page";
import Form from "./FormPage/page";
import TentangKami from "./AboutUs/page";

export default function Page() {

  const searchParams = useSearchParams();

  const success = searchParams.get("success");

  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_bottom,_#561C24_0%,_#8B3039_20%,_#B84E5C_40%,_#7A2430_75%,_#561C24_100%)] bg-[length:100%_200%] animate-[bgMove_18s_ease-in-out_infinite]" />

      <div className="absolute top-[-250px] left-[-180px] w-[700px] h-[700px] rounded-full bg-[#C26067]/30 blur-[180px] animate-[float1_15s_ease-in-out_infinite]" />

      <div className="absolute top-[10%] right-[-250px] w-[750px] h-[750px] rounded-full bg-[#8B3039]/30 blur-[180px] animate-[float2_18s_ease-in-out_infinite]" />

      <div className="absolute top-[34%] left-1/2 -translate-x-1/2 w-[1200px] h-[750px] rounded-full bg-[#FAE4DC] blur-[180px] z-0" />

      <div className="absolute bottom-[-250px] left-[10%] w-[750px] h-[750px] rounded-full bg-[#B84E5C]/25 blur-[180px] animate-[float1_18s_ease-in-out_infinite]" />

      <img
        src="/ror.png"
        alt="decor"
        className="absolute top-[-40px] left-[-40px] w-[220px] md:w-[300px] opacity-40 z-0 animate-[float1_12s_ease-in-out_infinite]"
      />

      <img
        src="/ror.png"
        alt="decor"
        className="absolute bottom-[20px] right-[-50px] w-[220px] md:w-[300px] opacity-40 rotate-180 z-0 animate-[float2_14s_ease-in-out_infinite]"
      />

      <img
        src="/ror.png"
        alt="decor"
        className="absolute bottom-[-60px] left-[-60px] w-[180px] md:w-[250px] opacity-30 z-0 animate-[float1_16s_ease-in-out_infinite]"
      />

      <div className="relative z-10">

        {success && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[999] animate-[slideDown_0.5s_ease]">

            <div className="bg-white border border-green-200 shadow-xl rounded-2xl px-5 py-4 flex items-center gap-3 min-w-[300px]">

              <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="text-green-600" size={24} />
              </div>

              <div>
                <h1 className="text-sm font-semibold text-black">
                  Laporan sukses dikirim
                </h1>

                <p className="text-xs text-black/60 mt-1">
                  Laporan Anda berhasil masuk ke admin
                </p>
              </div>
            </div>
          </div>
        )}

        <Navbar />
        <Beranda />
        <Form />
        <TentangKami />
      </div>

      <style>{`
        @keyframes bgMove {
          0% {
            background-position: 0% 0%;
          }

          50% {
            background-position: 0% 100%;
          }

          100% {
            background-position: 0% 0%;
          }
        }

        @keyframes float1 {
          0% {
            transform: translateY(0px) translateX(0px);
          }

          50% {
            transform: translateY(-20px) translateX(10px);
          }

          100% {
            transform: translateY(0px) translateX(0px);
          }
        }

        @keyframes float2 {
          0% {
            transform: translateY(0px) translateX(0px);
          }

          50% {
            transform: translateY(20px) translateX(-10px);
          }

          100% {
            transform: translateY(0px) translateX(0px);
          }
        }

        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translate(-50%, -40px);
          }

          100% {
            opacity: 1;
            transform: translate(-50%, 0px);
          }
        }
      `}</style>
    </div>
  );
}
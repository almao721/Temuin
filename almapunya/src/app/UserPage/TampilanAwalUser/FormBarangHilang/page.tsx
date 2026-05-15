"use client";

import Navbar from '../../Navbar/page';
import { ClipboardList, ShieldCheck, SearchCheck } from "lucide-react";

export default function FormBarangHilang() {
  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden text-black">
        {/* Background animasi */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,_#ffffff,_#FAE4DC,_#ffffff,_#FAE4DC)] bg-[length:400%_400%] animate-[gradientMove_14s_ease_infinite]" />
        <div className="absolute top-[-120px] left-[-80px] w-[320px] h-[320px] bg-[#FAE4DC] rounded-full blur-3xl opacity-40 animate-[floatGlow1_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-120px] right-[-80px] w-[320px] h-[320px] bg-white rounded-full blur-3xl opacity-50 animate-[floatGlow2_10s_ease-in-out_infinite]" />

        <img src="/ror.png" alt="decor" className="absolute top-0 right-0 w-[240px] opacity-35 z-0 animate-[float1_8s_ease-in-out_infinite]" />
        <img src="/ror.png" alt="decor" className="absolute bottom-0 left-0 w-[240px] opacity-25 rotate-180 z-0 animate-[float2_8s_ease-in-out_infinite]" />

        <div className="relative z-10 px-4 md:px-10 pb-20">
          <div className="pt-32 text-center">
            <h1 className="text-[32px] md:text-[52px] font-semibold tracking-[-1px] text-black drop-shadow-[0_3px_0_rgba(0,0,0,0.18)]">
              Lengkapi data berikut
            </h1>
            <p className="text-black/60 mt-4 text-sm md:text-base">
              agar kami dapat membantu menemukan barang Anda dengan lebih cepat.
            </p>
          </div>

          {/* Kotak Langkah 1-3, selalu horizontal */}
          <div className="mt-14 flex flex-nowrap justify-center gap-5 overflow-x-auto w-full">
            {[{ icon: ClipboardList, label: "Isi Data Barang" },
              { icon: ShieldCheck, label: "Verifikasi Admin" },
              { icon: SearchCheck, label: "Hasil Pencocokan" }
            ].map((step, index) => (
              <div key={index} className="bg-[#EEEEEE]/90 backdrop-blur-sm border border-gray-300 rounded-[20px] p-5 min-w-[250px] text-center shadow-[4px_4px_0_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-transform duration-300 flex-shrink-0">
                <div className="flex justify-center">
                  <step.icon className="text-black" size={34} />
                </div>

                <div className="mt-4 inline-block bg-[#4368E8] px-4 py-1.5 rounded-lg shadow-[4px_4px_0_rgba(0,0,0,0.10)]">
                  <p className="text-white text-xs font-semibold tracking-wide">
                    LANGKAH {index + 1}
                  </p>
                </div>

                <h1 className="mt-4 font-bold text-sm md:text-base">{step.label}</h1>
              </div>
            ))}
          </div>

          {/* Form pertanyaan tetap sama */}
          <div className="max-w-3xl mx-auto mt-14 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-[28px] shadow-[4px_4px_0_rgba(0,0,0,0.10)] p-6 md:p-10 text-black">
            <div className="space-y-6">
              <div>
                <h1 className="font-semibold mb-4 text-sm md:text-base">
                  1. Barang apa yang kamu hilangkan?
                </h1>
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                  {["Dompet","Gelang","Cincin","Kalung"].map((item,i)=>(
                    <label key={i} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="barang" className="accent-[#4368E8] w-4 h-4"/>
                      {item}
                    </label>
                  ))}
                </div>
                <input type="text" placeholder="Lainnya" className="w-full border border-gray-300 mt-4 rounded-xl px-4 py-3 outline-none focus:border-[#4368E8] duration-300"/>
              </div>

              {[
                "Warna pada barang anda ?",
                "Berikan deskripsi barang anda secara rinci!",
                "Brand / Merk dari barang anda",
                "Waktu terakhir terlihat",
                "Lokasi terakhir terlihat"
              ].map((item,index)=>(
                <div key={index}>
                  <h1 className="font-semibold mb-3 text-sm md:text-base">
                    {index+2}. {item}
                  </h1>
                  <input type="text" placeholder="Masukkan jawaban anda" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#4368E8] duration-300"/>
                </div>
              ))}

              <button className="w-full bg-[#4368E8] text-white py-3.5 rounded-xl font-semibold hover:scale-[1.01] duration-300 shadow-[4px_4px_0_rgba(0,0,0,0.10)]">
                Kirim Jawaban Anda
              </button>
            </div>
          </div>

        </div>
      </div>

      <style global jsx>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatGlow1 {
          0% { transform: translate(0px,0px); }
          50% { transform: translate(40px,20px); }
          100% { transform: translate(0px,0px); }
        }
        @keyframes floatGlow2 {
          0% { transform: translate(0px,0px); }
          50% { transform: translate(-40px,-20px); }
          100% { transform: translate(0px,0px); }
        }
        @keyframes float1 {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float2 {
          0% { transform: translateY(0px) rotate(180deg); }
          50% { transform: translateY(12px) rotate(180deg); }
          100% { transform: translateY(0px) rotate(180deg); }
        }
      `}</style>
    </>
  );
}
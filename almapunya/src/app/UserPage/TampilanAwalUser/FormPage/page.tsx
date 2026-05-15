"use client";

import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FormPage() {
  const router = useRouter();

  const handleFound = () => {};

  const handleLost = () => {
    router.push("/TampilanAwalUser/Kategori");
  };

  return (
    <div
      id="form"
      className="relative overflow-hidden px-6 md:px-16 py-24 md:py-32"
    >
      <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-[46%] md:top-1/2 md:-translate-y-1/2 z-20">

        <div className="bg-[#A73446] p-4 md:p-5 rounded-[20px] shadow-[4px_4px_0_rgba(0,0,0,0.12)] border border-white/20">

          <FileText className="text-white" size={30} />
        </div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row justify-center items-center gap-20 lg:gap-10">

        <div className="flex flex-col gap-5 w-full max-w-[430px] order-1">

          <div className="relative bg-[#651A27] border border-[#7E2A39] rounded-[26px] p-7 md:p-9 shadow-[4px_4px_0_rgba(0,0,0,0.12)] hover:-translate-y-1 duration-300">

            <div className="lg:hidden absolute left-1/2 -translate-x-1/2 -top-12">
              <div className="bg-[#A73446] p-4 rounded-[18px] shadow-[4px_4px_0_rgba(0,0,0,0.12)]">
                <FileText className="text-white" size={28} />
              </div>
            </div>

            <h1 className="text-white text-[28px] md:text-[38px] font-bold text-center leading-tight mt-6 lg:mt-0">
              Lapor Barang Ditemukan
            </h1>

            <p className="text-white/85 text-center mt-5 text-sm md:text-base leading-relaxed">
              Segera laporkan barang Anda yang di
              temukan untuk membantu proses
              pencarian menjadi lebih cepat.
            </p>

            <button
              onClick={handleFound}
              className="w-full bg-white text-[#651A27] py-3.5 rounded-xl font-semibold mt-8 hover:scale-[1.02] duration-300 shadow-[4px_4px_0_rgba(0,0,0,0.10)]"
            >
              Lapor Barang Ditemukan
            </button>
          </div>

          <div className="hidden lg:block bg-[#FFF8F5] border border-gray-300 rounded-[20px] p-5 shadow-[4px_4px_0_rgba(0,0,0,0.08)]">

            <h1 className="font-bold text-sm md:text-base mb-3 text-[#651A27]">
              Kami tidak menerima jenis laporan:
            </h1>

            <ol className="list-decimal ml-5 text-xs md:text-sm text-[#651A27] space-y-1.5 leading-relaxed">
              <li>Senjata tajam</li>
              <li>Uang</li>
              <li>Produk tembakau dan rokok elektronik</li>
              <li>Barang berbahaya atau ilegal lainnya</li>
              <li>Barang tanpa bukti kepemilikan</li>
            </ol>
          </div>
        </div>

        <div className="relative flex flex-col items-center w-full max-w-[430px] order-2">

          <img
            src="/Assets/wave birdie.png"
            alt="bird"
            className="w-36 md:w-80 absolute top-[-70px] md:-top-32 z-0 opacity-90 md:animate-[floatBird_4s_ease-in-out_infinite]"
          />

          <div className="relative z-10 bg-[#FFF8F5] border border-gray-300 rounded-[26px] p-7 md:p-9 shadow-[4px_4px_0_rgba(0,0,0,0.10)] w-full pt-20 md:pt-24 hover:-translate-y-1 duration-300">

            <h1 className="text-[#651A27] text-[28px] md:text-[38px] font-bold text-center leading-tight">
              Lapor Barang Hilang
            </h1>

            <p className="text-center mt-5 text-sm md:text-base leading-relaxed text-black/70">
              lengkapi form kami tentang deskripsi
              barang anda lalu kami akan
              memprosesnya dengan segera.
            </p>

            <button
              onClick={handleLost}
              className="w-full bg-[#651A27] text-white py-3.5 rounded-xl font-semibold mt-8 hover:scale-[1.02] duration-300 shadow-[4px_4px_0_rgba(0,0,0,0.10)]"
            >
              Lapor Barang Kehilangan
            </button>
          </div>

          <div className="lg:hidden mt-8 bg-[#FFF8F5] border border-gray-300 rounded-[20px] p-5 shadow-[4px_4px_0_rgba(0,0,0,0.08)] w-full">

            <h1 className="font-bold text-sm md:text-base mb-3 text-[#651A27]">
              Kami tidak menerima jenis laporan barang:
            </h1>

            <ol className="list-decimal ml-5 text-xs md:text-sm text-[#651A27] leading-relaxed">
              <li>Senjata tajam</li>
              <li>Uang</li>
              <li>Produk tembakau dan rokok elektronik</li>
              <li>Barang berbahaya atau ilegal lainnya</li>
              <li>Barang yang tidak dapat dibuktikan kepemilikannya</li>
            </ol>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatBird {
          0% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-12px);
          }

          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
}
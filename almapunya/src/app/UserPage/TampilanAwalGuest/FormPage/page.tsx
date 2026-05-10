"use client";

import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FormPage() {
  const router = useRouter();

  const isLogin = false;

  const handleRedirect = () => {
    if (!isLogin) {
      router.push("/login");
    } else {
      router.push("/TampilanAwalUser");
    }
  };

  return (
    <div
      id="form"
      className="relative overflow-hidden px-5 md:px-16 py-16 md:py-24"
    >

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center">

        {/* FORM AREA */}
        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">

          {/* LEFT */}
          <div className="flex flex-col gap-4">

            {/* CARD KIRI */}
            <div className="bg-[#651A27] rounded-[24px] p-6 md:p-8 w-full max-w-[340px] md:max-w-[420px] shadow-[0_10px_25px_rgba(0,0,0,0.12)]">

              <h1 className="text-white text-2xl md:text-4xl font-bold text-center leading-tight">
                Lapor Barang Ditemukan
              </h1>

              <p className="text-white/90 text-center mt-6 text-sm md:text-lg leading-relaxed">
                Segera laporkan barang Anda yang ditemukan untuk membantu proses pencarian menjadi lebih cepat.
              </p>

              <button
                onClick={handleRedirect}
                className="w-full bg-white text-[#651A27] py-3 rounded-xl font-semibold mt-8 hover:scale-[1.02] duration-300 text-sm md:text-base"
              >
                Lapor Barang Ditemukan
              </button>
            </div>

            {/* LIST */}
            <div className="bg-[#F5F5F5] rounded-[18px] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)] max-w-[340px] md:max-w-[420px]">

              <h1 className="font-bold text-sm md:text-base mb-3 text-[#651A27]">
                Kami tidak menerima jenis laporan barang:
              </h1>

              <ol className="list-decimal ml-5 text-[12px] md:text-sm text-[#651A27] space-y-1">

                <li>Senjata tajam</li>

                <li>Uang</li>

                <li>Produk tembakau dan rokok elektronik</li>

                <li>Barang berbahaya atau ilegal lainnya</li>

                <li>Barang yang tidak dapat dibuktikan kepemilikannya</li>
              </ol>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative flex flex-col items-center">

            {/* TEXT */}
            <p className="text-center text-black/90 text-sm md:text-xl leading-relaxed max-w-[340px] md:max-w-[480px] mb-6 font-medium">

              Silakan masuk/login terlebih dahulu, ikuti step kami berikan dan isi laporan barang, agar kami dapat membantu mencarikannya.
            </p>

            {/* ICON */}
            <div className="absolute top-[75px] md:top-[90px] left-1/2 lg:left-[-35px] -translate-x-1/2 lg:translate-x-0 z-20">

              <div className="bg-[#A73446] p-4 rounded-[18px] shadow-[0_8px_20px_rgba(101,26,39,0.18)]">

                <FileText className="text-white" size={30} />
              </div>
            </div>

            {/* CARD */}
            <div className="bg-[#F5F5F5] rounded-[24px] p-6 md:p-8 w-full max-w-[340px] md:max-w-[420px] shadow-[0_10px_25px_rgba(0,0,0,0.10)] mt-8">

              <h1 className="text-[#111111] text-2xl md:text-4xl font-bold text-center leading-tight">
                Lapor Barang Kehilangan
              </h1>

              <p className="text-center mt-6 text-sm md:text-lg leading-relaxed text-black/75">
                Lengkapi form kami tentang barang anda lalu kami akan memprosesnya dengan segera.
              </p>

              <button
                onClick={handleRedirect}
                className="w-full bg-[#651A27] text-white py-3 rounded-xl font-semibold mt-8 hover:scale-[1.02] duration-300 text-sm md:text-base"
              >
                Lapor Barang Kehilangan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
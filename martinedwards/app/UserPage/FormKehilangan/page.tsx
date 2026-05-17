"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FormKehilangan from "@/app/UserPage/components/FormKehilangan";
import Navbar from "@/app/UserPage/Navbar/Navbar";

function FormKehilanganContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "lainnya";

  // Kapitalisasi huruf pertama agar cocok dengan formConfig
  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#46141A] via-[#561C24] to-[#46141A]">
      <Navbar />

      {/* Spacer untuk navbar fixed */}
      <div className="h-24" />

      {/* HEADER */}
      <div className="text-center px-5 py-8">
        <p className="text-white/60 text-sm font-bold uppercase tracking-widest mb-2">
          Formulir Laporan
        </p>
        <h1 className="text-white text-3xl md:text-4xl font-black">
          Kehilangan Barang
        </h1>
        <p className="text-white/70 mt-3 text-sm md:text-base max-w-md mx-auto leading-relaxed">
          Isi formulir di bawah ini dengan lengkap agar kami dapat membantu
          menemukan barang kamu.
        </p>

        {/* Badge kategori */}
        <div className="inline-block mt-4 bg-white/10 border border-white/20 text-white px-5 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
          Kategori: {formattedCategory}
        </div>
      </div>

      {/* FORM */}
      <div className="px-4 pb-24 md:pb-16">
        <FormKehilangan initialKategori={formattedCategory} />
      </div>
    </div>
  );
}

export default function FormKehilanganPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-[#46141A] to-[#561C24] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <FormKehilanganContent />
    </Suspense>
  );
}
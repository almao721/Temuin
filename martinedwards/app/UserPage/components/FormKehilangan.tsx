"use client";

import { Send, ChevronDown, AlertCircle } from "lucide-react";
import { useState } from "react";
import PopupThxGiving from "../components/PopupThxGiving"; 

const lokasiList = [
  "Gedung A Lantai 1", "Gedung A Lantai 2", "Gedung A Lantai 3",
  "Gedung B Lantai 1", "Gedung B Lantai 2", "Gedung B Lantai 3",
  "Gedung C", "Gedung D Lantai 1", "Gedung D Lantai 2", "Gedung D Lantai 3",
  "Gedung E", "Kantin", "Lapangan Basket", "Lobby", "Parkiran",
  "Musholla Lantai 1", "Musholla Lantai 2", "Gerbang Depan SMK Telkom Makassar",
  "Mess", "Hati Martin Edwards"
];

const formConfig: Record<string, any> = {
  aksesoris: { 
    questions: [
      { id: "nama", label: "Jenis Aksesoris?", type: "text", placeholder: "Contoh: Jam Tangan, Gelang" },
      { id: "warna", label: "Warna Dominan?", type: "text", placeholder: "Contoh: Perak, Hitam" },
      { id: "brand", label: "Merek (Jika ada)?", type: "text", placeholder: "Contoh: Casio, Fossil" },
      { id: "ciri", label: "Ciri Fisik Menonjol?", type: "text", placeholder: "Contoh: Tali kulit cokelat" },
      { id: "lokasi", label: "Lokasi Terakhir Terlihat?", type: "select", options: lokasiList },
      { id: "waktu", label: "Perkiraan Jam Hilang?", type: "text", placeholder: "Contoh: Sekitar jam 10 pagi" }
    ] 
  },
  pribadi: { 
    questions: [
      { id: "nama", label: "Nama Barang?", type: "text", placeholder: "Contoh: Dompet, Tas" },
      { id: "warna", label: "Warna & Bahan?", type: "text", placeholder: "Contoh: Biru dongker, kain" },
      { id: "isi", label: "Isi di dalamnya?", type: "text", placeholder: "Contoh: Ada KTP, kunci rumah" },
      { id: "lokasi", label: "Lokasi Terakhir Terlihat?", type: "select", options: lokasiList },
      { id: "kontak", label: "Nomor WhatsApp?", type: "text", placeholder: "0812..." },
      { id: "pemilik", label: "Nama Pemilik (Jika ada)?", type: "text", placeholder: "Contoh: Nama di kartu" }
    ] 
  },
  kunci: { 
    questions: [
      { id: "jenis", label: "Kunci Untuk Apa?", type: "text", placeholder: "Contoh: Kunci Motor Beat" },
      { id: "jumlah", label: "Jumlah anak kunci?", type: "text", placeholder: "Contoh: 2 anak kunci" },
      { id: "gantungan", label: "Deskripsi Gantungan?", type: "text", placeholder: "Contoh: Boneka kecil" },
      { id: "remote", label: "Apakah ada remote/keyless?", type: "boolean" }, 
      { id: "lokasi", label: "Lokasi Terakhir Terlihat?", type: "select", options: lokasiList },
      { id: "tanda", label: "Tanda Unik Lainnya?", type: "text", placeholder: "Contoh: Ada stiker bengkel" }
    ] 
  },
  elektronik: { 
    questions: [
      { id: "nama", label: "Nama Perangkat?", type: "text", placeholder: "Contoh: HP, TWS" },
      { id: "merek", label: "Merek & Tipe?", type: "text", placeholder: "Contoh: iPhone 11" },
      { id: "warna", label: "Warna Perangkat?", type: "text", placeholder: "Contoh: Hitam" },
      { id: "status", label: "Apakah masih menyala?", type: "boolean" }, 
      { id: "lokasi", label: "Lokasi Terakhir Terlihat?", type: "select", options: lokasiList },
      { id: "wallpaper", label: "Ciri unik (Wallpaper/Stiker)?", type: "text", placeholder: "Contoh: Foto kucing" }
    ] 
  },
  pakaian: { 
    questions: [
      { id: "jenis", label: "Jenis Pakaian?", type: "text", placeholder: "Contoh: Jaket Hoodie" },
      { id: "warna", label: "Warna Dominan?", type: "text" },
      { id: "ukuran", label: "Ukuran?", type: "text", placeholder: "L, XL, dll" },
      { id: "merk_logo", label: "Logo/Tulisan?", type: "text", placeholder: "Contoh: Logo SMK Telkom" },
      { id: "lokasi", label: "Lokasi Terakhir Terlihat?", type: "select", options: lokasiList },
      { id: "kondisi", label: "Kondisi Barang?", type: "text", placeholder: "Contoh: Ada noda di lengan" }
    ] 
  },
  lainnya: { 
    questions: [
      { id: "nama", label: "Nama Barang?", type: "text" },
      { id: "warna", label: "Warna Barang?", type: "text" },
      { id: "deskripsi", label: "Deskripsi Fisik?", type: "text" },
      { id: "fungsi", label: "Kegunaan Barang?", type: "text", placeholder: "Contoh: Alat tulis" },
      { id: "lokasi", label: "Lokasi Terakhir Terlihat?", type: "select", options: lokasiList },
      { id: "catatan", label: "Pesan Tambahan?", type: "text" }
    ] 
  },
};

export default function FormKehilangan({ initialKategori }: { initialKategori: string }) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPopup, setShowPopup] = useState(false);

  const catKey = initialKategori?.toLowerCase();
  const currentForm = formConfig[catKey] || formConfig["lainnya"];

  const validate = () => {
    let newErrors: Record<string, string> = {};
    currentForm.questions.forEach((q: any) => {
      if (!formData[q.id] || formData[q.id].trim() === "") {
        newErrors[q.id] = `Wajib diisi!`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setShowPopup(true);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 relative">
      {/* 1. POPUP DENGAN PROPS FIX */}
      <PopupThxGiving 
        isOpen={showPopup} 
        onClose={() => setShowPopup(false)} 
        duration={5000} 
      />

      <div className={`bg-white rounded-[32px] p-8 md:p-10 shadow-[12px_12px_0px_#561C24] border-2 border-[#561C24] transition-all ${showPopup ? 'blur-sm pointer-events-none' : ''}`}>         
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {currentForm.questions.map((q: any) => (
            <div key={q.id} className="space-y-2">
              <label className="block text-[13px] font-bold text-black uppercase tracking-wide ml-1">
                {q.label}
              </label>

              {q.type === "select" ? (
                <div className="relative">
                  <select
                    className={`w-full bg-gray-50 border-2 rounded-2xl px-5 py-4 font-normal text-black outline-none appearance-none cursor-pointer ${
                      errors[q.id] ? 'border-red-500' : 'border-[#561C24]'
                    }`}
                    value={formData[q.id] || ""}
                    onChange={(e) => setFormData({ ...formData, [q.id]: e.target.value })}
                  >
                    <option value="">Pilih Lokasi...</option>
                    {q.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#561C24] pointer-events-none" />
                </div>
              ) : q.type === "boolean" ? (
                /* 2. OPSI BUNDAR SEBARIS */
                <div className="flex flex-row gap-10 p-2">
                  {["Ya", "Tidak"].map((option) => (
                    <label key={option} className="flex items-center group cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name={q.id}
                          className="sr-only"
                          checked={formData[q.id] === option}
                          onChange={() => setFormData({ ...formData, [q.id]: option })}
                        />
                        <div className={`w-6 h-6 rounded-full border-2 border-[#561C24] flex items-center justify-center transition-all ${
                          formData[q.id] === option ? 'bg-white shadow-[2px_2px_0px_#561C24]' : 'bg-gray-50'
                        }`}>
                          <div className={`w-3 h-3 rounded-full bg-[#8B3039] transition-all transform ${
                            formData[q.id] === option ? 'scale-100' : 'scale-0'
                          }`} />
                        </div>
                      </div>
                      <span className={`ml-3 font-bold text-sm uppercase ${
                        formData[q.id] === option ? 'text-[#8B3039]' : 'text-gray-500'
                      }`}>
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type={q.type}
                  className={`w-full bg-gray-50 border-2 rounded-2xl px-5 py-4 text-black outline-none ${
                    errors[q.id] ? 'border-red-500' : 'border-[#561C24]'
                  }`}
                  placeholder={q.placeholder}
                  value={formData[q.id] || ""}
                  onChange={(e) => setFormData({ ...formData, [q.id]: e.target.value })}
                />
              )}
              
              {errors[q.id] && (
                <div className="flex items-center gap-1.5 text-red-600 font-bold text-[11px] ml-1">
                  <AlertCircle size={12} />
                  <span>{errors[q.id]}</span>
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-[#8B3039] text-white py-5 rounded-2xl font-bold text-lg shadow-[6px_6px_0px_#561C24] hover:bg-[#561C24] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 border-2 border-[#561C24] uppercase mt-6"
          >
            <Send size={18} />
            Kirim Laporan
          </button>
        </form>
      </div>
    </div>
  );
}
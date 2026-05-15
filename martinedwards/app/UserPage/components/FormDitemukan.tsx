"use client";

import { useState, useRef } from "react";
import { Box, MapPin, Upload, ChevronDown, X, AlignLeft } from "lucide-react";
import PopupThxGiving from "./PopupThxGiving";

interface FormErrors {
  nama_barang?: string;
  kategori?: string;
  deskripsi?: string;
  foto?: string;
  lokasi?: string;
  tanggal?: string;
}

export default function FormDitemukan() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lokasiOptions = [
    "Gedung A Lantai 1", "Gedung A Lantai 2", "Gedung A Lantai 3",
    "Gedung B Lantai 1", "Gedung B Lantai 2", "Gedung B Lantai 3",
    "Gedung C", "Gedung D Lantai 1", "Gedung D Lantai 2", "Gedung D Lantai 3",
    "Gedung E", "Kantin", "Lapangan Basket", "Lobby", "Parkiran",
    "Musholla Lantai 1", "Musholla Lantai 2", 
    "Gerbang Depan SMK Telkom Makassar"
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setErrors(prev => ({ ...prev, foto: undefined }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newErrors: FormErrors = {};

    if (!formData.get("nama_barang")) newErrors.nama_barang = "Nama barang wajib diisi";
    if (!formData.get("kategori")) newErrors.kategori = "Pilih kategori barang";
    if (!formData.get("deskripsi")) newErrors.deskripsi = "Berikan sedikit deskripsi barang";
    if (!selectedImage) newErrors.foto = "Foto barang wajib diunggah";
    if (!formData.get("lokasi")) newErrors.lokasi = "Pilih lokasi ditemukan";
    if (!formData.get("tanggal")) newErrors.tanggal = "Pilih tanggal ditemukan";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsPopupOpen(true);
  };

  return (
    <>
      <div className="w-full bg-white rounded-[25px] border-2 border-gray-200 shadow-[12px_12px_0px_rgba(70,20,26,0.1)] p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-7" noValidate>
          
          {/* SECTION: DETAIL BARANG */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-[#46141A]">
              <Box size={22} strokeWidth={2.5} />
              <h3 className="font-bold text-lg tracking-tight uppercase">Detail Barang</h3>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {/* Nama Barang */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-600 ml-1">Nama Barang</label>
                <input 
                  name="nama_barang"
                  type="text" 
                  className={`w-full bg-white border-2 rounded-xl px-4 py-3.5 text-sm text-gray-800 transition-all ${errors.nama_barang ? 'border-red-500' : 'border-gray-200 focus:border-[#46141A] hover:border-[#46141A]'}`}
                  placeholder="Misal: Kunci Motor Beat Hitam"
                />
                {errors.nama_barang && <p className="text-red-500 text-xs font-medium ml-1">*{errors.nama_barang}</p>}
              </div>

              {/* Kategori */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-600 ml-1">Kategori Barang</label>
                <div className="relative group">
                  <select 
                    name="kategori"
                    defaultValue="" 
                    className={`w-full bg-white border-2 rounded-xl px-4 py-3.5 text-sm text-gray-700 appearance-none transition-all cursor-pointer ${errors.kategori ? 'border-red-500' : 'border-gray-200 focus:border-[#46141A] hover:border-[#46141A]'}`}
                  >
                    <option value="" disabled>Pilih Kategori</option>
                    <option value="aksesoris">Aksesoris</option>
                    <option value="elektronik">Elektronik</option>
                    <option value="pakaian">Pakaian</option>
                    <option value="kunci">Kunci</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#46141A]" size={18} />
                </div>
                {errors.kategori && <p className="text-red-500 text-xs font-medium ml-1">*{errors.kategori}</p>}
              </div>

              {/* Deskripsi Barang - BARU DI SINI */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 ml-1">
                   <label className="text-sm font-semibold text-gray-600">Deskripsi Tambahan</label>
                </div>
                <textarea 
                  name="deskripsi"
                  rows={3}
                  className={`w-full bg-white border-2 rounded-xl px-4 py-3 text-sm text-gray-800 transition-all resize-none ${errors.deskripsi ? 'border-red-500' : 'border-gray-200 focus:border-[#46141A] hover:border-[#46141A]'}`}
                  placeholder="Ceritakan detail barangnya (warna, merk, ciri khusus, dll)..."
                ></textarea>
                {errors.deskripsi && <p className="text-red-500 text-xs font-medium ml-1">*{errors.deskripsi}</p>}
              </div>
            </div>

            {/* Foto Barang */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">Foto Barang (Wajib)</label>
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
              
              {!selectedImage ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-[3px] border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group ${errors.foto ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-[#FAE4DC]/20 hover:border-[#46141A]'}`}
                >
                  <Upload size={32} className={`${errors.foto ? 'text-red-400' : 'text-gray-400'} mb-3 group-hover:text-[#46141A]`} />
                  <span className={`text-sm font-bold ${errors.foto ? 'text-red-500' : 'text-gray-500'} group-hover:text-[#46141A]`}>Klik untuk pilih foto</span>
                </div>
              ) : (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-gray-200 shadow-md">
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => setSelectedImage(null)} 
                    className="absolute top-3 right-3 bg-[#46141A] text-white p-2 rounded-lg hover:bg-black transition-all"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>
                </div>
              )}
              {errors.foto && <p className="text-red-500 text-xs font-medium ml-1">*{errors.foto}</p>}
            </div>
          </div>

          {/* SECTION: LOKASI & WAKTU */}
          <div className="space-y-5 pt-6 border-t-2 border-gray-100">
            <div className="flex items-center gap-2 text-[#46141A]">
              <MapPin size={22} strokeWidth={2.5} />
              <h3 className="font-bold text-lg tracking-tight uppercase">Lokasi & Waktu</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <div className="relative group">
                  <select 
                    name="lokasi"
                    defaultValue="" 
                    className={`w-full bg-white border-2 rounded-xl px-4 py-3.5 text-sm text-gray-700 appearance-none transition-all cursor-pointer ${errors.lokasi ? 'border-red-500' : 'border-gray-200 focus:border-[#46141A] hover:border-[#46141A]'}`}
                  >
                    <option value="" disabled>Pilih Lokasi Kejadian</option>
                    {lokasiOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#46141A]" size={18} />
                </div>
                {errors.lokasi && <p className="text-red-500 text-xs font-medium ml-1">*{errors.lokasi}</p>}
              </div>

              <div className="space-y-1.5">
                <input 
                  name="tanggal"
                  type="date" 
                  className={`w-full bg-white border-2 rounded-xl px-4 py-3.5 text-sm text-gray-700 transition-all ${errors.tanggal ? 'border-red-500' : 'border-gray-200 focus:border-[#46141A] hover:border-[#46141A]'}`}
                />
                {errors.tanggal && <p className="text-red-500 text-xs font-medium ml-1">*{errors.tanggal}</p>}
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#46141A] hover:bg-black text-white font-bold py-5 rounded-xl shadow-[8px_8px_0px_rgba(70,20,26,0.2)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-widest"
          >
            Kirim Laporan
          </button>
        </form>
      </div>

      <PopupThxGiving 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
      />
    </>
  );
}
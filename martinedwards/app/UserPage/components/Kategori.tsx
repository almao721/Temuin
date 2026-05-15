"use client";

import { X, Search } from "lucide-react";
import { useState, useEffect } from "react";

interface KategoriProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (kategori: string) => void;
}

const categories = [
  { 
    id: "aksesoris", 
    name: "Aksesoris", 
    images: ["/Assets/aksesoris1.jpg", "/Assets/aksesoris2.jpg", "/Assets/aksesoris3.jpg"] 
  },
  { 
    id: "elektronik", 
    name: "Elektronik", 
    images: ["/Assets/elektronik1.jpg", "/Assets/elektronik2.jpg", "/Assets/elektronik3.jpg"] 
  },
  { 
    id: "kunci", 
    name: "Kunci", 
    images: ["/Assets/kunci1.jpg", "/Assets/kunci2.jpg", "/Assets/kunci3.jpg"] 
  },
  { 
    id: "pakaian", 
    name: "Pakaian", 
    images: ["/Assets/pakaian1.jpg", "/Assets/pakaian2.jpg", "/Assets/pakaian3.jpg"] 
  },
  { 
    id: "pribadi", 
    name: "Pribadi", 
    images: ["/Assets/pribadi1.jpg", "/Assets/pribadi2.jpg", "/Assets/pribadi3.jpg"] 
  },
  { 
    id: "lainnya", 
    name: "Lainnya", 
    images: ["/Assets/lainnya1.jpg", "/Assets/lainnya2.jpg", "/Assets/lainnya3.jpg"] 
  },
];

export default function Kategori({ isOpen, onClose, onSelect }: KategoriProps) {
  const [imgIndex, setImgIndex] = useState(0);

  // --- FITUR LOCK SCROLL ---
  useEffect(() => {
    if (isOpen) {
      // Kunci scroll saat popup muncul
      document.body.style.overflow = "hidden";
    } else {
      // Buka kunci saat popup tutup
      document.body.style.overflow = "unset";
    }
    
    // Cleanup agar tidak nge-bug pas pindah page
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // --- SLIDESHOW TIMER ---
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/75 backdrop-blur-sm transition-all">
      
      {/* KOTAK UTAMA */}
      <div className="relative w-full max-w-3xl bg-white rounded-[32px] p-6 md:p-8 shadow-2xl animate-in zoom-in duration-300">
        
        {/* TOMBOL SILANG */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-6 text-gray-400 hover:text-[#46141A] transition-colors"
        >
          <X size={28} strokeWidth={2.5} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-gray-900 mb-1 uppercase tracking-tight">Kategori</h2>
          <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-bold text-gray-500 italic">
            <span>Pilih kategori barang sebelum masuk ke form laporan</span>
          </div>
        </div>

        {/* GRID 3 KOLOM */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className="relative h-28 md:h-36 rounded-2xl overflow-hidden cursor-pointer group shadow-sm transition-transform duration-300 active:scale-95"
            >
              {/* SLIDESHOW GAMBAR */}
              {cat.images.map((src, index) => (
                <img 
                  key={index}
                  src={src} 
                  alt={cat.name} 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out group-hover:scale-110 transition-transform ${
                    index === imgIndex ? "opacity-100" : "opacity-0"
                  }`} 
                />
              ))}

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-300" />
              
              {/* LABEL KATEGORI */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white font-black text-[10px] md:text-xs uppercase tracking-widest border border-white/20">
                  {cat.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
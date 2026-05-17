"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export default function PopupThxGiving({ isOpen, onClose, duration = 5000 }: PopupProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isOpen) {
      setProgress(100);
      return;
    }

    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const nextValue = prev - step;
        if (nextValue <= 0) {
          clearInterval(timer);
          return 0;
        }
        return nextValue;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen, duration]);

  useEffect(() => {
    if (progress <= 0 && isOpen) {
      onClose();
      router.push("/UserPage");   // ← PERBAIKAN
    }
  }, [progress, isOpen, onClose, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white rounded-[35px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="p-10 text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-[#DCFCE7] p-6 rounded-full flex items-center justify-center">
              <CheckCircle2 size={70} className="text-[#22C55E]" strokeWidth={3} />
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight text-center">
              Laporan anda telah dikirim!
            </h2>
            <p className="text-[#46141A] font-bold text-lg leading-relaxed text-center">
              Terima kasih, laporan anda akan segera diproses! Tim kami akan memverifikasi terlebih dahulu dengan rinci isi data anda
            </p>
            <p className="text-gray-500 text-sm text-center px-4">
              Mohon menunggu proses verifikasi kami dalam <span className="font-bold text-gray-700">2-4 hari</span>. Anda akan mendapatkan pemberitahuan setelah laporan diverifikasi.
            </p>
          </div>
          <button 
            onClick={() => {
              onClose();
              router.push("/UserPage");   // ← PERBAIKAN
            }}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95 text-lg"
          >
            Kembali ke beranda
          </button>
        </div>
        <div className="h-2 w-full bg-gray-100">
          <div className="h-full bg-[#3B82F6] transition-all ease-linear" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
}
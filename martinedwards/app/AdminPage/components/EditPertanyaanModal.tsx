"use client";

import { useState, useEffect } from "react";

interface Pertanyaan {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pertanyaan: Pertanyaan[]) => void;
  kategori: any;
}

export default function EditPertanyaanModal({ isOpen, onClose, onSave, kategori }: Props) {
  const [pertanyaan, setPertanyaan] = useState<Pertanyaan[]>([]);

  useEffect(() => {
    if (kategori && kategori.pertanyaan) {
      try {
        setPertanyaan(JSON.parse(kategori.pertanyaan));
      } catch {
        setPertanyaan([]);
      }
    } else {
      // Default pertanyaan berdasarkan kategori
      setPertanyaan(getDefaultQuestions(kategori?.nama_kategori));
    }
  }, [kategori]);

  const getDefaultQuestions = (kategoriNama: string): Pertanyaan[] => {
    const defaults: Record<string, Pertanyaan[]> = {
      elektronik: [
        { id: "nama", label: "Nama Perangkat?", type: "text", placeholder: "Contoh: HP, TWS" },
        { id: "merek", label: "Merek & Tipe?", type: "text", placeholder: "Contoh: iPhone 11" },
        { id: "warna", label: "Warna Perangkat?", type: "text", placeholder: "Contoh: Hitam" },
        { id: "status", label: "Apakah masih menyala?", type: "boolean" },
        { id: "lokasi", label: "Lokasi Terakhir Terlihat?", type: "select" },
        { id: "wallpaper", label: "Ciri unik (Wallpaper/Stiker)?", type: "text" }
      ],
      aksesoris: [
        { id: "nama", label: "Jenis Aksesoris?", type: "text" },
        { id: "warna", label: "Warna Dominan?", type: "text" },
        { id: "brand", label: "Merek (Jika ada)?", type: "text" },
        { id: "lokasi", label: "Lokasi Terakhir Terlihat?", type: "select" }
      ],
      kunci: [
        { id: "jenis", label: "Kunci Untuk Apa?", type: "text" },
        { id: "jumlah", label: "Jumlah anak kunci?", type: "text" },
        { id: "lokasi", label: "Lokasi Terakhir Terlihat?", type: "select" }
      ],
      pakaian: [
        { id: "jenis", label: "Jenis Pakaian?", type: "text" },
        { id: "warna", label: "Warna Dominan?", type: "text" },
        { id: "ukuran", label: "Ukuran?", type: "text" },
        { id: "lokasi", label: "Lokasi Terakhir Terlihat?", type: "select" }
      ],
      pribadi: [
        { id: "nama", label: "Nama Barang?", type: "text" },
        { id: "warna", label: "Warna & Bahan?", type: "text" },
        { id: "lokasi", label: "Lokasi Terakhir Terlihat?", type: "select" }
      ],
      lainnya: [
        { id: "nama", label: "Nama Barang?", type: "text" },
        { id: "warna", label: "Warna Barang?", type: "text" },
        { id: "deskripsi", label: "Deskripsi Fisik?", type: "text" },
        { id: "lokasi", label: "Lokasi Terakhir Terlihat?", type: "select" }
      ]
    };
    return defaults[kategoriNama?.toLowerCase()] || defaults.lainnya;
  };

  const addQuestion = () => {
    setPertanyaan([...pertanyaan, { id: `new_${Date.now()}`, label: "", type: "text", placeholder: "" }]);
  };

  const removeQuestion = (index: number) => {
    setPertanyaan(pertanyaan.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Pertanyaan, value: string) => {
    const updated = [...pertanyaan];
    updated[index] = { ...updated[index], [field]: value };
    setPertanyaan(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Edit Pertanyaan - {kategori?.nama_kategori}</h2>
        </div>
        
        <div className="p-6 space-y-4">
          {pertanyaan.map((q, idx) => (
            <div key={q.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <h3 className="font-medium">Pertanyaan {idx + 1}</h3>
                <button onClick={() => removeQuestion(idx)} className="text-red-500">Hapus</button>
              </div>
              <input
                type="text"
                value={q.label}
                onChange={(e) => updateQuestion(idx, "label", e.target.value)}
                placeholder="Label pertanyaan"
                className="w-full border rounded px-3 py-2"
              />
              <select
                value={q.type}
                onChange={(e) => updateQuestion(idx, "type", e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="text">Text</option>
                <option value="textarea">Text Area</option>
                <option value="select">Select (Lokasi)</option>
                <option value="boolean">Boolean (Ya/Tidak)</option>
              </select>
              <input
                type="text"
                value={q.placeholder || ""}
                onChange={(e) => updateQuestion(idx, "placeholder", e.target.value)}
                placeholder="Placeholder (opsional)"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          ))}
          
          <button onClick={addQuestion} className="w-full border-2 border-dashed rounded-lg py-2 text-gray-500">
            + Tambah Pertanyaan
          </button>
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">Batal</button>
          <button onClick={() => onSave(pertanyaan)} className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
        </div>
      </div>
    </div>
  );
}
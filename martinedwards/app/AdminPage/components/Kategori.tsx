"use client";

import { useState } from "react";
import {
  Trash2,
  MessageSquareText,
  FolderOpen,
  X,
  Pencil,
  Save,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Kategori() {
  const [selectedKategori, setSelectedKategori] =
    useState<any>(null);

  const [openPertanyaan, setOpenPertanyaan] =
    useState(false);

  const [openDelete, setOpenDelete] =
    useState(false);

  const [selectedDelete, setSelectedDelete] =
    useState<any>(null);

  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const lokasiOptions = [
    "Gedung A Lantai 1",
    "Gedung A Lantai 2",
    "Gedung A Lantai 3",
    "Gedung B Lantai 1",
    "Gedung B Lantai 2",
    "Gedung B Lantai 3",
    "Gedung C",
    "Gedung D Lantai 1",
    "Gedung D Lantai 2",
    "Gedung D Lantai 3",
    "Gedung E",
    "Kantin",
    "Lapangan Basket",
    "Lobby",
    "Parkiran",
    "Musholla Lantai 1",
    "Musholla Lantai 2",
    "Gerbang Depan SMK Telkom Makassar",
    "hati martin edwards"
  ];

  const [kategoriData, setKategoriData] =
    useState([
      {
        nama: "Aksesoris",
        pertanyaan: [
          {
            type: "text",
            value:
              "Barang apa yang kamu hilangkan?",
          },
          {
            type: "text",
            value:
              "Warna barang yang hilang?",
          },
          {
            type: "text",
            value:
              "Berikan ciri khas barang anda",
          },
          {
            type: "text",
            value:
              "Brand / merek barang anda?",
          },
          {
            type: "lokasi",
            value:
              "Dimana lokasi terakhir barang terlihat?",
          },
          {
            type: "yesno",
            value:
              "Apakah barang masih menyala saat hilang?",
          },
        ],
      },

      {
        nama: "Pribadi",
        pertanyaan: [
          {
            type: "text",
            value:
              "Barang pribadi apa yang hilang?",
          },
          {
            type: "text",
            value:
              "Apa warna barang tersebut?",
          },
          {
            type: "text",
            value:
              "Apa isi atau detail penting di dalamnya?",
          },
          {
            type: "text",
            value:
              "Kapan terakhir digunakan?",
          },
          {
            type: "lokasi",
            value:
              "Lokasi terakhir barang terlihat?",
          },
          {
            type: "yesno",
            value:
              "Apakah barang masih dalam kondisi aktif?",
          },
        ],
      },

      {
        nama: "Kunci",
        pertanyaan: [
          {
            type: "text",
            value:
              "Kunci apa yang hilang?",
          },
          {
            type: "text",
            value:
              "Apakah ada gantungan pada kunci?",
          },
          {
            type: "text",
            value:
              "Berapa jumlah kunci?",
          },
          {
            type: "text",
            value:
              "Warna atau bentuk khas kunci?",
          },
          {
            type: "lokasi",
            value:
              "Dimana terakhir terlihat?",
          },
          {
            type: "yesno",
            value:
              "Apakah kunci memiliki pelacak?",
          },
        ],
      },

      {
        nama: "Elektronik",
        pertanyaan: [
          {
            type: "text",
            value:
              "Barang elektronik apa yang hilang?",
          },
          {
            type: "text",
            value:
              "Apa warna barang tersebut?",
          },
          {
            type: "text",
            value:
              "Sebutkan merek / tipe barang",
          },
          {
            type: "text",
            value:
              "Apakah ada stiker atau ciri khusus?",
          },
          {
            type: "lokasi",
            value:
              "Dimana lokasi terakhir barang terlihat?",
          },
          {
            type: "yesno",
            value:
              "Apakah barang masih menyala saat hilang?",
          },
        ],
      },

      {
        nama: "Pakaian",
        pertanyaan: [
          {
            type: "text",
            value:
              "Pakaian apa yang hilang?",
          },
          {
            type: "text",
            value:
              "Apa warna pakaian tersebut?",
          },
          {
            type: "text",
            value:
              "Apakah ada motif tertentu?",
          },
          {
            type: "text",
            value:
              "Ukuran pakaian tersebut?",
          },
          {
            type: "lokasi",
            value:
              "Lokasi terakhir pakaian terlihat?",
          },
          {
            type: "yesno",
            value:
              "Apakah pakaian berada di dalam tas?",
          },
        ],
      },

      {
        nama: "Lainnya",
        pertanyaan: [
          {
            type: "text",
            value:
              "Barang apa yang hilang?",
          },
          {
            type: "text",
            value:
              "Apa warna barang tersebut?",
          },
          {
            type: "text",
            value:
              "Berikan detail barang anda",
          },
          {
            type: "text",
            value:
              "Kapan terakhir terlihat?",
          },
          {
            type: "lokasi",
            value:
              "Dimana lokasi terakhir barang terlihat?",
          },
          {
            type: "yesno",
            value:
              "Apakah barang masih berfungsi?",
          },
        ],
      },
    ]);
    

  // Fungsi simpan pertanyaan ke backend
  const simpanPertanyaanKeBackend = async (namaKategori: string, pertanyaan: any[]) => {
    const token = getToken();
    if (!token) {
      alert('Token tidak ditemukan, silakan login ulang');
      return false;
    }

    try {
      // Cari kategori_id berdasarkan nama
      const cariResponse = await fetch(`${API_BASE}/api/admin/kategori`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const cariResult = await cariResponse.json();
      
      let kategoriId = null;
      if (cariResult.success && Array.isArray(cariResult.data)) {
        const found = cariResult.data.find((k: any) => k.nama === namaKategori);
        if (found) kategoriId = found.id;
      }

      if (!kategoriId) {
        // Jika tidak ditemukan di backend, simpan hanya di frontend
        return true;
      }

      const response = await fetch(`${API_BASE}/api/admin/kategori/${kategoriId}/pertanyaan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pertanyaan })
      });
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Gagal simpan ke backend:', error);
      return false;
    }
  };

  const hapusKategori = (nama: string) => {
    setKategoriData(
      kategoriData.filter(
        (item) => item.nama !== nama
      )
    );
    setOpenDelete(false);
  };

  const updatePertanyaan = (
    kategoriIndex: number,
    pertanyaanIndex: number,
    value: string
  ) => {
    const updated = [...kategoriData];
    updated[kategoriIndex].pertanyaan[
      pertanyaanIndex
    ].value = value;
    setKategoriData(updated);
  };

  const handleSimpanPertanyaan = async () => {
    if (selectedKategori && selectedKategori.index !== undefined) {
      const namaKategori = selectedKategori.nama;
      const pertanyaanBaru = selectedKategori.pertanyaan;
      
      await simpanPertanyaanKeBackend(namaKategori, pertanyaanBaru);
      
      // Update state kategoriData
      const updatedKategoriData = [...kategoriData];
      updatedKategoriData[selectedKategori.index].pertanyaan = pertanyaanBaru;
      setKategoriData(updatedKategoriData);
      
      setOpenPertanyaan(false);
    }
  };

  return (
    <>
      <div className="mx-auto flex h-[calc(100vh-120px)] w-full max-w-7xl flex-col lg:h-[calc(100vh-40px)]">

        <div className="mb-5 rounded-[32px] bg-gradient-to-r from-[#651A27] to-[#8D303C] p-7 text-white shadow-2xl">

          <div>
            <h1 className="text-3xl font-bold tracking-wide">
              Control Panel
            </h1>

            <p className="mt-2 text-sm text-white/80">
              Kelola kategori pertanyaan laporan
            </p>
          </div>
        </div>

        <div className="flex h-full flex-col overflow-hidden rounded-[30px] border border-[#651A27]/10 bg-white shadow-2xl">

          <div className="border-b border-[#651A27]/10 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="rounded-2xl bg-[#651A27]/10 p-3 text-[#651A27]">
                <FolderOpen size={22} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#2F2F2F]">
                  Kategori
                </h2>

                <p className="text-sm text-gray-500">
                  Daftar kategori pertanyaan
                </p>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-6">

            <div className="overflow-auto rounded-3xl border border-[#651A27]/10">

              <table className="w-full min-w-[900px]">

                <thead className="bg-[#F7ECEE]">

                  <tr className="text-xs uppercase tracking-wide text-[#651A27]">

                    <th className="px-6 py-4 text-center">
                      Nama Kategori
                    </th>

                    <th className="px-6 py-4 text-center">
                      Pertanyaan
                    </th>

                    <th className="px-6 py-4 text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {kategoriData.map(
                    (kategori, kategoriIndex) => (
                      <tr
                        key={kategori.nama}
                        className="border-t border-[#651A27]/10 transition-all duration-300 hover:bg-[#651A27]/5"
                      >

                        <td className="px-6 py-5 text-center font-bold text-[#2F2F2F]">
                          {kategori.nama}
                        </td>

                        <td className="px-6 py-5">

                          <div className="flex justify-center">

                            <button
                              onClick={() => {
                                setSelectedKategori({
                                  ...kategori,
                                  index:
                                    kategoriIndex,
                                });

                                setOpenPertanyaan(
                                  true
                                );
                              }}
                              className="flex items-center gap-2 rounded-2xl bg-[#651A27]/10 px-5 py-3 text-sm font-semibold text-[#651A27] duration-300 hover:bg-[#651A27] hover:text-white"
                            >
                              <MessageSquareText
                                size={18}
                              />
                              Edit Pertanyaan
                            </button>
                          </div>
                        </td>

                        <td className="px-6 py-5">

                          <div className="flex justify-center">

                            <button
                              onClick={() => {
                                setSelectedDelete(
                                  kategori
                                );

                                setOpenDelete(
                                  true
                                );
                              }}
                              className="rounded-2xl bg-red-100 p-3 text-red-600 duration-300 hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {openPertanyaan &&
        selectedKategori && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

            <div className="relative w-full max-w-3xl rounded-[35px] bg-white p-8 shadow-2xl">

              <button
                onClick={() =>
                  setOpenPertanyaan(false)
                }
                className="absolute right-5 top-5 rounded-full bg-[#651A27]/10 p-2 text-[#651A27]"
              >
                <X size={18} />
              </button>

              <div className="mb-7 flex items-center gap-3">

                <div className="rounded-2xl bg-[#651A27]/10 p-3 text-[#651A27]">
                  <Pencil size={22} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-[#651A27]">
                    Edit Pertanyaan
                  </h2>

                  <p className="text-sm text-gray-500">
                    {
                      selectedKategori.nama
                    }
                  </p>
                </div>
              </div>

              <div className="max-h-[500px] space-y-5 overflow-auto pr-2">

                {selectedKategori.pertanyaan.map(
                  (
                    item: any,
                    pertanyaanIndex: number
                  ) => (
                    <div
                      key={pertanyaanIndex}
                      className="rounded-3xl border border-[#651A27]/10 bg-[#FAF6F7] p-5"
                    >

                      <div className="mb-3 flex items-center justify-between">

                        <p className="text-sm font-bold text-[#651A27]">
                          Pertanyaan{" "}
                          {pertanyaanIndex + 1}
                        </p>

                        <div className="rounded-full bg-[#651A27]/10 px-3 py-1 text-xs font-semibold text-[#651A27]">

                          {item.type ===
                          "lokasi"
                            ? "Dropdown Lokasi"
                            : item.type ===
                              "yesno"
                            ? "Ya / Tidak"
                            : "Text"}
                        </div>
                      </div>

                      <textarea
                        rows={2}
                        value={item.value}
                        onChange={(e) => {
                          updatePertanyaan(
                            selectedKategori.index,
                            pertanyaanIndex,
                            e.target.value
                          );

                          const updatedKategori =
                            {
                              ...selectedKategori,
                            };

                          updatedKategori
                            .pertanyaan[
                            pertanyaanIndex
                          ].value =
                            e.target.value;

                          setSelectedKategori(
                            updatedKategori
                          );
                        }}
                        className="w-full resize-none rounded-2xl border border-[#651A27]/15 bg-white px-4 py-3 text-sm text-[#2F2F2F] outline-none focus:border-[#651A27]"
                      />

                      {item.type ===
                        "lokasi" && (
                        <div className="mt-4 rounded-2xl bg-white p-4">

                          <p className="mb-3 text-sm font-semibold text-[#651A27]">
                            Pilihan Lokasi:
                          </p>

                          <div className="grid grid-cols-2 gap-2">

                            {lokasiOptions.map(
                              (lokasi) => (
                                <div
                                  key={lokasi}
                                  className="rounded-xl bg-[#FAF6F7] px-3 py-2 text-xs text-[#2F2F2F]"
                                >
                                  {lokasi}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {item.type ===
                        "yesno" && (
                        <div className="mt-4 flex gap-3">

                          <div className="rounded-xl bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                            Ya
                          </div>

                          <div className="rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                            Tidak
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>

              <button
                onClick={handleSimpanPertanyaan}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#651A27] py-4 text-sm font-semibold text-white shadow-lg duration-300 hover:scale-[1.02]"
              >
                <Save size={18} />
                Simpan Perubahan
              </button>
            </div>
          </div>
        )}

      {openDelete &&
        selectedDelete && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-[35px] bg-white p-7 shadow-2xl">

              <h2 className="text-center text-2xl font-bold text-[#651A27]">
                Hapus Kategori
              </h2>

              <p className="mt-4 text-center text-sm text-gray-600">
                Apakah anda yakin ingin
                membuang kategori pertanyaan
                ini?
              </p>

              <div className="mt-7 flex gap-3">

                <button
                  onClick={() =>
                    setOpenDelete(false)
                  }
                  className="w-full rounded-2xl bg-gray-200 py-3 text-sm font-semibold text-gray-700 duration-300 hover:bg-gray-300"
                >
                  Tidak
                </button>

                <button
                  onClick={() =>
                    hapusKategori(
                      selectedDelete.nama
                    )
                  }
                  className="w-full rounded-2xl bg-red-600 py-3 text-sm font-semibold text-white duration-300 hover:bg-red-700"
                >
                  Ya
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
}
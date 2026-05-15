"use client";

import { useMemo, useState } from "react";
import {
  Trash2,
  Plus,
  Search,
  SlidersHorizontal,
  FileText,
  X,
  Eye,
} from "lucide-react";

export default function LaporanKehilangan() {
  const [openFilter, setOpenFilter] =
    useState(false);

  const [openTambah, setOpenTambah] =
    useState(false);

  const [openDetail, setOpenDetail] =
    useState(false);

  const [selectedReport, setSelectedReport] =
    useState<any>(null);

  const [selectedCategory, setSelectedCategory] =
    useState("Semua");

  const [selectedStatus, setSelectedStatus] =
    useState("Semua");

  const [search, setSearch] = useState("");

  const categories = [
    "Aksesoris",
    "Pribadi",
    "Kunci",
    "Elektronik",
    "Pakaian",
    "Lainnya",
  ];

  const lokasiList = [
    "Gedung A Lantai 1",
    "Gedung A Lantai 2",
    "Gedung A Lantai 3",
    "Gedung B Lantai 1",
    "Gedung B Lantai 2",
    "Gedung B Lantai 3",
    "Gedung C",
    "Gedung D",
    "Gedung E",
    "Lobby",
    "Kantin",
    "Lapangan",
    "Parkiran",
    "Musholla",
  ];

  const [reports, setReports] = useState([
    {
      id: "LK-001",
      barang: "Dompet Kulit Hitam",
      pelapor: "Andi Pratama",
      tanggal: "2026-05-12",
      lokasi: "Gedung A Lantai 2",
      kategori: "Aksesoris",
      status: "Pending",
      score: "4/6",

      survey: {
        q1: "Dompet Kulit Hitam",
        q2: "Hitam",
        q3: "Dompet kulit dengan resleting silver",
        q4: "Eiger",
        q5: "12 Mei 2026 - 10:20",
        q6: "Gedung A Lantai 2",
      },
    },

    {
      id: "LK-002",
      barang: "Tas Selempang Maroon",
      pelapor: "Siti Aisyah",
      tanggal: "2026-05-12",
      lokasi: "Kantin",
      kategori: "Pribadi",
      status: "Diproses",
      score: "3/6",

      survey: {
        q1: "Tas Selempang",
        q2: "Maroon",
        q3: "Tas kecil dengan gantungan boneka",
        q4: "Nevada",
        q5: "12 Mei 2026 - 09:00",
        q6: "Kantin",
      },
    },
  ]);

  const [formData, setFormData] = useState({
    barang: "",
    pelapor: "",
    tanggal: "",
    lokasi: "",
    kategori: "Aksesoris",
    status: "Pending",
    warna: "",
    deskripsi: "",
    merek: "",
  });

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const cocokKategori =
        selectedCategory === "Semua" ||
        report.kategori === selectedCategory;

      const cocokStatus =
        selectedStatus === "Semua" ||
        report.status === selectedStatus;

      const cocokSearch =
        report.barang
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        report.pelapor
          .toLowerCase()
          .includes(search.toLowerCase());

      return (
        cocokKategori &&
        cocokStatus &&
        cocokSearch
      );
    });
  }, [
    reports,
    selectedCategory,
    selectedStatus,
    search,
  ]);

  const tambahLaporan = () => {
    if (
      !formData.barang ||
      !formData.pelapor ||
      !formData.tanggal ||
      !formData.lokasi
    )
      return;

    const laporanBaru = {
      id: `LK-00${reports.length + 1}`,
      barang: formData.barang,
      pelapor: formData.pelapor,
      tanggal: formData.tanggal,
      lokasi: formData.lokasi,
      kategori: formData.kategori,
      status: formData.status,
      score: "4/6",

      survey: {
        q1: formData.barang,
        q2: formData.warna || "-",
        q3:
          formData.deskripsi ||
          "Tidak ada deskripsi",
        q4: formData.merek || "-",
        q5: formData.tanggal,
        q6: formData.lokasi,
      },
    };

    setReports([laporanBaru, ...reports]);

    setFormData({
      barang: "",
      pelapor: "",
      tanggal: "",
      lokasi: "",
      kategori: "Aksesoris",
      status: "Pending",
      warna: "",
      deskripsi: "",
      merek: "",
    });

    setOpenTambah(false);
  };

  const hapusLaporan = (id: string) => {
    setReports(
      reports.filter((report) => report.id !== id)
    );
  };

  return (
    <>
      <div className="mx-auto flex h-[calc(100vh-110px)] w-full max-w-7xl flex-col lg:h-[calc(100vh-40px)]">

        <div className="mb-5 rounded-[32px] bg-gradient-to-r from-[#651A27] to-[#8D303C] p-7 text-white shadow-2xl">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h1 className="text-3xl font-bold tracking-wide text-white">
                Control Panel
              </h1>

              <p className="mt-2 text-sm text-white/90">
                Kelola laporan kehilangan
              </p>
            </div>

            <button
              onClick={() => setOpenFilter(true)}
              className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#651A27] shadow-lg duration-300 hover:scale-[1.03]"
            >
              <SlidersHorizontal size={18} />
              Filter
            </button>
          </div>
        </div>

        <div className="flex h-full flex-col overflow-hidden rounded-[30px] border border-[#651A27]/10 bg-white shadow-2xl">

          <div className="border-b border-[#651A27]/10 px-5 py-5 md:px-7">

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#651A27]/10 text-[#651A27]">
                  <FileText size={22} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-[#2F2F2F]">
                    Laporan Kehilangan
                  </h1>

                  <p className="text-sm text-[#6B6B6B]">
                    Data laporan barang hilang
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                <div className="flex items-center gap-2 rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 shadow-sm">

                  <Search
                    size={18}
                    className="text-[#651A27]"
                  />

                  <input
                    type="text"
                    placeholder="Cari laporan..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    className="w-full bg-transparent text-sm text-[#2F2F2F] outline-none placeholder:text-[#8A8A8A] sm:w-[240px]"
                  />
                </div>

                <button
                  onClick={() => setOpenTambah(true)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#651A27] px-5 py-3 text-sm font-semibold text-white shadow-lg duration-300 hover:scale-[1.03]"
                >
                  <Plus size={18} />
                  Tambah
                </button>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-5 md:p-7">

            <div className="overflow-auto rounded-3xl border border-[#651A27]/10">

              <table className="w-full min-w-[1000px]">
            <thead className="bg-[#F7ECEE]">
              <tr className="text-xs uppercase tracking-wide text-[#651A27]">
                <th className="px-4 py-4 text-left">
                  ID
                </th>

                <th className="px-4 py-4 text-left">
                  Nama Barang
                </th>

                <th className="px-4 py-4 text-left">
                  Pelapor
                </th>

                <th className="px-4 py-4 text-left">
                  Lokasi
                </th>

                <th className="px-4 py-4 text-left">
                  Survey
                </th>

                <th className="px-4 py-4 text-center">
                  Status
                </th>

                <th className="px-4 py-4 text-center">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredReports.map((report) => (

                <tr
                  key={report.id}
                  className="border-t border-[#651A27]/10 transition-all duration-300 hover:bg-[#651A27]/5"
                >

                  <td className="px-4 py-4 font-bold text-[#651A27]">
                    {report.id}
                  </td>

                  <td className="px-4 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#651A27]/10 text-[#651A27]">
                        <FileText size={18} />
                      </div>

                      <p className="font-bold text-[#2F2F2F]">
                        {report.barang}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-700">
                    {report.pelapor}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-700">
                    {report.lokasi}
                  </td>

                  <td className="px-4 py-4">

                    <div
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        report.score === "4/6"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {report.score}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center">

                    <div className="flex justify-center">

                      <div className="relative inline-block">

                        <select
                          value={report.status}
                          onChange={(e) => {
                            const updated =
                              reports.map((item) =>
                                item.id === report.id
                                  ? {
                                      ...item,
                                      status:
                                        e.target.value,
                                    }
                                  : item
                              );

                            setReports(updated);
                          }}
                          className={`appearance-none rounded-full border px-5 py-2 pr-10 text-xs font-bold outline-none ${
                            report.status === "Selesai"
                              ? "border-green-200 bg-green-100 text-green-700"
                              : report.status ===
                                "Diproses"
                              ? "border-blue-200 bg-blue-100 text-blue-700"
                              : "border-yellow-200 bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          <option className="text-black">
                            Pending
                          </option>

                          <option className="text-black">
                            Diproses
                          </option>

                          <option className="text-black">
                            Selesai
                          </option>
                        </select>

                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-700">
                          ▼
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setOpenDetail(true);
                        }}
                        className="rounded-xl bg-[#651A27]/10 p-2 text-[#651A27] duration-300 hover:scale-110 hover:bg-[#651A27] hover:text-white"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        onClick={() =>
                          hapusLaporan(report.id)
                        }
                        className="rounded-xl bg-red-100 p-2 text-red-600 duration-300 hover:scale-110 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {openTambah && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="relative w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl">

            <button
              onClick={() => setOpenTambah(false)}
              className="absolute -right-4 -top-4 rounded-full bg-white p-2.5 text-[#651A27] shadow-2xl"
            >
              <X size={18} />
            </button>

            <h2 className="mb-5 text-2xl font-bold text-[#651A27]">
              Tambah Laporan
            </h2>

            <div className="grid gap-4">

              <input
                type="text"
                placeholder="Nama Barang"
                value={formData.barang}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    barang: e.target.value,
                  })
                }
                className="rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 text-sm text-[#2F2F2F] outline-none"
              />

              <input
                type="text"
                placeholder="Nama Pelapor"
                value={formData.pelapor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pelapor: e.target.value,
                  })
                }
                className="rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 text-sm text-[#2F2F2F] outline-none"
              />

              <input
                type="text"
                placeholder="Warna Barang"
                value={formData.warna}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    warna: e.target.value,
                  })
                }
                className="rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 text-sm text-[#2F2F2F] outline-none"
              />

              <input
                type="text"
                placeholder="Brand / Merek"
                value={formData.merek}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    merek: e.target.value,
                  })
                }
                className="rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 text-sm text-[#2F2F2F] outline-none"
              />

              <input
                type="date"
                value={formData.tanggal}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tanggal: e.target.value,
                  })
                }
                className="rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 text-sm text-[#2F2F2F] outline-none"
              />

              <select
                value={formData.lokasi}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lokasi: e.target.value,
                  })
                }
                className="rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 text-sm text-[#2F2F2F] outline-none"
              >
                <option value="">
                  Pilih Lokasi
                </option>

                {lokasiList.map((item) => (
                  <option key={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                value={formData.kategori}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    kategori: e.target.value,
                  })
                }
                className="rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 text-sm text-[#2F2F2F] outline-none"
              >
                {categories.map((item) => (
                  <option key={item}>
                    {item}
                  </option>
                ))}
              </select>

              <textarea
                rows={3}
                placeholder="Deskripsi Barang"
                value={formData.deskripsi}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deskripsi: e.target.value,
                  })
                }
                className="resize-none rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 text-sm text-[#2F2F2F] outline-none"
              />

              <button
                onClick={tambahLaporan}
                className="rounded-2xl bg-[#651A27] py-3 text-sm font-semibold text-white shadow-lg"
              >
                Tambahkan Laporan
              </button>
            </div>
          </div>
        </div>
      )}

      {openDetail && selectedReport && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="relative w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl">

            <button
              onClick={() => setOpenDetail(false)}
              className="absolute -right-4 -top-4 rounded-full bg-white p-2.5 text-[#651A27] shadow-2xl"
            >
              <X size={18} />
            </button>

            <h2 className="mb-5 text-2xl font-bold text-[#651A27]">
              Hasil Survey
            </h2>

            <div className="space-y-3">

              {[
                {
                  title:
                    "1. Barang apa yang kamu hilangkan?",
                  value: selectedReport.survey.q1,
                },

                {
                  title:
                    "2. Warna pada barang anda?",
                  value: selectedReport.survey.q2,
                },

                {
                  title:
                    "3. Deskripsi barang",
                  value: selectedReport.survey.q3,
                },

                {
                  title:
                    "4. Brand / Merek",
                  value: selectedReport.survey.q4,
                },

                {
                  title:
                    "5. Waktu terakhir terlihat",
                  value: selectedReport.survey.q5,
                },

                {
                  title:
                    "6. Lokasi terakhir terlihat",
                  value: selectedReport.survey.q6,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-[#FFF7F8] p-4"
                >
                  <p className="text-xs font-semibold text-[#651A27]">
                    {item.title}
                  </p>

                  <p className="mt-1 text-sm text-[#2F2F2F]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {openFilter && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="relative w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl">

            <button
              onClick={() => setOpenFilter(false)}
              className="absolute -right-4 -top-4 rounded-full bg-white p-2.5 text-[#651A27] shadow-2xl"
            >
              <X size={18} />
            </button>

            <h2 className="mb-5 text-xl font-bold text-[#651A27]">
              Filter Laporan
            </h2>

            <div className="space-y-4">

              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 text-sm text-[#2F2F2F] outline-none"
              >
                <option>
                  Semua
                </option>

                {categories.map((item) => (
                  <option key={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-[#651A27]/15 bg-[#FFFDFD] px-4 py-3 text-sm text-[#2F2F2F] outline-none"
              >
                <option>
                  Semua
                </option>

                <option>
                  Pending
                </option>

                <option>
                  Diproses
                </option>

                <option>
                  Selesai
                </option>
              </select>

              <button
                onClick={() => setOpenFilter(false)}
                className="w-full rounded-2xl bg-[#651A27] py-3 text-sm font-semibold text-white"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
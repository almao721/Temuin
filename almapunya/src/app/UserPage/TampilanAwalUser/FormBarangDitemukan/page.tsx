"use client";

import { useState, useRef } from "react";
import Navbar from "../../Navbar/page";
import {
  Package,
  MapPin,
  Upload,
  ChevronDown,
  CalendarDays,
} from "lucide-react";

const KATEGORI = [
  "Elektronik",
  "Dompet / Tas",
  "Kunci",
  "Dokumen",
  "Perhiasan",
  "Pakaian",
  "Lainnya",
];

const LOKASI = [
  "Gedung A",
  "Gedung B",
  "Kantin",
  "Perpustakaan",
  "Parkiran",
  "Masjid",
  "Lainnya",
];

export default function FormulirLaporan() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [kategori, setKategori] = useState<string>("");
  const [lokasi, setLokasi] = useState<string>("");
  const [openKat, setOpenKat] = useState(false);
  const [openLok, setOpenLok] = useState(false);

  const dateRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

        .mf {
          font-family: 'Montserrat', sans-serif;
        }

        @keyframes rotateBg {
          0% {
            background-position: 0% 50%;
          }

          50% {
            background-position: 100% 50%;
          }

          100% {
            background-position: 0% 50%;
          }
        }

        .bg-animated {
          background: linear-gradient(
            135deg,
            #ffffff 0%,
            #FAE4DC 50%,
            #ffffff 100%
          );

          background-size: 400% 400%;
          animation: rotateBg 8s ease infinite;
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          position: absolute;
          right: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        @keyframes dropIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .drop-anim {
          animation: dropIn .15s ease;
        }
      `}</style>

      <Navbar />

      <div className="mf bg-animated min-h-screen w-full flex flex-col items-center px-4 pt-28 pb-12">
        <div className="text-center mb-7">
          <h1 className="text-2xl font-extrabold text-[#4A1020] tracking-tight mb-1">
            Formulir Laporan
          </h1>

          <p className="text-sm text-[#a07878] font-medium">
            Isi formulir di bawah untuk melaporkan ditemukan
          </p>
        </div>

        <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_4px_28px_rgba(107,26,43,0.10)] border border-[rgba(107,26,43,0.08)] px-7 py-8">
          <SectionTitle
            icon={<Package size={15} className="text-[#6B1A2B]" />}
            label="Detail Barang"
          />

          <Field label="Nama Barang">
            <input
              type="text"
              placeholder="Contoh: Airpods Gen 2 casing ungu"
              className="mf w-full text-[12.5px] text-gray-800 placeholder-gray-400 border-2 border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#6F3037] transition"
            />
          </Field>

<Field label="Kategori">
  <div className="relative">
    <button
      type="button"
      onClick={() => {
        setOpenKat(!openKat);
        setOpenLok(false);
      }}
      className={`mf w-full flex items-center justify-between text-[12.5px] border-2 rounded-xl px-3.5 py-2.5 outline-none transition bg-white
        ${openKat ? "border-[#6F3037]" : "border-gray-300"}
        ${kategori ? "text-gray-800" : "text-gray-400"}`}
    >
      <span>{kategori || "Pilih kategori"}</span>

      <ChevronDown
        size={15}
        className={`text-[#6B1A2B] transition-transform duration-200 ${
          openKat ? "rotate-180" : ""
        }`}
      />
    </button>

    {openKat && (
      <ul className="drop-anim absolute z-50 mt-1.5 w-full max-h-52 overflow-y-auto bg-white border-2 border-gray-300 rounded-xl shadow-lg">
        {KATEGORI.map((k) => (
          <li key={k}>
            <button
              type="button"
              onClick={() => {
                setKategori(k);
                setOpenKat(false);
              }}
              className={`mf w-full text-left text-[12.5px] px-4 py-2.5 transition
                ${
                  kategori === k
                    ? "bg-[#FAE4DC] text-[#6F3037] font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              {k}
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
</Field>

          <Field label="Deskripsi">
            <textarea
              placeholder="Jelaskan ciri-ciri barang secara detail (warna, merk, kondisi, dll)"
              rows={4}
              className="mf w-full text-[12.5px] text-gray-800 placeholder-gray-400 border-2 border-gray-300 rounded-xl px-3.5 py-2.5 outline-none resize-y focus:border-[#6F3037] transition leading-relaxed"
            />

            <p className="text-[11px] text-gray-400 mt-1 font-medium">
              *Berikan deskripsi sedetail mungkin untuk memudahkan identifikasi
            </p>
          </Field>

          <Field label="Foto Barang (Wajib)">
            <label
              htmlFor="fileInput"
              className="flex flex-col items-center justify-center gap-2 w-40 h-28 border-2 border-dashed border-gray-300 rounded-xl bg-[#fdf7f5] cursor-pointer hover:border-[#6F3037] hover:bg-[#faeae7] transition"
            >
              <Upload size={24} className="text-[#6B1A2B]" />

              <span className="text-[12px] font-semibold text-[#4A1020]">
                Upload Foto
              </span>
            </label>

            <input
              id="fileInput"
              type="file"
              accept=".jpg,.png"
              className="hidden"
              onChange={handleFileChange}
            />

            {fileName && (
              <p className="text-[11px] text-[#6F3037] mt-1 font-medium">
                {fileName}
              </p>
            )}

            <p className="text-[11px] text-gray-400 mt-1 font-medium">
              *Format: JPG, PNG
            </p>
          </Field>

          <div className="h-px bg-gray-200 my-6" />

          <SectionTitle
            icon={<MapPin size={15} className="text-[#6B1A2B]" />}
            label="Lokasi & Waktu"
          />

<Field label="Lokasi Penemuan">
  <div className="relative">
    <button
      type="button"
      onClick={() => {
        setOpenLok(!openLok);
        setOpenKat(false);
      }}
      className={`mf w-full flex items-center justify-between text-[12.5px] border-2 rounded-xl px-3.5 py-2.5 outline-none transition bg-white
        ${openLok ? "border-[#6F3037]" : "border-gray-300"}
        ${lokasi ? "text-gray-800" : "text-gray-400"}`}
    >
      <span>{lokasi || "Pilih lokasi"}</span>

      <ChevronDown
        size={15}
        className={`text-[#6B1A2B] transition-transform duration-200 ${
          openLok ? "rotate-180" : ""
        }`}
      />
    </button>

    {openLok && (
      <ul className="drop-anim absolute z-50 mt-1.5 w-full max-h-52 overflow-y-auto bg-white border-2 border-gray-300 rounded-xl shadow-lg">
        {LOKASI.map((l) => (
          <li key={l}>
            <button
              type="button"
              onClick={() => {
                setLokasi(l);
                setOpenLok(false);
              }}
              className={`mf w-full text-left text-[12.5px] px-4 py-2.5 transition
                ${
                  lokasi === l
                    ? "bg-[#FAE4DC] text-[#6F3037] font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              {l}
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
</Field>

          <Field label="Tanggal Penemuan">
            <div className="relative">
              <input
                ref={dateRef}
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                onClick={() => dateRef.current?.showPicker?.()}
                className="mf w-full text-[12.5px] text-gray-800 border-2 border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-[#6F3037] transition cursor-pointer"
              />

              <CalendarDays
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B1A2B] pointer-events-none"
              />
            </div>

            <p className="text-[11px] text-gray-400 mt-1 font-medium">
              *Klik untuk memilih tanggal dari kalender
            </p>
          </Field>

          <button
            type="button"
            className="mf w-full mt-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-[13.5px] tracking-wide rounded-xl py-3.5 transition shadow-[0_4px_16px_rgba(37,99,235,0.22)] hover:shadow-[0_6px_22px_rgba(37,99,235,0.32)]"
          >
            Kirim Laporan
          </button>
        </div>
      </div>
    </>
  );
}

function SectionTitle({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="w-7 h-7 bg-[#FAE4DC] rounded-lg flex items-center justify-center shrink-0">
        {icon}
      </div>

      <span className="text-sm font-bold text-[#6F3037]">
        {label}
      </span>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="block text-[12px] font-semibold text-black mb-1.5">
        {label}
      </label>

      {children}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Navbar from "../../Navbar/page";

export default function KategoriBarang() {
  const kategori = [
    {
      nama: "Aksesoris",
      gambar: [
        "/Assets/aksesoris1.jpg",
        "/Assets/aksesoris2.jpg",
        "/Assets/aksesoris3.jpg",
      ],
    },
    {
      nama: "Elektronik",
      gambar: [
        "/Assets/elektronik1.jpg",
        "/Assets/elektronik2.jpg",
        "/Assets/elektronik3.jpg",
      ],
    },
    {
      nama: "Pribadi",
      gambar: [
        "/Assets/pribadi1.jpg",
        "/Assets/pribadi2.jpg",
        "/Assets/pribadi3.jpg",
      ],
    },
    {
      nama: "Pakaian",
      gambar: [
        "/Assets/pakaian1.jpg",
        "/Assets/pakaian2.jpg",
        "/Assets/pakaian3.jpg",
      ],
    },
    {
      nama: "Kunci",
      gambar: [
        "/Assets/kunci1.jpg",
        "/Assets/kunci2.jpg",
        "/Assets/kunci3.jpg",
      ],
    },
    {
      nama: "Lainnya",
      gambar: [
        "/Assets/lainnya1.jpg",
        "/Assets/lainnya2.jpg",
        "/Assets/lainnya3.jpg",
      ],
    },
  ];

  const [activeImages, setActiveImages] = useState(
    kategori.map(() => 0)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImages((prev) =>
        prev.map(
          (item, index) =>
            (item + 1) % kategori[index].gambar.length
        )
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-black">

      <div className="absolute inset-0 bg-[linear-gradient(135deg,_#ffffff,_#FAE4DC,_#ffffff,_#FAE4DC)] bg-[length:400%_400%] animate-[gradientMove_14s_ease_infinite]" />

      <div className="absolute top-[-120px] left-[-80px] w-[320px] h-[320px] bg-[#FAE4DC] rounded-full blur-3xl opacity-40 animate-[floatGlow1_10s_ease-in-out_infinite]" />

      <div className="absolute bottom-[-120px] right-[-80px] w-[320px] h-[320px] bg-white rounded-full blur-3xl opacity-50 animate-[floatGlow2_10s_ease-in-out_infinite]" />

      <img
        src="/ror.png"
        className="absolute top-0 right-0 w-[170px] md:w-[240px] opacity-35 z-0 animate-[float1_8s_ease-in-out_infinite]"
      />

      <img
        src="/ror.png"
        className="absolute bottom-0 left-0 w-[170px] md:w-[240px] opacity-25 rotate-180 z-0 animate-[float2_8s_ease-in-out_infinite]"
      />

      <Navbar />

      <div className="relative z-10 px-4 md:px-10 pb-20">

        <div className="pt-32 text-center">

          <h1 className="text-[32px] md:text-[52px] font-semibold tracking-[-1px] drop-shadow-[0_3px_0_rgba(0,0,0,0.18)]">
            Kategori Barang
          </h1>

          <p className="text-black/60 mt-4 text-sm md:text-base">
            Pilih kategori barang yang ingin Anda laporkan.
          </p>
        </div>

        <div className="max-w-6xl mx-auto mt-14 bg-white/85 backdrop-blur-sm border border-gray-300 rounded-[28px] shadow-[4px_4px_0_rgba(0,0,0,0.10)] p-5 md:p-8">

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">

            {kategori.map((item, index) => (
              <button
                key={index}
                className="relative overflow-hidden rounded-[22px] border border-gray-300 shadow-[4px_4px_0_rgba(0,0,0,0.10)] group hover:-translate-y-1 duration-300"
              >

                <img
                  src={item.gambar[activeImages[index]]}
                  alt={item.nama}
                  className="w-full h-[110px] md:h-[140px] object-cover animate-[softFlicker_1.8s_ease-in-out]"
                />

                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent px-4 py-3">

                  <h1 className="text-white text-sm md:text-base font-semibold">
                    {item.nama}
                  </h1>
                </div>
              </button>
            ))}

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradientMove {
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

        @keyframes floatGlow1 {
          0% {
            transform: translate(0px, 0px);
          }

          50% {
            transform: translate(40px, 20px);
          }

          100% {
            transform: translate(0px, 0px);
          }
        }

        @keyframes floatGlow2 {
          0% {
            transform: translate(0px, 0px);
          }

          50% {
            transform: translate(-40px, -20px);
          }

          100% {
            transform: translate(0px, 0px);
          }
        }

        @keyframes float1 {
          0% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-12px);
          }

          100% {
            transform: translateY(0px);
          }
        }

        @keyframes float2 {
          0% {
            transform: translateY(0px) rotate(180deg);
          }

          50% {
            transform: translateY(12px) rotate(180deg);
          }

          100% {
            transform: translateY(0px) rotate(180deg);
          }
        }

        @keyframes softFlicker {
          0% {
            opacity: 1;
            filter: brightness(1);
          }

          45% {
            opacity: 0.75;
            filter: brightness(1.08);
          }

          55% {
            opacity: 0.9;
            filter: brightness(0.95);
          }

          100% {
            opacity: 1;
            filter: brightness(1);
          }
        }
      `}</style>
    </div>
  );
}
"use client";

export default function AboutUs() {
  return (
    <div id="about" className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center px-6 md:px-16 py-20 md:py-24">

      <h1 className="relative z-10 text-white text-4xl md:text-6xl font-bold mb-12">
        Tentang Kami
      </h1>

      {/* CARD */}
      <div className="relative z-10 bg-[#FFF8F5] rounded-[32px] shadow-[0_16px_40px_rgba(0,0,0,0.10)] p-7 md:p-12 max-w-4xl">

        <p className="text-center text-base md:text-2xl leading-relaxed text-[#2A2A2A]">
          Kami hadir untuk membantu Anda menemukan kembali
          <span className="font-bold"> barang yang hilang </span>
          dengan lebih mudah dan cepat.

          Melalui
          <span className="font-bold"> sistem yang terorganisir, </span>

          kami menghubungkan
          <span className="font-bold"> laporan kehilangan dan barang temuan </span>

          agar dapat kembali ke pemiliknya.

          Kami percaya setiap barang memiliki cerita, dan kami di sini untuk membantu
          <span className="font-bold"> mempertemukannya kembali.</span>
        </p>

        {/* BURUNG */}
        <div className="absolute -bottom-8 -left-4 md:-bottom-12 md:-left-8">

          <img
            src="/Assets/default birdie.png"
            alt="bird"
            className="w-24 md:w-32 drop-shadow-[0_10px_20px_rgba(0,0,0,0.18)]"
          />
        </div>
      </div>
    </div>
  );
}
"use client";

export default function Beranda() {
  return (
    <div
      id="beranda"
      className="relative overflow-hidden min-h-screen px-6 md:px-16 pt-32 md:pt-40"
    >

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">

        {/* TEXT */}
        <div className="max-w-[650px]">

          <h1 className="text-white font-black leading-[0.95] text-[58px] md:text-[88px] tracking-[-2px] [text-shadow:0_8px_18px_rgba(0,0,0,0.25)]">
            Kehilangan
            <br />
            Barang?
          </h1>

          <h2 className="text-[#F08A95] font-bold leading-[1] text-[45px] md:text-[74px] mt-2 tracking-[-2px] [text-shadow:0_6px_12px_rgba(0,0,0,0.18)]">
            Kami bantu temukan
          </h2>

          <p className="text-white/90 text-[16px] md:text-[22px] mt-8 leading-[1.5] max-w-[560px] [text-shadow:0_4px_8px_rgba(0,0,0,0.12)]">
            Kehilangan sesuatu yang berharga? Tenang.
            <span className="font-bold"> Temuin </span>
            siap membantu kamu menemukan dan melaporkan barang hilang dengan mudah agar cepat kembali ke tangan pemiliknya.
          </p>
        </div>

        {/* HERO IMAGE */}
        <div className="relative flex justify-center items-center">

          <div className="absolute w-[280px] h-[280px] md:w-[520px] md:h-[520px] rounded-full bg-[#C26067]/20 blur-[100px]" />

          <div className="relative w-[300px] h-[300px] md:w-[580px] md:h-[580px] flex items-center justify-center">

            <img
              src="/Assets/biurdie.png"
              alt="hero"
              className="w-full object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.35)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
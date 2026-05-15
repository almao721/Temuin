"use client";

export default function Beranda() {
  return (
    <div 
      id="beranda" 
      className="relative min-h-screen flex items-center justify-center px-6 md:px-16 pt-20 overflow-hidden"
    >
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-10 md:gap-20">
        
        {/* SISI KIRI: TEXT (Proporsional sesuai gambar) */}
        <div className="flex-1 text-center md:text-left z-10">
          <h1 className="text-white font-bold leading-tight text-[48px] md:text-[64px] lg:text-[72px] tracking-tight">
            Kehilangan Barang?
          </h1>
          <h2 className="text-[#F08A95] font-semibold text-[32px] md:text-[48px] lg:text-[56px] mt-1 leading-tight">
            Kami bantu temukan
          </h2>
          
          <p className="text-white/80 text-sm md:text-base lg:text-lg mt-6 leading-relaxed max-w-[550px] mx-auto md:mx-0 font-light">
            Kehilangan sesuatu yang berharga? Tenang. <span className="font-bold text-white">Temuin</span> siap 
            membantu kamu menemukan dan melaporkan barang hilang dengan mudah agar cepat kembali ke tangan pemiliknya.
          </p>
        </div>

        {/* SISI KANAN: FOTO (Tanpa ornamen bulat di belakang) */}
        <div className="flex-1 relative flex justify-center items-center max-w-[350px] md:max-w-[550px]">
          {/* Hanya menyisakan sedikit glow lembut agar gambar tidak flat */}
          <div className="absolute w-[70%] h-[70%] bg-[#B84E5C]/10 blur-[120px] rounded-full -z-10" />
          
          <img 
            src="/Assets/biurdie.png" 
            alt="Temuin Hero" 
            className="w-full h-auto object-contain drop-shadow-2xl animate-[float1_12s_ease-in-out_infinite]"
          />
        </div>

      </div>
    </div>
  );
}
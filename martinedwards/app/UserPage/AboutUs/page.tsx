"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AboutUs() {
  const [index, setIndex] = useState(0);

  const cards = [
    {
      id: 1,
      content: (
        <div className="w-full h-full bg-white rounded-[32px] p-8 text-[#46141A] flex flex-col justify-center border border-black/5">
          <p className="text-sm md:text-lg leading-relaxed font-medium">
            Kami hadir untuk membantu Anda menemukan kembali <span className="font-bold">barang yang hilang</span> dengan lebih mudah dan cepat melalui <span className="font-bold">sistem yang terorganisir</span>.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      content: (
        <div className="w-full h-full bg-gradient-to-r from-white to-[#FAE4DC] rounded-[32px] p-8 flex items-center gap-6 border border-black/5">
          <div className="flex-1 text-[#46141A]">
            <h3 className="text-2xl md:text-3xl font-bold">Butuh Bantuan?</h3>
            <p className="opacity-70 text-xs md:text-sm mt-2">Hubungi tim kami untuk solusi cepat dan bantuan lebih lanjut.</p>
          </div>
          <div className="w-[2px] h-16 bg-[#46141A]/10" />
          <a 
            href="https://www.instagram.com/temuin.kita/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative transition-transform duration-300 hover:scale-110 active:scale-95"
          >
            <img src="/Assets/instagram.png" alt="Instagram" className="w-14 h-14 md:w-24 md:h-24 drop-shadow-lg" />
          </a>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % cards.length);
    }, 4500); 
    return () => clearInterval(timer);
  }, [cards.length]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x < -50) {
      setIndex((prev) => (prev + 1) % cards.length);
    } else if (info.offset.x > 50) {
      setIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }
  };

  return (
    <div id="about" className="relative py-24 flex flex-col items-center justify-center overflow-hidden">
      <h2 className="text-4xl md:text-6xl font-semibold mb-16 tracking-tighter italic uppercase">Tentang Kami</h2>
      <div className="relative w-[340px] h-[260px] md:w-[600px] md:h-[300px]">
        {cards.map((card, i) => {
          const isActive = i === index;
          
          return (
            <motion.div
              key={card.id}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              initial={false}
              animate={{
                x: isActive ? 0 : 15,
                y: isActive ? 0 : 15,
                scale: isActive ? 1 : 0.95,
                opacity: isActive ? 1 : 0.4,
                zIndex: isActive ? 20 : 10,
              }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 25,
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing shadow-[20px_20px_0px_rgba(0,0,0,0.25)] rounded-[32px] bg-white"
            >
              {card.content}
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-3 mt-16">
        {cards.map((_, i) => (
          <button 
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-10 bg-[#FAE4DC]" : "w-2 bg-white/20"}`} 
          />
        ))}
      </div>
    </div>
  );
}
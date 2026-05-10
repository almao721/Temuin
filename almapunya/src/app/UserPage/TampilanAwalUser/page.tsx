"use client";

import React from "react";
import Navbar from "../Navbar/page";
import Beranda from "./Beranda/page";
import Form from "./FormPage/page";
import TentangKami from "./AboutUs/page";

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_bottom,_#561C24_0%,_#8B3039_20%,_#B84E5C_40%,_#7A2430_75%,_#561C24_100%)] bg-[length:100%_200%] animate-[bgMove_18s_ease-in-out_infinite]" />

      {/* TOP LIGHT */}
      <div className="absolute top-[-250px] left-[-180px] w-[700px] h-[700px] rounded-full bg-[#C26067]/30 blur-[180px] animate-[float1_15s_ease-in-out_infinite]" />

      {/* RIGHT LIGHT */}
      <div className="absolute top-[10%] right-[-250px] w-[750px] h-[750px] rounded-full bg-[#8B3039]/30 blur-[180px] animate-[float2_18s_ease-in-out_infinite]" />

      {/* FORM AREA */}
      <div className="absolute top-[34%] left-1/2 -translate-x-1/2 w-[1200px] h-[750px] rounded-full bg-[#FAE4DC] blur-[180px] z-0" />

      {/* BOTTOM LIGHT */}
      <div className="absolute bottom-[-250px] left-[10%] w-[750px] h-[750px] rounded-full bg-[#B84E5C]/25 blur-[180px] animate-[float1_18s_ease-in-out_infinite]" />

      {/* LEFT TOP */}
      <img
        src="/ror.png"
        alt="decor"
        className="absolute top-[-40px] left-[-40px] w-[220px] md:w-[300px] opacity-40 z-0 animate-[float1_12s_ease-in-out_infinite]"
      />

      {/* RIGHT BOTTOM */}
      <img
        src="/ror.png"
        alt="decor"
        className="absolute bottom-[20px] right-[-50px] w-[220px] md:w-[300px] opacity-40 rotate-180 z-0 animate-[float2_14s_ease-in-out_infinite]"
      />

      {/* LEFT BOTTOM */}
      <img
        src="/ror.png"
        alt="decor"
        className="absolute bottom-[-60px] left-[-60px] w-[180px] md:w-[250px] opacity-30 z-0 animate-[float1_16s_ease-in-out_infinite]"
      />

      {/* CONTENT */}
      <div className="relative z-10">
        <Navbar />
        <Beranda />
        <Form />
        <TentangKami />
      </div>

      {/* STYLE */}
      <style>{`
        @keyframes bgMove {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 0% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }

        @keyframes float1 {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }

        @keyframes float2 {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(20px) translateX(-10px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }
      `}</style>
    </div>
  );
}
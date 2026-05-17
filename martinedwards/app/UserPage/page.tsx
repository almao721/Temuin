"use client";

import { useEffect, useState } from "react";
import UserShell from "./components/UserShell";
import Beranda from "./Beranda/page";
import FormPage from "./FormPage/page";
import AboutUs from "./AboutUs/page";

export default function UserPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true); // Tambah status checking

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    if (status === "true") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setIsChecking(false); // Selesai cek
  }, []);

  return (
    <UserShell isLoggedIn={isLoggedIn}>
      <section id="beranda">
        <Beranda />   {/* Prop isLoggedIn dihapus */}
      </section>

      <section id="form" className="relative">
        {/* BLUR BULAT #FAE4DC */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FAE4DC] opacity-20 blur-[120px] rounded-full pointer-events-none z-0" />
        
        <div className="relative z-10">
          {/* Burung di dalam FormPage hanya muncul jika isChecking selesai dan isLoggedIn true */}
          {!isChecking && <FormPage isLoggedIn={isLoggedIn} />}
        </div>
      </section>

      <section id="about">
        <AboutUs />   {/* Prop isLoggedIn dihapus */}
      </section>
    </UserShell>
  );
}
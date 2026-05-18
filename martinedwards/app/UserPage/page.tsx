"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import UserShell from "./components/UserShell";
import Beranda from "./Beranda/page";
import FormPage from "./FormPage/page";
import AboutUs from "./AboutUs/page";

export default function UserPage() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === "undefined") {
        setIsLoggedIn(false);
        setIsChecking(false);
        return;
      }

      const status = localStorage.getItem("isLoggedIn");
      const userData = localStorage.getItem("user");

      if (status !== "true" || !userData) {
        setIsLoggedIn(false);
        setIsChecking(false);
        return;
      }

      try {
        const user = JSON.parse(userData);
        const role = String(user?.role || "").toLowerCase();

        if (role === "admin" || role === "pegawai") {
          router.replace("/AdminPage");
          return;
        }

        setIsLoggedIn(true);
      } catch (error) {
        console.error("Gagal membaca user:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  // LOADING
  if (isChecking) {
    return null;
  }

  return (
    <UserShell isLoggedIn={isLoggedIn}>

      <section id="beranda">
        <Beranda />
      </section>

      <section id="form" className="relative">

        {/* BLUR BULAT #FAE4DC */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FAE4DC] opacity-20 blur-[120px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10">

          {/* FORM */}
          <FormPage isLoggedIn={isLoggedIn} />

        </div>
      </section>

      <section id="about">
        <AboutUs />
      </section>

    </UserShell>
  );
}
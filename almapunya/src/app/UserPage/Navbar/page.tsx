"use client";

import {
  Bell,
  Box,
  CircleAlert,
  House,
  User,
} from "lucide-react";

import {
  useRouter,
  usePathname,
} from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const pathname = usePathname();

  // AUTO LOGIN CHECK
  const isLogin =
    pathname === "/TampilanAwalUser";

  // SCROLL FUNCTION
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <div className="hidden md:flex fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full justify-center px-5">

        <div className="w-full max-w-6xl bg-[#5A1520]/90 backdrop-blur-sm rounded-full px-7 py-3 flex items-center justify-between shadow-lg">

          {/* LOGO */}
          <div className="flex items-center">
            <img
              src="/Assets/logo.png"
              alt="logo"
              className="w-[50px] object-contain"
            />
          </div>

          {/* MENU */}
          <div className="flex items-center gap-10 text-white text-[14px] font-medium">

            <button
              onClick={() => scrollToSection("beranda")}
              className="cursor-pointer hover:text-[#F2B6BE] hover:scale-105 duration-300"
            >
              Beranda
            </button>

            <button
              onClick={() => scrollToSection("form")}
              className="cursor-pointer hover:text-[#F2B6BE] hover:scale-105 duration-300"
            >
              Kehilangan/Menemukan
            </button>

            <button
              onClick={() => scrollToSection("about")}
              className="cursor-pointer hover:text-[#F2B6BE] hover:scale-105 duration-300"
            >
              Tentang Kami
            </button>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* NOTIF */}
            <Bell
              className="text-white cursor-pointer hover:text-[#F2B6BE] hover:scale-110 duration-300"
              size={18}
            />

            <div className="w-[1px] h-6 bg-white/40" />

            {/* LOGIN / USER */}
            {isLogin ? (
              <button
                onClick={() => router.push("/Profile")}
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center cursor-pointer hover:scale-105 duration-300"
              >

                <User
                  className="text-[#5A1520]"
                  size={18}
                  fill="#5A1520"
                />
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="bg-white text-[#5A1520] px-6 py-2 rounded-full text-sm font-semibold hover:scale-105 duration-300"
              >
                Masuk
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE NAVBAR */}
      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[92%]">

        <div className="bg-[#5A1520]/90 backdrop-blur-sm rounded-full px-6 py-4 flex items-center justify-between shadow-xl">

          {/* HOME */}
          <button onClick={() => scrollToSection("beranda")}>
            <House
              className="text-white hover:text-[#F2B6BE] hover:scale-110 duration-300"
              size={22}
            />
          </button>

          {/* FORM */}
          <button onClick={() => scrollToSection("form")}>
            <Box
              className="text-white hover:text-[#F2B6BE] hover:scale-110 duration-300"
              size={22}
            />
          </button>

          {/* ABOUT */}
          <button onClick={() => scrollToSection("about")}>
            <CircleAlert
              className="text-white hover:text-[#F2B6BE] hover:scale-110 duration-300"
              size={22}
            />
          </button>

          {/* NOTIF */}
          <Bell
            className="text-white hover:text-[#F2B6BE] hover:scale-110 duration-300"
            size={22}
          />

          {/* LOGIN / USER */}
          {isLogin ? (
            <button
              onClick={() => router.push("/Profile")}
            >
              <User
                className="text-white hover:text-[#F2B6BE] hover:scale-110 duration-300"
                size={22}
                fill="white"
              />
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="text-white hover:text-[#F2B6BE] hover:scale-110 duration-300"
            >
              <User size={22} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
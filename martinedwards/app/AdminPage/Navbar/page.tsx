"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  House,
  SearchX,
  SearchCheck,
  PencilLine,
  UserRound,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Gagal parse user data", e);
      }
    }
  }, []);

  const menus = [
    {
      name: "Beranda",
      icon: House,
      href: "/AdminPage",
    },
    {
      name: "Kehilangan",
      icon: SearchX,
      href: "/AdminPage/laporan-kehilangan",
    },
    {
      name: "Ditemukan",
      icon: SearchCheck,
      href: "/AdminPage/laporan-ditemukan",
    },
    {
      name: "Edit Laporan",
      icon: PencilLine,
      href: "/AdminPage/Kategori",
    },
    {
      name: "Kelola Pengguna",
      icon: UserRound,
      href: "/AdminPage/Pengguna",
    },
  ];

  const isMenuActive = (href: string) => {
    if (href === "/AdminPage") {
      return pathname === "/AdminPage";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed left-4 top-4 z-50 rounded-xl bg-white p-2.5 shadow-lg duration-300 hover:scale-110 active:scale-95 lg:hidden"
        >
          <Menu size={22} className="text-[#8D303C]" />
        </button>
      )}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {open && (
        <button
          onClick={() => setOpen(false)}
          className="fixed left-[272px] top-5 z-[60] rounded-full bg-white p-2.5 shadow-xl duration-300 hover:scale-110 hover:bg-gray-100 active:scale-95 lg:hidden"
        >
          <X size={20} className="text-[#8D303C]" />
        </button>
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[260px] rounded-r-[30px] bg-white font-sans shadow-xl duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-r-[30px]">
          <div className="relative flex items-center justify-center px-5 py-6">
            <Image
              src="/Assets/logoAdmin.png"
              alt="Logo"
              width={120}
              height={105}
              className="object-contain"
            />
          </div>

          <div className="mx-5 mb-7 h-[2px] rounded-full bg-[#8D303C]/20" />

          <nav className="flex flex-1 flex-col gap-4 px-4">
            {menus.map((item) => {
              const Icon = item.icon;
              const isActive = isMenuActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-[13px] font-medium tracking-wide duration-300 hover:scale-[1.05] active:scale-95 ${
                    isActive
                      ? "bg-[#8D303C] text-white shadow-md"
                      : "text-[#561C24] hover:bg-[#8D303C]/20 hover:text-[#481920]"
                  }`}
                >
                  <Icon size={18} strokeWidth={2} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-4 pb-5">
            <div className="mb-5 h-[2px] rounded-full bg-[#8D303C]/20" />

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3.5 shadow-sm duration-300 hover:scale-[1.03] hover:shadow-md">
              <div className="flex items-center gap-3.5">
                <Image
                  src="/Assets/martinicon.jpg"
                  alt="Bu Yuni"
                  width={48}
                  height={48}
                  className="h-[48px] w-[48px] shrink-0 rounded-full border-2 border-[#8D303C] object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8D303C]/70">
                    Admin
                  </p>

                  <h3 className="truncate text-[13px] font-semibold tracking-wide text-gray-900">
                    Bu Yuni
                  </h3>

                  <p className="truncate text-[11px] font-medium text-gray-500">
                    Administrator
                  </p>
                </div>
              </div>

              {/* TOMBOL LOGOUT */}
              <button
                onClick={handleLogout}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#8D303C] px-3 py-2.5 text-xs font-medium tracking-wide text-white duration-300 hover:scale-[1.04] hover:bg-[#742630] hover:shadow-md active:scale-95"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
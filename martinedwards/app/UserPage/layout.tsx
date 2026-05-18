"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiMe } from "@/app/lib/api";

export default function UserPageLayout({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyUserPage = async () => {
      if (typeof window === "undefined") return setIsChecking(false);

      const token = localStorage.getItem("token");
      if (!token) {
        setIsChecking(false);
        return;
      }

      try {
        const res = await apiMe();
        const role = String(res.data?.role || "").toLowerCase();
        if (role === "admin" || role === "pegawai") {
          router.replace("/AdminPage");
          return;
        }
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
      } finally {
        setIsChecking(false);
      }
    };

    verifyUserPage();
  }, [router]);

  if (isChecking) return null;

  return <>{children}</>;
}

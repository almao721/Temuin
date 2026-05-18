"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAdmin = async () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.replace("/admin-login");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Token invalid");
        const data = await res.json();
        const role = String(data?.data?.user?.role || "").toLowerCase();
        if (role !== "admin" && role !== "pegawai") {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          router.replace("/admin-login");
          return;
        }
      } catch {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        router.replace("/admin-login");
        return;
      } finally {
        setIsChecking(false);
      }
    };

    verifyAdmin();
  }, [router]);

  if (isChecking) return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F0F0]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#651A27] border-t-transparent" />
    </div>
  );

  return <>{children}</>;
}

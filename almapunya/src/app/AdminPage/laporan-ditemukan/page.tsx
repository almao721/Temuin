"use client";

import Navbar from "../Navbar/page";
import AdminShell from "../components/AdminShell";
import LaporanDitemukan from "../components/LaporanDitemukan";

export default function Page() {
  return (
    <AdminShell>
      <Navbar />
      <LaporanDitemukan />
    </AdminShell>
  );
}
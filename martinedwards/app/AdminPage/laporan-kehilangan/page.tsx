"use client";

import AdminShell from "../components/AdminShell";
import LaporanKehilangan from "../components/LaporanKehilangan";

export default function Page() {
  return (
    <AdminShell>
      <LaporanKehilangan />
    </AdminShell>
  );
}
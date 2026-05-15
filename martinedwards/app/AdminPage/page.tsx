"use client";

import AdminShell from "./components/AdminShell";
import ControlCenter from "./components/ControlCenter";

export default function Page() {
  return (
    <AdminShell>
      <ControlCenter />
    </AdminShell>
  );
}
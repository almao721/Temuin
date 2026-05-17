"use client";

import { useEffect, useState } from "react";
import { apiHealth } from "./lib/api";

export default function Home() {

  const [status, setStatus] = useState("Menghubungkan ke backend...");

  // DATA USER LOGIN
  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    // TEST BACKEND
    const testApi = async () => {
      try {

        const data = await apiHealth();

        console.log(data);

        setStatus("✅ Backend berhasil terhubung");

      } catch (error) {

        console.error(error);

        setStatus("❌ Backend gagal terhubung");
      }
    };

    testApi();

    // AMBIL USER DARI LOCALSTORAGE
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

  }, []);

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Arial",
      background: "#561C24",
      color: "white"
    }}>

      <h1 style={{
        fontSize: "40px",
        marginBottom: "20px"
      }}>
        TEMUIN
      </h1>

      <p style={{
        fontSize: "20px"
      }}>
        Website Lost & Found
      </p>

      <p style={{
        marginTop: "20px"
      }}>
        {status}
      </p>

      {/* PROFILE USER */}
      {user && (
        <div style={{
          marginTop: "40px",
          background: "white",
          color: "black",
          padding: "30px",
          borderRadius: "20px",
          width: "320px"
        }}>

          <h2 style={{
            textAlign: "center",
            marginBottom: "20px"
          }}>
            Profile Pengguna
          </h2>

          <p>
            <b>User ID:</b> {user.user_id}
          </p>

          <p style={{ marginTop: "10px" }}>
            <b>NIS / NIP:</b> {user.nis_nip}
          </p>

          <p style={{ marginTop: "10px" }}>
            <b>Role:</b> {user.role}
          </p>

        </div>
      )}

    </main>
  );
}
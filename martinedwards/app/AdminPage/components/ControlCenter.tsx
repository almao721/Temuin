"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Users, Search, PackageCheck } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Fallback jika API belum ada data
const emptyMonthly = [
  { month: 'Jan', kehilangan: 0, ditemukan: 0 },
  { month: 'Feb', kehilangan: 0, ditemukan: 0 },
  { month: 'Mar', kehilangan: 0, ditemukan: 0 },
  { month: 'Apr', kehilangan: 0, ditemukan: 0 },
  { month: 'Mei', kehilangan: 0, ditemukan: 0 },
  { month: 'Jun', kehilangan: 0, ditemukan: 0 },
  { month: 'Jul', kehilangan: 0, ditemukan: 0 },
  { month: 'Agu', kehilangan: 0, ditemukan: 0 },
  { month: 'Sep', kehilangan: 0, ditemukan: 0 },
  { month: 'Okt', kehilangan: 0, ditemukan: 0 },
  { month: 'Nov', kehilangan: 0, ditemukan: 0 },
  { month: 'Des', kehilangan: 0, ditemukan: 0 },
];

export default function ControlCenter() {
  const [stats, setStats] = useState({
    pengguna_aktif: 0,
    sum_kehilangan: 0,
    sum_ditemukan: 0,
  });
  const [monthlyData, setMonthlyData] = useState(emptyMonthly);
  const [loadingStats, setLoadingStats]   = useState(true);
  const [loadingGrafik, setLoadingGrafik] = useState(true);

  const getToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  // ── Fetch statistik (StatBox) ──────────────────────────────────────────────
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getToken();
        const res  = await fetch(`${API_BASE}/api/admin/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success && json.data) {
          setStats({
            pengguna_aktif: json.data.pengguna_aktif ?? 0,
            sum_kehilangan: json.data.sum_kehilangan ?? 0,
            sum_ditemukan:  json.data.sum_ditemukan  ?? 0,
          });
        }
      } catch (err) {
        console.error('[ControlCenter] fetchStats gagal:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  // ── Fetch grafik dua garis ─────────────────────────────────────────────────
  useEffect(() => {
    const fetchGrafik = async () => {
      try {
        const token = getToken();
        const tahun = new Date().getFullYear();
        const res  = await fetch(
          `${API_BASE}/api/admin/dashboard/grafik?tahun=${tahun}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setMonthlyData(json.data);
        }
      } catch (err) {
        console.error('[ControlCenter] fetchGrafik gagal:', err);
      } finally {
        setLoadingGrafik(false);
      }
    };

    fetchGrafik();
  }, []);

  // ── Format angka (1284 → 1,284) ───────────────────────────────────────────
  const fmt = (n: number) => n.toLocaleString('id-ID');

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative mx-auto min-h-[760px] w-full max-w-7xl pb-10 px-4">

      {/* Floating balls — tidak berubah */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <span key={i} className={`floating-ball ball-${i + 1}`}></span>
        ))}
      </div>

      {/* Hero card */}
      <div className="relative z-10 overflow-hidden rounded-[28px] border border-white/70 bg-white/65 px-6 py-8 shadow-xl backdrop-blur-xl md:px-10">
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-[#F8E9EB]/80 to-[#8D303C]/35"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#8D303C] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white shadow-md">
            <ShieldCheck size={13} />
            Admin Dashboard
          </div>
          <h1 className="text-3xl font-bold tracking-[0.18em] text-[#2F2F2F] md:text-4xl">
            CONTROL CENTER
          </h1>
          <p className="mt-3 text-sm font-medium leading-relaxed text-[#4a3b3d] md:text-[15px]">
            Pantau perbandingan laporan kehilangan dan temuan secara real-time setiap bulannya.
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* StatBox kolom kiri */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <StatBox
            title="Total Pengguna"
            count={loadingStats ? '...' : fmt(stats.pengguna_aktif)}
            icon={<Users size={20} />}
          />
          <StatBox
            title="Laporan Kehilangan"
            count={loadingStats ? '...' : fmt(stats.sum_kehilangan)}
            icon={<Search size={20} />}
          />
          <StatBox
            title="Barang Ditemukan"
            count={loadingStats ? '...' : fmt(stats.sum_ditemukan)}
            icon={<PackageCheck size={20} />}
          />
        </div>

        {/* Grafik kolom kanan */}
        <div className="lg:col-span-8 rounded-[28px] border border-white/70 bg-white/70 p-6 shadow-2xl backdrop-blur-xl flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-lg font-bold text-[#2F2F2F]">Analisis Laporan</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                Tren Bulanan {new Date().getFullYear()}
              </p>
            </div>
          </div>

          <div className="h-[300px] w-full mt-4">
            {loadingGrafik ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8D303C] border-t-transparent" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '15px', border: 'none',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Line
                    name="Kehilangan"
                    type="monotone"
                    dataKey="kehilangan"
                    stroke="#8D303C"
                    strokeWidth={1.5}
                    dot={{ r: 4, fill: "#8D303C", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    name="Ditemukan"
                    type="monotone"
                    dataKey="ditemukan"
                    stroke="#4B5563"
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    dot={{ r: 4, fill: "#4B5563", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Animasi floating balls — identik dengan aslinya */}
      <style>{`
        .floating-ball {
          position: absolute;
          border-radius: 9999px;
          background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.95), rgba(141, 48, 60, 0.52));
          box-shadow: 0 20px 60px rgba(141, 48, 60, 0.22);
          backdrop-filter: blur(12px);
        }
        .ball-1  { width: 80px;  height: 80px;  top: 25px;    right: 8%;  animation: floatBall1  5s   ease-in-out infinite alternate; }
        .ball-2  { width: 48px;  height: 48px;  top: 210px;   left: 16%;  animation: floatBall2  4.5s ease-in-out infinite alternate; }
        .ball-3  { width: 115px; height: 115px; top: 290px;   right: 16%; animation: floatBall3  6s   ease-in-out infinite alternate; }
        .ball-4  { width: 38px;  height: 38px;  top: 390px;   left: 7%;   animation: floatBall4  4s   ease-in-out infinite alternate; }
        .ball-5  { width: 150px; height: 150px; top: 360px;   right: 4%;  animation: floatBall5  6.5s ease-in-out infinite alternate; }
        .ball-6  { width: 60px;  height: 60px;  top: 470px;   left: 34%;  animation: floatBall6  5s   ease-in-out infinite alternate; }
        .ball-7  { width: 95px;  height: 95px;  top: 120px;   left: 42%;  animation: floatBall7  7s   ease-in-out infinite alternate; }
        .ball-8  { width: 32px;  height: 32px;  top: 520px;   left: 55%;  animation: floatBall8  3.8s ease-in-out infinite alternate; }
        .ball-9  { width: 125px; height: 125px; bottom: 90px; left: 10%;  animation: floatBall9  6s   ease-in-out infinite alternate; }
        .ball-10 { width: 70px;  height: 70px;  bottom: 150px;right: 28%; animation: floatBall10 4.8s ease-in-out infinite alternate; }
        .ball-11 { width: 170px; height: 170px; bottom: -45px;right: 5%;  animation: floatBall11 7s   ease-in-out infinite alternate; }
        .ball-12 { width: 45px;  height: 45px;  bottom: 25px; left: 48%;  animation: floatBall12 4s   ease-in-out infinite alternate; }

        @keyframes floatBall1  { from { transform: translate(0,0) scale(1); } to { transform: translate(-45px, 55px) scale(1.12); } }
        @keyframes floatBall2  { from { transform: translate(0,0) scale(1); } to { transform: translate( 55px,-35px) scale(0.92); } }
        @keyframes floatBall3  { from { transform: translate(0,0) scale(1); } to { transform: translate(-75px,-45px) scale(1.08); } }
        @keyframes floatBall4  { from { transform: translate(0,0) scale(1); } to { transform: translate( 40px, 45px) scale(1.18); } }
        @keyframes floatBall5  { from { transform: translate(0,0) scale(1); } to { transform: translate(-80px, 60px) scale(1.1);  } }
        @keyframes floatBall6  { from { transform: translate(0,0) scale(1); } to { transform: translate( 65px,-50px) scale(0.9);  } }
        @keyframes floatBall7  { from { transform: translate(0,0) scale(1); } to { transform: translate(-55px, 45px) scale(1.15); } }
        @keyframes floatBall8  { from { transform: translate(0,0) scale(1); } to { transform: translate( 35px,-45px) scale(1.25); } }
        @keyframes floatBall9  { from { transform: translate(0,0) scale(1); } to { transform: translate( 80px,-55px) scale(1.12); } }
        @keyframes floatBall10 { from { transform: translate(0,0) scale(1); } to { transform: translate(-70px, 45px) scale(0.9);  } }
        @keyframes floatBall11 { from { transform: translate(0,0) scale(1); } to { transform: translate(-90px,-70px) scale(1.08); } }
        @keyframes floatBall12 { from { transform: translate(0,0) scale(1); } to { transform: translate( 45px,-60px) scale(1.25); } }
      `}</style>
    </div>
  );
}

// ── StatBox identik dengan aslinya ────────────────────────────────────────────
function StatBox({ title, count, icon }: { title: string; count: string; icon: any }) {
  return (
    <div className="flex flex-1 items-center justify-between rounded-[24px] border border-white/70 bg-white/70 p-5 shadow-lg backdrop-blur-xl transition-all hover:scale-[1.02]">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{title}</p>
        <p className="text-xl font-extrabold text-[#2F2F2F]">{count}</p>
      </div>
      <div className="rounded-xl bg-[#F8E9EB] p-2.5 text-[#8D303C]">
        {icon}
      </div>
    </div>
  );
}
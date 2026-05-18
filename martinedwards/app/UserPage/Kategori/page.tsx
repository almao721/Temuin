"use client";

import { useRouter } from 'next/navigation';
import UserShell from '../components/UserShell';

export default function Page() {
  const router = useRouter();

  return (
    <UserShell isLoggedIn={true}>
      <div className='min-h-screen bg-white py-16 px-4 text-center'>
        <div className='mx-auto max-w-3xl rounded-[32px] border border-gray-200 bg-[#F8FAFC] p-10 shadow-lg'>
          <h1 className='mb-4 text-3xl font-bold text-[#46141A]'>Kategori</h1>
          <p className='mb-6 text-base text-gray-700'>Halaman kategori akan ditampilkan di menu utama. Silakan kembali ke beranda untuk memilih kategori laporan.</p>
          <button
            type='button'
            onClick={() => router.push('/UserPage')}
            className='rounded-2xl bg-[#46141A] px-6 py-3 text-sm font-semibold text-white hover:bg-black'
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </UserShell>
  );
}

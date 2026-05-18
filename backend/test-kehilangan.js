// Test persis seperti yang dikirim FormKehilangan
async function test() {
  // Login sebagai siswa
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nis_nip: '544241097', password: 'siswa123' })
  });
  const loginData = await loginRes.json();
  if (!loginData.success) {
    console.log('Login gagal:', loginData.message);
    return;
  }
  const token = loginData.data.token;
  console.log('✅ Login berhasil sebagai siswa');

  // Kirim laporan kehilangan - persis seperti FormKehilangan
  const payload = {
    kategori_name: "elektronik",                    // <- nama, bukan ID
    barang_tipe: "HP",
    warna_barang: "putih",
    brand_merk: "iPhone 14",
    keterangan_lainnya: JSON.stringify({
      nama: "HP",
      merek: "iPhone 14",
      warna: "putih",
      status: "Ya",
      lokasi: "Gedung B Lantai 1",
      wallpaper: "Foto pantai"
    }),
    waktu_insiden: new Date().toISOString(),
    lokasi_terakhir: "Gedung B Lantai 1"             // <- nama, bukan ID
  };

  console.log('\n📤 Payload yang dikirim:', JSON.stringify(payload, null, 2));

  const res = await fetch('http://localhost:5000/api/laporan/kehilangan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  console.log('\n📋 Response:', JSON.stringify(data, null, 2));
  console.log(res.ok ? '✅ BERHASIL!' : '❌ GAGAL!');
}
test().catch(console.error);

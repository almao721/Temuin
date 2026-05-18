async function checkLaporanData() {
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nis_nip: '123456', password: 'admin123' })
  });
  const { data } = await loginRes.json();
  const headers = { 'Authorization': `Bearer ${data.token}` };

  const res = await fetch('http://localhost:5000/api/admin/laporan/kehilangan?page=1&limit=5', { headers });
  const json = await res.json();
  
  console.log('📋 LAPORAN KEHILANGAN - Data Baru:\n');
  (json.data || []).forEach(r => {
    console.log(`ID ${r.id}:`);
    console.log(`  barang           : ${r.barang}`);
    console.log(`  warna_barang     : ${r.warna_barang}`);
    console.log(`  merek            : ${r.merek}`);
    console.log(`  lokasi_terakhir  : ${r.lokasi_terakhir}`);
    console.log(`  pelapor          : ${r.pelapor}`);
    console.log(`  status           : ${r.status}`);
    console.log('');
  });
  if (!json.data?.length) {
    console.log('Raw response:', JSON.stringify(json).substring(0, 500));
  }
}
checkLaporanData().catch(console.error);

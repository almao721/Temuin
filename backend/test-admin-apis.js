async function testAdminAPIs() {
  // Login first
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nis_nip: '123456', password: 'admin123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.data.token;
  console.log('✅ Login OK\n');

  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  // Test dashboard stats
  const statsRes = await fetch('http://localhost:5000/api/admin/dashboard/stats', { headers });
  const stats = await statsRes.json();
  console.log('📊 Dashboard Stats:', JSON.stringify(stats, null, 2));

  // Test siswa list
  const siswaRes = await fetch('http://localhost:5000/api/admin/siswa?page=1&limit=10', { headers });
  const siswa = await siswaRes.json();
  console.log('\n👥 Siswa List:', JSON.stringify(siswa, null, 2));

  // Test laporan kehilangan
  const kehRes = await fetch('http://localhost:5000/api/admin/laporan/kehilangan?page=1&limit=10', { headers });
  const keh = await kehRes.json();
  console.log('\n📋 Laporan Kehilangan:', JSON.stringify(keh, null, 2));

  // Test laporan penemuan
  const penRes = await fetch('http://localhost:5000/api/admin/laporan/penemuan?page=1&limit=10', { headers });
  const pen = await penRes.json();
  console.log('\n📋 Laporan Penemuan:', JSON.stringify(pen, null, 2));

  // Test kategori
  const katRes = await fetch('http://localhost:5000/api/admin/kategori', { headers });
  const kat = await katRes.json();
  console.log('\n📂 Kategori:', JSON.stringify(kat, null, 2));

  // Test lokasi
  const lokRes = await fetch('http://localhost:5000/api/admin/lokasi', { headers });
  const lok = await lokRes.json();
  console.log('\n📍 Lokasi:', JSON.stringify(lok, null, 2));
}
testAdminAPIs().catch(console.error);

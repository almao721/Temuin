async function quickTest() {
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nis_nip: '123456', password: 'admin123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.data.token;
  const headers = { 'Authorization': `Bearer ${token}` };

  // Siswa
  const siswaRes = await fetch('http://localhost:5000/api/admin/siswa?page=1&limit=50', { headers });
  const siswa = await siswaRes.json();
  console.log('👥 SISWA (', siswa.data?.length, 'rows):');
  siswa.data?.forEach(u => console.log(`  - user_id:${u.user_id} nis_nip:${u.nis_nip} role:${u.role} active:${u.is_active}`));

  // Laporan Kehilangan
  const kehRes = await fetch('http://localhost:5000/api/admin/laporan/kehilangan?page=1&limit=5', { headers });
  const keh = await kehRes.json();
  console.log('\n📋 LAPORAN KEHILANGAN (total:', keh.pagination?.total, '):');
  keh.data?.slice(0,3).forEach(r => console.log(`  - id:${r.id} barang:${r.barang} status:${r.status} pelapor:${r.pelapor}`));

  // Laporan Penemuan
  const penRes = await fetch('http://localhost:5000/api/admin/laporan/penemuan?page=1&limit=5', { headers });
  const pen = await penRes.json();
  console.log('\n📋 LAPORAN PENEMUAN (total:', pen.pagination?.total, '):');
  pen.data?.slice(0,3).forEach(r => console.log(`  - id:${r.id} barang:${r.barang || r.nama_barang} status:${r.status}`));

  console.log('\n✅ Semua endpoint berhasil!');
}
quickTest().catch(e => console.error('❌', e.message));

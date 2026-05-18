const db = require('./src/config/db');
async function check() {
  const [rows] = await db.execute('SELECT id, laporan_id, nama_barang, foto_barang, deskripsi FROM laporan_penemuan ORDER BY id DESC LIMIT 5');
  console.log('laporan_penemuan foto_barang:');
  rows.forEach(r => console.log(`  id:${r.id} laporan_id:${r.laporan_id} nama:${r.nama_barang} foto:${r.foto_barang}`));
  process.exit(0);
}
check().catch(e => { console.error(e.message); process.exit(1); });

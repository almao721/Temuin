const db = require('./src/config/db');
async function test() {
  try {
    const tables = ['user', 'laporan', 'laporan_kehilangan', 'laporan_penemuan', 'kategori', 'lokasi', 'kuisioner_laporan'];
    for (const t of tables) {
      const [cols] = await db.query(`SHOW COLUMNS FROM ${t}`);
      console.log(`\n=== ${t} ===`);
      cols.forEach(c => console.log(`  ${c.Field} (${c.Type}) ${c.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${c.Key} ${c.Default || ''}`));
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
test();

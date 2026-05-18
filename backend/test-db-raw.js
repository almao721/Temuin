const db = require('./src/config/db');
async function check() {
  // Check kuisioner_laporan table
  const [kuis] = await db.execute('SELECT * FROM kuisioner_laporan ORDER BY id DESC LIMIT 5');
  console.log('kuisioner_laporan:', JSON.stringify(kuis, null, 2));

  // Check laporan_kehilangan table  
  const [keh] = await db.execute('SELECT * FROM laporan_kehilangan ORDER BY id DESC LIMIT 5');
  console.log('\nlaporan_kehilangan:', JSON.stringify(keh, null, 2));

  process.exit(0);
}
check().catch(e => { console.error(e); process.exit(1); });

const db = require('./src/config/db');

async function checkColumns() {
  try {
    const [rows] = await db.query('SHOW COLUMNS FROM laporan_kehilangan');
    console.log('Columns in laporan_kehilangan:', rows);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
checkColumns();

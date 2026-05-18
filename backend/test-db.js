const db = require('./src/config/db');

async function test() {
  try {
    const [rows] = await db.query('SHOW TABLES');
    console.log('Tables:', rows);
    process.exit(0);
  } catch (err) {
    console.error('Error connecting to DB:', err);
    process.exit(1);
  }
}
test();

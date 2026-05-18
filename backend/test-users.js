const db = require('./src/config/db');
async function test() {
  const [rows] = await db.query('SELECT * FROM user');
  console.log(rows);
  process.exit(0);
}
test();

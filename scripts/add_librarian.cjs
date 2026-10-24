const path = require('path');
const mysql = require(path.join(__dirname, '../server/node_modules/mysql2/promise'));

async function run() {
  const db = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Raj@2026',
    database: 'college_erp'
  });
  const [libs] = await db.execute('SELECT * FROM librarian WHERE staff_id = 23');
  if (libs.length === 0) {
    await db.execute('INSERT INTO librarian (staff_id, email, phone, status) VALUES (?, ?, ?, ?)', [
      23,
      'librarian@campus.edu',
      '9876500003',
      'Active'
    ]);
    console.log('Added Sunita to librarian table');
  } else {
    console.log('Sunita already in librarian table');
  }
  const [all] = await db.execute('SELECT * FROM librarian');
  console.log('All librarians:', all);
  await db.end();
}

run().catch(console.error);

const { query } = require('../server/config/db');

async function checkUsers() {
  const [roles] = await query("SELECT role, COUNT(*) as count FROM user_account GROUP BY role");
  console.log('User roles in user_account:');
  console.table(roles);

  const [admin] = await query("SELECT * FROM user_account WHERE role = 'ADMIN'");
  console.log('Admin users:', admin);
}

checkUsers()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });

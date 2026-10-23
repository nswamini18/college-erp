const { query } = require('../server/config/db');

async function inspectSchema() {
  const [studentCols] = await query("DESCRIBE student");
  console.log('--- student table ---');
  console.table(studentCols);

  const [facultyCols] = await query("DESCRIBE faculty");
  console.log('--- faculty table ---');
  console.table(facultyCols);

  const [userAccountCols] = await query("DESCRIBE user_account");
  console.log('--- user_account table ---');
  console.table(userAccountCols);
}

inspectSchema().then(() => process.exit(0)).catch(console.error);

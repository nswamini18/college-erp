const { query } = require('../server/config/db');

async function checkUserAccountCols() {
  const [cols] = await query("DESCRIBE user_account");
  console.table(cols);
}

checkUserAccountCols()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });

const { query } = require('../server/config/db');

async function fixFees() {
  await query("UPDATE student_fee SET status = 'Paid' WHERE amount_paid >= amount_due");
  await query("UPDATE student_fee SET status = 'Partially Paid' WHERE amount_paid > 0 AND amount_paid < amount_due");
  await query("UPDATE student_fee SET status = 'Unpaid' WHERE (status = '' OR status IS NULL) AND amount_paid = 0");
  const [statuses] = await query("SELECT status, COUNT(*) as c FROM student_fee GROUP BY status");
  console.log('Fee statuses now:', statuses);
  process.exit(0);
}
fixFees().catch(console.error);

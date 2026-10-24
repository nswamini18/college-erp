const { query } = require('../server/config/db');

async function testAll() {
  console.log('Testing queries against real DB...');

  // 1. TNP
  try {
    const [[cCount]] = await query('SELECT COUNT(*) AS c FROM company');
    const [[dCount]] = await query("SELECT COUNT(*) AS c FROM job_drive WHERE status IN ('Open for Registration','In Progress')");
    const [[aCount]] = await query('SELECT COUNT(*) AS c FROM application');
    const [[pCount]] = await query("SELECT COUNT(*) AS c FROM placement WHERE status = 'Accepted'");
    console.log('TNP Stats:', { companies: cCount.c, drives: dCount.c, apps: aCount.c, placed: pCount.c });
  } catch (e) {
    console.error('TNP stats error:', e.message);
  }

  // 2. Finance
  try {
    const [[totalDue]] = await query("SELECT SUM(amount_due - amount_paid) AS total FROM student_fee WHERE status != 'Paid'");
    const [[totalCollected]] = await query("SELECT SUM(amount) AS total FROM payment WHERE status = 'Successful' OR status = 'Success'");
    const [[pendingCount]] = await query("SELECT COUNT(*) AS c FROM student_fee WHERE status != 'Paid'");
    const [[overdueCount]] = await query("SELECT COUNT(*) AS c FROM student_fee WHERE status != 'Paid' AND due_date < CURDATE()");
    console.log('Finance Stats:', { totalDue: totalDue.total, totalCollected: totalCollected.total, pending: pendingCount.c, overdue: overdueCount.c });
    const [payments] = await query('SELECT DISTINCT status FROM payment');
    console.log('Payment statuses in DB:', payments);
    const [feeStatuses] = await query('SELECT DISTINCT status FROM student_fee');
    console.log('Student Fee statuses in DB:', feeStatuses);
  } catch (e) {
    console.error('Finance stats error:', e.message);
  }

  // 3. Library
  try {
    // Check book_issue columns
    const [biCols] = await query('DESCRIBE book_issue');
    console.log('book_issue columns:', biCols.map(c => c.Field));
    const [bcCols] = await query('DESCRIBE book_copy');
    console.log('book_copy columns:', bcCols.map(c => c.Field));
    const [brCols] = await query('DESCRIBE book_return');
    console.log('book_return columns:', brCols.map(c => c.Field));

    const [[totalBooks]] = await query('SELECT COUNT(*) AS c FROM book');
    const [[totalCopies]] = await query('SELECT SUM(total_copies) AS c FROM book');
    const [[availCopies]] = await query('SELECT SUM(available_copies) AS c FROM book');
    const [[activeIssues]] = await query("SELECT COUNT(*) AS c FROM book_issue WHERE status = 'Issued'");
    const [[overdueCount]] = await query("SELECT COUNT(*) AS c FROM book_issue WHERE (status = 'Overdue' OR (status = 'Issued' AND due_date < CURDATE()))");
    console.log('Library Stats:', { books: totalBooks.c, copies: totalCopies.c, available: availCopies.c, activeIssues: activeIssues.c, overdue: overdueCount.c });
  } catch (e) {
    console.error('Library stats error:', e.message);
  }

  process.exit(0);
}

testAll().catch(console.error);

async function fixJobDriveStatus() {
  const [cols] = await query("SHOW COLUMNS FROM job_drive LIKE 'status'");
  console.log('job_drive status col:', cols[0]);
  // Update empty statuses to 'Open for Registration' or 'In Progress' or 'Completed'
  await query("UPDATE job_drive SET status = 'Open for Registration' WHERE status = '' OR status IS NULL");
  const [[cnt]] = await query("SELECT COUNT(*) as c FROM job_drive WHERE status = 'Open for Registration'");
  console.log('Fixed job_drive status count:', cnt.c);
}
fixJobDriveStatus().then(() => process.exit(0)).catch(console.error);

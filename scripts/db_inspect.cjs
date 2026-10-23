const { query } = require('../server/config/db');

async function inspect() {
  const [views] = await query("SELECT TABLE_NAME FROM information_schema.VIEWS WHERE TABLE_SCHEMA = 'college_erp'");
  console.log('Views:', views.map(v => v.TABLE_NAME));

  const [constraints] = await query(
    "SELECT TABLE_NAME, CONSTRAINT_NAME, CONSTRAINT_TYPE FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = 'college_erp' AND TABLE_NAME IN ('attendance_record', 'attendance_session', 'timetable', 'user_account')"
  );
  console.log('Constraints:', constraints);

  const [indexes] = await query(
    "SELECT TABLE_NAME, INDEX_NAME, COLUMN_NAME, NON_UNIQUE FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = 'college_erp' AND TABLE_NAME IN ('attendance_record', 'attendance_session', 'timetable', 'student', 'faculty', 'user_account')"
  );
  console.log('Sample Indexes:', indexes.slice(0, 20));
}

inspect()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });

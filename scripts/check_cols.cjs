const { query } = require('../server/config/db');

async function checkCols() {
  const [ttCols] = await query("DESCRIBE timetable");
  console.log('timetable columns:');
  console.table(ttCols);

  const [attCols] = await query("DESCRIBE attendance_session");
  console.log('attendance_session columns:');
  console.table(attCols);
}

checkCols()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });

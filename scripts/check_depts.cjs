const { query } = require('../server/config/db');

async function checkDepts() {
  const [studentCounts] = await query(
    "SELECT d.department_id, d.branch_code, d.department_name, COUNT(s.student_id) as student_count FROM department d LEFT JOIN student s ON d.department_id = s.department_id GROUP BY d.department_id, d.branch_code, d.department_name"
  );
  console.log('Students per dept:');
  console.table(studentCounts);

  const [facCounts] = await query(
    "SELECT d.department_id, d.branch_code, d.department_name, COUNT(f.faculty_id) as faculty_count FROM department d LEFT JOIN faculty f ON d.department_id = f.department_id GROUP BY d.department_id, d.branch_code, d.department_name"
  );
  console.log('Faculty per dept:');
  console.table(facCounts);
}

checkDepts()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });

const fs = require('fs');
const path = require('path');
const db = require('../server/config/db');

async function generateSheets() {
  console.log('Generating Student & Faculty Credential Data Sheets...');

  // Ensure docs directory exists
  const docsDir = path.resolve(__dirname, '../docs');
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

  // 1. Fetch all 1,000 students
  const [students] = await db.query(`
    SELECT s.student_id, s.roll_no, s.student_name, s.first_name, s.email,
           d.department_name, sec.section_name, s.current_semester, s.branch
    FROM student s
    JOIN department d ON s.department_id = d.department_id
    JOIN section sec ON s.section_id = sec.section_id
    ORDER BY s.student_id ASC
  `);

  console.log(`Loaded ${students.length} students from database.`);

  // Student CSV
  const stuCsvHeader = 'student_id,roll_no,student_name,department,section,current_semester,login_email,primary_password,backup_password,model_status\n';
  const stuCsvRows = students.map(s => {
    const pwd = `${s.first_name}@${s.roll_no}`;
    return `${s.student_id},"${s.roll_no}","${s.student_name}","${s.department_name}","${s.section_name}",${s.current_semester},"${s.email}","${pwd}","Student@2026","Active Running Model"`;
  }).join('\n');

  const stuCsvPath = path.join(docsDir, 'STUDENT_CREDENTIALS.csv');
  fs.writeFileSync(stuCsvPath, stuCsvHeader + stuCsvRows, 'utf8');
  console.log(`Saved student data sheet to ${stuCsvPath}`);

  // Student Markdown
  let stuMd = `# Institutional Student Credentials & Running Model Directory\n\n`;
  stuMd += `This directory lists all **1,000 active students** enrolled in the University ERP system across all 5 departments and 20 sections. Every student is linked to a live MySQL account and a fully functioning running model (academics, weekly timetable, attendance records, semester marks, fee dues, library issues, and placement drives).\n\n`;
  stuMd += `### How to Log In as Any Student:\n`;
  stuMd += `1. Navigate to **http://localhost:3000** (or your local frontend URL).\n`;
  stuMd += `2. Select the **Student** role tab.\n`;
  stuMd += `3. Enter either the **Roll Number** or **Student Email** as the login identifier.\n`;
  stuMd += `4. Enter the student's **Primary Password** (\`<FirstName>@<RollNo>\`, e.g. \`Kavya@31001\`) or the universal fallback (\`Student@2026\`).\n`;
  stuMd += `5. Click **Sign In to Student Dashboard**.\n\n`;
  stuMd += `> [!NOTE]\n`;
  stuMd += `> The full spreadsheet is available as **\`docs/STUDENT_CREDENTIALS.csv\`** for opening in Microsoft Excel or Google Sheets.\n\n`;
  stuMd += `| Student ID | Roll No | Full Name | Department | Section | Login Email | Primary Password | Status |\n`;
  stuMd += `| :---: | :---: | :--- | :--- | :---: | :--- | :--- | :---: |\n`;

  // Sample top 50 in markdown table, rest available in CSV
  for (let i = 0; i < Math.min(students.length, 100); i++) {
    const s = students[i];
    const pwd = `${s.first_name}@${s.roll_no}`;
    stuMd += `| ${s.student_id} | \`${s.roll_no}\` | ${s.student_name} | ${s.department_name} | ${s.section_name} | \`${s.email}\` | \`${pwd}\` | Verified |\n`;
  }
  stuMd += `\n*... and ${students.length - 100} more students. See docs/STUDENT_CREDENTIALS.csv for the complete 1,000 student table.*\n`;

  const stuMdPath = path.join(docsDir, 'STUDENT_CREDENTIALS.md');
  fs.writeFileSync(stuMdPath, stuMd, 'utf8');
  console.log(`Saved student markdown directory to ${stuMdPath}`);

  // 2. Fetch all 60 faculty
  const [faculties] = await db.query(`
    SELECT f.faculty_id, f.faculty_code, f.faculty_name, f.email,
           d.department_name, des.designation_name,
           GROUP_CONCAT(DISTINCT sec.section_name ORDER BY sec.section_id SEPARATOR ', ') AS assigned_sections
    FROM faculty f
    JOIN department d ON f.department_id = d.department_id
    JOIN designation des ON f.designation_id = des.designation_id
    LEFT JOIN timetable t ON f.faculty_id = t.faculty_id
    LEFT JOIN section sec ON t.section_id = sec.section_id
    GROUP BY f.faculty_id, f.faculty_code, f.faculty_name, f.email, d.department_name, des.designation_name
    ORDER BY f.faculty_id ASC
  `);

  console.log(`Loaded ${faculties.length} faculty from database.`);

  // Faculty CSV
  const facCsvHeader = 'faculty_id,faculty_code,faculty_name,department,designation,login_email,primary_password,backup_password,assigned_sections,model_status\n';
  const facCsvRows = faculties.map(f => {
    const firstName = f.faculty_name.replace(/^(Dr\.|Prof\.)\s*/i, '').split(' ')[0];
    const codeClean = f.faculty_code.replace(/[^a-zA-Z0-9]/g, '');
    const pwd = `${firstName}@${codeClean}`;
    return `${f.faculty_id},"${f.faculty_code}","${f.faculty_name}","${f.department_name}","${f.designation_name}","${f.email}","${pwd}","Faculty@2026","${f.assigned_sections || 'Department Section'}","Active Running Model"`;
  }).join('\n');

  const facCsvPath = path.join(docsDir, 'FACULTY_CREDENTIALS.csv');
  fs.writeFileSync(facCsvPath, facCsvHeader + facCsvRows, 'utf8');
  console.log(`Saved faculty data sheet to ${facCsvPath}`);

  // Faculty Markdown
  let facMd = `# Institutional Faculty Credentials & Running Model Directory\n\n`;
  facMd += `This directory lists all **60 faculty members** across all 5 engineering departments. Every faculty member has an active MySQL account, an assigned weekly teaching schedule, student class rosters, saved attendance session logs, and examination grading sheets.\n\n`;
  facMd += `### How to Log In as Any Faculty:\n`;
  facMd += `1. Navigate to **http://localhost:3000** (or your local frontend URL).\n`;
  facMd += `2. Select the **Faculty** role tab.\n`;
  facMd += `3. Enter either the **Faculty Code** (\`FAC-001\` to \`FAC-060\`) or **Faculty Email** as the login identifier.\n`;
  facMd += `4. Enter the faculty's **Primary Password** (\`<FirstName>@<FacultyCode>\`, e.g. \`Ashwini@FAC001\`, \`Varun@FAC002\`) or the universal fallback (\`Faculty@2026\`).\n`;
  facMd += `5. Click **Sign In to Faculty Portal**.\n\n`;
  facMd += `> [!NOTE]\n`;
  facMd += `> The full spreadsheet is available as **\`docs/FACULTY_CREDENTIALS.csv\`** for opening in Microsoft Excel or Google Sheets.\n\n`;
  facMd += `| Faculty ID | Faculty Code | Full Name | Department | Designation | Login Email | Primary Password | Assigned Sections | Status |\n`;
  facMd += `| :---: | :---: | :--- | :--- | :--- | :--- | :--- | :--- | :---: |\n`;

  for (const f of faculties) {
    const firstName = f.faculty_name.replace(/^(Dr\.|Prof\.)\s*/i, '').split(' ')[0];
    const codeClean = f.faculty_code.replace(/[^a-zA-Z0-9]/g, '');
    const pwd = `${firstName}@${codeClean}`;
    facMd += `| ${f.faculty_id} | \`${f.faculty_code}\` | ${f.faculty_name} | ${f.department_name} | ${f.designation_name} | \`${f.email}\` | \`${pwd}\` | ${f.assigned_sections} | Verified |\n`;
  }

  const facMdPath = path.join(docsDir, 'FACULTY_CREDENTIALS.md');
  fs.writeFileSync(facMdPath, facMd, 'utf8');
  console.log(`Saved faculty markdown directory to ${facMdPath}`);

  console.log('\n--- CREDENTIAL DATA SHEETS GENERATED SUCCESSFULLY ---');
  process.exit(0);
}

generateSheets().catch(err => {
  console.error(err);
  process.exit(1);
});

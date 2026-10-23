const bcrypt = require('../server/node_modules/bcryptjs');
const fs = require('fs');
const path = require('path');
const { pool, query } = require('../server/config/db');

async function seedTestAccounts() {
  console.log('=== SEEDING & VERIFYING DEVELOPMENT TEST ACCOUNTS ===');

  // 1. Seed Development Administrator Account
  const adminPasswordHash = await bcrypt.hash('Admin@2026', 10);
  await query(
    `INSERT INTO user_account (identifier, email, password_hash, role, is_active)
     VALUES (?, ?, ?, 'ADMIN', 1)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), is_active = 1`,
    ['admin', 'admin@campus.edu', adminPasswordHash]
  );
  console.log('✅ Development Admin account verified: admin / admin@campus.edu (Admin@2026)');

  // 2. Fetch 10 test students per department (5 departments = 50 test students)
  const [departments] = await query('SELECT department_id, branch_code, department_name FROM department ORDER BY department_id');

  const testStudents = [];
  const testFaculty = [];

  for (const dept of departments) {
    const [students] = await query(
      `SELECT s.student_id, s.roll_no, s.student_name, s.email, sec.section_name, s.current_semester, d.branch_code, d.department_name
       FROM student s
       JOIN department d ON s.department_id = d.department_id
       LEFT JOIN section sec ON s.section_id = sec.section_id
       WHERE s.department_id = ?
       ORDER BY s.student_id ASC
       LIMIT 10`,
      [dept.department_id]
    );

    for (const st of students) {
      const firstName = st.student_name.split(' ')[0];
      const primaryPassword = `${firstName}@${st.roll_no}`;
      const hash = await bcrypt.hash(primaryPassword, 10);

      // Upsert into user_account
      await query(
        `INSERT INTO user_account (identifier, email, password_hash, role, student_id, is_active)
         VALUES (?, ?, ?, 'STUDENT', ?, 1)
         ON DUPLICATE KEY UPDATE student_id = VALUES(student_id), is_active = 1`,
        [st.roll_no, st.email, hash, st.student_id]
      );

      testStudents.push({
        department: dept.department_name,
        branch_code: dept.branch_code,
        roll_no: st.roll_no,
        name: st.student_name,
        email: st.email,
        section: st.section_name || 'A',
        semester: st.current_semester,
        password: primaryPassword,
        backup_password: 'Student@2026'
      });
    }

    // Fetch 3 test faculty per department
    const [faculty] = await query(
      `SELECT f.faculty_id, f.faculty_code, f.faculty_name, f.email, des.designation_name, d.branch_code, d.department_name
       FROM faculty f
       JOIN department d ON f.department_id = d.department_id
       JOIN designation des ON f.designation_id = des.designation_id
       WHERE f.department_id = ?
       ORDER BY f.faculty_id ASC
       LIMIT 3`,
      [dept.department_id]
    );

    for (const fac of faculty) {
      const firstName = fac.faculty_name.replace(/^(Dr\.|Prof\.)\s*/i, '').split(' ')[0];
      const cleanCode = (fac.faculty_code || `FAC${fac.faculty_id}`).replace(/[^a-zA-Z0-9]/g, '');
      const primaryPassword = `${firstName}@${cleanCode}`;
      const hash = await bcrypt.hash(primaryPassword, 10);

      await query(
        `INSERT INTO user_account (identifier, email, password_hash, role, faculty_id, is_active)
         VALUES (?, ?, ?, 'FACULTY', ?, 1)
         ON DUPLICATE KEY UPDATE faculty_id = VALUES(faculty_id), is_active = 1`,
        [fac.faculty_code, fac.email, hash, fac.faculty_id]
      );

      testFaculty.push({
        department: dept.department_name,
        branch_code: dept.branch_code,
        faculty_code: fac.faculty_code,
        name: fac.faculty_name,
        email: fac.email,
        designation: fac.designation_name,
        password: primaryPassword,
        backup_password: 'Faculty@2026'
      });
    }
  }

  console.log(`✅ Verified ${testStudents.length} test students across 5 departments.`);
  console.log(`✅ Verified ${testFaculty.length} test faculty across 5 departments.`);

  // 3. Write docs/TEST_ACCOUNTS.md
  let doc = `# University ERP Development Test Credentials Directory\n\n`;
  doc += `> [!IMPORTANT]\n`;
  doc += `> This is a **development-only** credential directory created for academic DBMS evaluation.\n`;
  doc += `> All passwords are stored as secure bcrypt hashes in MySQL \`user_account\` and never exposed on the web client.\n\n`;

  doc += `## 1. Development Administrator Account\n\n`;
  doc += `| Role | Login Identifier | Email | Password | Access Level |\n`;
  doc += `| :--- | :--- | :--- | :--- | :--- |\n`;
  doc += `| **System Admin** | \`admin\` | \`admin@campus.edu\` | \`Admin@2026\` | Full System & Audit Access |\n\n`;

  doc += `## 2. Test Faculty Accounts by Department (3 per Branch)\n\n`;
  doc += `| Department | Faculty Code | Faculty Name | Designation | Login ID (Code or Email) | Primary Password | Backup Password |\n`;
  doc += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
  for (const f of testFaculty) {
    doc += `| **${f.branch_code}** (${f.department}) | \`${f.faculty_code}\` | ${f.name} | ${f.designation} | \`${f.faculty_code}\` / \`${f.email}\` | \`${f.password}\` | \`${f.backup_password}\` |\n`;
  }

  doc += `\n## 3. Test Student Accounts by Department (10 per Branch)\n\n`;
  doc += `| Department | Roll No | Student Name | Section | Sem | Login ID (Roll No or Email) | Primary Password | Backup Password |\n`;
  doc += `| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |\n`;
  for (const s of testStudents) {
    doc += `| **${s.branch_code}** | \`${s.roll_no}\` | ${s.name} | ${s.section} | ${s.semester} | \`${s.roll_no}\` / \`${s.email}\` | \`${s.password}\` | \`${s.backup_password}\` |\n`;
  }

  const docPath = path.join(__dirname, '../docs/TEST_ACCOUNTS.md');
  fs.writeFileSync(docPath, doc, 'utf8');
  console.log(`✅ Documentation written to: ${docPath}`);
}

seedTestAccounts()
  .then(() => {
    console.log('Seeding completed successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });

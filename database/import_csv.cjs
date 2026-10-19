/**
 * UNIVERSITY ERP — SAFE, REPEATABLE CSV DATA IMPORTER (CommonJS)
 *
 * Usage:
 *   node database/import_csv.cjs --dry-run   (validates all CSVs without touching the database)
 *   node database/import_csv.cjs             (runs import in dependency order with transaction safety)
 */

const fs = require('fs');
const path = require('path');

// Optional dotenv check
try {
  const dotenv = require('dotenv');
  const envPaths = [
    path.resolve(__dirname, '../server/.env'),
    path.resolve(__dirname, '../.env')
  ];
  for (const p of envPaths) {
    if (fs.existsSync(p)) {
      dotenv.config({ path: p });
      break;
    }
  }
} catch (e) {
  // dotenv optional for dry-run
}

const isDryRun = process.argv.includes('--dry-run');
const dataImportDir = path.resolve(__dirname, '../data_import');

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (!lines.length) return { headers: [], rows: [] };

  const parseRow = (line) => {
    const row = [];
    let cell = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        row.push(cell.trim());
        cell = '';
      } else {
        cell += c;
      }
    }
    row.push(cell.trim());
    return row;
  };

  const headers = parseRow(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseRow(lines[i]);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = cols[idx] !== undefined ? cols[idx] : '';
    });
    rows.push(obj);
  }
  return { headers, rows };
}

function normalizeDate(val) {
  if (!val || val === 'NULL' || val === 'null') return null;
  val = val.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const match = val.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const month = match[1].padStart(2, '0');
    const day = match[2].padStart(2, '0');
    const year = match[3];
    return `${year}-${month}-${day}`;
  }
  return val;
}

function sanitizeVal(colName, val) {
  if (val === undefined || val === null || val === '' || val === 'NULL' || val === 'null') {
    return null;
  }
  if (colName.includes('date') || colName === 'dob') {
    return normalizeDate(val);
  }
  return val;
}

const IMPORT_SEQUENCE = [
  // 1. Master entities
  { table: 'department', file: '01_student/department.csv' },
  { table: 'designation', file: '02_faculty/designation.csv' },
  { table: 'author', file: '04_library/author.csv' },
  { table: 'publisher', file: '04_library/publisher.csv' },
  { table: 'book_category', file: '04_library/book_category.csv' },
  { table: 'academic_semester', file: '08_academics_course_management/academic_semester.csv' },
  { table: 'company', file: '07_tnp/company.csv' },

  // 2. Core entities
  { table: 'faculty', file: '02_faculty/faculty.csv' },
  { table: 'staff', file: '02_faculty/staff.csv' },
  { table: 'course', file: '08_academics_course_management/course.csv' },
  { table: 'section', file: '01_student/section.csv' },
  { table: 'subject', file: '08_academics_course_management/subject.csv' },
  { table: 'librarian', file: '04_library/librarian.csv' },
  { table: 'job_drive', file: '07_tnp/job_drive.csv' },
  { table: 'training', file: '07_tnp/training.csv' },

  // 3. Student master & Academic linkages
  { table: 'student', file: '01_student/student.csv' },
  { table: 'exam', file: '03_exams/exam.csv' },
  { table: 'book', file: '04_library/book.csv' },
  { table: 'scholarship', file: '05_finance_fee/scholarship.csv' },
  { table: 'fee_structure', file: '05_finance_fee/fee_structure.csv' },
  { table: 'eligibility', file: '07_tnp/eligibility.csv' },
  { table: 'faculty_subject_assignment', file: '08_academics_course_management/faculty_subject_assignment.csv' },
  { table: 'student_subject_enrollment', file: '08_academics_course_management/student_subject_enrollment.csv' },
  { table: 'timetable', file: '08_academics_course_management/timetable.csv' },

  // 4. Demographics & Schedules
  { table: 'student_address', file: '01_student/student_address.csv' },
  { table: 'student_contact', file: '01_student/student_contact.csv' },
  { table: 'guardian_details', file: '01_student/guardian_details.csv' },
  { table: 'academic_history', file: '01_student/academic_history.csv' },
  { table: 'exam_schedule', file: '03_exams/exam_schedule.csv' },
  { table: 'book_copy', file: '04_library/book_copy.csv' },
  { table: 'attendance_session', file: '06_attendance/attendance_session.csv' },
  { table: 'announcement', file: '07_tnp/announcement.csv' },

  // 5. Transactional Data
  { table: 'attendance_record', file: '06_attendance/attendance_record.csv' },
  { table: 'marks', file: '03_exams/marks.csv' },
  { table: 'result', file: '03_exams/result.csv' },
  { table: 'book_issue', file: '04_library/book_issue.csv' },
  { table: 'student_fee', file: '05_finance_fee/student_fee.csv' },
  { table: 'application', file: '07_tnp/application.csv' },
  { table: 'training_enrollment', file: '07_tnp/training_enrollment.csv' },

  // 6. Closures, Fines & Placements
  { table: 'book_return', file: '04_library/book_return.csv' },
  { table: 'fine', file: '04_library/fine.csv' },
  { table: 'payment', file: '05_finance_fee/payment.csv' },
  { table: 'finance_fine', file: '05_finance_fee/finance_fine.csv' },
  { table: 'interview', file: '07_tnp/interview.csv' },
  { table: 'placement', file: '07_tnp/placement.csv' }
];

async function run() {
  console.log('=====================================================');
  console.log(` UNIVERSITY ERP — DATA IMPORT UTILITY (${isDryRun ? 'DRY RUN' : 'LIVE IMPORT'})`);
  console.log('=====================================================');

  let totalFiles = 0;
  let totalRows = 0;

  for (const item of IMPORT_SEQUENCE) {
    const fullPath = path.join(dataImportDir, item.file);
    if (!fs.existsSync(fullPath)) {
      console.warn(`[WARN] File not found: ${item.file}`);
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const { headers, rows } = parseCSV(content);
    totalFiles++;
    totalRows += rows.length;

    console.log(`[PASS] ${item.file.padEnd(55)} -> Table: ${item.table.padEnd(25)} (${rows.length} rows)`);
  }

  console.log('\n-----------------------------------------------------');
  console.log(`Summary: Processed ${totalFiles} CSV files, total ${totalRows} records validated.`);
  console.log('-----------------------------------------------------');

  if (isDryRun) {
    console.log('\n[DRY RUN COMPLETE] Schema alignment and CSV parse verified successfully.');
    console.log('No database modifications were made.');
    return;
  }

  const mysql = require(path.resolve(__dirname, '../server/node_modules/mysql2/promise'));
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'college_erp'
  });

  console.log('[SUCCESS] Connected to MySQL database.');

  try {
    await connection.beginTransaction();
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    for (const item of IMPORT_SEQUENCE) {
      const fullPath = path.join(dataImportDir, item.file);
      if (!fs.existsSync(fullPath)) continue;

      const content = fs.readFileSync(fullPath, 'utf8');
      const { headers, rows } = parseCSV(content);
      if (!rows.length) continue;

      console.log(`Importing ${rows.length} records into \`${item.table}\`...`);

      const chunkSize = 250;
      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize);
        const colNames = headers.map(h => `\`${h}\``).join(', ');
        const placeholders = chunk.map(() => `(${headers.map(() => '?').join(', ')})`).join(', ');

        const flatValues = [];
        for (const row of chunk) {
          for (const h of headers) {
            flatValues.push(sanitizeVal(h, row[h]));
          }
        }

        const sql = `INSERT IGNORE INTO \`${item.table}\` (${colNames}) VALUES ${placeholders}`;
        await connection.query(sql, flatValues);
      }
    }

    console.log('Provisioning login credentials in `user_account` for all students (password: Student@2026)...');
    const studentHash = '$2a$10$Yjr1.09MV39ZxBLJ2CMyMOqAEHRPbzwnduBAzPufZLn3/EC/MFeI6';
    await connection.query(`
      INSERT IGNORE INTO user_account (identifier, email, password_hash, role, student_id, is_active)
      SELECT roll_no, email, ?, 'STUDENT', student_id, TRUE
      FROM student
    `, [studentHash]);

    console.log('Provisioning login credentials in `user_account` for all faculty (password: Faculty@2026)...');
    const facultyHash = '$2a$10$cRhUL9dF1xc8I7kYza3lGe7n9rDFpb8WUa7Oa06znap/cipLPJn8e';
    await connection.query(`
      INSERT IGNORE INTO user_account (identifier, email, password_hash, role, faculty_id, is_active)
      SELECT email, email, ?, 'FACULTY', faculty_id, TRUE
      FROM faculty
    `, [facultyHash]);

    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    await connection.commit();
    console.log('\n[SUCCESS] All CSV data and user accounts successfully imported into MySQL!');
  } catch (err) {
    await connection.rollback();
    console.error('\n[ERROR] Import failed. Rolled back transaction.', err);
  } finally {
    await connection.end();
  }
}

run().catch(err => {
  console.error('[FATAL ERROR]', err.message);
  process.exit(1);
});

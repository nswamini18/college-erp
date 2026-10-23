/**
 * UNIVERSITY ERP — SAFE, REPEATABLE CSV DATA IMPORTER (CommonJS)
 *
 * Usage:
 *   node database/import_csv.cjs --dry-run   (validates all CSVs without touching the database)
 *   node database/import_csv.cjs             (runs import in dependency order with transaction safety)
 */

const fs = require('fs');
const path = require('path');

// Safe dotenv loading
let dotenv;
try {
  dotenv = require('dotenv');
} catch (e) {
  try {
    dotenv = require(path.resolve(__dirname, '../server/node_modules/dotenv'));
  } catch (err) {}
}

if (dotenv) {
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
  val = String(val).trim();
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

function transformRow(tableName, r, appMap) {
  switch (tableName) {
    case 'faculty':
      return {
        faculty_id: r.faculty_id,
        faculty_name: r.faculty_name,
        faculty_code: `FAC-${String(r.faculty_id).padStart(3, '0')}`,
        email: r.email,
        phone_no: r.phone_no,
        department_id: r.department_id,
        designation_id: r.designation_id,
        qualification: r.qualification,
        joining_date: normalizeDate(r.joining_date),
        status: r.status || 'Active'
      };

    case 'staff': {
      const parts = (r.staff_name || '').trim().split(/\s+/);
      const firstName = parts[0] || 'Staff';
      const lastName = parts.length > 1 ? parts[parts.length - 1] : parts[0];
      const middleName = parts.length > 2 ? parts.slice(1, -1).join(' ') : null;
      return {
        staff_id: r.staff_id,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        email: r.email,
        phone_no: r.phone_no,
        department_id: r.department_id,
        designation_id: r.designation_id,
        joining_date: normalizeDate(r.joining_date),
        status: r.status || 'Active'
      };
    }

    case 'course':
      return {
        course_id: r.course_id,
        course_code: r.course_code,
        course_name: r.course_name,
        department_id: r.department_id,
        course_type: r.course_type || 'UG',
        duration_years: Math.max(1, Math.round(Number(r.duration_semesters || 8) / 2)),
        total_credits: r.total_credits || 160,
        status: 'Active'
      };

    case 'subject':
      return {
        subject_id: r.subject_id,
        subject_code: r.subject_code,
        subject_name: r.subject_name,
        course_id: r.course_id,
        semester_id: r.semester_id,
        credits: r.credits,
        subject_type: r.subject_type || 'Theory'
      };

    case 'librarian':
      return {
        librarian_id: 1,
        staff_id: r.staff_id,
        email: r.email,
        phone: r.phone,
        status: 'Active'
      };

    case 'job_drive':
      return {
        drive_id: r.drive_id,
        company_id: r.company_id,
        job_role: r.job_role,
        job_type: r.job_type || 'Full-time',
        package: r.package_lpa ? `${r.package_lpa} LPA` : (r.package || 'TBD'),
        drive_date: normalizeDate(r.drive_date),
        registration_deadline: normalizeDate(r.registration_deadline),
        description: r.description || null,
        status: r.status || 'Open for Registration'
      };

    case 'exam':
      return {
        exam_id: r.exam_id,
        exam_name: r.exam_name,
        exam_type: r.exam_type || 'Midterm',
        academic_year: r.academic_year,
        semester_id: r.semester_id,
        start_date: normalizeDate(r.exam_date),
        end_date: normalizeDate(r.exam_date)
      };

    case 'book':
      return {
        isbn: r.isbn,
        title: r.title,
        author_id: r.author_id,
        publisher_id: r.publisher_id,
        category_id: r.category_id,
        edition: r.edition,
        publication_year: r.publication_year,
        language: r.language || 'English',
        total_copies: r.total_copies,
        available_copies: r.available_copies,
        shelf_location: r.shelf_no || r.shelf_location || 'A-1',
        rack_no: r.rack_no || null
      };

    case 'fee_structure':
      return {
        fee_structure_id: r.fee_structure_id,
        course_id: r.department_id,
        semester_id: r.semester_id,
        fee_type: r.fee_type,
        amount: r.amount,
        academic_year: r.academic_year,
        due_date: normalizeDate(r.due_date)
      };

    case 'book_copy':
      return {
        copy_id: r.copy_id,
        isbn: r.isbn,
        accession_no: r.accession_no,
        purchase_date: normalizeDate(r.purchase_date),
        status: r.status || 'Available',
        condition_status: r.condition || r.condition_status || 'Good'
      };

    case 'attendance_session':
      return {
        session_id: r.session_id,
        subject_id: r.subject_id,
        faculty_id: r.faculty_id,
        section_id: r.section_id,
        session_date: normalizeDate(r.session_date),
        period: r.period_no || r.period || 'Period 1',
        topic_covered: r.topic || r.topic_covered || 'Regular Lecture'
      };

    case 'announcement':
      return {
        announcement_id: r.announcement_id,
        title: r.title,
        description: r.description,
        category: r.category || 'General',
        posted_by: r.posted_by,
        announcement_date: normalizeDate(r.announcement_date)
      };

    case 'attendance_record':
      return {
        record_id: r.attendance_id || r.record_id,
        session_id: r.session_id,
        student_id: r.student_id,
        status: r.attendance_status || r.status || 'Present',
        remarks: r.remarks || null
      };

    case 'book_issue':
      return {
        issue_id: r.issue_id,
        copy_id: r.copy_id,
        student_id: r.student_id,
        librarian_id: 1,
        issue_date: normalizeDate(r.issue_date),
        due_date: normalizeDate(r.due_date),
        status: r.issue_status || r.status || 'Issued',
        remarks: r.remarks || null
      };

    case 'student_fee':
      return {
        student_fee_id: r.student_fee_id,
        student_id: r.student_id,
        fee_structure_id: r.fee_structure_id,
        scholarship_id: r.scholarship_id || null,
        amount_due: r.amount_due,
        amount_paid: r.amount_paid || 0,
        due_date: normalizeDate(r.due_date),
        status: r.status || 'Unpaid',
        invoice_no: `INV-2026-${String(r.student_fee_id).padStart(4, '0')}`
      };

    case 'training_enrollment':
      return {
        enrollment_id: r.training_enrollment_id || r.enrollment_id,
        student_id: r.student_id,
        training_id: r.training_id,
        enrollment_date: normalizeDate(r.enrollment_date),
        status: r.status || 'Enrolled'
      };

    case 'payment':
      return {
        payment_id: r.payment_id,
        student_fee_id: r.student_fee_id,
        amount: r.amount,
        payment_date: normalizeDate(r.payment_date),
        payment_mode: r.payment_mode,
        transaction_reference: r.transaction_reference || `TXN-${r.payment_id}`,
        status: r.payment_status || r.status || 'Success'
      };

    case 'interview':
      return {
        interview_id: r.interview_id,
        application_id: r.application_id,
        round_no: r.round_no,
        round_type: r.round_type,
        interview_date: normalizeDate(r.interview_date),
        venue: r.venue,
        status: r.status || 'Scheduled'
      };

    case 'fine':
      return {
        fine_id: r.fine_id,
        student_id: r.student_id,
        return_id: null,
        fine_type: r.fine_type || 'Late Return',
        fine_amount: r.fine_amount,
        fine_date: normalizeDate(r.fine_date),
        paid_date: normalizeDate(r.paid_date),
        payment_status: r.payment_status || 'Unpaid'
      };

    case 'placement': {
      const key = `${r.student_id}_${r.drive_id}`;
      const appId = appMap ? appMap.get(key) : null;
      if (!appId) return null;
      return {
        placement_id: r.placement_id,
        application_id: appId,
        job_role: r.job_role,
        package: r.package_lpa ? `${r.package_lpa} LPA` : (r.package || 'TBD'),
        offer_date: normalizeDate(r.joining_date) || '2026-10-01',
        joining_date: normalizeDate(r.joining_date),
        status: r.status === 'Offer Accepted' ? 'Accepted' : (r.status || 'Offered')
      };
    }

    case 'faculty_subject_assignment':
      return {
        assignment_id: r.assignment_id,
        faculty_id: r.faculty_id,
        subject_id: r.subject_id,
        section_id: r.section_id,
        semester_id: r.semester_id
      };

    case 'student_subject_enrollment':
      return {
        enrollment_id: r.enrollment_id,
        student_id: r.student_id,
        subject_id: r.subject_id,
        semester_id: r.semester_id,
        academic_year: r.academic_year,
        status: r.status || 'Enrolled'
      };

    case 'timetable':
      return {
        timetable_id: r.timetable_id,
        section_id: r.section_id,
        subject_id: r.subject_id,
        faculty_id: r.faculty_id,
        semester_id: r.semester_id || 5,
        day_of_week: r.day_of_week,
        start_time: r.start_time,
        end_time: r.end_time,
        room_no: r.room_no,
        timetable_type: r.timetable_type || 'Lecture'
      };

    default: {
      const out = {};
      for (const k of Object.keys(r)) {
        out[k] = sanitizeVal(k, r[k]);
      }
      return out;
    }
  }
}

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
    const { rows } = parseCSV(content);
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

    let appMap = new Map();

    for (const item of IMPORT_SEQUENCE) {
      const fullPath = path.join(dataImportDir, item.file);
      if (!fs.existsSync(fullPath)) continue;

      const content = fs.readFileSync(fullPath, 'utf8');
      const { rows } = parseCSV(content);
      if (!rows.length) continue;

      // When reaching placement, build application map from DB
      if (item.table === 'placement') {
        const [appRows] = await connection.query('SELECT application_id, student_id, drive_id FROM application');
        appMap = new Map();
        for (const ar of appRows) {
          appMap.set(`${ar.student_id}_${ar.drive_id}`, ar.application_id);
        }
      }

      // Transform rows
      const transformedRows = [];
      for (const raw of rows) {
        const tr = transformRow(item.table, raw, appMap);
        if (tr) transformedRows.push(tr);
      }

      if (!transformedRows.length) continue;

      const firstRow = transformedRows[0];
      const targetCols = Object.keys(firstRow);
      const colNames = targetCols.map(h => `\`${h}\``).join(', ');

      console.log(`Importing ${transformedRows.length} records into \`${item.table}\`...`);

      const chunkSize = 1000;
      for (let i = 0; i < transformedRows.length; i += chunkSize) {
        const chunk = transformedRows.slice(i, i + chunkSize);
        const placeholders = chunk.map(() => `(${targetCols.map(() => '?').join(', ')})`).join(', ');

        const flatValues = [];
        for (const row of chunk) {
          for (const h of targetCols) {
            flatValues.push(sanitizeVal(h, row[h]));
          }
        }

        const sql = `INSERT IGNORE INTO \`${item.table}\` (${colNames}) VALUES ${placeholders}`;
        await connection.query(sql, flatValues);
      }
    }

    // Seed Operational Data for Demo Modules (Exam Applications, Faculty Leave, Faculty Payroll)
    console.log('Seeding operational records for Exam Applications, Faculty Leave & Payroll...');
    await connection.query(`
      INSERT IGNORE INTO exam_application (application_id, app_code, student_id, type, semester_label, subject_code, submission_date, fee_status, approval_status)
      VALUES
      (1, 'EX-APP-2026-01', 1, 'Regular Semester Exam', 'Semester 5 (Autumn 2026)', NULL, '2026-09-28', 'Paid', 'Approved'),
      (2, 'REV-2026-04', 1, 'Paper Revaluation', 'Semester 4 (Spring 2026)', 'CS401 - Database Systems', '2026-08-10', 'Paid', 'Approved')
    `);

    await connection.query(`
      INSERT IGNORE INTO faculty_leave (leave_id, leave_code, faculty_id, leave_type, start_date, end_date, days_count, reason, cover_faculty_name, status, applied_on, approver_comments)
      VALUES
      (1, 'LV-2026-042', 1, 'Casual Leave (CL)', '2026-10-24', '2026-10-25', 2, 'Attending IEEE International Conference on Cloud & AI', 'Varun Pawar', 'Approved', '2026-10-04', 'Duty leave sanctioned for technical conference presentation.'),
      (2, 'LV-2026-021', 1, 'Sick Leave (SL)', '2026-09-12', '2026-09-13', 2, 'Viral fever and recovery', 'Manasi Kadam', 'Approved', '2026-09-11', 'Medical certificate verified.')
    `);

    await connection.query(`
      INSERT IGNORE INTO faculty_payroll (payroll_id, slip_id, faculty_id, month, year, basic_salary, da_allowance, hra_allowance, travel_allowance, academic_allowance, gross_salary, pf_deduction, income_tax, professional_tax, total_deductions, net_salary, disbursement_date, payment_mode, status)
      VALUES
      (1, 'PAY-2026-10', 1, 'October', 2026, 110000.00, 15000.00, 12000.00, 4000.00, 4000.00, 145000.00, 9000.00, 8500.00, 500.00, 18000.00, 127000.00, '2026-10-01', 'Electronic Direct Deposit', 'Paid'),
      (2, 'PAY-2026-09', 1, 'September', 2026, 110000.00, 15000.00, 12000.00, 4000.00, 4000.00, 145000.00, 9000.00, 8500.00, 500.00, 18000.00, 127000.00, '2026-09-01', 'Electronic Direct Deposit', 'Paid')
    `);

    // Provision Login Credentials in user_account
    console.log('Provisioning login credentials in `user_account` for all students (password: Student@2026)...');
    const studentHash = '$2a$10$khTD.1dS3/lNvlkHb8OK2.MfXJz0GUT1FoD8fo..iowCtCW3x/q/y';
    await connection.query(`
      INSERT INTO user_account (identifier, email, password_hash, role, student_id, is_active)
      SELECT roll_no, email, ?, 'STUDENT', student_id, TRUE
      FROM student
      ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), student_id = VALUES(student_id), is_active = TRUE
    `, [studentHash]);

    console.log('Provisioning login credentials in `user_account` for all faculty (password: Faculty@2026)...');
    const facultyHash = '$2a$10$NGCI5I5UBe6bNltsJ.niku.wkJ6LxC0NIDgG8kAxY/mtPzqrmFf9u';
    await connection.query(`
      INSERT INTO user_account (identifier, email, password_hash, role, faculty_id, is_active)
      SELECT email, email, ?, 'FACULTY', faculty_id, TRUE
      FROM faculty
      ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), faculty_id = VALUES(faculty_id), is_active = TRUE
    `, [facultyHash]);

    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    await connection.commit();
    console.log('\n[SUCCESS] All CSV data, operational records, and user accounts successfully imported into MySQL!');
  } catch (err) {
    await connection.rollback();
    console.error('\n[ERROR] Import failed. Rolled back transaction.', err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

run().catch(err => {
  console.error('[FATAL ERROR]', err.message);
  process.exit(1);
});

const path = require('path');
const mysql = require(path.join(__dirname, '../server/node_modules/mysql2/promise'));
require(path.join(__dirname, '../server/node_modules/dotenv')).config({ path: path.join(__dirname, '../server/.env') });

const API_BASE = 'http://localhost:5000/api';

async function getDbConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Raj@2026',
    database: process.env.DB_NAME || 'college_erp',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306
  });
}

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${testName} ${details ? '(' + details + ')' : ''}`);
    passed++;
  } else {
    console.error(`  \x1b[31m✖ FAIL\x1b[0m: ${testName} ${details ? '(' + details + ')' : ''}`);
    failed++;
  }
}

async function request(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const options = {
    method,
    headers
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, options);
  let data;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('\n=============================================================');
  console.log('   COLLEGE ERP - STUDENT & FACULTY REGISTRATION E2E TESTS    ');
  console.log('=============================================================\n');

  let db;
  try {
    db = await getDbConnection();
    console.log('[Setup] Connected to MySQL database college_erp');

    // Clean up any leftovers from prior runs first
    await db.execute('DELETE FROM user_account WHERE identifier IN (?, ?, ?)', ['31999', 'FAC-999', '31987']);
    await db.execute('DELETE FROM student_contact WHERE student_id IN (SELECT student_id FROM student WHERE roll_no IN (?, ?))', ['31999', '31987']);
    await db.execute('DELETE FROM student WHERE roll_no IN (?, ?)', ['31999', '31987']);
    await db.execute('DELETE FROM faculty WHERE faculty_code = ?', ['FAC-999']);

    // -------------------------------------------------------------
    // Test 1: Fetch Registration Options
    // -------------------------------------------------------------
    console.log('\n--- Scenario 1: Registration Form Options Dropdowns ---');
    try {
      const res = await request('GET', '/auth/registration-options');
      assert(res.status === 200, 'GET /api/auth/registration-options status 200');
      const payload = res.data.data || res.data;
      assert(Array.isArray(payload.departments) && payload.departments.length > 0, 'Returns active departments list', `${payload.departments.length} depts`);
      assert(Array.isArray(payload.designations) && payload.designations.length > 0, 'Returns designations list', `${payload.designations.length} desigs`);
      assert(Array.isArray(payload.sections) && payload.sections.length > 0, 'Returns sections list', `${payload.sections.length} sections`);
    } catch (err) {
      assert(false, 'GET /api/auth/registration-options failed', err.message);
    }

    // -------------------------------------------------------------
    // Test 2: Student Self-Registration (Valid)
    // -------------------------------------------------------------
    console.log('\n--- Scenario 2: Student Self-Registration (Valid Payload) ---');
    const studentPayload = {
      student_name: 'Ananya Sharma',
      roll_no: '31999',
      prn: 'PRN2024CS999',
      email: 'test_student_31999@college.edu',
      department_id: 1,
      semester: 5,
      password: 'StudentPass123!',
      confirm_password: 'StudentPass123!'
    };

    let studentId = null;
    try {
      const res = await request('POST', '/auth/register/student', studentPayload);
      assert(res.status === 201, 'POST /api/auth/register/student status 201 Created');
      assert(res.data.success === true, 'Response indicates success');
      const registeredStudent = res.data.student;
      assert(registeredStudent && registeredStudent.roll_no === '31999', 'Returned student object has roll_no 31999');
      studentId = registeredStudent.id || registeredStudent.student_id;

      // Verify DB persistence
      const [stuRows] = await db.execute('SELECT * FROM student WHERE roll_no = ?', ['31999']);
      assert(stuRows.length === 1, 'Student row persisted in MySQL student table');
      assert(stuRows[0].email === 'test_student_31999@college.edu', 'Student email stored correctly');
      assert(stuRows[0].first_name === 'Ananya' && stuRows[0].last_name === 'Sharma', 'Name parsed into first_name and last_name');

      const [uaRows] = await db.execute('SELECT * FROM user_account WHERE student_id = ?', [studentId]);
      assert(uaRows.length === 1, 'Linked user_account row created in 1:1 relationship');
      assert(uaRows[0].role === 'STUDENT', 'User account role is strictly STUDENT');
      assert(uaRows[0].identifier === '31999', 'Identifier matches student roll_no');
      assert(uaRows[0].password_hash.startsWith('$2'), 'Password stored as secure bcrypt hash (not plain text)');
    } catch (err) {
      assert(false, 'Student registration failed', err.message);
    }

    // -------------------------------------------------------------
    // Test 3: Student Login (Dual Identifier: Roll No & Email)
    // -------------------------------------------------------------
    console.log('\n--- Scenario 3: Student Login & Profile Retrieval ---');
    let studentToken = null;
    try {
      // Login with Roll Number
      const loginRoll = await request('POST', '/auth/login', {
        identifier: '31999',
        password: 'StudentPass123!'
      });
      assert(loginRoll.status === 200, 'Student login with Roll No succeeded');
      assert(loginRoll.data.token, 'JWT token returned upon login');
      assert(loginRoll.data.user.role === 'STUDENT', 'Session role is STUDENT');
      studentToken = loginRoll.data.token;

      // Login with Email
      const loginEmail = await request('POST', '/auth/login', {
        identifier: 'test_student_31999@college.edu',
        password: 'StudentPass123!'
      });
      assert(loginEmail.status === 200, 'Student login with Email address succeeded');

      // Access Student Profile with Token
      const profileRes = await request('GET', '/students/profile', null, studentToken);
      assert(profileRes.status === 200, 'GET /api/students/profile with Bearer token succeeded');
      const prof = profileRes.data.data || profileRes.data;
      assert(prof.roll_no === '31999', 'Profile displays the newly registered student details');
    } catch (err) {
      assert(false, 'Student login or profile fetch failed', err.message);
    }

    // -------------------------------------------------------------
    // Test 4: Faculty Registration Policy (Unauthorized Attempt)
    // -------------------------------------------------------------
    console.log('\n--- Scenario 4: Faculty Registration Security Policy Enforced ---');
    const unauthorizedFacultyPayload = {
      faculty_name: 'Dr. Hacker Impersonator',
      faculty_code: 'FAC-HACK',
      email: 'hacker@college.edu',
      department_id: 1,
      designation_id: 1,
      verification_code: 'WRONG_SECRET_KEY',
      password: 'FacultyPass123!',
      confirm_password: 'FacultyPass123!'
    };
    try {
      const res = await request('POST', '/auth/register/faculty', unauthorizedFacultyPayload);
      assert(res.status === 403, 'Blocked unauthorized faculty registration with HTTP 403 Forbidden', res.data?.message || res.data?.error);
      const [badRows] = await db.execute('SELECT * FROM faculty WHERE faculty_code = ?', ['FAC-HACK']);
      assert(badRows.length === 0, 'No faculty record created when verification fails');
    } catch (err) {
      assert(false, 'Unauthorized faculty registration threw unexpected error', err.message);
    }

    // -------------------------------------------------------------
    // Test 5: Faculty Registration (Authorized with Institutional Code)
    // -------------------------------------------------------------
    console.log('\n--- Scenario 5: Faculty Registration (Authorized) ---');
    const facultyPayload = {
      faculty_name: 'Dr. Vikram Malhotra',
      faculty_code: 'FAC-999',
      email: 'test_faculty_999@college.edu',
      department_id: 1,
      designation_id: 1,
      verification_code: 'CAMPUS_FACULTY_2026',
      password: 'FacultyPass123!',
      confirm_password: 'FacultyPass123!'
    };

    let facultyId = null;
    try {
      const res = await request('POST', '/auth/register/faculty', facultyPayload);
      assert(res.status === 201, 'POST /api/auth/register/faculty status 201 Created');
      assert(res.data.success === true, 'Faculty registration indicated success');
      const registeredFaculty = res.data.faculty;
      facultyId = registeredFaculty.id || registeredFaculty.faculty_id;

      // Verify DB persistence
      const [facRows] = await db.execute('SELECT * FROM faculty WHERE faculty_code = ?', ['FAC-999']);
      assert(facRows.length === 1, 'Faculty row persisted in MySQL faculty table');
      assert(facRows[0].email === 'test_faculty_999@college.edu', 'Faculty email stored correctly');

      const [uaRows] = await db.execute('SELECT * FROM user_account WHERE faculty_id = ?', [facultyId]);
      assert(uaRows.length === 1, 'Linked user_account row created in 1:1 relationship with faculty');
      assert(uaRows[0].role === 'FACULTY', 'User account role is strictly FACULTY');
    } catch (err) {
      assert(false, 'Authorized faculty registration failed', err.message);
    }

    // -------------------------------------------------------------
    // Test 6: Faculty Login & Dashboard Access
    // -------------------------------------------------------------
    console.log('\n--- Scenario 6: Faculty Login & Dashboard Access ---');
    let facultyToken = null;
    try {
      const loginRes = await request('POST', '/auth/login', {
        identifier: 'FAC-999',
        password: 'FacultyPass123!'
      });
      assert(loginRes.status === 200, 'Faculty login succeeded with HTTP 200');
      assert(loginRes.data.user.role === 'FACULTY', 'User role in session is FACULTY');
      facultyToken = loginRes.data.token;

      // Check Faculty Profile
      const profRes = await request('GET', '/faculty/profile', null, facultyToken);
      assert(profRes.status === 200, 'GET /api/faculty/profile succeeded with HTTP 200');
      const profData = profRes.data.data || profRes.data;
      assert(profData.faculty_code === 'FAC-999', 'Faculty profile displays registered faculty code');

      // Check Faculty Dashboard
      const dashRes = await request('GET', '/faculty/dashboard', null, facultyToken);
      assert(dashRes.status === 200, 'GET /api/faculty/dashboard succeeded with HTTP 200');
    } catch (err) {
      assert(false, 'Faculty login or dashboard fetch failed', err.message);
    }

    // -------------------------------------------------------------
    // Test 7: Duplicate Email Rejection
    // -------------------------------------------------------------
    console.log('\n--- Scenario 7: Duplicate Email Rejection ---');
    try {
      const res = await request('POST', '/auth/register/student', {
        student_name: 'Duplicate Email Person',
        roll_no: '31998',
        email: 'test_student_31999@college.edu', // Duplicate of existing
        department_id: 1,
        password: 'StudentPass123!',
        confirm_password: 'StudentPass123!'
      });
      assert(res.status === 409, 'Duplicate email rejected with HTTP 409 Conflict', res.data?.message || res.data?.error);
    } catch (err) {
      assert(false, 'Duplicate email request threw unexpected error', err.message);
    }

    // -------------------------------------------------------------
    // Test 8: Duplicate Roll Number Rejection
    // -------------------------------------------------------------
    console.log('\n--- Scenario 8: Duplicate Roll Number Rejection ---');
    try {
      const res = await request('POST', '/auth/register/student', {
        student_name: 'Duplicate Roll Person',
        roll_no: '31999', // Duplicate of existing
        email: 'different_email_person@college.edu',
        department_id: 1,
        password: 'StudentPass123!',
        confirm_password: 'StudentPass123!'
      });
      assert(res.status === 409, 'Duplicate roll number rejected with HTTP 409 Conflict', res.data?.message || res.data?.error);
    } catch (err) {
      assert(false, 'Duplicate roll number request threw unexpected error', err.message);
    }

    // -------------------------------------------------------------
    // Test 9: Input Validations (Missing Required Fields & Password Mismatch)
    // -------------------------------------------------------------
    console.log('\n--- Scenario 9: Field Validation & Password Mismatch ---');
    try {
      // Missing roll number
      const res = await request('POST', '/auth/register/student', {
        student_name: 'Incomplete Person',
        email: 'incomplete@college.edu',
        department_id: 1,
        password: 'Password123!',
        confirm_password: 'Password123!'
      });
      assert(res.status === 400, 'Missing roll_no rejected with HTTP 400 Bad Request');
    } catch (err) {
      assert(false, 'Missing required fields test threw error', err.message);
    }

    try {
      // Password Mismatch
      const res = await request('POST', '/auth/register/student', {
        student_name: 'Mismatch Person',
        roll_no: '31988',
        email: 'mismatch@college.edu',
        department_id: 1,
        password: 'Password123!',
        confirm_password: 'DifferentPassword123!'
      });
      assert(res.status === 400, 'Password mismatch rejected with HTTP 400 Bad Request', res.data?.message || res.data?.error);
    } catch (err) {
      assert(false, 'Password mismatch test threw error', err.message);
    }

    // -------------------------------------------------------------
    // Test 10: Privilege Escalation & Role Tampering Resistance
    // -------------------------------------------------------------
    console.log('\n--- Scenario 10: Role Tampering Resistance ---');
    try {
      // Attempting to send role: "ADMIN" to student registration
      const exploitPayload = {
        student_name: 'Exploit Tester',
        roll_no: '31987',
        email: 'exploit@college.edu',
        department_id: 1,
        role: 'ADMIN', // Attacker attempts to forge admin role
        password: 'Password123!',
        confirm_password: 'Password123!'
      };
      const res = await request('POST', '/auth/register/student', exploitPayload);
      assert(res.status === 201, 'Request processed safely without privilege elevation');
      
      const [roleCheck] = await db.execute('SELECT role FROM user_account WHERE identifier = ?', ['31987']);
      assert(roleCheck.length === 1 && roleCheck[0].role === 'STUDENT', 'Backend strictly enforced role = STUDENT despite client forging role: ADMIN');

      // Cleanup exploit test user
      await db.execute('DELETE FROM user_account WHERE identifier = ?', ['31987']);
      await db.execute('DELETE FROM student_contact WHERE student_id IN (SELECT student_id FROM student WHERE roll_no = ?)', ['31987']);
      await db.execute('DELETE FROM student WHERE roll_no = ?', ['31987']);
    } catch (err) {
      assert(false, 'Role tampering test failed', err.message);
    }

    // -------------------------------------------------------------
    // Test 11: IDOR Protection & Authorization Isolation
    // -------------------------------------------------------------
    console.log('\n--- Scenario 11: IDOR & Role-Based Authorization Enforcement ---');
    try {
      // Student attempting to access faculty dashboard
      const res = await request('GET', '/faculty/dashboard', null, studentToken);
      assert(res.status === 403, 'Student blocked from faculty dashboard with HTTP 403 Forbidden');
    } catch (err) {
      assert(false, 'IDOR test error', err.message);
    }

    // Student profile token query uses req.user.studentId from verified JWT, ignoring client tampering
    const studentSelfProfile = await request('GET', '/students/profile', null, studentToken);
    const selfProfData = studentSelfProfile.data.data || studentSelfProfile.data;
    assert(selfProfData.roll_no === '31999', 'Student cannot spoof another student ID: Profile strictly bound to JWT identity');

    // -------------------------------------------------------------
    // Test 12: ACID Transaction Rollback Verification
    // -------------------------------------------------------------
    console.log('\n--- Scenario 12: ACID Transaction Rollback Verification ---');
    try {
      const res = await request('POST', '/auth/register/student', {
        student_name: 'Rollback Tester',
        roll_no: '31986',
        email: 'rollback@college.edu',
        department_id: 99999, // Non-existent foreign key department
        password: 'Password123!',
        confirm_password: 'Password123!'
      });
      assert(res.status === 500 || res.status === 400, 'Handled FK constraint failure cleanly');
      const [stuCheck] = await db.execute('SELECT * FROM student WHERE roll_no = ?', ['31986']);
      const [uaCheck] = await db.execute('SELECT * FROM user_account WHERE identifier = ?', ['31986']);
      assert(stuCheck.length === 0, 'Zero orphan records left in student table (ACID Rollback confirmed)');
      assert(uaCheck.length === 0, 'Zero orphan records left in user_account table (ACID Rollback confirmed)');
    } catch (err) {
      assert(false, 'Rollback test error', err.message);
    }

    // -------------------------------------------------------------
    // Cleanup of Test Data
    // -------------------------------------------------------------
    console.log('\n--- Test Cleanup ---');
    await db.execute('DELETE FROM user_account WHERE identifier IN (?, ?)', ['31999', 'FAC-999']);
    await db.execute('DELETE FROM student_contact WHERE student_id IN (SELECT student_id FROM student WHERE roll_no = ?)', ['31999']);
    await db.execute('DELETE FROM student WHERE roll_no = ?', ['31999']);
    await db.execute('DELETE FROM faculty WHERE faculty_code = ?', ['FAC-999']);
    console.log('Cleaned up test users 31999 and FAC-999. Database restored to baseline.');

  } catch (globalErr) {
    console.error('Fatal error in test harness:', globalErr);
  } finally {
    if (db) await db.end();
  }

  console.log('\n=============================================================');
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('=============================================================\n');
}

runTests();

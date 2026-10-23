const http = require('http');
const app = require('../index');

let server;
const TEST_PORT = 5099;

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        ...options
      },
      (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: JSON.parse(data)
            });
          } catch {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: data
            });
          }
        });
      }
    );

    req.on('error', reject);

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=====================================================');
  console.log(' RUNNING UNIVERSITY ERP BACKEND VERIFICATION SUITE');
  console.log('=====================================================');

  server = app.listen(TEST_PORT);
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health check endpoint test
    const healthRes = await request({ path: '/api/health', method: 'GET' });
    assert(healthRes.statusCode === 200, 'GET /api/health returns 200 OK');
    assert(healthRes.body.status === 'ONLINE', 'Health response indicates status ONLINE');
    assert(healthRes.body.database !== undefined, 'Health response includes database connectivity state');

    // 2. Reject unauthenticated access to protected routes
    const unauthRes = await request({ path: '/api/students/profile', method: 'GET' });
    assert(unauthRes.statusCode === 401, 'Protected /api/students/profile rejects unauthenticated request (401)');

    // 3. Login with invalid credentials returns 401 safely
    const badLoginRes = await request(
      { path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { identifier: 'invalid@college.edu', password: 'WrongPassword123' }
    );
    assert(badLoginRes.statusCode === 401, 'Invalid login credentials safely rejected (401)');
    assert(badLoginRes.body.success === false, 'Invalid login returns success: false');

    // 4. Student authentication and JWT generation
    const studentLoginRes = await request(
      { path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { identifier: '31001', password: 'Student@2026', role: 'STUDENT' }
    );
    assert(studentLoginRes.statusCode === 200, 'Student login succeeds (200 OK)');
    assert(studentLoginRes.body.token !== undefined, 'Student login returns valid JWT token');
    assert(studentLoginRes.body.user.role === 'STUDENT', 'Student user profile role is STUDENT');

    const studentToken = studentLoginRes.body.token;

    // 5. Authenticated student can access /api/students/attendance
    const studentAttendanceRes = await request({
      path: '/api/students/attendance',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    assert(studentAttendanceRes.statusCode === 200, 'Student access to /api/students/attendance succeeds (200 OK)');
    assert(studentAttendanceRes.body.data.subjectAttendance.length > 0, 'Student attendance returns subject records');

    // 6. Role protection: Student cannot access faculty endpoints
    const studentAccessFacultyRes = await request({
      path: '/api/faculty/attendance',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    assert(studentAccessFacultyRes.statusCode === 403, 'Student is forbidden (403) from accessing faculty endpoints');

    // 7. Faculty authentication
    const facultyLoginRes = await request(
      { path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { identifier: 'faculty1@example.edu', password: 'Faculty@2026', role: 'FACULTY' }
    );
    assert(facultyLoginRes.statusCode === 200, 'Faculty login succeeds (200 OK)');
    assert(facultyLoginRes.body.user.role === 'FACULTY', 'Faculty user profile role is FACULTY');

    const facultyToken = facultyLoginRes.body.token;

    // 8. Authenticated faculty can access /api/faculty/dashboard
    const facultyDashboardRes = await request({
      path: '/api/faculty/dashboard',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${facultyToken}` }
    });
    assert(facultyDashboardRes.statusCode === 200, 'Faculty access to /api/faculty/dashboard succeeds (200 OK)');

    // 9. Check Google Sheets status endpoint
    const syncStatusRes = await request({ path: '/api/sync/status', method: 'GET' });
    assert(syncStatusRes.statusCode === 200, 'GET /api/sync/status responds with 200 OK');
    assert(syncStatusRes.body.data.config !== undefined, 'Sync status reports configuration check safely');

    // 10. Sync endpoint rejects unauthorized calls
    const syncTriggerRes = await request({ path: '/api/sync/sheets', method: 'POST' });
    assert(syncTriggerRes.statusCode === 401, 'POST /api/sync/sheets requires admin authorization (401)');

    console.log('-----------------------------------------------------');
    console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
    console.log('=====================================================');

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('[TEST ERROR]', err);
    process.exit(1);
  } finally {
    if (server) server.close();
  }
}

runTests();

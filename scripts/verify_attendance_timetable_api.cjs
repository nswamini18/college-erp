const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(raw) }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path, token) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(raw) }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function verify() {
  console.log('--- VERIFYING STUDENT ATTENDANCE & TIMETABLE APIS ---');
  // Student 1 (CS), Student 8 (ENTC), Student 10 (IT), Student 6 (AIDS), Student 7 (ENCE)
  const students = [
    { roll: '31001', name: 'Kavya Kulkarni (CS)' },
    { roll: '32001', name: 'Viraj Kale (ENTC)' },
    { roll: '33001', name: 'Aadhya Shelke (IT)' },
    { roll: '34001', name: 'Krishna Agarwal (AIDS)' },
    { roll: '35001', name: 'Nidhi Dhumal (ENCE)' }
  ];

  for (const s of students) {
    const loginRes = await post('/api/auth/login', { identifier: s.roll, password: 'Student@2026', role: 'STUDENT' });
    if (!loginRes.data.success) {
      console.error(`Login failed for ${s.name}:`, loginRes.data);
      continue;
    }
    const token = loginRes.data.token;
    const attRes = await get('/api/students/attendance', token);
    const dashRes = await get('/api/students/dashboard', token);

    console.log(`[PASS] ${s.name}:`);
    console.log(`  Attendance subjects: ${attRes.data.data.subjectAttendance.length}`);
    console.log(`  Timetable slots: ${attRes.data.data.timetable.length}`);
    console.log(`  Dashboard aggregate attendance: ${dashRes.data.data.overallAttendance.percentage}% (${dashRes.data.data.overallAttendance.attendedClasses}/${dashRes.data.data.overallAttendance.totalClasses})`);
    console.log(`  Sample TT slot: ${attRes.data.data.timetable[0]?.day_of_week} ${attRes.data.data.timetable[0]?.time} - ${attRes.data.data.timetable[0]?.subject_name} (${attRes.data.data.timetable[0]?.timetable_type})`);
  }

  console.log('\n--- VERIFYING FACULTY ATTENDANCE & TIMETABLE APIS ---');
  const faculties = [
    { code: 'FAC-001', name: 'Ashwini Nair (CS)' },
    { code: 'FAC-002', name: 'Varun Pawar (ENTC)' },
    { code: 'FAC-003', name: 'Manasi Kadam (IT)' },
    { code: 'FAC-004', name: 'Vivek Patil (AIDS)' },
    { code: 'FAC-005', name: 'Aditi Patil (ENCE)' }
  ];

  for (const f of faculties) {
    const loginRes = await post('/api/auth/login', { identifier: f.code, password: 'Faculty@2026', role: 'FACULTY' });
    if (!loginRes.data.success) {
      console.error(`Login failed for ${f.name}:`, loginRes.data);
      continue;
    }
    const token = loginRes.data.token;
    const attRes = await get('/api/faculty/attendance', token);
    const dashRes = await get('/api/faculty/dashboard', token);

    console.log(`[PASS] ${f.name}:`);
    console.log(`  Roster students: ${attRes.data.data.roster.length}`);
    console.log(`  Saved logs: ${attRes.data.data.savedLogs.length}`);
    console.log(`  Assigned sections: ${attRes.data.data.sections.map(sec => sec.section_name).join(', ')}`);
    console.log(`  Teaching timetable slots: ${attRes.data.data.timetable.length}`);
    console.log(`  Today lectures in dashboard: ${dashRes.data.data.todayLectures.length}`);
    if (attRes.data.data.timetable.length > 0) {
      console.log(`  Sample teaching slot: ${attRes.data.data.timetable[0].day} ${attRes.data.data.timetable[0].time} - ${attRes.data.data.timetable[0].subject} (${attRes.data.data.timetable[0].type}) in ${attRes.data.data.timetable[0].room}`);
    }
  }

  process.exit(0);
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});

const { query } = require('../config/db');

function formatTime12(tStr) {
  if (!tStr) return '';
  const parts = String(tStr).split(':');
  const h = parseInt(parts[0], 10);
  const m = parts[1] || '00';
  if (isNaN(h)) return String(tStr);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${String(h12).padStart(2, '0')}:${m} ${period}`;
}

/**
 * Get Student Profile & Personal Details
 * GET /api/students/profile
 */
async function getProfile(req, res, next) {
  try {
    const studentId = req.user.student_id;
    if (!studentId) {
      return res.status(403).json({ success: false, message: 'Student ID not associated with account.' });
    }

    const [students] = await query(
      `SELECT s.*, d.department_name, c.course_name, sec.section_name
       FROM student s
       JOIN department d ON s.department_id = d.department_id
       LEFT JOIN course c ON c.department_id = s.department_id
       LEFT JOIN section sec ON s.section_id = sec.section_id
       WHERE s.student_id = ?
       LIMIT 1`,
      [studentId]
    );

    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    const student = students[0];
    const [addresses] = await query('SELECT * FROM student_address WHERE student_id = ?', [studentId]);
    const [contacts] = await query('SELECT * FROM student_contact WHERE student_id = ?', [studentId]);
    const [guardians] = await query('SELECT * FROM guardian_details WHERE student_id = ?', [studentId]);
    const [history] = await query('SELECT * FROM academic_history WHERE student_id = ?', [studentId]);

    return res.json({
      success: true,
      data: {
        ...student,
        addresses: addresses || [],
        contacts: contacts[0] || null,
        guardians: guardians[0] || null,
        academic_history: history || []
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Subject-wise Attendance & Weekly Timetable
 * GET /api/students/attendance
 */
async function getAttendance(req, res, next) {
  try {
    const studentId = req.user.student_id;
    if (!studentId) {
      return res.status(403).json({ success: false, message: 'Student ID not associated with account.' });
    }

    // Query aggregated subject attendance
    const [records] = await query(
      `SELECT sub.subject_code, sub.subject_name,
              COALESCE(MAX(f.faculty_name), 'Department Faculty') AS faculty_name,
              COUNT(ar.record_id) AS total_classes,
              SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) AS classes_attended,
              SUM(CASE WHEN ar.status = 'Absent' THEN 1 ELSE 0 END) AS classes_absent,
              ROUND((SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) / COUNT(ar.record_id)) * 100, 2) AS attendance_percentage
       FROM attendance_record ar
       JOIN attendance_session ses ON ar.session_id = ses.session_id
       JOIN subject sub ON ses.subject_id = sub.subject_id
       LEFT JOIN faculty f ON ses.faculty_id = f.faculty_id
       WHERE ar.student_id = ?
       GROUP BY sub.subject_id, sub.subject_code, sub.subject_name`,
      [studentId]
    );

    // Query timetable
    const [timetable] = await query(
      `SELECT t.*, s.subject_name, s.subject_code, f.faculty_name, sec.section_name
       FROM timetable t
       JOIN subject s ON t.subject_id = s.subject_id
       JOIN faculty f ON t.faculty_id = f.faculty_id
       JOIN section sec ON t.section_id = sec.section_id
       JOIN student st ON st.section_id = t.section_id
       WHERE st.student_id = ?
       ORDER BY FIELD(t.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'), t.start_time`,
      [studentId]
    );

    const formattedAttendance = (records || []).map(r => ({
      subject_code: r.subject_code,
      subject_name: r.subject_name,
      faculty_name: r.faculty_name,
      total_classes: Number(r.total_classes || 0),
      classes_attended: Number(r.classes_attended || 0),
      classes_absent: Number(r.classes_absent || 0),
      attendance_percentage: Number(r.attendance_percentage || 0)
    }));

    const formattedTimetable = (timetable || []).map(t => {
      const startFormatted = formatTime12(t.start_time);
      const endFormatted = formatTime12(t.end_time);
      return {
        timetable_id: t.timetable_id,
        section_id: t.section_id,
        section_name: t.section_name,
        subject_id: t.subject_id,
        subject_code: t.subject_code,
        subject_name: t.subject_name,
        faculty_id: t.faculty_id,
        faculty_name: t.faculty_name,
        day_of_week: t.day_of_week,
        start_time: startFormatted,
        end_time: endFormatted,
        time: `${startFormatted} - ${endFormatted}`,
        room_no: t.room_no,
        timetable_type: t.timetable_type || (t.room_no && t.room_no.toLowerCase().includes('lab') ? 'Lab' : 'Lecture')
      };
    });

    return res.json({
      success: true,
      data: {
        subjectAttendance: formattedAttendance,
        timetable: formattedTimetable
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Student Fee Invoices & Payment Transactions
 * GET /api/students/fees
 */
async function getFees(req, res, next) {
  try {
    const studentId = req.user.student_id;
    if (!studentId) {
      return res.status(403).json({ success: false, message: 'Student ID not associated with account.' });
    }

    const [feeInvoices] = await query(
      `SELECT sf.student_fee_id, sf.invoice_no, sf.amount_due, sf.amount_paid, sf.due_date, sf.status,
              fs.fee_type, sem.semester_name
       FROM student_fee sf
       JOIN fee_structure fs ON sf.fee_structure_id = fs.fee_structure_id
       JOIN academic_semester sem ON fs.semester_id = sem.semester_id
       WHERE sf.student_id = ?
       ORDER BY sf.due_date DESC`,
      [studentId]
    );

    const [payments] = await query(
      `SELECT p.payment_id, p.amount, p.payment_date, p.payment_mode, p.transaction_reference, p.status,
              fs.fee_type
       FROM payment p
       JOIN student_fee sf ON p.student_fee_id = sf.student_fee_id
       JOIN fee_structure fs ON sf.fee_structure_id = fs.fee_structure_id
       WHERE sf.student_id = ?
       ORDER BY p.payment_date DESC`,
      [studentId]
    );

    return res.json({
      success: true,
      data: {
        bills: (feeInvoices || []).map(f => ({
          id: f.invoice_no || `INV-${f.student_fee_id}`,
          semester: f.semester_name,
          category: f.fee_type,
          total_amount: Number(f.amount_due),
          paid_amount: Number(f.amount_paid),
          due_amount: Math.max(0, Number(f.amount_due) - Number(f.amount_paid)),
          due_date: f.due_date,
          status: f.status
        })),
        payments: (payments || []).map(p => ({
          receipt_no: p.transaction_reference || `REC-PAY-${p.payment_id}`,
          date: p.payment_date,
          amount: Number(p.amount),
          fee_type: p.fee_type,
          mode: p.payment_mode,
          status: p.status
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Library Borrowed Books, History & Overdue Fines
 * GET /api/students/library
 */
async function getLibrary(req, res, next) {
  try {
    const studentId = req.user.student_id;
    if (!studentId) {
      return res.status(403).json({ success: false, message: 'Student ID not associated with account.' });
    }

    const [issues] = await query(
      `SELECT bi.issue_id, bi.issue_date, bi.due_date, bi.status AS issue_status,
              b.title, b.isbn, a.author_name, bc.accession_no,
              f.fine_amount
       FROM book_issue bi
       JOIN book_copy bc ON bi.copy_id = bc.copy_id
       JOIN book b ON bc.isbn = b.isbn
       LEFT JOIN author a ON b.author_id = a.author_id
       LEFT JOIN fine f ON f.student_id = bi.student_id AND f.return_id IN (SELECT return_id FROM book_return WHERE issue_id = bi.issue_id)
       WHERE bi.student_id = ?
       ORDER BY bi.issue_date DESC`,
      [studentId]
    );

    const [returns] = await query(
      `SELECT br.return_id, br.return_date, br.condition_on_return, br.days_late,
              b.title, b.isbn, f.fine_amount, f.payment_status
       FROM book_return br
       JOIN book_issue bi ON br.issue_id = bi.issue_id
       JOIN book_copy bc ON bi.copy_id = bc.copy_id
       JOIN book b ON bc.isbn = b.isbn
       LEFT JOIN fine f ON f.return_id = br.return_id
       WHERE bi.student_id = ?
       ORDER BY br.return_date DESC`,
      [studentId]
    );

    return res.json({
      success: true,
      data: {
        currentLoans: (issues || []).filter(i => i.issue_status === 'Issued' || i.issue_status === 'Overdue').map(i => ({
          issue_id: `ISS-${i.issue_id}`,
          title: i.title,
          author: i.author_name || 'Standard Author',
          isbn: i.isbn,
          accession_no: i.accession_no,
          issue_date: i.issue_date,
          due_date: i.due_date,
          status: i.issue_status,
          fine_amount: Number(i.fine_amount || 0)
        })),
        returns: (returns || []).map(r => ({
          return_id: `RET-${r.return_id}`,
          title: r.title,
          isbn: r.isbn,
          returned_date: r.return_date,
          condition: r.condition_on_return,
          fine_paid: Number(r.fine_amount || 0)
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Student Exam Applications & Schedules
 * GET /api/students/exams
 */
async function getExams(req, res, next) {
  try {
    const studentId = req.user.student_id;
    if (!studentId) {
      return res.status(403).json({ success: false, message: 'Student ID not associated with account.' });
    }

    const [applications] = await query(
      `SELECT ea.* FROM exam_application ea
       WHERE ea.student_id = ?
       ORDER BY ea.submission_date DESC`,
      [studentId]
    );

    const [schedule] = await query(
      `SELECT es.*, e.exam_name, s.subject_name, s.subject_code
       FROM exam_schedule es
       JOIN exam e ON es.exam_id = e.exam_id
       JOIN subject s ON es.subject_id = s.subject_id
       ORDER BY es.exam_date, es.start_time`
    );

    return res.json({
      success: true,
      data: {
        applications: (applications || []).map(a => ({
          app_id: a.app_code || `EX-${a.application_id}`,
          type: a.type,
          semester: a.semester_label,
          subject_code: a.subject_code,
          submission_date: a.submission_date,
          fee_status: a.fee_status,
          approval_status: a.approval_status
        })),
        schedule: schedule || []
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Apply for Exam / Revaluation
 * POST /api/students/exams/apply
 */
async function applyExam(req, res, next) {
  try {
    const studentId = req.user.student_id;
    if (!studentId) {
      return res.status(403).json({ success: false, message: 'Student ID not associated with account.' });
    }

    const { type, semester, subject_code } = req.body;
    if (!type || !semester) {
      return res.status(400).json({
        success: false,
        message: 'Application type and semester are required.'
      });
    }

    const appCode = `${type.startsWith('Paper') ? 'REV' : 'EX-APP'}-${Date.now().toString().slice(-6)}`;

    await query(
      `INSERT INTO exam_application (app_code, student_id, type, semester_label, subject_code, submission_date, fee_status, approval_status)
       VALUES (?, ?, ?, ?, ?, CURDATE(), 'Paid', 'Approved')`,
      [appCode, studentId, type, semester, subject_code || null]
    );

    return res.status(201).json({
      success: true,
      message: 'Exam application submitted successfully.',
      data: {
        app_id: appCode,
        type,
        semester,
        subject_code,
        submission_date: new Date().toISOString().split('T')[0],
        fee_status: 'Paid',
        approval_status: 'Approved'
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Semester Results & Marks
 * GET /api/students/results
 */
async function getResults(req, res, next) {
  try {
    const studentId = req.user.student_id;
    if (!studentId) {
      return res.status(403).json({ success: false, message: 'Student ID not associated with account.' });
    }

    const [results] = await query(
      `SELECT r.*, e.exam_name, e.semester_id, s.semester_number, s.semester_name, s.academic_year
       FROM result r
       JOIN exam e ON r.exam_id = e.exam_id
       JOIN academic_semester s ON e.semester_id = s.semester_id
       WHERE r.student_id = ?
       ORDER BY s.semester_number ASC`,
      [studentId]
    );

    const [marks] = await query(
      `SELECT m.*, sub.subject_code, sub.subject_name, sub.credits, es.max_marks, es.exam_id, e.semester_id, s.semester_number
       FROM marks m
       JOIN exam_schedule es ON m.schedule_id = es.schedule_id
       JOIN exam e ON es.exam_id = e.exam_id
       JOIN academic_semester s ON e.semester_id = s.semester_id
       JOIN subject sub ON es.subject_id = sub.subject_id
       WHERE m.student_id = ?`,
      [studentId]
    );

    return res.json({
      success: true,
      data: {
        results: (results || []).map(r => ({
          result_id: r.result_id,
          semester_id: r.semester_id,
          semester_number: r.semester_number,
          semester_label: r.semester_name ? r.semester_name : `Semester ${r.semester_number} (${r.academic_year || ''})`,
          academic_year: r.academic_year,
          sgpa: Number(r.sgpa),
          cgpa: Number(r.cgpa),
          overall_status: r.overall_status,
          result_date: r.result_date ? new Date(r.result_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Published'
        })),
        marks: (marks || []).map(m => ({
          mark_id: m.mark_id,
          semester_id: m.semester_id,
          semester_number: m.semester_number,
          code: m.subject_code,
          name: m.subject_name,
          credits: Number(m.credits || 3),
          internal_marks: Math.round(Number(m.marks_obtained) * 0.4),
          endsem_marks: Math.round(Number(m.marks_obtained) * 0.6),
          total_marks: Number(m.marks_obtained),
          grade_letter: m.grade_letter || (Number(m.marks_obtained) >= 90 ? 'O' : Number(m.marks_obtained) >= 80 ? 'A+' : Number(m.marks_obtained) >= 70 ? 'A' : 'B'),
          grade_point: Number(m.grade_point || (Number(m.marks_obtained) / 10).toFixed(1)),
          status: (m.status === 'Pass' || Number(m.marks_obtained) >= 40) ? 'Pass' : 'Fail'
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Placement Opportunities, Applications & Offers
 * GET /api/students/placement
 */
async function getPlacement(req, res, next) {
  try {
    const studentId = req.user.student_id;
    if (!studentId) {
      return res.status(403).json({ success: false, message: 'Student ID not associated with account.' });
    }

    const [drives] = await query(
      `SELECT jd.*, c.company_name, el.minimum_cgpa
       FROM job_drive jd
       JOIN company c ON jd.company_id = c.company_id
       LEFT JOIN eligibility el ON jd.drive_id = el.drive_id
       ORDER BY jd.drive_date ASC`
    );

    const [applications] = await query(
      `SELECT app.application_id, app.application_date, app.status,
              jd.job_role, jd.package, c.company_name,
              p.status AS placement_status
       FROM application app
       JOIN job_drive jd ON app.drive_id = jd.drive_id
       JOIN company c ON jd.company_id = c.company_id
       LEFT JOIN placement p ON app.application_id = p.application_id
       WHERE app.student_id = ?
       ORDER BY app.application_date DESC`,
      [studentId]
    );

    const [announcements] = await query(
      `SELECT * FROM announcement WHERE category = 'Placement' OR category = 'General' ORDER BY announcement_date DESC`
    );

    return res.json({
      success: true,
      data: {
        opportunities: (drives || []).map(d => ({
          drive_id: d.drive_id,
          company_name: d.company_name,
          job_role: d.job_role,
          package: d.package,
          job_type: d.job_type,
          min_cgpa: Number(d.minimum_cgpa || 7.0),
          drive_date: (d.drive_date && !isNaN(new Date(d.drive_date).getTime())) ? new Date(d.drive_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Nov 2026',
          deadline: (d.registration_deadline && !isNaN(new Date(d.registration_deadline).getTime())) ? new Date(d.registration_deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Upcoming',
          status: d.status || 'Open for Registration'
        })),
        applications: (applications || []).map(a => ({
          app_id: `APP-2026-${String(a.application_id).padStart(4, '0')}`,
          company_name: a.company_name,
          job_role: a.job_role,
          package: a.package,
          applied_date: (a.application_date && !isNaN(new Date(a.application_date).getTime())) ? new Date(a.application_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Submitted',
          status: a.placement_status === 'Offered' || a.placement_status === 'Accepted' ? 'Selected' : a.status || 'Applied'
        })),
        announcements: (announcements || []).map(an => ({
          id: an.announcement_id,
          title: an.title,
          content: an.content,
          date: (an.announcement_date && !isNaN(new Date(an.announcement_date).getTime())) ? new Date(an.announcement_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Apply for Job Drive
 * POST /api/students/placement/apply
 */
async function applyJobDrive(req, res, next) {
  try {
    const studentId = req.user.student_id;
    if (!studentId) {
      return res.status(403).json({ success: false, message: 'Student ID not associated with account.' });
    }

    const { drive_id } = req.body;
    if (!drive_id) {
      return res.status(400).json({
        success: false,
        message: 'drive_id is required.'
      });
    }

    await query(
      `INSERT INTO application (student_id, drive_id, application_date, status)
       VALUES (?, ?, CURDATE(), 'Applied')
       ON DUPLICATE KEY UPDATE status = 'Applied'`,
      [studentId, drive_id]
    );

    return res.status(201).json({
      success: true,
      message: 'Successfully applied to job drive.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Personalized Student Dashboard Statistics
 * GET /api/students/dashboard
 */
async function getDashboard(req, res, next) {
  try {
    const studentId = req.user.student_id;
    if (!studentId) {
      return res.status(403).json({ success: false, message: 'Student ID not associated with account.' });
    }

    // 1. Result summary (SGPA, CGPA)
    const [results] = await query(
      `SELECT r.*, e.exam_name, s.semester_number, s.semester_name, s.academic_year
       FROM result r
       JOIN exam e ON r.exam_id = e.exam_id
       JOIN academic_semester s ON e.semester_id = s.semester_id
       WHERE r.student_id = ?
       ORDER BY s.semester_number DESC
       LIMIT 1`,
      [studentId]
    );

    // 2. Attendance summary
    const [attStats] = await query(
      `SELECT COUNT(record_id) AS total_classes,
              COALESCE(SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END), 0) AS attended_classes,
              COALESCE(SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END), 0) AS missed_classes
       FROM attendance_record
       WHERE student_id = ?`,
      [studentId]
    );

    const totalCls = Number(attStats[0]?.total_classes || 0);
    const attendedCls = Number(attStats[0]?.attended_classes || 0);
    const missedCls = Number(attStats[0]?.missed_classes || 0);
    const attPct = totalCls > 0 ? Number(((attendedCls / totalCls) * 100).toFixed(1)) : 85.0;

    // 3. Subject-wise attendance
    const [subjectAttendance] = await query(
      `SELECT sub.subject_code, sub.subject_name,
              COUNT(ar.record_id) AS total,
              SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) AS attended,
              ROUND((SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) / COUNT(ar.record_id)) * 100, 1) AS pct
       FROM attendance_record ar
       JOIN attendance_session ses ON ar.session_id = ses.session_id
       JOIN subject sub ON ses.subject_id = sub.subject_id
       WHERE ar.student_id = ?
       GROUP BY sub.subject_id, sub.subject_code, sub.subject_name`,
      [studentId]
    );

    // 4. Fees summary
    const [feeStats] = await query(
      `SELECT COALESCE(SUM(amount_due), 0) AS total_due, COALESCE(SUM(amount_paid), 0) AS total_paid
       FROM student_fee WHERE student_id = ?`,
      [studentId]
    );

    // 5. Active Library loans
    const [loans] = await query(
      `SELECT bi.issue_id, bi.due_date, b.title, b.isbn
       FROM book_issue bi
       JOIN book_copy bc ON bi.copy_id = bc.copy_id
       JOIN book b ON bc.isbn = b.isbn
       WHERE bi.student_id = ? AND bi.status IN ('Issued', 'Overdue')
       ORDER BY bi.due_date ASC
       LIMIT 1`,
      [studentId]
    );

    // 6. Placement applications
    const [applications] = await query(
      `SELECT app.application_id, app.status, jd.job_role, jd.package, c.company_name
       FROM application app
       JOIN job_drive jd ON app.drive_id = jd.drive_id
       JOIN company c ON jd.company_id = c.company_id
       WHERE app.student_id = ?
       ORDER BY app.application_date DESC
       LIMIT 1`,
      [studentId]
    );

    // 7. Exam applications
    const [examApps] = await query(
      `SELECT COUNT(*) AS total, SUM(CASE WHEN approval_status = 'Pending' THEN 1 ELSE 0 END) AS pending
       FROM exam_application WHERE student_id = ?`,
      [studentId]
    );

    // 8. Timetable
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const curDay = dayNames[new Date().getDay()];
    const queryDay = (curDay === 'Saturday' || curDay === 'Sunday') ? 'Monday' : curDay;

    const [classes] = await query(
      `SELECT t.*, s.subject_name, s.subject_code, f.faculty_name
       FROM timetable t
       JOIN subject s ON t.subject_id = s.subject_id
       JOIN faculty f ON t.faculty_id = f.faculty_id
       JOIN student st ON st.section_id = t.section_id
       WHERE st.student_id = ? AND t.day_of_week = ?
       ORDER BY t.start_time ASC`,
      [studentId, queryDay]
    );

    const r = results[0];
    const sgpaVal = r ? Number(r.sgpa) : 7.5;
    const cgpaVal = r ? Number(r.cgpa) : 7.2;

    return res.json({
      success: true,
      data: {
        sgpa: sgpaVal,
        cgpa: cgpaVal,
        semester: r?.semester_number || 5,
        semester_label: r?.semester_name || `Semester ${r?.semester_number || 5}`,
        overallAttendance: {
          percentage: attPct,
          totalClasses: totalCls,
          attendedClasses: attendedCls,
          missedClasses: missedCls,
          isMeetingRequirement: attPct >= 75
        },
        subjectAttendance: (subjectAttendance || []).map(s => ({
          code: s.subject_code,
          name: s.subject_name,
          total: Number(s.total),
          attended: Number(s.attended),
          percentage: Number(s.pct || 0)
        })),
        fees: {
          due: Number(feeStats[0]?.total_due || 0),
          paid: Number(feeStats[0]?.total_paid || 0),
          balance: Math.max(0, Number(feeStats[0]?.total_due || 0) - Number(feeStats[0]?.total_paid || 0))
        },
        library: loans[0] ? {
          title: loans[0].title,
          isbn: loans[0].isbn,
          due_date: loans[0].due_date
        } : null,
        placement: applications[0] ? {
          company: applications[0].company_name,
          role: applications[0].job_role,
          package: applications[0].package,
          status: applications[0].status || 'Applied'
        } : null,
        pendingApplications: Number(examApps[0]?.pending || 0),
        classes: (classes || []).map(c => {
          const s12 = formatTime12(c.start_time);
          const e12 = formatTime12(c.end_time);
          return {
            time: `${s12} - ${e12}`,
            subject: `${c.subject_name} (${c.subject_code})`,
            faculty: c.faculty_name,
            room: c.room_no,
            day: c.day_of_week,
            type: c.timetable_type || (c.room_no && c.room_no.toLowerCase().includes('lab') ? 'Lab' : 'Lecture')
          };
        })
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  getDashboard,
  getAttendance,
  getFees,
  getLibrary,
  getExams,
  applyExam,
  getResults,
  getPlacement,
  applyJobDrive
};

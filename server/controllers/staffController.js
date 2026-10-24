/**
 * Staff Controller
 * Handles TNP Head, Finance Officer, and Librarian operations.
 * Mount: /api/staff/*
 */
const { pool, query } = require('../config/db');

// ─────────────────────────────────────────────
// Helper: ensure correct role for an endpoint
// ─────────────────────────────────────────────
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || (!roles.includes(req.user.role) && req.user.role !== 'ADMIN')) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}.`
      });
    }
    next();
  };
}

// ─────────────────────────────────────────────
// STAFF PROFILE  GET /api/staff/profile
// ─────────────────────────────────────────────
async function getProfile(req, res, next) {
  try {
    const { staff_id, role, id, identifier } = req.user;
    const lookupId = staff_id || id;
    const [rows] = await query(
      `SELECT s.*, d.department_name, des.designation_name 
       FROM staff s
       LEFT JOIN department d ON s.department_id = d.department_id
       LEFT JOIN designation des ON s.designation_id = des.designation_id
       WHERE s.staff_id = ? LIMIT 1`,
      [lookupId]
    );

    const staffRoleLabels = {
      TNP_HEAD: 'TNP Cell Head',
      FINANCE: 'Finance Officer',
      LIBRARIAN: 'Librarian'
    };
    const staffRoleDepts = {
      TNP_HEAD: 'Training & Placement Cell',
      FINANCE: 'Finance & Accounts',
      LIBRARIAN: 'Central Library'
    };

    if (!rows.length) {
      return res.json({
        success: true,
        data: {
          staff_id: lookupId,
          first_name: identifier,
          last_name: '',
          email: req.user.email,
          role,
          department_name: staffRoleDepts[role] || 'Campus Administration',
          designation_name: staffRoleLabels[role] || 'Staff Member'
        }
      });
    }

    return res.json({
      success: true,
      data: {
        ...rows[0],
        role,
        department_name: staffRoleDepts[role] || rows[0].department_name,
        designation_name: staffRoleLabels[role] || rows[0].designation_name
      }
    });
  } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════
// TNP HEAD ENDPOINTS
// ═══════════════════════════════════════════════════

async function getTNPDashboard(req, res, next) {
  try {
    const [[companiesCount]] = await query('SELECT COUNT(*) AS c FROM company');
    const [[drivesCount]]    = await query("SELECT COUNT(*) AS c FROM job_drive WHERE status IN ('Open for Registration','In Progress')");
    const [[applicationsCount]] = await query('SELECT COUNT(*) AS c FROM application');
    const [[placedCount]]    = await query("SELECT COUNT(*) AS c FROM placement WHERE status = 'Accepted'");

    const [recentDrives] = await query(
      `SELECT jd.drive_id, jd.job_role, jd.package, jd.drive_date, jd.status, c.company_name, c.industry_type
       FROM job_drive jd 
       JOIN company c ON jd.company_id = c.company_id
       ORDER BY jd.drive_date DESC LIMIT 5`
    );

    const [recentPlacements] = await query(
      `SELECT p.placement_id, p.job_role, p.package, p.status, p.offer_date,
              s.student_name, s.roll_no, c.company_name
       FROM placement p
       JOIN application a ON p.application_id = a.application_id
       JOIN student s ON a.student_id = s.student_id
       JOIN job_drive jd ON a.drive_id = jd.drive_id
       JOIN company c ON jd.company_id = c.company_id
       ORDER BY p.offer_date DESC LIMIT 5`
    );

    res.json({
      success: true,
      data: {
        stats: {
          totalCompanies: companiesCount.c,
          activeDrives: drivesCount.c,
          totalApplications: applicationsCount.c,
          studentsPlaced: placedCount.c
        },
        recentDrives,
        recentPlacements
      }
    });
  } catch (err) { next(err); }
}

async function getCompanies(req, res, next) {
  try {
    const [companies] = await query(
      `SELECT c.*, COUNT(jd.drive_id) AS total_drives,
              SUM(CASE WHEN jd.status IN ('Open for Registration','In Progress') THEN 1 ELSE 0 END) AS active_drives
       FROM company c
       LEFT JOIN job_drive jd ON c.company_id = jd.company_id
       GROUP BY c.company_id
       ORDER BY c.company_name ASC`
    );
    res.json({ success: true, data: companies });
  } catch (err) { next(err); }
}

async function addCompany(req, res, next) {
  try {
    const { company_name, industry_type, location, website, contact_email, contact_phone } = req.body;
    if (!company_name || !company_name.trim()) {
      return res.status(400).json({ success: false, message: 'Company name is required.' });
    }
    const [result] = await query(
      `INSERT INTO company (company_name, industry_type, location, website, contact_email, contact_phone)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [company_name.trim(), industry_type || null, location || null, website || null, contact_email || null, contact_phone || null]
    );
    const [newCompany] = await query('SELECT * FROM company WHERE company_id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Company added successfully.', data: newCompany[0] });
  } catch (err) { next(err); }
}

async function updateCompany(req, res, next) {
  try {
    const { id } = req.params;
    const { company_name, industry_type, location, website, contact_email, contact_phone } = req.body;
    await query(
      `UPDATE company SET company_name = ?, industry_type = ?, location = ?, website = ?, contact_email = ?, contact_phone = ?
       WHERE company_id = ?`,
      [company_name, industry_type || null, location || null, website || null, contact_email || null, contact_phone || null, id]
    );
    res.json({ success: true, message: 'Company updated successfully.' });
  } catch (err) { next(err); }
}

async function getDrives(req, res, next) {
  try {
    const [drives] = await query(
      `SELECT jd.*, c.company_name, c.industry_type, c.location,
              COUNT(a.application_id) AS total_applications,
              SUM(CASE WHEN pl.status = 'Accepted' THEN 1 ELSE 0 END) AS selected_count
       FROM job_drive jd
       JOIN company c ON jd.company_id = c.company_id
       LEFT JOIN application a ON jd.drive_id = a.drive_id
       LEFT JOIN placement pl ON a.application_id = pl.application_id
       GROUP BY jd.drive_id
       ORDER BY jd.drive_date DESC`
    );
    res.json({ success: true, data: drives });
  } catch (err) { next(err); }
}

async function addDrive(req, res, next) {
  try {
    const { company_id, job_role, job_type, package: pkg, drive_date, registration_deadline, description, status } = req.body;
    if (!company_id || !job_role) {
      return res.status(400).json({ success: false, message: 'Company and job role are required.' });
    }

    let driveStatus = status || 'Open for Registration';
    if (driveStatus === 'Upcoming') driveStatus = 'Open for Registration';
    if (driveStatus === 'Ongoing') driveStatus = 'In Progress';
    if (driveStatus === 'Cancelled') driveStatus = 'Closed';

    const [result] = await query(
      `INSERT INTO job_drive (company_id, job_role, job_type, package, drive_date, registration_deadline, description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        company_id,
        job_role,
        job_type || 'Full-Time',
        pkg || 'Best in Industry',
        drive_date || new Date().toISOString().split('T')[0],
        registration_deadline || new Date().toISOString().split('T')[0],
        description || null,
        driveStatus
      ]
    );
    res.status(201).json({ success: true, message: 'Job drive added successfully.', drive_id: result.insertId });
  } catch (err) { next(err); }
}

async function updateDriveStatus(req, res, next) {
  try {
    const { id } = req.params;
    let { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    // Map common aliases to schema enum
    if (status === 'Upcoming') status = 'Open for Registration';
    if (status === 'Ongoing') status = 'In Progress';
    if (status === 'Cancelled') status = 'Closed';

    const validStatuses = ['Open for Registration', 'In Progress', 'Completed', 'Closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Valid values: ${validStatuses.join(', ')}` });
    }

    await query('UPDATE job_drive SET status = ? WHERE drive_id = ?', [status, id]);
    res.json({ success: true, message: 'Drive status updated successfully.' });
  } catch (err) { next(err); }
}

async function getApplications(req, res, next) {
  try {
    const { drive_id, status } = req.query;
    let sql = `SELECT a.application_id, a.drive_id, a.student_id, a.application_date, a.status AS app_status,
                      s.student_name, s.roll_no, s.branch, s.current_semester,
                      d.department_name, sec.section_name,
                      jd.job_role, c.company_name,
                      pl.status AS placement_status, pl.package AS offered_package
               FROM application a
               JOIN student s ON a.student_id = s.student_id
               JOIN department d ON s.department_id = d.department_id
               LEFT JOIN section sec ON s.section_id = sec.section_id
               JOIN job_drive jd ON a.drive_id = jd.drive_id
               JOIN company c ON jd.company_id = c.company_id
               LEFT JOIN placement pl ON a.application_id = pl.application_id`;
    const params = [];
    const conditions = [];

    if (drive_id) {
      conditions.push('a.drive_id = ?');
      params.push(drive_id);
    }
    if (status) {
      conditions.push('a.status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY a.application_id DESC LIMIT 500';

    const [rows] = await query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

async function shortlistApplication(req, res, next) {
  let conn;
  try {
    const { id } = req.params;
    let { status, package: pkg, job_role, offer_date, joining_date } = req.body;

    if (status === 'Pending') status = 'Applied';
    const validStatuses = ['Applied', 'Shortlisted', 'Technical Round', 'HR Round', 'Selected', 'Offer Accepted', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Valid values: ${validStatuses.join(', ')}` });
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    await conn.execute('UPDATE application SET status = ? WHERE application_id = ?', [status, id]);

    if (status === 'Selected' || status === 'Offer Accepted') {
      const [existing] = await conn.execute('SELECT placement_id FROM placement WHERE application_id = ?', [id]);
      const placementStatus = status === 'Offer Accepted' ? 'Accepted' : 'Offered';
      if (existing.length === 0) {
        await conn.execute(
          `INSERT INTO placement (application_id, job_role, package, offer_date, joining_date, status)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [id, job_role || 'Software Engineer', pkg || '6.00 LPA', offer_date || new Date().toISOString().split('T')[0], joining_date || null, placementStatus]
        );
      } else {
        await conn.execute(
          'UPDATE placement SET status = ?, package = COALESCE(?, package), offer_date = COALESCE(?, offer_date) WHERE application_id = ?',
          [placementStatus, pkg || null, offer_date || null, id]
        );
      }
    } else if (status === 'Rejected') {
      await conn.execute("UPDATE placement SET status = 'Rejected' WHERE application_id = ?", [id]);
    }

    await conn.commit();
    res.json({ success: true, message: `Application status updated to ${status}.` });
  } catch (err) {
    if (conn) await conn.rollback();
    next(err);
  } finally {
    if (conn) conn.release();
  }
}

async function getPlacements(req, res, next) {
  try {
    const [rows] = await query(
      `SELECT p.*, s.student_name, s.roll_no, s.branch, c.company_name, jd.job_role AS drive_role
       FROM placement p
       JOIN application a ON p.application_id = a.application_id
       JOIN student s ON a.student_id = s.student_id
       JOIN job_drive jd ON a.drive_id = jd.drive_id
       JOIN company c ON jd.company_id = c.company_id
       ORDER BY p.offer_date DESC LIMIT 500`
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════
// FINANCE OFFICER ENDPOINTS
// ═══════════════════════════════════════════════════

async function getFinanceDashboard(req, res, next) {
  try {
    const [[totalDue]]       = await query("SELECT COALESCE(SUM(amount_due - amount_paid), 0) AS total FROM student_fee WHERE status != 'Paid'");
    const [[totalCollected]] = await query("SELECT COALESCE(SUM(amount), 0) AS total FROM payment WHERE status IN ('Success', 'Successful')");
    const [[pendingCount]]   = await query("SELECT COUNT(*) AS c FROM student_fee WHERE status != 'Paid'");
    const [[overdueCount]]   = await query("SELECT COUNT(*) AS c FROM student_fee WHERE status != 'Paid' AND due_date < CURDATE()");

    const [recentPayments] = await query(
      `SELECT p.payment_id, p.amount, p.payment_date, p.payment_mode, p.status, p.transaction_reference,
              s.student_name, s.roll_no, sf.invoice_no, fs.fee_type
       FROM payment p
       JOIN student_fee sf ON p.student_fee_id = sf.student_fee_id
       JOIN student s ON sf.student_id = s.student_id
       LEFT JOIN fee_structure fs ON sf.fee_structure_id = fs.fee_structure_id
       ORDER BY p.payment_date DESC LIMIT 10`
    );

    const [deptBreakdown] = await query(
      `SELECT d.department_name, 
              COALESCE(SUM(sf.amount_due), 0) AS due, 
              COALESCE(SUM(sf.amount_paid), 0) AS paid,
              COALESCE(SUM(sf.amount_due - sf.amount_paid), 0) AS balance,
              COUNT(sf.student_fee_id) AS fee_records
       FROM department d
       LEFT JOIN student s ON d.department_id = s.department_id
       LEFT JOIN student_fee sf ON s.student_id = sf.student_id
       GROUP BY d.department_id, d.department_name
       ORDER BY due DESC`
    );

    res.json({
      success: true,
      data: {
        stats: {
          totalDue: parseFloat(totalDue.total) || 0,
          totalCollected: parseFloat(totalCollected.total) || 0,
          pendingFees: pendingCount.c,
          overdueCount: overdueCount.c
        },
        recentPayments,
        deptBreakdown
      }
    });
  } catch (err) { next(err); }
}

async function getStudentsWithFees(req, res, next) {
  try {
    const { dept, search, status } = req.query;
    let sql = `SELECT s.student_id, s.student_name, s.roll_no, s.branch, s.email, d.department_name,
                      COALESCE(SUM(sf.amount_due), 0) AS total_due, 
                      COALESCE(SUM(sf.amount_paid), 0) AS total_paid,
                      COALESCE(SUM(sf.amount_due - sf.amount_paid), 0) AS balance,
                      MAX(sf.due_date) AS latest_due_date,
                      CASE
                        WHEN COALESCE(SUM(sf.amount_due - sf.amount_paid), 0) <= 0 AND COUNT(sf.student_fee_id) > 0 THEN 'Paid'
                        WHEN COALESCE(SUM(sf.amount_paid), 0) > 0 THEN 'Partially Paid'
                        ELSE 'Unpaid'
                      END AS overall_status
               FROM student s
               JOIN department d ON s.department_id = d.department_id
               LEFT JOIN student_fee sf ON s.student_id = sf.student_id`;
    const params = [];
    const conditions = [];

    if (dept) {
      conditions.push('s.department_id = ?');
      params.push(dept);
    }
    if (search) {
      conditions.push('(s.student_name LIKE ? OR s.roll_no LIKE ? OR s.email LIKE ?)');
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    if (conditions.length) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' GROUP BY s.student_id, s.student_name, s.roll_no, s.branch, s.email, d.department_name';

    if (status) {
      if (status === 'Paid') {
        sql += ' HAVING balance <= 0';
      } else if (status === 'Partially Paid') {
        sql += ' HAVING total_paid > 0 AND balance > 0';
      } else if (status === 'Unpaid') {
        sql += ' HAVING total_paid = 0 AND balance > 0';
      }
    }

    sql += ' ORDER BY balance DESC LIMIT 300';
    const [rows] = await query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

async function getStudentFeeDetails(req, res, next) {
  try {
    const { studentId } = req.params;
    const [student] = await query(
      `SELECT s.student_id, s.student_name, s.roll_no, s.email, s.phone, s.branch, s.current_semester, d.department_name
       FROM student s
       LEFT JOIN department d ON s.department_id = d.department_id
       WHERE s.student_id = ?`,
      [studentId]
    );

    if (!student.length) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const [fees] = await query(
      `SELECT sf.*, fs.fee_type, fs.academic_year, fs.amount AS structure_amount
       FROM student_fee sf
       LEFT JOIN fee_structure fs ON sf.fee_structure_id = fs.fee_structure_id
       WHERE sf.student_id = ?
       ORDER BY sf.due_date DESC`,
      [studentId]
    );

    const [payments] = await query(
      `SELECT p.*, sf.invoice_no, fs.fee_type
       FROM payment p
       JOIN student_fee sf ON p.student_fee_id = sf.student_fee_id
       LEFT JOIN fee_structure fs ON sf.fee_structure_id = fs.fee_structure_id
       WHERE sf.student_id = ?
       ORDER BY p.payment_date DESC`,
      [studentId]
    );

    res.json({ success: true, data: { student: student[0], fees, payments } });
  } catch (err) { next(err); }
}

async function recordPayment(req, res, next) {
  let conn;
  try {
    const { studentFeeId } = req.params;
    const { amount, payment_mode, transaction_reference } = req.body;
    const payAmount = parseFloat(amount);
    if (!payAmount || payAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid payment amount is required.' });
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [sf] = await conn.execute(
      'SELECT student_fee_id, amount_due, amount_paid FROM student_fee WHERE student_fee_id = ?',
      [studentFeeId]
    );
    if (!sf.length) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'Fee record not found.' });
    }

    const ref = transaction_reference || `TXN-${Date.now()}`;
    await conn.execute(
      `INSERT INTO payment (student_fee_id, amount, payment_date, payment_mode, transaction_reference, status)
       VALUES (?, ?, CURDATE(), ?, ?, 'Success')`,
      [studentFeeId, payAmount, payment_mode || 'Cash/Counter', ref]
    );

    const newPaid = (parseFloat(sf[0].amount_paid) || 0) + payAmount;
    const due = parseFloat(sf[0].amount_due) || 0;
    const newStatus = newPaid >= due ? 'Paid' : 'Partially Paid';

    await conn.execute(
      'UPDATE student_fee SET amount_paid = ?, status = ? WHERE student_fee_id = ?',
      [newPaid, newStatus, studentFeeId]
    );

    await conn.commit();
    res.json({
      success: true,
      message: `Payment of ₹${payAmount.toLocaleString('en-IN')} recorded successfully. Status: ${newStatus}.`,
      data: { student_fee_id: studentFeeId, amount_paid: newPaid, status: newStatus }
    });
  } catch (err) {
    if (conn) await conn.rollback();
    next(err);
  } finally {
    if (conn) conn.release();
  }
}

async function getFeeStructures(req, res, next) {
  try {
    const [structures] = await query(
      `SELECT fs.*, c.course_name, sem.semester_number, sem.academic_year AS sem_year
       FROM fee_structure fs
       LEFT JOIN course c ON fs.course_id = c.course_id
       LEFT JOIN academic_semester sem ON fs.semester_id = sem.semester_id
       ORDER BY fs.academic_year DESC, fs.fee_type ASC`
    );
    res.json({ success: true, data: structures });
  } catch (err) { next(err); }
}

async function addFeeStructure(req, res, next) {
  try {
    const { course_id, semester_id, fee_type, amount, academic_year, due_date } = req.body;
    if (!fee_type || !amount) {
      return res.status(400).json({ success: false, message: 'Fee type and amount are required.' });
    }
    const [result] = await query(
      `INSERT INTO fee_structure (course_id, semester_id, fee_type, amount, academic_year, due_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        course_id || 1,
        semester_id || 1,
        fee_type,
        parseFloat(amount),
        academic_year || '2026-2027',
        due_date || new Date().toISOString().split('T')[0]
      ]
    );
    res.status(201).json({ success: true, message: 'Fee structure created successfully.', fee_structure_id: result.insertId });
  } catch (err) { next(err); }
}

async function getAllPayments(req, res, next) {
  try {
    const [rows] = await query(
      `SELECT p.*, s.student_name, s.roll_no, sf.invoice_no, fs.fee_type
       FROM payment p
       JOIN student_fee sf ON p.student_fee_id = sf.student_fee_id
       JOIN student s ON sf.student_id = s.student_id
       LEFT JOIN fee_structure fs ON sf.fee_structure_id = fs.fee_structure_id
       ORDER BY p.payment_date DESC LIMIT 300`
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════
// LIBRARIAN ENDPOINTS
// ═══════════════════════════════════════════════════

async function getLibraryDashboard(req, res, next) {
  try {
    const [[totalBooks]]    = await query('SELECT COUNT(*) AS c FROM book');
    const [[totalCopies]]   = await query('SELECT COALESCE(SUM(total_copies), 0) AS c FROM book');
    const [[availCopies]]   = await query('SELECT COALESCE(SUM(available_copies), 0) AS c FROM book');
    const [[activeIssues]]  = await query("SELECT COUNT(*) AS c FROM book_issue WHERE status = 'Issued' OR status = 'Overdue'");
    const [[overdueCount]]  = await query("SELECT COUNT(*) AS c FROM book_issue WHERE status = 'Overdue' OR (status = 'Issued' AND due_date < CURDATE())");

    const [recentIssues] = await query(
      `SELECT bi.issue_id, bi.issue_date, bi.due_date, bi.status AS issue_status,
              s.student_name, s.roll_no,
              b.title, b.isbn, bc.accession_no,
              br.return_date,
              GREATEST(0, DATEDIFF(CURDATE(), bi.due_date)) AS days_overdue
       FROM book_issue bi
       JOIN student s ON bi.student_id = s.student_id
       JOIN book_copy bc ON bi.copy_id = bc.copy_id
       JOIN book b ON bc.isbn = b.isbn
       LEFT JOIN book_return br ON bi.issue_id = br.issue_id
       ORDER BY bi.issue_date DESC LIMIT 10`
    );

    res.json({
      success: true,
      data: {
        stats: {
          totalBooks: totalBooks.c,
          totalCopies: parseInt(totalCopies.c) || 0,
          availableCopies: parseInt(availCopies.c) || 0,
          activeIssues: activeIssues.c,
          overdueCount: overdueCount.c
        },
        recentIssues
      }
    });
  } catch (err) { next(err); }
}

async function getBooks(req, res, next) {
  try {
    const { search, category } = req.query;
    let sql = `SELECT b.isbn, b.title, b.edition, b.publication_year, b.language,
                      b.total_copies, b.available_copies, b.shelf_location, b.rack_no,
                      a.author_name, p.publisher_name, cat.category_name
               FROM book b
               LEFT JOIN author a ON b.author_id = a.author_id
               LEFT JOIN publisher p ON b.publisher_id = p.publisher_id
               LEFT JOIN book_category cat ON b.category_id = cat.category_id`;
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push('(b.title LIKE ? OR a.author_name LIKE ? OR b.isbn LIKE ?)');
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }
    if (category) {
      conditions.push('cat.category_name = ?');
      params.push(category);
    }

    if (conditions.length) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY b.title ASC LIMIT 500';

    const [rows] = await query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

async function addBook(req, res, next) {
  let conn;
  try {
    const { isbn, title, author_name, publisher_name, category_name, edition, publication_year, language, total_copies, shelf_location, rack_no } = req.body;
    if (!isbn || !title) {
      return res.status(400).json({ success: false, message: 'ISBN and title are required.' });
    }
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Resolve or create author
    let authorId = null;
    if (author_name && author_name.trim()) {
      const [existAuth] = await conn.execute('SELECT author_id FROM author WHERE author_name = ?', [author_name.trim()]);
      if (existAuth.length > 0) {
        authorId = existAuth[0].author_id;
      } else {
        const [authRes] = await conn.execute('INSERT INTO author (author_name) VALUES (?)', [author_name.trim()]);
        authorId = authRes.insertId;
      }
    }

    // Resolve or create publisher
    let publisherId = null;
    if (publisher_name && publisher_name.trim()) {
      const [existPub] = await conn.execute('SELECT publisher_id FROM publisher WHERE publisher_name = ?', [publisher_name.trim()]);
      if (existPub.length > 0) {
        publisherId = existPub[0].publisher_id;
      } else {
        const [pubRes] = await conn.execute('INSERT INTO publisher (publisher_name) VALUES (?)', [publisher_name.trim()]);
        publisherId = pubRes.insertId;
      }
    }

    // Resolve or create category
    let categoryId = 1;
    if (category_name && category_name.trim()) {
      const [existCat] = await conn.execute('SELECT category_id FROM book_category WHERE category_name = ?', [category_name.trim()]);
      if (existCat.length > 0) {
        categoryId = existCat[0].category_id;
      } else {
        const [catRes] = await conn.execute('INSERT INTO book_category (category_name) VALUES (?)', [category_name.trim()]);
        categoryId = catRes.insertId;
      }
    }

    const copies = parseInt(total_copies) || 1;
    await conn.execute(
      `INSERT INTO book (isbn, title, author_id, publisher_id, category_id, edition, publication_year, language, total_copies, available_copies, shelf_location, rack_no)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         title = VALUES(title), 
         total_copies = total_copies + VALUES(total_copies), 
         available_copies = available_copies + VALUES(available_copies)`,
      [
        isbn.trim(),
        title.trim(),
        authorId,
        publisherId,
        categoryId,
        edition || '1st Edition',
        publication_year || new Date().getFullYear(),
        language || 'English',
        copies,
        copies,
        shelf_location || 'Main Floor',
        rack_no || 'R-01'
      ]
    );

    // Insert copies into book_copy table
    const cleanIsbn = isbn.replace(/[^a-zA-Z0-9]/g, '').slice(-4);
    for (let i = 1; i <= copies; i++) {
      const accessionNo = `ACC-${cleanIsbn}-${Date.now().toString().slice(-4)}${i}`;
      await conn.execute(
        `INSERT IGNORE INTO book_copy (isbn, accession_no, purchase_date, status, condition_status) 
         VALUES (?, ?, CURDATE(), 'Available', 'New')`,
        [isbn.trim(), accessionNo]
      );
    }

    await conn.commit();
    res.status(201).json({ success: true, message: `Book "${title}" added successfully with ${copies} copies.` });
  } catch (err) {
    if (conn) await conn.rollback();
    next(err);
  } finally {
    if (conn) conn.release();
  }
}

async function updateBook(req, res, next) {
  try {
    const { isbn } = req.params;
    const { title, edition, publication_year, language, shelf_location, rack_no } = req.body;
    await query(
      `UPDATE book 
       SET title = COALESCE(?, title), 
           edition = ?, 
           publication_year = ?, 
           language = COALESCE(?, language), 
           shelf_location = ?, 
           rack_no = ? 
       WHERE isbn = ?`,
      [title, edition || null, publication_year || null, language || 'English', shelf_location || null, rack_no || null, isbn]
    );
    res.json({ success: true, message: 'Book updated successfully.' });
  } catch (err) { next(err); }
}

async function getIssues(req, res, next) {
  try {
    const { status, student_id } = req.query;
    let sql = `SELECT bi.issue_id, bi.issue_date, bi.due_date, bi.status AS issue_status, bi.remarks,
                      s.student_name, s.roll_no, s.student_id,
                      b.title, b.isbn, bc.copy_id, bc.accession_no,
                      br.return_date, br.condition_on_return,
                      GREATEST(0, DATEDIFF(CURDATE(), bi.due_date)) AS days_overdue
               FROM book_issue bi
               JOIN student s ON bi.student_id = s.student_id
               JOIN book_copy bc ON bi.copy_id = bc.copy_id
               JOIN book b ON bc.isbn = b.isbn
               LEFT JOIN book_return br ON bi.issue_id = br.issue_id`;
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push('bi.status = ?');
      params.push(status);
    }
    if (student_id) {
      conditions.push('bi.student_id = ?');
      params.push(student_id);
    }

    if (conditions.length) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY bi.issue_date DESC LIMIT 500';

    const [rows] = await query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

async function issueBook(req, res, next) {
  let conn;
  try {
    const { student_id, roll_no, isbn, due_days } = req.body;
    let resolvedStudentId = student_id;

    conn = await pool.getConnection();
    await conn.beginTransaction();

    if (!resolvedStudentId && roll_no) {
      const [stu] = await conn.execute('SELECT student_id FROM student WHERE roll_no = ? LIMIT 1', [roll_no.trim()]);
      if (stu.length) resolvedStudentId = stu[0].student_id;
    }

    if (!resolvedStudentId || !isbn) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Student (ID or Roll No) and Book ISBN are required.' });
    }

    // Determine librarian_id
    let libId = 1;
    if (req.user.staff_id) {
      const [libs] = await conn.execute('SELECT librarian_id FROM librarian WHERE staff_id = ? LIMIT 1', [req.user.staff_id]);
      if (libs.length) libId = libs[0].librarian_id;
    }

    // Find an available copy
    const [copies] = await conn.execute(
      "SELECT copy_id, accession_no FROM book_copy WHERE isbn = ? AND status = 'Available' LIMIT 1",
      [isbn.trim()]
    );
    if (!copies.length) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'No available copies for this book right now.' });
    }
    const copyId = copies[0].copy_id;
    const days = parseInt(due_days) || 14;

    const [issueRes] = await conn.execute(
      `INSERT INTO book_issue (copy_id, student_id, librarian_id, issue_date, due_date, status, remarks)
       VALUES (?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL ? DAY), 'Issued', 'Issued via Staff Portal')`,
      [copyId, resolvedStudentId, libId, days]
    );

    await conn.execute("UPDATE book_copy SET status = 'Issued' WHERE copy_id = ?", [copyId]);
    await conn.execute("UPDATE book SET available_copies = GREATEST(0, available_copies - 1) WHERE isbn = ?", [isbn.trim()]);

    await conn.commit();
    res.status(201).json({
      success: true,
      message: `Book issued successfully. Due in ${days} days. Accession No: ${copies[0].accession_no}.`,
      issue_id: issueRes.insertId
    });
  } catch (err) {
    if (conn) await conn.rollback();
    next(err);
  } finally {
    if (conn) conn.release();
  }
}

async function returnBook(req, res, next) {
  let conn;
  try {
    const { id } = req.params;
    const { condition_on_return, remarks } = req.body || {};

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [issue] = await conn.execute(
      `SELECT bi.*, DATEDIFF(CURDATE(), bi.due_date) AS days_late_calc
       FROM book_issue bi WHERE bi.issue_id = ?`,
      [id]
    );
    if (!issue.length) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'Issue record not found.' });
    }
    if (issue[0].status === 'Returned') {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'This book has already been marked as returned.' });
    }

    const daysLate = Math.max(0, issue[0].days_late_calc || 0);
    const bookCondition = condition_on_return || 'Good';

    // Insert into book_return
    const [retRes] = await conn.execute(
      `INSERT INTO book_return (issue_id, return_date, condition_on_return, days_late, remarks)
       VALUES (?, CURDATE(), ?, ?, ?)`,
      [id, bookCondition, daysLate, remarks || 'Returned via Staff Portal']
    );

    // Update issue status
    await conn.execute("UPDATE book_issue SET status = 'Returned' WHERE issue_id = ?", [id]);

    // Update copy status
    const copyStatus = bookCondition === 'Damaged' ? 'Damaged' : (bookCondition === 'Lost' ? 'Lost' : 'Available');
    await conn.execute("UPDATE book_copy SET status = ? WHERE copy_id = ?", [copyStatus, issue[0].copy_id]);

    // Update book available_copies if returned in usable condition
    const [bc] = await conn.execute('SELECT isbn FROM book_copy WHERE copy_id = ?', [issue[0].copy_id]);
    if (bc.length && copyStatus === 'Available') {
      await conn.execute("UPDATE book SET available_copies = LEAST(total_copies, available_copies + 1) WHERE isbn = ?", [bc[0].isbn]);
    }

    // If late, insert fine record
    if (daysLate > 0) {
      const fineAmount = daysLate * 5.00; // ₹5 per day
      await conn.execute(
        `INSERT INTO fine (student_id, return_id, fine_type, fine_amount, fine_date, payment_status)
         VALUES (?, ?, 'Late Return', ?, CURDATE(), 'Unpaid')`,
        [issue[0].student_id, retRes.insertId, fineAmount]
      );
    }

    await conn.commit();
    res.json({
      success: true,
      message: `Book returned successfully.${daysLate > 0 ? ` (Late by ${daysLate} days. Fine of ₹${daysLate * 5} applied)` : ''}`
    });
  } catch (err) {
    if (conn) await conn.rollback();
    next(err);
  } finally {
    if (conn) conn.release();
  }
}

async function getOverdueBooks(req, res, next) {
  try {
    const [rows] = await query(
      `SELECT bi.issue_id, bi.issue_date, bi.due_date,
              GREATEST(0, DATEDIFF(CURDATE(), bi.due_date)) AS days_overdue,
              s.student_name, s.roll_no, s.email, s.phone,
              b.title, b.isbn, bc.accession_no
       FROM book_issue bi
       JOIN student s ON bi.student_id = s.student_id
       JOIN book_copy bc ON bi.copy_id = bc.copy_id
       JOIN book b ON bc.isbn = b.isbn
       WHERE bi.status IN ('Issued', 'Overdue') AND bi.due_date < CURDATE()
       ORDER BY days_overdue DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

module.exports = {
  getProfile,
  requireRole,
  // TNP
  getTNPDashboard, getCompanies, addCompany, updateCompany,
  getDrives, addDrive, updateDriveStatus,
  getApplications, shortlistApplication, getPlacements,
  // Finance
  getFinanceDashboard, getStudentsWithFees, getStudentFeeDetails,
  recordPayment, getFeeStructures, addFeeStructure, getAllPayments,
  // Library
  getLibraryDashboard, getBooks, addBook, updateBook,
  getIssues, issueBook, returnBook, getOverdueBooks
};

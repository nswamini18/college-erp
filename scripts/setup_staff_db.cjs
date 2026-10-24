/**
 * Staff Module Database Setup
 * - Adds TNP_HEAD, FINANCE, LIBRARIAN roles to user_account
 * - Inserts staff member records
 * - Creates user_account logins for all 3 staff members
 */
const path = require('path');
const bcrypt = require(path.join(__dirname, '../server/node_modules/bcryptjs'));
const mysql = require(path.join(__dirname, '../server/node_modules/mysql2/promise'));

async function setup() {
  const db = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Raj@2026',
    database: 'college_erp',
    multipleStatements: true
  });

  console.log('[SETUP] Connected to MySQL college_erp');

  try {
    // 1. Extend the role ENUM to include staff roles
    console.log('[1] Extending user_account.role ENUM...');
    await db.execute(
      `ALTER TABLE user_account MODIFY COLUMN role ENUM('STUDENT','FACULTY','ADMIN','TNP_HEAD','FINANCE','LIBRARIAN') NOT NULL`
    );
    console.log('    ✔ role enum extended');

    // 2. Check if staff_id column exists in user_account (it already does per inspection)
    console.log('[2] Verifying staff_id FK column in user_account...');
    const [cols] = await db.execute("SHOW COLUMNS FROM user_account LIKE 'staff_id'");
    if (cols.length === 0) {
      await db.execute(`ALTER TABLE user_account ADD COLUMN staff_id INT NULL REFERENCES staff(staff_id)`);
      console.log('    ✔ staff_id column added');
    } else {
      console.log('    ✔ staff_id column already present');
    }

    // 3. Hash passwords
    const tnpPass   = await bcrypt.hash('TNP@Campus2026', 10);
    const finPass   = await bcrypt.hash('Finance@Campus2026', 10);
    const libPass   = await bcrypt.hash('Library@Campus2026', 10);

    // 4. Check if staff members already exist
    const [existingStaff] = await db.execute(
      "SELECT email FROM staff WHERE email IN (?, ?, ?)",
      ['tnp.head@campus.edu', 'finance@campus.edu', 'sunita.joshi@campus.edu']
    );
    const existingEmails = existingStaff.map(r => r.email);

    let tnpStaffId, finStaffId, libStaffId;

    // 5. Insert TNP Head staff row
    if (!existingEmails.includes('tnp.head@campus.edu')) {
      const [r] = await db.execute(
        `INSERT INTO staff (first_name, middle_name, last_name, email, phone_no, department_id, designation_id, joining_date, status)
         VALUES ('Rajesh', 'Kumar', 'Sharma', 'tnp.head@campus.edu', '9876500001', 1, 5, CURDATE(), 'Active')`
      );
      tnpStaffId = r.insertId;
      console.log('    ✔ TNP Head staff row inserted (staff_id:', tnpStaffId, ')');
    } else {
      const [r] = await db.execute("SELECT staff_id FROM staff WHERE email = ?", ['tnp.head@campus.edu']);
      tnpStaffId = r[0].staff_id;
      console.log('    ✔ TNP Head already exists (staff_id:', tnpStaffId, ')');
    }

    // 6. Insert Finance Officer staff row
    if (!existingEmails.includes('finance@campus.edu')) {
      const [r] = await db.execute(
        `INSERT INTO staff (first_name, middle_name, last_name, email, phone_no, department_id, designation_id, joining_date, status)
         VALUES ('Priya', 'Deepak', 'Mehta', 'finance@campus.edu', '9876500002', 1, 5, CURDATE(), 'Active')`
      );
      finStaffId = r.insertId;
      console.log('    ✔ Finance Officer staff row inserted (staff_id:', finStaffId, ')');
    } else {
      const [r] = await db.execute("SELECT staff_id FROM staff WHERE email = ?", ['finance@campus.edu']);
      finStaffId = r[0].staff_id;
      console.log('    ✔ Finance Officer already exists (staff_id:', finStaffId, ')');
    }

    // 7. Insert Librarian staff row (separate person from existing librarian entry)
    if (!existingEmails.includes('sunita.joshi@campus.edu')) {
      const [r] = await db.execute(
        `INSERT INTO staff (first_name, middle_name, last_name, email, phone_no, department_id, designation_id, joining_date, status)
         VALUES ('Sunita', 'Ramesh', 'Joshi', 'sunita.joshi@campus.edu', '9876500003', 1, 5, CURDATE(), 'Active')`
      );
      libStaffId = r.insertId;
      console.log('    ✔ Librarian staff row inserted (staff_id:', libStaffId, ')');
    } else {
      const [r] = await db.execute("SELECT staff_id FROM staff WHERE email = ?", ['sunita.joshi@campus.edu']);
      libStaffId = r[0].staff_id;
      console.log('    ✔ Librarian already exists (staff_id:', libStaffId, ')');
    }

    // 8. Insert user_account records (check for existing first)
    const staffAccounts = [
      { identifier: 'TNP-HEAD', email: 'tnp.head@campus.edu', hash: tnpPass, role: 'TNP_HEAD', staff_id: tnpStaffId },
      { identifier: 'FINANCE-01', email: 'finance@campus.edu', hash: finPass, role: 'FINANCE', staff_id: finStaffId },
      { identifier: 'LIB-001', email: 'librarian@campus.edu', hash: libPass, role: 'LIBRARIAN', staff_id: libStaffId },
    ];

    for (const acc of staffAccounts) {
      const [existing] = await db.execute(
        "SELECT user_id FROM user_account WHERE identifier = ? OR email = ?",
        [acc.identifier, acc.email]
      );
      if (existing.length > 0) {
        // Update password hash and role
        await db.execute(
          "UPDATE user_account SET password_hash = ?, role = ?, staff_id = ?, is_active = 1 WHERE identifier = ? OR email = ?",
          [acc.hash, acc.role, acc.staff_id, acc.identifier, acc.email]
        );
        console.log(`    ✔ Updated user_account for ${acc.identifier} (${acc.role})`);
      } else {
        await db.execute(
          `INSERT INTO user_account (identifier, email, password_hash, role, staff_id, is_active)
           VALUES (?, ?, ?, ?, ?, 1)`,
          [acc.identifier, acc.email, acc.hash, acc.role, acc.staff_id]
        );
        console.log(`    ✔ Created user_account for ${acc.identifier} (${acc.role})`);
      }
    }

    // 9. Verify
    console.log('\n[VERIFY] Staff accounts in user_account:');
    const [verify] = await db.execute(
      "SELECT user_id, identifier, email, role, staff_id, is_active FROM user_account WHERE role IN ('TNP_HEAD','FINANCE','LIBRARIAN')"
    );
    verify.forEach(r => console.log('  ', r));

    console.log('\n[DONE] Staff database setup complete!');
  } catch (err) {
    console.error('[ERROR]', err.message);
    throw err;
  } finally {
    await db.end();
  }
}

setup();

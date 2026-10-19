# University ERP — Complete Windows Setup & Integration Guide

This guide provides end-to-end instructions for running the University ERP backend, MySQL database, frontend portal, and Google Sheets synchronization on Windows.

---

## 1. System Requirements & Environment

| Component | Minimum Version | Installed / Verified on System |
| :--- | :--- | :--- |
| **Operating System** | Windows 10 / 11 (x64) | Windows (PowerShell 5.1 / 7+) |
| **Node.js** | v18.0.0+ (LTS) | **v24.21.0** |
| **npm** | v9.0.0+ | **v11.19.0** |
| **MySQL Server** | 8.0+ | **MySQL80** Windows Service (Port 3306) |
| **MySQL Workbench** | 8.0+ | Installed & Connected |

---

## 2. Directory Structure Overview

```
college-erp/
├── database/
│   ├── schema.sql              # Normalized MySQL 8 schema (45+ tables + auth & audit)
│   ├── seed.sql                # Prototype development seed accounts & sample records
│   ├── import_csv.cjs          # Safe transactional CSV importer (--dry-run supported)
│   ├── csv_mapping.md          # Complete column mapping documentation
│   ├── import_validation.md    # Validation rules, date formats, and rollback strategy
│   └── README.md               # Detailed database instructions & verification queries
├── server/
│   ├── config/db.js            # MySQL2 connection pool with health check
│   ├── controllers/            # Auth, Student, Faculty controllers
│   ├── middleware/             # JWT authentication & RBAC middleware
│   ├── routes/                 # API endpoints (/auth, /students, /faculty, /sync)
│   ├── services/               # Google Sheets API integration service
│   ├── test/health.test.js     # Automated test suite (18 assertions)
│   ├── .env.example            # Backend environment template
│   └── index.js                # Express server entry point
├── src/                        # Preserved React frontend with dual-portal UI
│   ├── services/api.ts         # Centralized API client with offline fallback
│   └── context/AuthContext.tsx # Connected authentication context
├── data_import/                # 45 original CSV files from Google Sheets (untouched)
├── .env.example                # Root environment template
└── package.json                # Frontend & backend workspace scripts
```

---

## 3. Step-by-Step Configuration

### Step 3.1: Configure Environment Variables (`.env`)
1. Create a copy of `.env.example` named `.env` in the root and in `server/`:
   ```powershell
   Copy-Item .env.example .env
   Copy-Item server/.env.example server/.env
   ```
2. Open `server/.env` and update your actual MySQL password:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173

   # MySQL80 Configuration
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=YourActualMySQLPasswordHere
   DB_NAME=college_erp
   DB_CONNECTION_LIMIT=10

   # JWT Secret Key
   JWT_SECRET=super_secret_university_erp_jwt_key_2026_xyz987
   JWT_EXPIRES_IN=7d

   # Google Sheets Integration (Configure when ready)
   GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./service_account.json
   GOOGLE_SHEET_ID=your_google_spreadsheet_id_here
   SYNC_ADMIN_KEY=sync_admin_secure_passphrase_2026
   ```
   > [!IMPORTANT]
   > Never commit `.env` or `service_account.json` to version control. They are strictly ignored by `.gitignore`.

---

## 4. Database Setup in MySQL Workbench

Per safety rules, no database alteration or data loading is done automatically. You can review and execute the scripts manually:

### Step 4.1: Create Schema
1. Open **MySQL Workbench**.
2. Connect to your `Local instance MySQL80`.
3. Open `database/schema.sql` (`Ctrl+Shift+O`).
4. Click the yellow lightning bolt icon (**Execute**) or press `Ctrl+Shift+Enter`.
5. Check the **Action Output** at the bottom to verify all 45+ tables created successfully.

### Step 4.2: (Optional) Load Development Seed
If you want to immediately test the frontend against the database without importing all 29,400+ CSV records:
1. Open `database/seed.sql` in MySQL Workbench.
2. Execute the script.
3. This provisions:
   - **Student Accounts (Password: `Student@2026`):**
     - Aarav Sharma: `aarav.sharma@college.edu` or `CS2023001`
     - Kavya Kulkarni: `f24ce001@student.example.edu` or `31001`
     - Siddharth Nale: `f24ce002@student.example.edu` or `31002`
   - **Faculty Accounts (Password: `Faculty@2026`):**
     - Dr. Arvind Sharma (HOD): `arvind.sharma@college.edu` or `FAC-CSE-001`
     - Prof. Sunita Rao: `sunita.rao@college.edu` or `FAC-CSE-002`
     - Prof. Ashwini Nair: `faculty1@example.edu`
     - Prof. Varun Pawar: `faculty2@example.edu`
   - **Administrator Account (Password: `Admin@2026`):**
     - `admin@college.edu` or `ADMIN-001`

> [!NOTE]
> When you run the full import (`node database/import_csv.cjs`), login accounts in `user_account` are automatically generated for **all 1,000 students** (Password: `Student@2026`, login by Roll No or Student Email) and **all 60 faculty members** (Password: `Faculty@2026`, login by Faculty Email).

---

## 5. CSV Validation & Repeatable Import

### Step 5.1: Run Safe Pre-Flight Validation (Dry Run)
Before modifying the database, run the pre-flight dry run:
```powershell
node database/import_csv.cjs --dry-run
```
Expected output:
```
Summary: Processed 45 CSV files, total 29401 records validated.
[DRY RUN COMPLETE] Schema alignment and CSV parse verified successfully.
No database modifications were made.
```

### Step 5.2: Execute Live Import (After Approval)
Once you have reviewed the schema in MySQL Workbench:
```powershell
node database/import_csv.cjs
```
This utility:
- Imports all 29,401 records across all 45 CSV files in strict dependency order.
- Automatically handles date normalization (`M/D/YYYY` -> `YYYY-MM-DD`).
- Uses parameterized batch inserts (`?`) with transaction rollback protection.

---

## 6. Running Backend and Frontend

### Step 6.1: Start the Backend Server
In a Windows Terminal or PowerShell window:
```powershell
npm run server:dev
```
Or directly from `server/`:
```powershell
cd server
npm run dev
```
You will see:
```
=====================================================
 UNIVERSITY ERP BACKEND STARTED ON PORT 5000
 Health endpoint: http://localhost:5000/api/health
 Allowed Frontend Origin: http://localhost:5173
=====================================================
[DB STATUS] Connected to MySQL database 'college_erp'.
```

### Step 6.2: Start the Frontend Application
In a second Windows Terminal or PowerShell window:
```powershell
npm run dev
```
Open your browser at: `http://localhost:5173`

---

## 7. Google Sheets API Integration Setup

MySQL remains the authoritative database. Google Sheets is used as a secondary reporting export destination.

### Step 7.1: Google Cloud Service Account Setup
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project (e.g., `University-ERP-Reporting`).
3. In the sidebar, navigate to **APIs & Services** -> **Library**.
4. Search for **Google Sheets API** and click **Enable**.
5. Go to **APIs & Services** -> **Credentials** -> **Create Credentials** -> **Service Account**.
6. Give it a name (e.g., `erp-sheets-sync`) and click **Create and Continue**.
7. Under the created Service Account, go to the **Keys** tab -> **Add Key** -> **Create new key** -> **JSON**.
8. Save the downloaded JSON file as `server/service_account.json` (do not rename or commit to Git).
9. Copy the service account's email address (e.g., `erp-sheets-sync@your-project.iam.gserviceaccount.com`).

### Step 7.2: Share Google Spreadsheet
1. Create a Google Sheet or open your existing reporting spreadsheet.
2. Click **Share** (top-right).
3. Paste the Service Account email address and grant **Editor** permissions.
4. Copy the Spreadsheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/`**`<YOUR_SPREADSHEET_ID>`**`/edit`
5. Set `GOOGLE_SHEET_ID` in `server/.env`.

### Step 7.3: Test Synchronization
Trigger the synchronization using PowerShell or curl:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/sync/sheets" `
  -Method POST `
  -Headers @{ "x-sync-admin-key" = "sync_admin_secure_passphrase_2026" }
```
The endpoint:
- Sanitizes the reporting dataset (excluding all personal contacts, passwords, and tokens).
- Idempotently updates the `Academic_Results_Summary` worksheet using batch writes.
- Returns a JSON response with the number of records synchronized.

---

## 8. Troubleshooting Common Windows Issues

### Issue 1: MySQL `Access denied for user 'root'@'localhost'`
- **Cause:** Incorrect MySQL root password in `.env`.
- **Solution:** Verify your MySQL password by logging in via MySQL Workbench or CLI (`mysql -u root -p`). Update `DB_PASSWORD` in `server/.env`.

### Issue 2: `Port 5000 is already in use`
- **Cause:** Another process is listening on port 5000 (often Apple AirPlay or another Node server).
- **Solution:** In `server/.env`, change `PORT=5001`, and update `VITE_API_BASE_URL=http://localhost:5001/api` in frontend.

### Issue 3: CORS Error in Browser Console
- **Cause:** Frontend URL does not match backend `FRONTEND_URL`.
- **Solution:** Ensure Vite is running on `http://localhost:5173` and backend `server/index.js` allows it.

### Issue 4: Running automated tests
You can run the full test suite anytime with:
```powershell
npm run server:test
```
All 18 tests will verify endpoint connectivity, JWT authentication, RBAC boundaries, and input validation without modifying any database records.

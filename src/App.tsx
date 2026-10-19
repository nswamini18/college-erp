import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import { StudentLayout } from './components/layout/StudentLayout';
import { FacultyLayout } from './components/layout/FacultyLayout';

// Common Pages
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Student Pages
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { StudentAttendancePage } from './pages/student/StudentAttendancePage';
import { StudentFeesPage } from './pages/student/StudentFeesPage';
import { StudentLibraryPage } from './pages/student/StudentLibraryPage';
import { StudentExamPage } from './pages/student/StudentExamPage';
import { StudentResultPage } from './pages/student/StudentResultPage';
import { StudentPlacementPage } from './pages/student/StudentPlacementPage';

// Faculty Pages
import { FacultyDashboardPage } from './pages/faculty/FacultyDashboardPage';
import { FacultyAttendancePage } from './pages/faculty/FacultyAttendancePage';
import { FacultyGradingPage } from './pages/faculty/FacultyGradingPage';
import { FacultyLeavePage } from './pages/faculty/FacultyLeavePage';
import { FacultyPayrollPage } from './pages/faculty/FacultyPayrollPage';

// Smart Root Redirect based on active session
const RootRedirect: React.FC = () => {
  const { user, role } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role === 'FACULTY') return <Navigate to="/faculty/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Dedicated Student Portal Routes */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboardPage />} />
            <Route path="attendance" element={<StudentAttendancePage />} />
            <Route path="fees" element={<StudentFeesPage />} />
            <Route path="library" element={<StudentLibraryPage />} />
            <Route path="examination" element={<StudentExamPage />} />
            <Route path="results" element={<StudentResultPage />} />
            <Route path="placement" element={<StudentPlacementPage />} />
          </Route>

          {/* Dedicated Faculty Portal Routes */}
          <Route path="/faculty" element={<FacultyLayout />}>
            <Route index element={<Navigate to="/faculty/dashboard" replace />} />
            <Route path="dashboard" element={<FacultyDashboardPage />} />
            <Route path="attendance" element={<FacultyAttendancePage />} />
            <Route path="grading" element={<FacultyGradingPage />} />
            <Route path="leave" element={<FacultyLeavePage />} />
            <Route path="payroll" element={<FacultyPayrollPage />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

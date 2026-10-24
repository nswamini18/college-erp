import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { TNPDashboardPage } from './TNPDashboardPage';
import { FinanceDashboardPage } from './FinanceDashboardPage';
import { LibrarianDashboardPage } from './LibrarianDashboardPage';

export const StaffDashboardPage: React.FC = () => {
  const { role } = useAuth();

  if (role === 'TNP_HEAD') {
    return <TNPDashboardPage />;
  }

  if (role === 'FINANCE') {
    return <FinanceDashboardPage />;
  }

  return <LibrarianDashboardPage />;
};

export default StaffDashboardPage;

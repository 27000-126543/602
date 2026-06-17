import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import Layout from '@/components/Layout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import VenueList from '@/pages/VenueList';
import VenueDetail from '@/pages/VenueDetail';
import AlertCenter from '@/pages/AlertCenter';
import ContractVerify from '@/pages/ContractVerify';
import ReportCenter from '@/pages/ReportCenter';
import PermissionManage from '@/pages/PermissionManage';
import { useEffect } from 'react';

function ProtectedRoute({ children, permission }: { children: React.ReactNode; permission?: string }) {
  const { isAuthenticated, hasPermission } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
      } />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute permission="dashboard">
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/venues" element={
        <ProtectedRoute permission="venue_detail">
          <Layout>
            <VenueList />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/venues/:id" element={
        <ProtectedRoute permission="venue_detail">
          <Layout>
            <VenueDetail />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/alerts" element={
        <ProtectedRoute permission="alerts">
          <Layout>
            <AlertCenter />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/contracts" element={
        <ProtectedRoute permission="contracts">
          <Layout>
            <ContractVerify />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/reports" element={
        <ProtectedRoute permission="reports">
          <Layout>
            <ReportCenter />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/permissions" element={
        <ProtectedRoute permission="permissions">
          <Layout>
            <PermissionManage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

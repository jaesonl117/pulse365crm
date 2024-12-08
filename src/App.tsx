import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterTenantPage } from './pages/auth/RegisterTenantPage';
import { RegistrationSuccessPage } from './pages/auth/RegistrationSuccessPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { useTheme } from './hooks/useTheme';
import { Toaster } from 'react-hot-toast';
import { DashboardPage } from './pages/DashboardPage';
import { LeadsPage } from './pages/LeadsPage';
import { MessagingPage } from './pages/MessagingPage';
import { CallsPage } from './pages/CallsPage';
import { EmailPage } from './pages/EmailPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { ReportsPage } from './pages/ReportsPage';
import { LogsPage } from './pages/LogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  useTheme();

  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterTenantPage />} />
          <Route path="/registration-success" element={<RegistrationSuccessPage />} />
          
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="messaging" element={<MessagingPage />} />
            <Route path="calls" element={<CallsPage />} />
            <Route path="email" element={<EmailPage />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="logs" element={<LogsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DoctorSetup from './pages/DoctorSetup';
import { AuthProvider, useAuth } from './context/AuthContext'; // Added useAuth
import ProfileEdit from './pages/ProfileEdit';

// 1. Refactored ProtectedRoute to use Context
const ProtectedRoute = ({ children, role }: { children: React.ReactElement, role: string }) => {
  const { user, loading } = useAuth();

  // Show a spinner while the AuthProvider checks localStorage on boot
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (user.role !== role) return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 2. Added protection to Doctor Setup too */}
          <Route path="/doctor/setup" element={
            <ProtectedRoute role="Doctor">
              <DoctorSetup />
            </ProtectedRoute>
          } />

          <Route path="/patient" element={
            <ProtectedRoute role="Patient">
              <PatientDashboard />
            </ProtectedRoute>
          } />

          <Route path="/doctor" element={
            <ProtectedRoute role="Doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } />

          {/* Make sure this is also protected! */}
          <Route path="/doctor/profile" element={
            <ProtectedRoute role="Doctor">
              <ProfileEdit />
            </ProtectedRoute>} />

          <Route path="/admin" element={
            <ProtectedRoute role="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* 3. Fallback Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
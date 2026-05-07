import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Redirects unauthenticated users to /login
// Redirects authenticated users away from /login and /register
function ProtectedRoute({ allowedRoles, guestOnly = false }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  // Guest-only routes (login, register) — redirect authenticated users to their dashboard
  if (guestOnly && isAuthenticated) {
    if (role === 'instructor') return <Navigate to="/dashboard/instructor/courses" replace />;
    if (role === 'admin') return <Navigate to="/dashboard/admin/users" replace />;
    return <Navigate to="/dashboard/my-courses" replace />;
  }

  // Protected routes — redirect unauthenticated users to login
  if (!guestOnly && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check — redirect to home if role not allowed
  if (!guestOnly && allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

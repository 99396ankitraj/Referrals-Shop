import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export function RequireAuth({ children, redirectTo = '/login' }) {
  const token = useSelector((s) => s.auth.token);
  const location = useLocation();
  if (!token) return <Navigate to={redirectTo} replace state={{ from: location }} />;
  return children;
}

export function RequireGuest({ children, redirectTo = '/shop' }) {
  const token = useSelector((s) => s.auth.token);
  if (token) return <Navigate to={redirectTo} replace />;
  return children;
}

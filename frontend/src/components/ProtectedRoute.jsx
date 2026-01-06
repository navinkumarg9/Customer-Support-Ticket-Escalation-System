import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ allowedRole, children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <h1>Access Denied</h1>;
  }

  return children;
}

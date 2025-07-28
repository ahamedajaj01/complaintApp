import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, allowedRoles=[] }) => {
  const { isAuthenticated, authReady, userData } = useSelector((state) => state.auth);

  if (!authReady) return <p>Loading...</p>;

  // Ensure role exists
  const role = userData?.prefs?.role;
  if (!isAuthenticated || !role) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user's role is allowed
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/NoPageFound" replace />;
  }

  return children;
};

export default PrivateRoute;

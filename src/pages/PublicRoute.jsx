import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, authReady, userData } = useSelector((state) => state.auth);

  // Wait until auth state is ready
  if (!authReady) return <p>Loading...</p>;

  // Only redirect if authenticated and role exists
  if (isAuthenticated && userData?.prefs?.role) {
    const redirectPath = userData.prefs.role === "admin" ? "/adminDashboard" : "/userDashboard";
    return <Navigate to={redirectPath} replace />;
  }

  // Otherwise, allow access to public page (like login/register)
  return children;
};

export default PublicRoute;

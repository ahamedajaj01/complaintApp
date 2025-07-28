// notAuthorized page only admin can access
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const NotAuthorized = ({children}) => {
const { isAuthenticated, authReady, userData } = useSelector((state) => state.auth);
const role = userData?.prefs?.role;
    // Wait until auth state is ready
    if (!authReady) return <p>Loading...</p>;
    // If user is authenticated but not an admin, redirect to user dashboard
    if (isAuthenticated && role !== "admin") {
        return <Navigate to="/userDashboard" replace />;
    }
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    // If user is authenticated and an admin, allow access to the children
    return children;
}
export default NotAuthorized;
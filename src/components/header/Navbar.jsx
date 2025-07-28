// src/components/Navbar.jsx
import React from "react";
import { Link , useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser as logoutSession } from "../../appFeatures/authSlice";


function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
  const {isAuthenticated,authReady, userData} = useSelector((state) => state.auth)

  // Prevent rendering navbar before auth check completes
  if(!authReady) return null;

    const handleLogout = async ()=>{
    try {
      await dispatch(logoutSession());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
  
    }
  };

  // Determine the link based on authentication status
  const role = userData?.prefs?.role;
  const homeLink = isAuthenticated ? (role === "admin" ? "/adminDashboard" : "/userDashboard") : "/";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to={homeLink}>
          ComplaintBox
        </Link>
           {isAuthenticated && (
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
      
     
    </nav>
  );
}



export default Navbar;

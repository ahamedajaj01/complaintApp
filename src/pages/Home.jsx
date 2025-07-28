import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";


function Home() {
    const {isAuthenticated, authReady,userData} = useSelector((state) => state.auth)

    if(!authReady) return <p>Loading...</p>;

    const dashboardLink = isAuthenticated ? (userData?.role === "admin" ? "/adminDashboard" : "/userDashboard") : "/login";

  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-4">Welcome to ComplaintBox</h1>
      <p className="lead">
        A platform where users can register their complaints and the admin can take action on them.
      </p>
      <div className="mt-4">
        <Link to={dashboardLink} className="btn btn-primary me-3">
          Login
        </Link>
        <Link to={dashboardLink} className="btn btn-outline-secondary my-4">
          Register
        </Link>
      </div>
    </div>
  );
}

export default Home;

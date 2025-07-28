import React from 'react';

function NoPageFound() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center px-3">
      <h1 className="display-1 fw-bold text-danger mb-3">404</h1>
      <h2 className="mb-3">Page Not Found</h2>
      <p className="text-muted w-75 mx-auto">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
    </div>
  );
}

export default NoPageFound;

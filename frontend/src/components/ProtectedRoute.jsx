import React from 'react';
import { Outlet } from 'react-router-dom';

// NOTE: We are temporarily commenting out these imports and the logic below
// to allow for frontend development without a backend.
// import { useSelector } from 'react-redux';
// import { Navigate } from 'react-router-dom';

const ProtectedRoute = () => {
  // const { isAuthenticated } = useSelector((state) => state.auth);

  // To re-enable route protection later, uncomment the imports above and
  // the line below, then delete the `return <Outlet />;` line.
  // return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;

  // For now, we always render the child routes.
  return <Outlet />;
};

export default ProtectedRoute;

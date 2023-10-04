import { Navigate, Outlet } from "react-router";

const NestedRoutes = ({ isAllowedNested, children }) => {
  if (!isAllowedNested) {
    return <Navigate to="/worker-dashboard" replace />;
  }

  return children ? children : <Outlet />;
};

export default NestedRoutes;

// import React from "react";
// import { authData } from "../authData";
// import { useNavigate } from "react-router-dom";

// const PrivateRoutes = ({ children, user }) => {
//   const navigate = useNavigate();
//   //   const { isAuthenticated, isActivated } = authData;

//   if (!user) {
//     return navigate("/login");
//   }

//   return children;
// };

// export default PrivateRoutes;

import { Navigate, Outlet } from "react-router";

const PrivateRoutes = ({ isAllowed, children }) => {
  if (!isAllowed) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoutes;

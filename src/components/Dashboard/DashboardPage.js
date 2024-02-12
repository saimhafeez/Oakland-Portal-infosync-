import React from "react";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import { useNavigate } from "react-router";
import SuperAdmin from "../../pages/SuperAdmin";
import SuperAdminSidebar from "../sidebar/SuperAdminSidebar";
import UserDashboard from "../tables/UserDashboard";
import { useAppContext } from "../../context/appContext";
import ManagersDashboard from "../tables/ManagersDashboard";

const DashboardPage = (props) => {
  const navigate = useNavigate();
  const handleWork = () => {
    if (props.userJdesc === "Extractor") {
      // handleAuthToken();
      navigate("/extraction");
    } else if (props.userJdesc === "QA-Extractor") {
      navigate("/qa-extraction");
    } else if (props.userJdesc === "DimAna") {
      navigate("/dimensions-analyst");
    } else if (props.userJdesc === "QA-DimAna") {
      navigate("/dimensional-qa-analyst");
    }
  };

  const { sidebarOpened } = useAppContext()


  return (
    <>
      <Header
        userEmail={props.userEmail}
        userRole={props.userRole}
        userJdesc={props.userJdesc}
        user={props.user}
      />

      {props.userRole === "admin" ? <SuperAdminSidebar /> : <Sidebar />}

      <div
        className={`${(sidebarOpened || props.userRole !== "admin") && "set-right-container-252"} p-3`} style={{ height: 'calc(100vh - 70px)', overflow: 'auto' }}
      >
        <div className="row align-items-center">
          <div className="col-lg-6 text-center text-lg-start">
            <h5>
              Welcome {props.userEmail ? props.userEmail : "Please Login"}
            </h5>
          </div>
          <div className="col-lg-6">
            <div className="text-center text-lg-end">
              {props.userRole === "worker" && (
                <button className="start-btn" onClick={handleWork}>
                  Start Work
                </button>
              )}
            </div>
          </div>
        </div>
        {/* TABLES */}
        {props.userRole === "worker" && <UserDashboard user={props.user} />}

        {props.userRole === "admin" && <SuperAdmin />}

        {props.userRole === "manager" && <ManagersDashboard user={props.user} />}

      </div>
    </>
  );
};

export default DashboardPage;

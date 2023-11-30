import React from "react";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import ExtractorTable from "../tables/ExtractorTable";
import ExtractorQATable from "../tables/ExtractorQATable";
import AdminTable from "../tables/AdminTable";
import ManagerTable from "../tables/ManagerTable";
import DimensionAnalystTable from "../tables/DimensionAnalystTable";
import DimensionQATable from "../tables/DimensionQATable";
import ManagerExtractorTable from "../tables/ManagerExtractorTable";
import ManagerQAExtractorTable from "../tables/ManagerQAExtractorTable";
import ManagerDimensionsTable from "../tables/ManagerDimensionsTable";
import ManagerQADimensionsTable from "../tables/ManagerQADimensionsTable";
import SuperAdmin from "../../pages/SuperAdmin";
import SuperAdminSidebar from "../sidebar/SuperAdminSidebar";

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
  return (
    <>
      <Header
        userEmail={props.userEmail}
        userRole={props.userRole}
        userJdesc={props.userJdesc}
        user={props.user}
      />

      {props.userRole === "admin" ? <SuperAdminSidebar /> : <Sidebar />}

      <div className="set-right-container-252 p-3" style={{ height: 'calc(100vh - 70px)', overflow: 'auto' }}>
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
        {props.userRole === "worker" && props.userJdesc === "Extractor" && (<ExtractorTable user={props.user} />)}

        {props.userRole === "worker" && props.userJdesc === "QA-Extractor" && (<ExtractorQATable user={props.user} />)}

        {props.userRole === "worker" && props.userJdesc === "DimAna" && <DimensionAnalystTable user={props.user} />}

        {props.userRole === "worker" && props.userJdesc === "QA-DimAna" && <DimensionQATable user={props.user} />}



        {props.userRole === "admin" && <SuperAdmin />}


        {props.userRole === "manager" && props.userJdesc === "Extractor" && <ManagerExtractorTable />}

        {props.userRole === "manager" && props.userJdesc === "QA-Extractor" && <ManagerQAExtractorTable />}

        {props.userRole === "manager" && props.userJdesc === "DimAna" && <ManagerDimensionsTable />}

        {props.userRole === "manager" && props.userJdesc === "QA-DimAna" && <ManagerQADimensionsTable />}

      </div>
    </>
  );
};

export default DashboardPage;

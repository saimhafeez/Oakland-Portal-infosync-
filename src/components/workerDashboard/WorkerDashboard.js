import React from "react";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import ExtractorTable from "../tables/ExtractorTable";
import ExtractorQATable from "../tables/ExtractorQATable";

const WorkerDashboard = (props) => {
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
      />
      <Sidebar />
      <div className="set-right-container-252 p-3">
        <div className="row align-items-center">
          <div className="col-lg-6 text-center text-lg-start">
            <h5>
              Welcome {props.userEmail ? props.userEmail : "Please Login"}
            </h5>
          </div>
          <div className="col-lg-6">
            <div className="text-center text-lg-end">
              <button className="start-btn" onClick={handleWork}>
                Start Work
              </button>
            </div>
          </div>
        </div>
        {/* TABLES */}
        {props.userJdesc === "Extractor" && <ExtractorTable />}
        {props.userJdesc === "QA-Extractor" && <ExtractorQATable />}
      </div>
    </>
  );
};

export default WorkerDashboard;

import React from "react";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

const WorkerDashboard = (props) => {
  // const handleAuthToken = () => {
  //   if (props.user) {
  //     // Get the authentication token
  //     props.user
  //       .getIdToken()
  //       .then((token) => {
  //         // Define the API endpoint URL
  //         const apiUrl = "http://161.97.167.225:5000/api/get_job";
  //         console.log(token);
  //         // Make an authenticated API request
  //         fetch(apiUrl, {
  //           method: "GET",
  //           headers: {
  //             Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
  //           },
  //         })
  //           .then((response) => {
  //             if (!response.ok) {
  //               throw new Error("Network response was not ok");
  //             }
  //             return response.json();
  //           })
  //           .then((data) => {
  //             // Handle the API response data
  //             console.log("API Response:", data);
  //           })
  //           .catch((error) => {
  //             // Handle any errors
  //             console.error("Error:", error);
  //           });
  //       })
  //       .catch((error) => {
  //         // Handle any errors while getting the token
  //         console.error("Token Error:", error);
  //       });
  //   }
  // };
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
      </div>
    </>
  );
};

export default WorkerDashboard;

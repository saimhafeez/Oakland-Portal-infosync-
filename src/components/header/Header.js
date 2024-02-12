import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useAppContext } from "../../context/appContext";
import { Menu } from "@mui/icons-material";

const Header = (props) => {
  const navigate = useNavigate();
  // SIGN OUT
  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const { sidebarOpened, toggleSidebar } = useAppContext()

  return (
    <div className="navbar-my py-2">
      <div className="set-container">
        <ul>
          {props.userRole === "admin" && <li>
            <button className="btn " onClick={toggleSidebar}>
              <Menu htmlColor="white" />
            </button>
          </li>}
          <li>
            <strong className="h1">LOGO HERE</strong>
          </li>
          <li>
            <strong className="h6">
              Email:
              <span className="set-underline-span">
                &nbsp;{props.userEmail}
              </span>
            </strong>
          </li>
          {/* <li>
            <strong className="h6">
              Job Role:
              <span className="set-underline-span">&nbsp;{props.userRole}</span>
            </strong>
          </li> */}
          <li>
            <strong className="h6">
              Job Description:
              <span className="set-underline-span">
                &nbsp;{props.userJdesc}
              </span>
            </strong>
          </li>
          <li>
            <button onClick={handleSignOut} className="btn-white-still">
              SignOut
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;

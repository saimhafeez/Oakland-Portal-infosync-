import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

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
  return (
    <div className="navbar-my py-2">
      <div className="set-container">
        <ul>
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

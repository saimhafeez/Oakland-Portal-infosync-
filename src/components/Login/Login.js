import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";

const Login = (props) => {
  const navigate = useNavigate();
  const currentUser = props.user;
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  // const [userUid, setUserUid] = useState("");

  const handleSubmission = () => {
    if (!values.email || !values.password) {
      toast.error("Please fill all fields", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    //  CONNECT WITH FIREBASE
    setSubmitButtonDisabled(true);
    const loginData = signInWithEmailAndPassword(
      auth,
      values.email,
      values.password
    )
      .then(async (res) => {
        setSubmitButtonDisabled(false);
        if (props.userRole === "admin") {
          navigate("/dimensions-analyst");
        } else if (props.userRole === "manager") {
          navigate("/dimensions-analyst");
        } else if (props.userRole === "worker") {
          navigate("/dashboard");
        } else {
          return null;
        }
        // navigate("/extraction");
        const user = res.user;
        console.log("User UID", user.uid);
        toast.success(`Welcome ${props.userEmail}`, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        // console.log("User Display Name", user.displayName);
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        // setErrorMsg(err.message);
        toast.error(`Invalid Email or Password`, {
          position: toast.POSITION.TOP_CENTER,
        });
        // OR
        // email already in use
      });
  };
  return (
    <>
      <div className="main-login-signup text-center mt-5">
        <div>
          <h1>Login</h1>
        </div>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            placeholder="Enter email address..."
            onChange={(event) =>
              setValues((prev) => ({ ...prev, email: event.target.value }))
            }
          />
        </div>
        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            placeholder="Enter password..."
            onChange={(event) =>
              setValues((prev) => ({ ...prev, password: event.target.value }))
            }
          />
        </div>
        <div className="">
          <p>
            <strong>{errorMsg}</strong>
          </p>
          <button onClick={handleSubmission} disabled={submitButtonDisabled}>
            LOGIN
          </button>
          <p>
            Create a account <Link to="/signup">SignUp</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;

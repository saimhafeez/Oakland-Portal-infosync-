import React, { useEffect, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { auth, firestore } from "../../firebase";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import { triggerToast } from "../../utils/triggerToast";
import { Stack, TextField } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";

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

  const handleSubmission = async () => {
    console.log('submit');
    if (!values.email || !values.password) {
      triggerToast("Please fill all fields", "error")
      return;
    }
    //  CONNECT WITH FIREBASE
    setSubmitButtonDisabled(true);
    const loginData = await signInWithEmailAndPassword(auth, values.email, values.password)

    console.log('loginData', loginData.user.email);

    try {
      // Reference to the users collection
      const usersCollectionRef = collection(firestore, "users");

      // Query for the user with the specified UID
      const userQuery = query(usersCollectionRef, loginData.user.uid);

      // Get the documents that match the query
      const querySnapshot = await getDocs(userQuery);

      // Check if any documents were found
      if (!querySnapshot.empty) {
        // Extract the user data from the first document
        const userData = querySnapshot.docs[0].data();
        console.log(userData);
        setSubmitButtonDisabled(false);
        if (userData.role === "admin") {
          navigate("/dimensions-analyst");
        } else if (userData.role === "manager") {
          navigate("/dimensions-analyst");
        } else if (userData.role === "worker") {
          navigate("/dashboard");
        } else {
          return null;
        }


      } else {
        // No user found with the specified UID
        console.log("User not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }

    // .then(async (res) => {
    //   setSubmitButtonDisabled(false);
    //   if (props.userRole === "admin") {
    //     navigate("/dimensions-analyst");
    //   } else if (props.userRole === "manager") {
    //     navigate("/dimensions-analyst");
    //   } else if (props.userRole === "worker") {
    //     navigate("/dashboard");
    //   } else {
    //     return null;
    //   }
    //   // navigate("/extraction");
    //   const user = res.user;
    //   console.log("User UID", user.uid);
    //   triggerToast(`Welcome ${props.userEmail}`, "success")
    //   // console.log("User Display Name", user.displayName);
    // })
    // .catch((err) => {
    //   setSubmitButtonDisabled(false);
    //   // setErrorMsg(err.message);
    //   triggerToast("Invalid Email or Password", "error")
    //   // OR
    //   // email already in use
    // });
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
        </div>
      </div>
    </>
  );
};

export default Login;

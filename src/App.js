import axios from "axios";
import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import {
  Alert,
  AppBar,
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Divider,
  Drawer,
  LinearProgress,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import IconButton from "@mui/material/IconButton";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SharedLayout from "./pages/SharedLayout";
import Dashboard from "./pages/Dashboard";
import FileManagement from "./pages/FileManagement";
import DimensionsAnalyst from "./pages/DimensionsAnalyst";
import DashboardPage from "./components/Dashboard/DashboardPage";
import Extraction from "./pages/Extraction";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import { auth, firestore } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import ExtractionQA from "./pages/ExtractionQA";
// import ExtractionQA from "./pages/ExtractionQA";
import Demo from "./pages/Demo";
import PrivateRoutes from "./routes/PrivateRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NestedRoutes from "./routes/NestedRoutes";
import DimensionalQAAnalyst from "./pages/DimensionalQAAnalyst";

function App() {
  const notify = () => toast("Wow so easy!");
  const [userName, setUserName] = useState("");
  // useEffect(() => {
  //   auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       setUserName(user.displayName);
  //     } else setUserName("");
  //   });
  // }, []);

  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userJdesc, setUserJdesc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // User is signed in
        setUser(authUser);
        // Fetch the user's role from Firestore
        const userRef = doc(firestore, "users", authUser.uid);
        getDoc(userRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              setUserRole(docSnapshot.data().role);
              setUserJdesc(docSnapshot.data().jdesc);
              setUserEmail(docSnapshot.data().email);
              setLoading(false);
              localStorage.setItem("userEmail", JSON.stringify(userEmail));
            } else {
              console.log("User role not found.");
              setLoading(false);
            }
          })
          .catch((error) => {
            console.error("Error getting user role:", error);
            setLoading(false);
          });
      } else {
        // User is signed out
        setUser(null);
        setUserRole(null);
        setUserEmail(null);
        setUserJdesc(null);
        setLoading(false);
        // localStorage.removeItem("userEmail");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, userRole]);

  if (loading) {
    return (
      <div className="set-full-screen">
        <div class="spinner"></div>
      </div>
    );
  }
  // const [data, setData] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // collection mean table name
  //     const dataRef = firestore.collection('users');
  //     const snapshot = await dataRef.get();

  //     const items = []
  //     // doc mean document or you could say a row
  //     snapshot.forEach((doc) => {
  //       items.push(doc.data());
  //     });
  //     setData(items);
  //   }
  //   fetchData();
  // }, []);

  return (
    <>
      <div className="">
        <ToastContainer />
        {/* <Route path="/" element={<SharedLayout name={userName} />}> */}
        {/* <Route index element={<Dashboard />} /> */}
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            {/* SECURE LOGIN ROUTE */}
            <Route
              element={
                <PrivateRoutes
                  isAllowed={
                    !!userRole &&
                    (userRole === "worker" ||
                      userRole === "manager" ||
                      userRole === "admin")
                  }
                />
              }
            >
              <Route
                path="/dashboard"
                element={
                  <DashboardPage
                    user={user}
                    userEmail={userEmail}
                    userRole={userRole}
                    userJdesc={userJdesc}
                  />
                }
              />
              {/* SECURE NESTED ROUTE WITH FILE MANAGEMENT  */}
              <Route
                path="/file-management"
                element={
                  <FileManagement
                    userEmail={userEmail}
                    userRole={userRole}
                    userJdesc={userJdesc}
                  />
                }
              />
              {/* END SECURE NESTED ROUTE WITH FILE MANAGEMENT  */}
              {/* SECURE NESTED ROUTE WITH DIMENSIONS ANALYST  */}
              <Route
                element={
                  <NestedRoutes
                    isAllowedNested={
                      !!userRole &&
                      userRole === "worker" &&
                      userJdesc === "DimAna"
                    }
                  />
                }
              >
                <Route
                  path="/dimensions-analyst"
                  element={
                    <DimensionsAnalyst
                      userEmail={userEmail}
                      userRole={userRole}
                      userJdesc={userJdesc}
                      user={user}
                    />
                  }
                />
              </Route>
              {/* END SECURE NESTED ROUTE WITH DIMENSIONS ANALYST  */}
              {/* SECURE NESTED ROUTE WITH DIMENSIONS ANALYST QA  */}
              <Route
                element={
                  <NestedRoutes
                    isAllowedNested={
                      !!userRole &&
                      userRole === "worker" &&
                      userJdesc === "QA-DimAna"
                    }
                  />
                }
              >
                <Route
                  path="/dimensional-qa-analyst"
                  element={
                    <DimensionalQAAnalyst
                      userEmail={userEmail}
                      userRole={userRole}
                      userJdesc={userJdesc}
                      user={user}
                    />
                  }
                />
              </Route>
              {/* END SECURE NESTED ROUTE WITH DIMENSIONS ANALYST QA */}
              {/* SECURE NESTED ROUTE WITH EXTRACTOR  */}
              <Route
                element={
                  <NestedRoutes
                    isAllowedNested={
                      !!userRole &&
                      userRole === "worker" &&
                      userJdesc === "Extractor"
                    }
                  />
                }
              >
                <Route
                  path="/extraction"
                  element={
                    <Extraction
                      user={user}
                      userEmail={userEmail}
                      userRole={userRole}
                      userJdesc={userJdesc}
                    />
                  }
                />
              </Route>
              {/* END SECURE NESTED ROUTE WITH EXTRACTOR  */}
              {/* SECURE NESTED ROUTE WITH QA EXTRACTOR  */}
              <Route
                element={
                  <NestedRoutes
                    isAllowedNested={
                      !!userRole &&
                      userRole === "worker" &&
                      userJdesc === "QA-Extractor"
                    }
                  />
                }
              >
                <Route
                  path="/qa-extraction"
                  element={
                    <ExtractionQA
                      user={user}
                      userEmail={userEmail}
                      userRole={userRole}
                      userJdesc={userJdesc}
                    />
                  }
                />
              </Route>
              {/* END SECURE NESTED ROUTE WITH QA EXTRACTOR  */}
            </Route>
            {/* END SECURE LOGIN ROUTE */}
            <Route
              path="/"
              element={
                <Login
                  name={userName}
                  user={user}
                  userRole={userRole}
                  userEmail={userEmail}
                />
              }
            />

            {/* <Route path="/login" element={<Login name={userName} />} /> */}
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<p>Page Not found</p>} />
            {/* <Route path="/demo" element={<Demo />} /> */}
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;

// e79c2c
// 000000

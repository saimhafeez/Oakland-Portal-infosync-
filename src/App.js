import 'bootstrap/dist/css/bootstrap.css';
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FileManagement from "./pages/FileManagement";
import DimensionsAnalyst from "./pages/DimensionsAnalyst";
import DashboardPage from "./components/Dashboard/DashboardPage";
import Extraction from "./pages/Extraction";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import { firestore } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import ExtractionQA from "./pages/ExtractionQA";
import PrivateRoutes from "./routes/PrivateRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NestedRoutes from "./routes/NestedRoutes";
import DimensionalQAAnalyst from "./pages/DimensionalQAAnalyst";
import Ingredients from "./pages/Ingredients";
import ProductVendorInformation from "./pages/ProductVendorInformation";
import UserManagement from './pages/admin/UserManagement';
import ReadyToLive from './pages/admin/ReadyToLive';
import AllNads from './pages/admin/AllNads';
import NotUnderstandables from './pages/admin/NotUnderstandables';
import ExtractionComparision from './pages/admin/ExtractionComparision';
import DimAnaComparision from './pages/admin/DimAnaComparision';

const auth = getAuth();

function App() {
  const [userName, setUserName] = useState("");

  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userJdesc, setUserJdesc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // Fetch the user's data from Firestore
        const userRef = doc(firestore, "users", authUser.uid);
        getDoc(userRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const userData = docSnapshot.data();

              if (userData.role === "worker" || userData.role === "manager") {
                // Check if the user's role is "worker" or "manager" and status is "active"
                if (userData.status === "active") {
                  setUser(authUser);
                  setUserRole(userData.role);
                  setUserJdesc(userData.jdesc);
                  setUserEmail(userData.email);
                  setLoading(false);
                  localStorage.setItem("userEmail", JSON.stringify(userData.email));
                } else {
                  alert("User status is not active.");
                  setUser(null);
                  setLoading(false);
                }
              } else {
                // For other roles, proceed without additional checks
                setUser(authUser);
                setUserRole(userData.role);
                setUserJdesc(userData.jdesc);
                setUserEmail(userData.email);
                setLoading(false);
                localStorage.setItem("userEmail", JSON.stringify(userData.email));
              }
            } else {
              console.log("User data not found in Firestore.");
              setUser(null);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.error("Error getting user data from Firestore:", error);
            setUser(null);
            setLoading(false);
          });
      } else {
        // User is signed out
        setUser(null);
        setUserRole(null);
        setUserEmail(null);
        setUserJdesc(null);
        setUserName(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);




  if (loading) {
    return (
      <div className="set-full-screen">
        <div class="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="">
        <ToastContainer />
        {/* <Route path="/" element={<SharedLayout name={userName} />}> */}
        {/* <Route index element={<Dashboard />} /> */}
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

            {/* Admin Routes START*/}
            <Route
              element={
                <NestedRoutes
                  isAllowedNested={
                    !!userRole &&
                    userRole === "admin"
                  }
                />
              }
            >
              <Route
                path="/ingredients"
                element={
                  <Ingredients
                    userEmail={userEmail}
                    userRole={userRole}
                    userJdesc={userJdesc}
                    user={user}
                  />
                }
              />
              <Route
                path="/product-detail-info"
                element={
                  <ProductVendorInformation
                    userEmail={userEmail}
                    userRole={userRole}
                    userJdesc={userJdesc}
                    user={user}
                  />
                }
              />
              <Route
                path="/extraction-comparision"
                element={
                  <ExtractionComparision
                    userEmail={userEmail}
                    userRole={userRole}
                    userJdesc={userJdesc}
                    user={user}
                  />
                }
              />
              <Route
                path="/dimana-comparision"
                element={
                  <DimAnaComparision
                    userEmail={userEmail}
                    userRole={userRole}
                    userJdesc={userJdesc}
                    user={user}
                  />
                }
              />
              <Route
                path="/user-management"
                element={
                  <UserManagement
                    userEmail={userEmail}
                    userRole={userRole}
                    userJdesc={userJdesc}
                    user={user}
                  />
                }
              />
              <Route
                path="/ready-to-live"
                element={
                  <ReadyToLive
                    userEmail={userEmail}
                    userRole={userRole}
                    userJdesc={userJdesc}
                    user={user}
                  />
                }
              />
              <Route
                path="/all-nads"
                element={
                  <AllNads
                    userEmail={userEmail}
                    userRole={userRole}
                    userJdesc={userJdesc}
                    user={user}
                  />
                }
              />
              <Route
                path="/not-understandables"
                element={
                  <NotUnderstandables
                    userEmail={userEmail}
                    userRole={userRole}
                    userJdesc={userJdesc}
                    user={user}
                  />
                }
              />
            </Route>
            {/* Admin Routes END */}

          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
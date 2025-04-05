import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getItem } from "./utils/storage.js";
import { UserProvider } from "./context/userContext.jsx";
import Home from "./Pages/Home";
import Auth from "./Pages/Auth";
import About from "./Pages/about";
import AddColleges from "./Pages/addColleges";
import CollegeProfile from "./Pages/CollegeProfile";
import CollegeList from "./Pages/CollegeList";
import UserProfile from "./Pages/UserProfile";
import StudentMentors from "./Pages/StudentMentors";
import CommentsPage from "./Pages/CommentsPage";
import InterestsSelection from "./Pages/InterestsSelection";
import UpdateProfile from "./Pages/UpdateProfile";
import HelpCenter from "./Pages/HelpCenter";
import { AnimatePresence } from "framer-motion";
import MentorProfile from "./Pages/MentorProfile.jsx";
import PageNotFound from "./Components/PageNotFound.jsx";
import VerifyEmail from "./Pages/VerifyEmail.jsx";
import CollegeComparison from "./Pages/CollegeComparison.jsx";
// import FadeWrapper from "./Components/fadeIn.jsx";

const PrivateRoute = ({ element }) => {
  const location = useLocation();
  const [authStatus, setAuthStatus] = useState({
    isChecked: false,
    hasToken: false,
  });

  useEffect(() => {
    const validateToken = async () => {
      const token = await getItem("token");
      if (!token) {
        localStorage.setItem("redirectAfterLogin", location.pathname);
      }
      setAuthStatus({
        isChecked: true,
        hasToken: !!token,
      });
    };
    validateToken();
  }, [location.pathname]);

  if (!authStatus.isChecked) {
    return <div>Loading...</div>;
  }
  if (!authStatus.hasToken) {
    return <Navigate to="/auth" />;
  }
  return element;
};

const CheckAuth = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getItem("token");
      setIsAuthenticated(!!token);
    };
    checkToken();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div>
        Loading... Try Logging in again
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>
    );
  }
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return element;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence exitBeforeEnter>
      <Routes location={location} key={location.pathname}>
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/auth" element={<CheckAuth element={<Auth />} />} />
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/about" element={<PrivateRoute element={<About />} />} />
        <Route
          path="/add-college"
          element={<PrivateRoute element={<AddColleges />} />}
        />
        <Route
          path="/college/:id"
          element={<PrivateRoute element={<CollegeProfile />} />}
        />
        <Route
          path="/colleges"
          element={<PrivateRoute element={<CollegeList />} />}
        />
        <Route
          path="/user/:id"
          element={<PrivateRoute element={<UserProfile />} />}
        />
        <Route
          path="/mentors"
          element={<PrivateRoute element={<StudentMentors />} />}
        />
        <Route
          path="/comments"
          element={<PrivateRoute element={<CommentsPage />} />}
        />
        <Route path="/interests" element={<InterestsSelection />} />
        <Route
          path="/update-profile"
          element={<PrivateRoute element={<UpdateProfile />} />}
        />
        <Route
          path="/help"
          element={<PrivateRoute element={<HelpCenter />} />}
        />
        <Route path="/mentor/:id" element={<MentorProfile />} />
        <Route
          path="/compare-colleges"
          element={<PrivateRoute element={<CollegeComparison />} />}
        />

        {/* Add this catch-all route at the end */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <UserProvider>
      <Router>
        <ToastContainer position="bottom-center" autoClose="1500" />
        <AnimatedRoutes />
      </Router>
    </UserProvider>
  );
}

export default App;

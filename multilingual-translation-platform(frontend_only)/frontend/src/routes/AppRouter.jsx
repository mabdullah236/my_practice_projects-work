import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Ensure correct imports (exact filenames & extensions)
import Landing from "../pages/Landing.jsx";
import Home from "../pages/Home.jsx";
import AboutUs from "../pages/AboutUs.jsx";
import ContactUs from "../pages/ContactUs.jsx";
import OurModels from "../pages/OurModels.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx"; // Agar use kar rahe ho

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/ourmodels" element={<OurModels />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

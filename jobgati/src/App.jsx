import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { JobSeekerRoute, EmployerRoute } from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import About from "./pages/About";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import ProfilePage from "./pages/ProfilePage";
import LearningPathPage from "./pages/LearningPathPage";
import EmployerDashboard from "./pages/EmployerDashboard";
import PostJobPage from "./pages/PostJobPage";
import EmployerProfilePage from "./pages/EmployerProfilePage";
import JobDetailsPage from "./pages/JobDetailsPage";
import CandidateProfilePage from "./pages/CandidateProfilePage";
import MarketInsightsPage from "./pages/MarketInsightsPage";

function AppWrapper() {
  const location = useLocation();

  const hideFooter =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/learning") ||
    location.pathname.startsWith("/jobs") ||
    location.pathname.startsWith("/insights") ||
    location.pathname.startsWith("/employer");

  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />

        {/* Job Seeker */}
        <Route path="/dashboard" element={<JobSeekerRoute><JobSeekerDashboard /></JobSeekerRoute>} />
        <Route path="/profile" element={<JobSeekerRoute><ProfilePage /></JobSeekerRoute>} />
        <Route path="/learning" element={<JobSeekerRoute><LearningPathPage /></JobSeekerRoute>} />
        <Route path="/insights" element={<JobSeekerRoute><MarketInsightsPage /></JobSeekerRoute>} />
        <Route path="/jobs/:id" element={<JobSeekerRoute><JobDetailsPage /></JobSeekerRoute>} />

        {/* Employer */}
        <Route path="/employer/dashboard" element={<EmployerRoute><EmployerDashboard /></EmployerRoute>} />
        <Route path="/employer/post-job" element={<EmployerRoute><PostJobPage /></EmployerRoute>} />
        <Route path="/employer/jobs" element={<EmployerRoute><EmployerDashboard /></EmployerRoute>} />
        <Route path="/employer/profile" element={<EmployerRoute><EmployerProfilePage /></EmployerRoute>} />
        <Route path="/employer/candidates/:id" element={<EmployerRoute><CandidateProfilePage /></EmployerRoute>} />
      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWrapper />
      </Router>
    </AuthProvider>
  );
}

export default App;
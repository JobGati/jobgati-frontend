import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Redirects to home if not authenticated
export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    return children;
};

// Only for job seekers
export const JobSeekerRoute = ({ children }) => {
    const { isAuthenticated, isJobSeeker } = useAuth();
    if (!isAuthenticated) return <Navigate to="/" replace />;
    if (!isJobSeeker) return <Navigate to="/employer/dashboard" replace />;
    return children;
};

// Only for employers
export const EmployerRoute = ({ children }) => {
    const { isAuthenticated, isEmployer } = useAuth();
    if (!isAuthenticated) return <Navigate to="/" replace />;
    if (!isEmployer) return <Navigate to="/dashboard" replace />;
    return children;
};

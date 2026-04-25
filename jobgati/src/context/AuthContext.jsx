import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("jobgati_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("jobgati_token") || null);
  const [profileCompletion, setProfileCompletion] = useState(() => {
    return Number(localStorage.getItem("jobgati_completion")) || 0;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("jobgati_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("jobgati_user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("jobgati_token", token);
    } else {
      localStorage.removeItem("jobgati_token");
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem("jobgati_completion", profileCompletion);
  }, [profileCompletion]);

  const login = (userData, authToken, completion = 0) => {
    setUser(userData);
    setToken(authToken);
    setProfileCompletion(completion);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setProfileCompletion(0);
    localStorage.removeItem("jobgati_completion");
  };

  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const isAuthenticated = !!token && !!user;
  const isJobSeeker = user?.role === "jobseeker";
  const isEmployer = user?.role === "employer";
  const isProfileUnlocked = profileCompletion >= 80;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isJobSeeker,
        isEmployer,
        profileCompletion,
        setProfileCompletion,
        isProfileUnlocked,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, } from "react-router-dom";
import App from "./App";
import { Dashboard } from "./scenes";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import ContractorLogin from "./components/ContractorLogin";
import AdminLogin from "./components/AdminLogin";
import PrivateRoute from "./utils/PrivateRoute";
import VendorDashboard from "./vendors/VendorDashboard";
import VendorProfile from "./scenes/vendor/VendorProfile";
import JobPosts from "./scenes/vendor/JobPosts";
import { useAuth } from "./utils/context/AuthContext";
import Labours from "./scenes/admin/Labours";
import Contracter from "./scenes/admin/Contracter";
import CreateSkill from "./scenes/admin/CreateSkill";
import LoadingScreen from "./components/LoadingScreen";
import Services from "./scenes/vendor/Services";
import JobApplication from "./scenes/vendor/JobApplication";
import LabourAvailability from "./scenes/admin/LabourAvailability";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";
import DeleteAccountPolicy from "./components/DeleteAccountPolicy";

const AppRouter = () => {
  const { isAuthenticated, panelType, token, stylistId, login } = useAuth();

  if (isAuthenticated === null) {
    return <div><LoadingScreen /></div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated === null ? (<div>Loading...</div>) : isAuthenticated ? (<Navigate to="/dashboard" replace />) : (<ContractorLogin onLoginSuccess={login} />)} />
        <Route path="/admin" element={isAuthenticated === null ? (<div>Loading...</div>) : isAuthenticated ? (<Navigate to="/dashboard" replace />) : (<AdminLogin onLoginSuccess={login} />)} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditionos" element={<TermsAndConditions />} />
        <Route path="/delete-policy" element={<DeleteAccountPolicy />} />
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} panelType={panelType} token={token} stylistId={stylistId} />}>
          <Route path="/dashboard" element={<App panelType={panelType} />}>
            {panelType === "admin" ? (
              <>
                <Route index element={<Dashboard />} />
                <Route path="labours" element={<Labours />} />
                <Route path="skills" element={<CreateSkill />} />
                <Route path="contracter" element={<Contracter />} />
                <Route path="labour-availability" element={<LabourAvailability />} />
              </>
            ) : panelType === "vendor" ? (
              <>
                <Route index element={<VendorDashboard />} />
                <Route path="job-post" element={<JobPosts />} />
                <Route path="application" element={<JobApplication />} />
                <Route path="contractor-profile" element={<VendorProfile />} />
                <Route path="labour" element={<Services />} />
                <Route path="labour-availability" element={<LabourAvailability />} />
              </>
            ) : (
              <Route index element={<Navigate to="/login" replace />} />
            )}
          </Route>
          {/* Redirect old paths to dashboard nested paths */}
          {panelType === "vendor" && (
            <>
              <Route path="/job-post" element={<Navigate to="/dashboard/job-post" replace />} />
              <Route path="/application" element={<Navigate to="/dashboard/application" replace />} />
              <Route path="/contractor-profile" element={<Navigate to="/dashboard/contractor-profile" replace />} />
              <Route path="/labour" element={<Navigate to="/dashboard/labour" replace />} />
              <Route path="/labour-availability" element={<Navigate to="/dashboard/labour-availability" replace />} />
            </>
          )}
          {panelType === "admin" && (
            <>
              <Route path="/labours" element={<Navigate to="/dashboard/labours" replace />} />
              <Route path="/skills" element={<Navigate to="/dashboard/skills" replace />} />
              <Route path="/contracter" element={<Navigate to="/dashboard/contracter" replace />} />
              <Route path="/labour-availability" element={<Navigate to="/dashboard/labour-availability" replace />} />
            </>
          )}
        </Route>
        <Route path="/" element={isAuthenticated ? (<Navigate to="/dashboard" replace />) : (<LandingPage />)} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

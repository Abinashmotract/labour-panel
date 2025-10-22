import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, } from "react-router-dom";
import App from "./App";
import { Dashboard } from "./scenes";
import Login from "./components/Login";
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

const AppRouter = () => {
  const { isAuthenticated, panelType, token, stylistId, login } = useAuth();

  if (isAuthenticated === null) {
    return <div><LoadingScreen /></div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated === null ? (<div>Loading...</div>) : isAuthenticated ? (<Navigate to="/" replace />) : (<Login onLoginSuccess={login} />)} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditionos" element={<TermsAndConditions />} />
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} panelType={panelType} token={token} stylistId={stylistId} />}>
          <Route path="/" element={<App panelType={panelType} />}>
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
                 {/* <Route path="referal" element={<ReferalByAgent />} /> */}
              </>
            ) : (
              <Route index element={<Navigate to="/login" replace />} />
            )}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;

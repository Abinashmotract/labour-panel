import React from "react";
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
import ContractorAcceptances from "./scenes/admin/ContractorAcceptances";
import ContractorJobAcceptances from "./scenes/admin/ContractorJobAcceptances";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";
import DeleteAccountPolicy from "./components/DeleteAccountPolicy";
import NotFound from "./components/NotFound";

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
            {/* Admin routes - always defined, authorization checked in components */}
            <Route index element={panelType === "admin" ? <Dashboard /> : panelType === "vendor" ? <VendorDashboard /> : <Navigate to="/login" replace />} />
            <Route path="labours" element={panelType === "admin" ? <Labours /> : <Navigate to="/dashboard" replace />} />
            <Route path="skills" element={panelType === "admin" ? <CreateSkill /> : <Navigate to="/dashboard" replace />} />
            <Route path="contracter" element={panelType === "admin" ? <Contracter /> : <Navigate to="/dashboard" replace />} />
            <Route path="labour-availability" element={panelType === "admin" || panelType === "vendor" ? <LabourAvailability /> : <Navigate to="/dashboard" replace />} />
            <Route path="contractor-acceptances" element={panelType === "admin" ? <ContractorAcceptances /> : <Navigate to="/dashboard" replace />} />
            <Route path="contractor-job-acceptances" element={panelType === "admin" ? <ContractorJobAcceptances /> : <Navigate to="/dashboard" replace />} />
            {/* Vendor routes - always defined, authorization checked in components */}
            <Route path="job-post" element={panelType === "vendor" ? <JobPosts /> : <Navigate to="/dashboard" replace />} />
            <Route path="application" element={panelType === "vendor" ? <JobApplication /> : <Navigate to="/dashboard" replace />} />
            <Route path="contractor-profile" element={panelType === "vendor" ? <VendorProfile /> : <Navigate to="/dashboard" replace />} />
            <Route path="labour" element={panelType === "vendor" ? <Services /> : <Navigate to="/dashboard" replace />} />
            {/* Catch-all route for unmatched nested dashboard routes */}
            <Route path="*" element={<NotFound />} />
          </Route>
          {/* Redirect old paths to dashboard nested paths */}
          <Route path="/job-post" element={<Navigate to="/dashboard/job-post" replace />} />
          <Route path="/application" element={<Navigate to="/dashboard/application" replace />} />
          <Route path="/contractor-profile" element={<Navigate to="/dashboard/contractor-profile" replace />} />
          <Route path="/labour" element={<Navigate to="/dashboard/labour" replace />} />
          <Route path="/labour-availability" element={<Navigate to="/dashboard/labour-availability" replace />} />
          <Route path="/labours" element={<Navigate to="/dashboard/labours" replace />} />
          <Route path="/skills" element={<Navigate to="/dashboard/skills" replace />} />
          <Route path="/contracter" element={<Navigate to="/dashboard/contracter" replace />} />
          <Route path="/contractor-acceptances" element={<Navigate to="/dashboard/contractor-acceptances" replace />} />
          <Route path="/contractor-job-acceptances" element={<Navigate to="/dashboard/contractor-job-acceptances" replace />} />
        </Route>
        <Route path="/" element={isAuthenticated ? (<Navigate to="/dashboard" replace />) : (<LandingPage />)} />
        {/* Catch-all route for any unmatched paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

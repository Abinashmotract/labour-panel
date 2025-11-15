import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";
import Cookies from "js-cookie";
import "../css/contractor-login.css";

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        setIsLoading(false);
        return;
      }
      const response = await axios.post(`${API_BASE_URL}/admin/login`, {
        email,
        password,
      });
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token");
      localStorage.removeItem("panelType");
      localStorage.removeItem("stylistId");
      localStorage.removeItem("vendorToken");
      const token = response.data.token;
      localStorage.setItem("isAuthenticated", "true");
      Cookies.set("token", token, { expires: 1 });
      localStorage.setItem("panelType", "admin");
      onLoginSuccess(true, "admin", token, null);
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="screen active" id="loginScreen">
        <div className="screen-left">
          <div className="screen-left-content">
            <div className="logo">
              <i className="fas fa-hard-hat"></i>
              Nearby Labour
            </div>
            <h2>Welcome Back, Admin!</h2>
            <p>Access your admin dashboard to manage the platform, users, and all system operations.</p>
            
            <ul className="features-list">
              <li><i className="fas fa-check-circle"></i> Manage all users and contractors</li>
              <li><i className="fas fa-check-circle"></i> Monitor platform activity</li>
              <li><i className="fas fa-check-circle"></i> Access system analytics</li>
              <li><i className="fas fa-check-circle"></i> Control platform settings</li>
            </ul>
          </div>
        </div>
        
        <div className="screen-right">
          <div className="screen-header">
            <h1>Admin Login</h1>
            <p>Enter your credentials to access your account</p>
          </div>
          
          <form className="screen-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <input 
                  type="email" 
                  id="email" 
                  className="form-control" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  className="form-control" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
              </div>
            </div>
            
            {error && (
              <div className="error-message" style={{ display: 'block' }}>{error}</div>
            )}
            
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
            </div>
            
            <button type="submit" className="action-button" disabled={isLoading}>
              {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Logging In...</> : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;


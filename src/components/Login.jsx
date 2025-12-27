import React, { useState } from "react";
import Cookies from "js-cookie";
import "../css/contractor-login.css";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";
import logo from "../assets/images/loginpagelogo.jpeg";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [panelType, setPanelType] = useState("adminpanel");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const getCurrentLocation = async () => {
    try {
      return await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation not supported"));
        }
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => reject(error),
          { enableHighAccuracy: true }
        );
      });
    } catch (error) {
      console.warn("Location not available", error);
      return {};
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (panelType === "adminpanel") {
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
      } else {
        if (!phoneNumber || !password) {
          setError("Please fill in all fields");
          setIsLoading(false);
          return;
        }
        const location = await getCurrentLocation();
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          phoneNumber,
          password,
          role: "contractor",
          latitude: location.latitude,
          longitude: location.longitude,
        });

        const token = response.data.token;
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
        localStorage.removeItem("panelType");
        localStorage.removeItem("vendorToken");
        localStorage.setItem("isAuthenticated", "true");
        Cookies.set("token", token, { expires: 1 });
        localStorage.setItem("panelType", "vendor");
        onLoginSuccess(true, "vendor", token);
      }
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
            <div className="">
              <img src={logo} alt="Nearby Labour" style={{ height: 70 }} />
            </div>
            <h2>
              {panelType === "adminpanel"
                ? "Welcome Back, Admin!"
                : "Welcome Back, Contractor!"}
            </h2>
            <p>
              {panelType === "adminpanel"
                ? "Access your admin dashboard to manage the platform, users, and all system operations."
                : "Access your contractor dashboard to manage projects, workers, and payments all in one place."}
            </p>

            <ul className="features-list">
              {panelType === "adminpanel" ? (
                <>
                  <li><i className="fas fa-check-circle"></i> Manage all users and contractors</li>
                  <li><i className="fas fa-check-circle"></i> Monitor platform activity</li>
                  <li><i className="fas fa-check-circle"></i> Access system analytics</li>
                  <li><i className="fas fa-check-circle"></i> Control platform settings</li>
                </>
              ) : (
                <>
                  <li><i className="fas fa-check-circle"></i> Manage multiple projects</li>
                  <li><i className="fas fa-check-circle"></i> Track worker availability</li>
                  <li><i className="fas fa-check-circle"></i> Process secure payments</li>
                  <li><i className="fas fa-check-circle"></i> Access performance analytics</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="screen-right">
          <div className="screen-header">
            <h1>{panelType === "adminpanel" ? "Admin Login" : "Contractor Login"}</h1>
            <p>Enter your credentials to access your account</p>
          </div>

          <form className="screen-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>
                <input
                  type="radio"
                  name="panelType"
                  value="adminpanel"
                  checked={panelType === "adminpanel"}
                  onChange={(e) => setPanelType(e.target.value)}
                  style={{ marginRight: "8px" }}
                />
                Admin Panel
              </label>
              <label style={{ marginLeft: "20px" }}>
                <input
                  type="radio"
                  name="panelType"
                  value="vendorpanel"
                  checked={panelType === "vendorpanel"}
                  onChange={(e) => setPanelType(e.target.value)}
                  style={{ marginRight: "8px" }}
                />
                Contractor Panel
              </label>
            </div>

            {panelType === "adminpanel" ? (
              <>
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
                    <i className="fas fa-envelope"></i>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      id="phoneNumber"
                      className="form-control"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <i className="fas fa-phone"></i>
                  </div>
                </div>
              </>
            )}

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
                <i className="fas fa-lock"></i>
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

export default Login;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";
import Cookies from "js-cookie";
import "../css/contractor-login.css";
import logo from "../assets/images/loginpagelogo.jpeg";

const ContractorLogin = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved credentials on component mount
  useEffect(() => {
    const savedPhoneNumber = localStorage.getItem("contractorRememberedPhone");
    const savedRememberMe = localStorage.getItem("contractorRememberMe") === "true";
    
    if (savedRememberMe && savedPhoneNumber) {
      setPhoneNumber(savedPhoneNumber);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    // OTP input navigation
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((input, index) => {
      input.addEventListener('input', function () {
        if (this.value.length === 1 && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
      });

      input.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
          otpInputs[index - 1].focus();
        }
      });
    });
  }, [currentScreen === "otp"]);

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

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
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
      
      // Handle remember me functionality
      if (rememberMe) {
        localStorage.setItem("contractorRememberedPhone", phoneNumber);
        localStorage.setItem("contractorRememberMe", "true");
      } else {
        localStorage.removeItem("contractorRememberedPhone");
        localStorage.removeItem("contractorRememberMe");
      }
      
      onLoginSuccess(true, "vendor", token);
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!validateEmail(forgotEmail)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    // Simulate sending OTP
    setCurrentScreen("otp");
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6 || isNaN(otpValue)) {
      setError("Please enter a valid 6-digit code");
      return;
    }
    setError("");
    setCurrentScreen("reset");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validatePassword(newPassword)) {
      setError("Password must be at least 8 characters with letters and numbers");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    // Simulate password reset
    alert("Password reset successfully! You can now login with your new password.");
    setCurrentScreen("login");
    setNewPassword("");
    setConfirmPassword("");
  };

  const showScreen = (screen) => {
    setCurrentScreen(screen);
    setError("");
  };

  return (
    <div className="login-page-container">
      {/* Login Screen */}
      <div className={`screen ${currentScreen === "login" ? "active" : ""}`} id="loginScreen">
        <div className="screen-left">
          <div className="screen-left-content">
            <div className="">
              <img src={logo} alt="Nearby Labour" style={{ height: 70 }} />
            </div>
            <h2>Welcome Back, Contractor!</h2>
            <p>Access your contractor dashboard to manage projects, workers, and payments all in one place.</p>

            <ul className="features-list">
              <li><i className="fas fa-check-circle"></i> Manage multiple projects</li>
              <li><i className="fas fa-check-circle"></i> Track worker availability</li>
              <li><i className="fas fa-check-circle"></i> Process secure payments</li>
              <li><i className="fas fa-check-circle"></i> Access performance analytics</li>
            </ul>
          </div>
        </div>

        <div className="screen-right">
          <div className="screen-header">
            <h1>Contractor Login</h1>
            <p>Enter your credentials to access your account</p>
          </div>

          <form className="screen-form" onSubmit={handleLogin}>
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
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
            </div>

            <button type="submit" className="action-button" disabled={isLoading}>
              {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Logging In...</> : "Log In"}
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Screen */}
      <div className={`screen ${currentScreen === "forgot" ? "active" : ""}`} id="forgotPasswordScreen">
        <div className="screen-left">
          <div className="screen-left-content">
            <div className="">
              <img src={logo} alt="Nearby Labour" style={{ height: 70 }} />
            </div>
            <h2>Reset Your Password</h2>
            <p>Enter your email address and we'll send you instructions to reset your password.</p>

            <ul className="features-list">
              <li><i className="fas fa-shield-alt"></i> Secure password reset process</li>
              <li><i className="fas fa-envelope"></i> OTP sent to your registered email</li>
              <li><i className="fas fa-clock"></i> Quick and easy process</li>
            </ul>
          </div>
        </div>

        <div className="screen-right">
          <div className="screen-header">
            <h1>Forgot Password</h1>
            <p>Enter your email to receive reset instructions</p>
          </div>

          <form className="screen-form" onSubmit={handleForgotPassword}>
            <div className="form-group">
              <label htmlFor="forgotEmail">Email Address</label>
              <div className="input-with-icon">
                <input
                  type="email"
                  id="forgotEmail"
                  className="form-control"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
                <i className="fas fa-envelope"></i>
              </div>
            </div>

            {error && (
              <div className="error-message" style={{ display: 'block' }}>{error}</div>
            )}

            <button type="submit" className="action-button">Send Reset Instructions</button>

            <div className="back-to-login">
              <a onClick={() => showScreen("login")}>Back to Login</a>
            </div>
          </form>
        </div>
      </div>

      {/* OTP Verification Screen */}
      <div className={`screen ${currentScreen === "otp" ? "active" : ""}`} id="otpScreen">
        <div className="screen-left">
          <div className="screen-left-content">
            <div className="">
              <img src={logo} alt="Nearby Labour" style={{ height: 70 }} />
            </div>
            <h2>Verify Your Identity</h2>
            <p>We've sent a 6-digit verification code to your email address. Please enter it below.</p>

            <ul className="features-list">
              <li><i className="fas fa-mobile-alt"></i> Check your email for the OTP</li>
              <li><i className="fas fa-clock"></i> Code expires in 10 minutes</li>
              <li><i className="fas fa-redo"></i> Resend if you didn't receive it</li>
            </ul>
          </div>
        </div>

        <div className="screen-right">
          <div className="screen-header">
            <h1>Enter Verification Code</h1>
            <p>We sent a code to your email</p>
          </div>

          <form className="screen-form" onSubmit={handleOtpSubmit}>
            <div className="form-group">
              <label htmlFor="otp">6-Digit Code</label>
              <div className="otp-container">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="otp-input"
                    value={otp[index]}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[index] = e.target.value;
                      setOtp(newOtp);
                    }}
                  />
                ))}
              </div>
              {error && (
                <div className="error-message" style={{ display: 'block' }}>{error}</div>
              )}
            </div>

            <button type="submit" className="action-button">Verify Code</button>

            <div className="resend-otp">
              Didn't receive the code? <a onClick={() => alert('OTP has been resent to your email')}>Resend OTP</a>
            </div>

            <div className="back-to-login">
              <a onClick={() => showScreen("login")}>Back to Login</a>
            </div>
          </form>
        </div>
      </div>

      {/* Reset Password Screen */}
      <div className={`screen ${currentScreen === "reset" ? "active" : ""}`} id="resetPasswordScreen">
        <div className="screen-left">
          <div className="screen-left-content">
            <div className="">
              <img src={logo} alt="Nearby Labour" style={{ height: 70 }} />
            </div>
            <h2>Create New Password</h2>
            <p>Your new password must be different from previously used passwords.</p>

            <ul className="features-list">
              <li><i className="fas fa-lock"></i> Minimum 8 characters</li>
              <li><i className="fas fa-key"></i> Include letters and numbers</li>
              <li><i className="fas fa-check-circle"></i> Confirm your new password</li>
            </ul>
          </div>
        </div>

        <div className="screen-right">
          <div className="screen-header">
            <h1>Reset Password</h1>
            <p>Create a new password for your account</p>
          </div>

          <form className="screen-form" onSubmit={handleResetPassword}>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-with-icon">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  className="form-control"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <i className="fas fa-lock"></i>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  <i className={showNewPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-with-icon">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="form-control"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <i className="fas fa-lock"></i>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message" style={{ display: 'block' }}>{error}</div>
            )}

            <button type="submit" className="action-button">Reset Password</button>

            <div className="back-to-login">
              <a onClick={() => showScreen("login")}>Back to Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContractorLogin;


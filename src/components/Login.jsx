import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Button,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import {
  Email,
  Visibility,
  VisibilityOff,
  Lock,
  PersonOutlined,
} from "@mui/icons-material";
import logo from "../assets/images/loginpagelogo.jpeg";
import watermark from "../assets/images/watermark1.png";
import Cookies from "js-cookie";
import "../css/login.scss";
import Input from "../custom/Input";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";

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
      return {}; // return empty object if location fetching fails
    }
  };

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      if (panelType === "adminpanel") {
        if (!email || !password) {
          setError("Please fill in all fields");
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
    <Box className="login-container" sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Grid container spacing={0} sx={{ flex: 1 }}>
        <Grid item xs={12} md={8} className="left-column" sx={{ position: "relative", overflow: "hidden", }}>
          <img src="https://imgs.search.brave.com/FGqh4uVn8vkK8qtN3N35kfRyWWJwWZgX-QyIUFe65Rs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzM4L2E0/L2I1LzM4YTRiNWY3/Njk0NzU5MGRjZTgx/YzhmOTk0NWY2YTIx/LmpwZw" />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              zIndex: 2,
              px: 8,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <Typography variant="h6" sx={{ color: "white" }}>
              Welcome to
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: "bold", color: "white", fontSize: { sm: "2.5rem", md: "3rem" }, }}>
              MistriConnect
            </Typography>
            <Typography variant="body1" sx={{ color: "white", maxWidth: { sm: 600, md: 800 }, mt: 2, fontSize: { sm: "1rem" }, }}>
              Find reliable mistri and labour workers for your home or
              commercial projects. Whether it’s carpentry, plumbing, electrical,
              or general repairs — get skilled professionals at your doorstep,
              quickly and affordably.
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          className="right-column"
          sx={{
            position: { xs: "absolute", md: "relative" },
            top: { xs: 0, md: "auto" },
            left: { xs: 0, md: "auto" },
            width: { xs: "100%", md: "auto" },
            height: { xs: "100%", md: "auto" },
            zIndex: { xs: 3, md: "auto" },
            backgroundColor: "#000000",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 2, sm: 4 },
            py: { xs: 4, md: 10 },
          }}
        >
          <Box className="login-form" sx={{ width: "100%", maxWidth: 400 }}>
            {/* <Link to="/delete-policy" className="me-4">Delete Account Policy</Link>
            <Link to="/privacy-policy" className="me-4">Privacy Policy</Link>
            <Link to="/terms-conditionos">Terms & Conditions</Link> */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <img src={logo} alt="logo" />
            </Box>
            <FormControl sx={{ color: "white", mb: 2 }}>
              <RadioGroup row aria-labelledby="panel-selection" name="panel-selection" value={panelType} onChange={(e) => setPanelType(e.target.value)}>
                <FormControlLabel value="adminpanel" control={<Radio sx={{ color: "white", "&.Mui-checked": { color: "white" }, }} />} label="ADMIN PANEL" sx={{ color: "white" }} />
                <FormControlLabel value="vendorpanel" control={<Radio sx={{ color: "white", "&.Mui-checked": { color: "white" }, }} />} label="CONTRACTE PANEL" sx={{ color: "white" }} />
              </RadioGroup>
            </FormControl>
            {panelType === "adminpanel" ? (
              <>
                <Box className="mb-2">
                  <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Email />} />
                </Box>
                <Box>
                  <Input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock />}
                    endIcon={showPassword ? <VisibilityOff /> : <Visibility />}
                    onEndIconClick={() => setShowPassword(!showPassword)}
                  />
                </Box>
              </>
            ) : (
              <>
                <Box className="mb-2">
                  <Input placeholder="Phone Number" type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} icon={<PersonOutlined />} />
                </Box>
                <Box>
                  <Input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock />}
                    endIcon={showPassword ? <VisibilityOff /> : <Visibility />}
                    onEndIconClick={() => setShowPassword(!showPassword)}
                  />
                </Box>
              </>
            )}
            {error && (
              <Typography color="error" sx={{ mt: 1, mb: 1 }}>
                {error}
              </Typography>
            )}
            <Button variant="contained" fullWidth disabled={isLoading} sx={{
              mt: 2,
              color: "white",
              backgroundColor: "blue",
              "&:hover": { backgroundColor: "#0047ab" },
              "&:disabled": {
                backgroundColor: "blue",
                opacity: 0.6,
                color: "white",
              },
            }} onClick={handleLogin}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;

import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { Box, CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Navbar, SideBar } from "./scenes";
import { Outlet } from "react-router-dom";
import ToastNotification, { showErrorToast } from "./Toast";
import { useAuth } from "./utils/context/AuthContext";
import { requestNotificationPermission } from "./firebase";
import axios from "axios";
import { API_BASE_URL } from "./utils/apiConfig";
import Cookies from "js-cookie";

export const ToggledContext = createContext(null);

function App({ panelType }) {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { logoutReason, clearLogoutReason } = useAuth();

  const authToken = Cookies.get("token");

  React.useEffect(() => {
    if (logoutReason === "expired") {
      showErrorToast("Session expired. Please log in again.");
      clearLogoutReason();
    }
  }, [logoutReason, clearLogoutReason]);

  useEffect(() => {
    const setupFCM = async () => {
      if (authToken) {
        const token = await requestNotificationPermission();
        if (token) {
          await axios.post(`${API_BASE_URL}/auth/update-fcmtoken`,
            { fcmToken: token },
            {
              withCredentials: true,
              headers: { Authorization: `Bearer ${authToken}` },
            }
          );
        }
      }
    };

    setupFCM();
  }, [authToken]);

  const values = useMemo(() => ({
    toggled,
    setToggled,
  }), [toggled]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToggledContext.Provider value={values}>
          <ToastNotification />
          <Box sx={{ display: "flex", height: "100vh", width: "100vw", overflowX: "hidden", position: "relative" }}>
            <SideBar />
            <Box data-main-content sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative", marginLeft: { xs: 0, md: "250px" }, transition: "margin-left 300ms ease", width: { xs: "100%", md: "calc(100% - 250px)" }, "@media (max-width: 768px)": { marginLeft: 0, width: "100%" } }}>
              <Navbar />
              <Box sx={{ overflowY: "auto", flex: 1, width: "100%", position: "relative", mt: 2, p: 2 }}>
                <Outlet />
              </Box>
            </Box>
          </Box>
        </ToggledContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

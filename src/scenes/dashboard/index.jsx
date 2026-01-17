import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Header } from "../../components";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/apiConfig";
import Cookies from "js-cookie";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { useTranslation } from "react-i18next";

const timeAgo = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);

  if (seconds < 60) return `${seconds} sec ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
};

function Dashboard() {
  const [overviewData, setOverviewData] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [rawRecentActivity, setRawRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const { t } = useTranslation();
  const colors = tokens(theme.palette.mode);
  const authToken = Cookies.get("token");

  const fetchOverViewDataOfDashboard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/overview`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data.success) {
        setOverviewData(response.data.data);
        setRawRecentActivity(response.data.data.recentActivity); // stores raw datetime
        setRecentActivity(response.data.data.recentActivity); // visible activity with time text
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchOverViewDataOfDashboard();
    }
  }, [authToken]);

  useEffect(() => {
    // Recalculate time every 60 seconds
    const interval = setInterval(() => {
      const updated = rawRecentActivity.map((item) => ({
        ...item,
        time: timeAgo(item.timeRaw),
      }));
      setRecentActivity(updated);
    }, 60000); // 60 sec

    return () => clearInterval(interval);
  }, [rawRecentActivity]);

  const overviewStats = [
    {
      title: t("dashboard.totalLabours"),
      value: overviewData.totalLabour || 0,
      icon: <PersonIcon sx={{ fontSize: 36, color: "#1E3A8A" }} />,
    },
    {
      title: t("dashboard.totalContractors"),
      value: overviewData.totalContractors || 0,
      icon: <BusinessIcon sx={{ fontSize: 36, color: "#1E3A8A" }} />,
    },
    {
      title: "Total Pending",
      value: overviewData.totalPendingContractors || 0,
      icon: <PendingActionsIcon sx={{ fontSize: 36, color: "#1E3A8A" }} />,
    },
  ];


  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Header
            title={t("dashboard.headerTitle")}
            subtitle="Welcome to your dashboard"
          />

          <Grid container spacing={3}>
            {overviewStats?.map((stat) => (
              <Grid item xs={12} sm={6} md={4} key={stat?.title}>
                <Card
                  sx={{
                    borderRadius: "16px",
                    boxShadow: 3,
                    border: "0.5px solid #2B3990",
                    textAlign: "center",
                    p: 2,
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {stat?.icon}
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: "#000" }}
                    >
                      {stat?.title}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 900, color: "#000" }}
                    >
                      {stat?.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

        </>
      )}
    </Box>
  );
}

export default Dashboard;

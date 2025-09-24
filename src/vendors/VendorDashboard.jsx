import React, { useEffect, useState } from "react";
import { Box, Typography, Card, Chip, Button } from "@mui/material";
import {
  AssignmentOutlined,
  QueryBuilder,
  CheckCircleOutline,
  Today,
  AddOutlined,
} from "@mui/icons-material";
import Header from "../components/Header";
import { ContentCopy } from "@mui/icons-material";
import { CheckIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";
import { useTranslation } from "react-i18next";
import useStylistProfile from "../hooks/useStylistProfile";

const ContractorDashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    inProgress: 0,
    completed: 0,
    todayRequested: 0,
  });
  const [copied, setCopied] = useState(false);

  const { t } = useTranslation();
  const authToken = Cookies.get("token");
  const { profile } = useStylistProfile();

  const fetchContractorStats = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/job/contractor/dashboard-stats`, {
        headers: { Authorization: `Bearer ${authToken}` },
        withCredentials: true,
      });
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch contractor stats", err);
    }
  };

  useEffect(() => {
    fetchContractorStats();
  }, [authToken]);

  const handleCopy = () => {
    if (!profile?.referralCode) return;
    navigator.clipboard.writeText(profile.referralCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => { });
  };

  const statData = [
    { title: "Total Jobs", value: stats.totalJobs, icon: <AssignmentOutlined sx={{ fontSize: 36, color: "#1E3A8A" }} /> },
    { title: "In Progress", value: stats.inProgress, icon: <QueryBuilder sx={{ fontSize: 36, color: "#1E3A8A" }} /> },
    { title: "Completed", value: stats.completed, icon: <CheckCircleOutline sx={{ fontSize: 36, color: "#1E3A8A" }} /> },
    { title: "Requests Today", value: stats.todayRequested, icon: <Today sx={{ fontSize: 36, color: "#1E3A8A" }} /> },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      <Header title="Dashboard" subtitle="Overview of your job posts" />

      {/* Referral + Referrals Count */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2, mb: 2, border: "1px solid black", p: 2, borderRadius: 3 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Referral Code
          </Typography>
          {profile?.isAgent && profile?.referralCode ? (
            <Chip
              label={copied ? "Copied" : profile.referralCode.toUpperCase()}
              size="small"
              variant="filled"
              onClick={handleCopy}
              sx={{
                bgcolor: "black",
                color: "white",
                fontWeight: "bold",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
              icon={!copied ? <ContentCopy style={{ color: "white", fontSize: 16 }} /> : undefined}
              deleteIcon={copied ? <CheckIcon style={{ color: "white", fontSize: 16 }} /> : undefined}
              onDelete={copied ? () => { } : undefined}
            />
          ) : (
            <Typography variant="body2" fontWeight={500}>N/A</Typography>
          )}
        </Box>

        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Referrals Count
          </Typography>
          {profile?.isAgent ? (
            <Chip
              label={profile.referralsCount || 0}
              size="small"
              variant="filled"
              sx={{
                bgcolor: "black",
                color: "white",
                fontWeight: "bold",
              }}
            />
          ) : (
            <Typography variant="body2" fontWeight={500}>0</Typography>
          )}
        </Box>
      </Box>

      {/* Stats Overview */}
      <Box
        mt={3}
        display="grid"
        gridTemplateColumns={{ xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
        gap={3}
      >
        {statData.map((stat, index) => (
          <Card
            key={index}
            sx={{
              p: 3,
              borderRadius: "16px",
              boxShadow: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 1,
            }}
          >
            {stat.icon}
            <Typography variant="subtitle1" fontWeight="bold">
              {stat.title}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {stat.value}
            </Typography>
          </Card>
        ))}
      </Box>

      {/* Quick Actions */}
      <Box mt={4}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Quick Actions
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2}>
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            component={Link}
            to="/job-post"
            sx={{ bgcolor: "primary.main", px: 3, py: 1.5, borderRadius: 2 }}
          >
            Post New Job
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ContractorDashboard;

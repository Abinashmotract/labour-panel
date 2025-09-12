import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, Button, useMediaQuery, Select, MenuItem, Card, Chip } from "@mui/material";
import {
  WorkOutline,
  PeopleOutline,
  PaymentOutlined,
  AssignmentOutlined,
  HistoryOutlined,
  AddOutlined,
  TrendingUpOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";
import Header from "../components/Header";
import { Banknote, Briefcase, UserPlus, Calendar } from "lucide-react";
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import "../vendors/customscss/Dashboard.scss";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";
import { useTranslation, Trans } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ContractorDashboard = () => {
  const [activeJobs, setActiveJobs] = useState(12);
  const [availableWorkers, setAvailableWorkers] = useState(47);
  const [pendingApplications, setPendingApplications] = useState(8);
  const [jobsData, setJobsData] = useState([]);
  const [earningsData, setEarningsData] = useState({});

  const { t } = useTranslation();
  const authToken = Cookies.get("token");
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/contractor/jobs`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (res.data && res.data.success) {
        setJobsData(res.data.data || []);
        setActiveJobs(res.data.data.filter(job => job.status === 'active').length);
      }
    } catch (err) {
      console.error('Failed to fetch jobs data');
    }
  };

  const fetchEarnings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/contractor/earnings`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (res.data && res.data.success) {
        setEarningsData(res.data.data || {});
      }
    } catch (err) {
      console.error('Failed to fetch earnings data');
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchEarnings();
  }, [authToken]);

  const statData = [
    { title: t("dashboard.activeJobs"), value: activeJobs, path: "/jobs", icon: <WorkOutline />, color: "#2E7D32" },
    { title: t("dashboard.availableWorkers"), value: availableWorkers, path: "/workers", icon: <PeopleOutline />, color: "#1565C0" },
    { title: t("dashboard.pendingApplications"), value: pendingApplications, path: "/applications", icon: <AssignmentOutlined />, color: "#ED6C02" },
    { title: t("dashboard.totalEarnings"), value: `$${earningsData.total || '0'}`, path: "/earnings", icon: <PaymentOutlined />, color: "#9C27B0" }
  ];

  const recentJobs = [
    { id: 1, title: "Construction Labor Needed", location: "Downtown", workers: 5, status: "active", budget: "$1200" },
    { id: 2, title: "Warehouse Workers", location: "Industrial Area", workers: 8, status: "active", budget: "$2000" },
    { id: 3, title: "Event Staff Required", location: "Convention Center", workers: 10, status: "completed", budget: "$3000" },
  ];

  const skillDistributionData = {
    labels: ['Construction', 'Delivery', 'Warehouse', 'Events', 'General Labor'],
    datasets: [
      {
        data: [30, 15, 25, 10, 20],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", p: { xs: 1, sm: 2, md: 3 } }}>
      <Header title={t("dashboard.headerTitle")}  subtitle={t("dashboard.headerSubtitle")} />
      
      {/* Stats Overview */}
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
        }}
        gap={{ xs: "15px", sm: "20px" }}
        sx={{ width: "100%" }}
      >
        {statData?.map((stat, index) => (
          <Card
            key={index}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              boxShadow: 3,
              background: stat.color,
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 140,
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.03)" },
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}>
                  {stat.value}
                </Typography>
                <Typography variant="h6" sx={{ fontSize: { xs: "0.8rem", sm: "1rem" }, mt: 1 }}>
                  {stat.title}
                </Typography>
              </Box>
              <Box sx={{ opacity: 0.8 }}>
                {React.cloneElement(stat.icon, { sx: { fontSize: 32 } })}
              </Box>
            </Box>
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
            sx={{ 
              bgcolor: 'primary.main', 
              px: 3, 
              py: 1.5,
              borderRadius: 2
            }}
          >
            Post New Job
          </Button>
          <Button
            variant="outlined"
            startIcon={<PeopleOutline />}
            component={Link}
            to="/workers"
            sx={{ 
              borderColor: 'primary.main', 
              color: 'primary.main',
              px: 3, 
              py: 1.5,
              borderRadius: 2
            }}
          >
            Find Workers
          </Button>
          <Button
            variant="outlined"
            startIcon={<PaymentOutlined />}
            component={Link}
            to="/payments"
            sx={{ 
              borderColor: 'primary.main', 
              color: 'primary.main',
              px: 3, 
              py: 1.5,
              borderRadius: 2
            }}
          >
            Process Payments
          </Button>
        </Box>
      </Box>

      {/* Main Content Grid */}
      <Box sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "2fr 1fr"
        },
        gap: { xs: 2, md: 4 },
        mt: 4
      }}>
        {/* Left Column - Jobs and Earnings */}
        <Box>
          {/* Recent Jobs */}
          <Box mb={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" fontWeight="bold">
                Recent Job Posts
              </Typography>
              <Button component={Link} to="/jobs" size="small">
                View All
              </Button>
            </Box>
            
            <Box display="flex" flexDirection="column" gap={2}>
              {recentJobs.map((job) => (
                <Card key={job.id} sx={{ p: 2, borderRadius: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{job.title}</Typography>
                      <Box display="flex" alignItems="center" mt={0.5} mb={1}>
                        <LocationOnOutlined sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.location}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={1}>
                        <Chip 
                          label={`${job.workers} workers`} 
                          size="small" 
                          variant="outlined" 
                        />
                        <Chip 
                          label={job.status} 
                          size="small" 
                          color={job.status === 'active' ? 'success' : 'default'} 
                        />
                      </Box>
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      {job.budget}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Earnings Chart */}
          <Box className="p-4" sx={{
            background: "white",
            borderRadius: 2,
            boxShadow: 2,
            p: 3
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold">Earnings Overview</Typography>
              <Select defaultValue={"2023"} size="small" sx={{ backgroundColor: "white", borderRadius: 1 }}>
                <MenuItem value="2023">2023</MenuItem>
                <MenuItem value="2022">2022</MenuItem>
              </Select>
            </Box>
            <Box sx={{ height: 300 }}>
              <Bar
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                  datasets: [
                    {
                      label: 'Earnings ($)',
                      data: [4200, 5100, 6800, 7200, 8900, 9500, 10200, 11000, 9800, 11500, 12200, 12700],
                      backgroundColor: 'rgba(54, 162, 235, 0.7)',
                      borderColor: 'rgba(54, 162, 235, 1)',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return '$' + value;
                        }
                      }
                    }
                  }
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Right Column - Stats and Workers */}
        <Box>
          {/* Worker Distribution */}
          <Box className="p-4" sx={{
            background: "white",
            borderRadius: 2,
            boxShadow: 2,
            p: 3,
            mb: 4
          }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>Worker Skills Distribution</Typography>
            <Box sx={{ height: 250, position: 'relative' }}>
              <Doughnut 
                data={skillDistributionData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 12,
                        font: {
                          size: 11
                        }
                      }
                    }
                  }
                }}
              />
            </Box>
          </Box>

          {/* Upcoming Tasks */}
          <Box className="p-4" sx={{
            background: "white",
            borderRadius: 2,
            boxShadow: 2,
            p: 3
          }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>Upcoming Tasks</Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box sx={{ background: '#EDF7ED', p: 1, borderRadius: 1 }}>
                  <Calendar size={18} color="#2E7D32" />
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="medium">Interview scheduled</Typography>
                  <Typography variant="caption" color="text.secondary">Tomorrow, 10:00 AM</Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box sx={{ background: '#E3F2FD', p: 1, borderRadius: 1 }}>
                  <PaymentOutlined sx={{ fontSize: 18, color: '#1565C0' }} />
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="medium">Pay workers</Typography>
                  <Typography variant="caption" color="text.secondary">Due in 3 days</Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box sx={{ background: '#FFF4E5', p: 1, borderRadius: 1 }}>
                  <WorkOutline sx={{ fontSize: 18, color: '#ED6C02' }} />
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="medium">Construction job starts</Typography>
                  <Typography variant="caption" color="text.secondary">Next Monday</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default ContractorDashboard;
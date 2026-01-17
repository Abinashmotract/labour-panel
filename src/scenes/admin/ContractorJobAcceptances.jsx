import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
  TablePagination,
  useTheme,
} from "@mui/material";
import { Header } from "../../components";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/apiConfig";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { tokens } from "../../theme";

const timeAgo = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);

  if (seconds < 60) return `${seconds} sec ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
};

function ContractorJobAcceptances() {
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [contractorJobAcceptances, setContractorJobAcceptances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const authToken = Cookies.get("token");

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/overview`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data.success) {
        setContractorJobAcceptances(response.data.data.contractorJobAcceptances || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchData();
    }
  }, [authToken]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedJobs = contractorJobAcceptances?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
            title={t("dashboard.contractorJobAcceptancesTitle")}
            subtitle={t("dashboard.contractorJobAcceptancesSubtitle")}
          />

          {contractorJobAcceptances?.length > 0 ? (
            <Card sx={{ mt: 3, borderRadius: "16px", boxShadow: 3, border: "0.5px solid #2B3990", backgroundColor: colors.primary[400] }}>
              <CardContent>
                {paginatedJobs?.map((job, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.gray[100] }}>
                        {job?.jobTitle}
                      </Typography>
                      <Chip
                        label={`${job?.acceptedLaboursCount} / ${job?.labourersRequired} ${t("dashboard.labours")}`}
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t("dashboard.contractorLabel")}: {job?.contractorName} ({job?.contractorEmail})
                    </Typography>
                    <TableContainer component={Paper} sx={{ boxShadow: "none", mt: 1, backgroundColor: colors.primary[400] }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: colors.gray[900] }}>
                            <TableCell sx={{ fontWeight: 700, color: colors.primary[100] }}>{t("dashboard.labourName")}</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: colors.primary[100] }}>{t("dashboard.email")}</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: colors.primary[100] }}>{t("dashboard.phone")}</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: colors.primary[100] }}>{t("dashboard.acceptedAt")}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {job?.acceptedLabours?.map((labour, labourIndex) => (
                            <TableRow key={labourIndex} sx={{ "&:hover": { backgroundColor: colors.primary[500] } }}>
                              <TableCell sx={{ fontWeight: 600, color: colors.gray[100] }}>{labour?.labourName}</TableCell>
                              <TableCell sx={{ color: colors.gray[100] }}>{labour?.labourEmail}</TableCell>
                              <TableCell sx={{ color: colors.gray[100] }}>{labour?.labourPhone}</TableCell>
                              <TableCell>
                                <Chip
                                  label={labour?.acceptedAtFormatted}
                                  size="small"
                                  color="success"
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {index < paginatedJobs.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
                <TablePagination
                  component="div"
                  count={contractorJobAcceptances?.length || 0}
                  page={page}
                  onPageChange={handlePageChange}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                />
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ mt: 3, borderRadius: "16px", boxShadow: 3, border: "0.5px solid #2B3990", backgroundColor: colors.primary[400] }}>
              <CardContent>
                <Typography variant="body1" sx={{ textAlign: "center", py: 4, color: colors.gray[100] }}>
                  {t("dashboard.noJobAcceptances")}
                </Typography>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
}

export default ContractorJobAcceptances;


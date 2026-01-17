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

function ContractorAcceptances() {
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [contractorAcceptances, setContractorAcceptances] = useState([]);
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
        setContractorAcceptances(response.data.data.contractorAcceptances || []);
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

  const paginatedData = contractorAcceptances?.slice(
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
            title={t("dashboard.contractorAcceptancesTitle")}
            subtitle={t("dashboard.contractorAcceptancesSubtitle")}
          />

          {contractorAcceptances?.length > 0 ? (
            <Card sx={{ mt: 3, borderRadius: "16px", boxShadow: 3, border: "0.5px solid #2B3990", backgroundColor: colors.primary[400] }}>
              <CardContent>
                <TableContainer component={Paper} sx={{ boxShadow: "none", backgroundColor: colors.primary[400] }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: colors.gray[900] }}>
                        <TableCell sx={{ fontWeight: 700, color: colors.primary[100] }}>{t("dashboard.labour")}</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: colors.primary[100] }}>{t("dashboard.contractor")}</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: colors.primary[100] }}>{t("dashboard.jobTitle")}</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: colors.primary[100] }}>{t("dashboard.acceptedAt")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedData?.map((acceptance, index) => (
                        <TableRow key={index} sx={{ "&:hover": { backgroundColor: colors.primary[500] } }}>
                          <TableCell sx={{ color: colors.gray[100] }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.gray[100] }}>
                              {acceptance?.labourName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.gray[300] }}>
                              {acceptance?.labourPhone || "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ color: colors.gray[100] }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.gray[100] }}>
                              {acceptance?.contractorName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.gray[300] }}>
                              {acceptance?.contractorPhone || "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ color: colors.gray[100] }}>{acceptance?.jobTitle}</TableCell>
                          <TableCell>
                            <Chip
                              label={acceptance?.acceptedAtFormatted}
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
                <TablePagination
                  component="div"
                  count={contractorAcceptances?.length || 0}
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
                  {t("dashboard.noContractorAcceptances")}
                </Typography>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
}

export default ContractorAcceptances;


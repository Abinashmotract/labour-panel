import { Box, Container, IconButton, InputBase, useTheme } from "@mui/material";
import { Header } from "../../components";
import { SearchOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomTable from "../../custom/Table";
import { API_BASE_URL } from "../../utils/apiConfig";
import { tokens } from "../../theme";
import { showErrorToast, showSuccessToast } from "../../Toast";
import Cookies from "js-cookie";
import { CustomIconButton } from "../../custom/Button";
import { jobApplicationTableColumns } from "../../custom/TableColumns";
import JobApplicationDialog from "../../components/JobApplicationDialog";
import Alert from "../../custom/Alert";
import { useTranslation } from 'react-i18next';

export default function JobApplication() {
  const [allApplications, setAllApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [viewRow, setViewRow] = useState(null);
  const [isViewDialog, setIsViewDialog] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { t } = useTranslation();
  const authToken = Cookies.get("token");

  const fetchAllApplications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/job/contractor/applications`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("Applications API Response:", response.data);

      if (response?.data?.success) {
        const fullData = (response?.data?.data || []).map((item) => ({
          ...item,
          id: item._id,
          jobTitle: item.job?.title || "No Job Title",
          applicantName:
            `${item.labour?.firstName || ""} ${
              item.labour?.lastName || ""
            }`.trim() || "Unknown",
          applicantPhone: item.labour?.phoneNumber || "N/A",
          applicantEmail: item.labour?.email || "N/A",
          status: item.status || "pending",
          appliedDate: item.createdAt || new Date().toISOString(),
          coverLetter: item.coverLetter || "",
          jobDetails: item.job || {},
          labourDetails: item.labour || {},
        }));
        setAllApplications(fullData);
      } else {
        showErrorToast(
          response?.data?.message || "Failed to fetch job applications"
        );
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      showErrorToast("Error fetching job applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchAllApplications();
    }
  }, [authToken]);

  useEffect(() => {
    if (searchText === "") {
      setFilteredApplications(allApplications);
    } else {
      setFilteredApplications(
        allApplications.filter(
          (application) =>
            (application.jobTitle || "")
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            (application.applicantName || "")
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            (application.status || "")
              .toLowerCase()
              .includes(searchText.toLowerCase())
        )
      );
    }
  }, [allApplications, searchText]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/application/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.success) {
        showSuccessToast(
          response?.data?.message || "Application deleted successfully"
        );
        setAllApplications((prev) => prev.filter((app) => app.id !== deleteId));
        await fetchAllApplications();
      } else {
        showErrorToast("Failed to delete application.");
      }
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message || "An error occurred while deleting."
      );
    } finally {
      setDeleting(false);
      setAlertOpen(false);
      setDeleteId(null);
    }
  };

  const handleView = (row) => {
    setViewRow(row);
    setIsViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialog(false);
    setViewRow(null);
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setUpdatingStatus(applicationId);
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/job/contractor/application/${applicationId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.success) {
        showSuccessToast(
          response?.data?.message || "Application status updated successfully"
        );
        setAllApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      } else {
        showErrorToast(
          response?.data?.message || "Failed to update application status"
        );
      }
    } catch (error) {
      console.error("Status update error:", error);
      showErrorToast(
        error?.response?.data?.message || "Error updating application status"
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  const columns = jobApplicationTableColumns({
    handleDelete,
    handleView,
    handleStatusUpdate,
    updatingStatus,
  });

  return (
    <Box>
      <Container maxWidth={false}>
        <Header title={t("dashboard.labourjobapplications")} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            bgcolor={colors.primary[400]}
            sx={{
              border: "1px solid purple",
              borderRadius: "10px",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <InputBase
              placeholder="Search Applications"
              value={searchText}
              onChange={handleSearch}
              sx={{ ml: 2, flex: 1 }}
            />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchOutlined />
            </IconButton>
          </Box>
        </Box>
        <CustomTable
          columns={columns}
          rows={filteredApplications}
          loading={loading}
          noRowsMessage="No job applications found"
        />
      </Container>

      <JobApplicationDialog
        open={isViewDialog}
        onClose={handleCloseViewDialog}
        rowData={viewRow}
      />

      <Alert
        open={alertOpen}
        title="Delete Application"
        description="Are you sure you want to delete this application? This action cannot be undone."
        onClose={() => setAlertOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        disableCancel={deleting}
      />
    </Box>
  );
}

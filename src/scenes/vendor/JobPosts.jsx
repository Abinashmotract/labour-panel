import {
  Box,
  Container,
  IconButton,
  InputBase,
  useTheme,
} from "@mui/material";
import { Header } from "../../components";
import { SearchOutlined, PersonAdd } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomTable from "../../custom/Table";
import { API_BASE_URL } from "../../utils/apiConfig";
import { tokens } from "../../theme";
import { showErrorToast, showSuccessToast } from "../../Toast";
import Cookies from "js-cookie";
import { CustomIconButton } from "../../custom/Button";
import { jobPostTableColumns } from "../../custom/TableColumns";
import Alert from "../../custom/Alert";
import JobPostDialog from '../../components/JobPostDialog';
import { useTranslation } from 'react-i18next';

export default function JobPosts() {
  const [allJobPosts, setAllJobPosts] = useState([]);
  const [filteredJobPosts, setFilteredJobPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openJobPostDialog, setOpenJobPostDialog] = useState(false);
  const [viewRow, setViewRow] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isViewDialog, setIsViewDialog] = useState(false);

  const { t } = useTranslation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authToken = Cookies.get("token");

  const fetchAllJobPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/contractor/all-jobs`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("Job Posts Response:", response?.data?.data);
      if (response?.data?.success) {
        const fullData = (response?.data?.data || []).map((item) => ({
          ...item,
          id: item._id,
        }));
        setAllJobPosts(fullData);
      } else {
        showErrorToast(response?.data?.message || "Failed to fetch job posts");
      }
    } catch (error) {
      showErrorToast("Error fetching job posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchAllJobPosts();
    }
  }, [authToken]);

  useEffect(() => {
    if (searchText === "") {
      setFilteredJobPosts(allJobPosts);
    } else {
      setFilteredJobPosts(
        allJobPosts.filter((post) =>
          (post.title || "").toLowerCase().includes(searchText.toLowerCase()) ||
          (post.description || "").toLowerCase().includes(searchText.toLowerCase()) ||
          ((post.location?.address || "").toLowerCase().includes(searchText.toLowerCase()))
        )
      );
    }
  }, [allJobPosts, searchText]);

  const handleOpenJobPost = () => {
    setEditRow(null);
    setEditMode(false);
    setOpenJobPostDialog(true);
  };

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
      const response = await axios.delete(`${API_BASE_URL}/contractor/delete-job-posts/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response?.data?.status === 200) {
        showSuccessToast(response?.data?.message || "Job post deleted successfully");
        setAllJobPosts((prev) => prev.filter((post) => post.id !== deleteId));
        await fetchAllJobPosts();
      } else {
        showErrorToast("Failed to delete job post.");
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "An error occurred while deleting.");
    } finally {
      setDeleting(false);
      setAlertOpen(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (row) => {
    setEditRow(row);
    setEditMode(true);
    setOpenJobPostDialog(true);
  };

  const handleView = (row) => {
    setViewRow(row);
    setIsViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialog(false);
    setViewRow(null);
  };

  const columns = jobPostTableColumns({ handleDelete, handleView, handleEdit });

  return (
    <Box>
      <Container maxWidth={false}>
        <Header title={t("nav.jobPost")} />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexDirection: { xs: "column", sm: "row" }, gap: 2, }}>
          <Box display="flex" alignItems="center" bgcolor={colors.primary[400]} sx={{ border: '1px solid purple', borderRadius: '10px', width: { xs: '100%', sm: 'auto' }, }}>
            <InputBase placeholder={t("nav.searchJobPosts")} value={searchText} onChange={handleSearch} sx={{ ml: 2, flex: 1 }} />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchOutlined />
            </IconButton>
          </Box>
          <CustomIconButton icon={<PersonAdd />} text={t("nav.createJobPost")} fontWeight="bold" color="#6d295a" variant="outlined" onClick={handleOpenJobPost} sx={{ width: { xs: '100%', sm: 'auto' } }} />
        </Box>
        <CustomTable columns={columns} rows={filteredJobPosts} loading={loading} noRowsMessage="No job posts found" />
      </Container>

      <JobPostDialog
        open={openJobPostDialog}
        handleClose={() => {
          setOpenJobPostDialog(false);
          setEditMode(false);
          setEditRow(null);
        }}
        onSuccess={() => {
          setOpenJobPostDialog(false);
          setEditMode(false);
          setEditRow(null);
          fetchAllJobPosts();
        }}
        editMode={editMode}
        rowData={editRow}
      />
      <JobPostDialog open={isViewDialog} handleClose={handleCloseViewDialog} viewMode={true} rowData={viewRow} />

      <Alert
        open={alertOpen}
        title="Delete Job Post"
        description="Are you sure you want to delete this job post? This action cannot be undone."
        onClose={() => setAlertOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        disableCancel={deleting}
      />
    </Box>
  );
}
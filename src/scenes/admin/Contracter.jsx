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
import { stylistUserTableColumns } from "../../custom/StylistUserTableColumns";
import ShowDetailsDialog from "../../components/ShowDetailsDialog";
import Alert from "../../custom/Alert";
import { useTranslation } from "react-i18next";

export default function RegisteredStylist() {
  const [allUsers, setAllUsers] = useState([]);
  const [originalStylists, setOriginalStylists] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [togglingIds, setTogglingIds] = useState({});
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedStylistDetails, setSelectedStylistDetails] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
    loading: false,
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authToken = Cookies.get("token");
  const {t} = useTranslation();

  const formatAddress = (address) => {
    if (!address) return "N/A";
    if (typeof address === "string") return address;
    if (typeof address === "object") {
      return Object.values(address).filter(Boolean).join(", ");
    }
    return "N/A";
  };

  const fetchAllStylistUserDetials = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/contractors/all`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response?.data?.status === 200) {
        setOriginalStylists(response.data.data);
        const formattedData = response?.data?.data.map((stylist) => ({
          id: stylist._id,
          fullName: stylist.fullName || "N/A",
          email: stylist.email || "N/A",
          phone: stylist.phoneNumber || "N/A",
          role: stylist.role || "N/A",
          dob: stylist.dob ? new Date(stylist.dob).toLocaleDateString() : "N/A",
          gender: stylist.gender || "N/A",
          approved: stylist.isApproved ?? false,
          createdAt: new Date(stylist.createdAt).toLocaleDateString(),
          address: formatAddress(stylist.address),
        }));
        setAllUsers(formattedData); // ✅ Set both states
        setFilteredUsers(formattedData);
      }
    } catch (error) {
      showErrorToast("Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchAllStylistUserDetials();
    }
  }, [authToken]);

  const handleView = (row) => {
    const fullStylistDetails = originalStylists.find((s) => s._id === row.id);
    if (fullStylistDetails) {
      fullStylistDetails.address = formatAddress(fullStylistDetails.address);
    }
    setSelectedStylistDetails(fullStylistDetails);
    setIsDetailsDialogOpen(true);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    setTogglingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/admin/contractors/${id}`,
        { isApproved: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      showSuccessToast(response?.data?.message || "Approval status updated!");
      await fetchAllStylistUserDetials();
    } catch (error) {
      console.error("Toggle error:", error);
      showErrorToast("An error occurred while toggling approval.");
    } finally {
      setTogglingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (value.trim() === "") {
      setFilteredUsers(allUsers);
      return;
    }
    try {
      const response = await axios.get(
        `${API_BASE_URL}/stylist/admin/search-stylist`,
        {
          params: { query: value },
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response?.data?.status === 200 && response?.data?.success) {
        const formattedData = (response?.data?.data || []).map((stylist) => ({
          id: stylist._id,
          fullName: stylist.fullName || "N/A",
          email: stylist.email || "N/A",
          phone: stylist.phoneNumber || "N/A",
          role: stylist.role || "N/A",
          dob: stylist.dob ? new Date(stylist.dob).toLocaleDateString() : "N/A",
          gender: stylist.gender || "N/A",
          approved: stylist.isApproved ?? false,
          createdAt: stylist.createdAt
            ? new Date(stylist.createdAt).toLocaleDateString()
            : "N/A",
          address: formatAddress(stylist.address),
        }));
        setFilteredUsers(formattedData);
      } else {
        setFilteredUsers([]);
      }
    } catch (error) {
      setFilteredUsers([]);
    }
  };

  const handleDelete = (id) => {
    setDeleteDialog({ open: true, id, loading: false });
  };

  const handleConfirmDelete = async () => {
    const id = deleteDialog.id;
    console.log("Deleting stylist with ID:", id);
    setDeleteDialog((prev) => ({ ...prev, loading: true }));
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/admin/contractors/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.status === 200) {
        showSuccessToast(
          response?.data?.message || "Stylist deleted successfully"
        );
        setAllUsers((prevList) => prevList.filter((user) => user.id !== id));
        setFilteredUsers((prevList) =>
          prevList.filter((user) => user.id !== id)
        );
      } else {
        showErrorToast("Failed to delete stylist.");
      }
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message || "An error occurred while deleting."
      );
    } finally {
      setDeleteDialog({ open: false, id: null, loading: false });
    }
  };

  const columns = stylistUserTableColumns({
    handleToggleStatus,
    handleDelete,
    handleView,
    togglingIds,
  });

  return (
    <Box className="p-1">
      <Header title="All Verified Contracter " />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          bgcolor={colors.primary[400]}
          sx={{ border: "1px solid purple", borderRadius: "10px" }}
        >
          <InputBase
            placeholder={t("nav.searchJobPosts")}
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
        rows={filteredUsers}
        loading={loading}
        checkboxSelection
      />
      <ShowDetailsDialog
        open={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        data={selectedStylistDetails}
      />
      <Alert
        open={deleteDialog.open}
        title="Delete Stylist"
        description="Are you sure you want to delete this stylist?"
        onClose={() =>
          setDeleteDialog({ open: false, id: null, loading: false })
        }
        onConfirm={handleConfirmDelete}
        loading={deleteDialog.loading}
      />
    </Box>
  );
}

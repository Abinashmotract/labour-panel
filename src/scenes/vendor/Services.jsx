// src/scenes/vendor/Services.jsx
import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import { Header } from "../../components";
import { SearchOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomTable from "../../custom/Table";
import { labourTableColumns } from "../../custom/TableColumns";
import { API_BASE_URL } from "../../utils/apiConfig";
import { tokens } from "../../theme";
import Cookies from "js-cookie";
import ShowDetailsDialog from "../../components/ShowDetailsDialog";

export default function Services() {
  const [allUsers, setAllUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authToken = Cookies.get("token");

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/user/contractor/all-labour`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const users = response?.data?.data || [];
      setOriginalUsers(users);

      const formattedData = users.map((user) => ({
        id: user._id,
        fullName:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() || "N/A",
        email: user.email || "N/A",
        mobile: user.phoneNumber || "N/A",
        role: user.role || "N/A",
        gender: user.gender || "N/A",
        profilePicture: user.profilePicture || "",
        createdAt: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "N/A",
        isPhoneVerified: user.isPhoneVerified ? "Yes" : "No",
        address: user.addressLine1 || "N/A",
        workCategory: user.work_category || "N/A",
        workExperience: user.work_experience || "N/A",
        latitude:
          user.location?.coordinates?.length > 1
            ? user.location.coordinates[1]
            : "N/A",
        longitude:
          user.location?.coordinates?.length > 0
            ? user.location.coordinates[0]
            : "N/A",
      }));

      setAllUsers(formattedData);
      setFilteredUsers(formattedData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    if (value === "") {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(
        (user) =>
          user.fullName.toLowerCase().includes(value) ||
          user.email.toLowerCase().includes(value) ||
          user.mobile.toLowerCase().includes(value)
      );
      setFilteredUsers(filtered);
    }
  };

  const handleView = (user) => {
    const fullUserDetails = originalUsers.find((u) => u._id === user.id);
    setSelectedUserDetails(fullUserDetails);
    setIsDetailsDialogOpen(true);
  };

  const columns = labourTableColumns({ handleView });

  return (
    <Box>
      <Header title="All Labours" />
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
            placeholder="Search user"
            value={searchText}
            onChange={handleSearch}
            sx={{ ml: 2, flex: 1 }}
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchOutlined />
          </IconButton>
        </Box>
      </Box>

      <CustomTable columns={columns} rows={filteredUsers} loading={loading} />

      {/* Details Dialog */}
      {isDetailsDialogOpen && selectedUserDetails && (
        <ShowDetailsDialog
          open={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          user={selectedUserDetails}
        />
      )}
    </Box>
  );
}

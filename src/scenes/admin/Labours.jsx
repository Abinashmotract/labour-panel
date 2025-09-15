import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import { Header } from "../../components";
import { PersonAdd, Refresh, SearchOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomTable from "../../custom/Table";
import { userTableColumns } from "../../custom/TableColumns";
import { API_BASE_URL } from "../../utils/apiConfig";
import { tokens } from "../../theme";
import Cookies from "js-cookie";
import ShowDetailsDialog from "../../components/ShowDetailsDialog";
import Alert from "../../custom/Alert";
import { showSuccessToast, showErrorToast } from "../../Toast";
import { CustomIconButton } from "../../custom/Button";
import AgentEntityDialog from "../../components/AgentEntityDialog";
import SelectInput from "../../custom/Select";
import { useTranslation } from 'react-i18next';

export default function CustomerDetails() {
    const [allUsers, setAllUsers] = useState([]);
    const [originalUsers, setOriginalUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [isViewDialog, setIsViewDialog] = useState(false);
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [roleFilter, setRoleFilter] = useState("");

    const theme = useTheme();
     const { t } = useTranslation();
    const colors = tokens(theme.palette.mode);
    const authToken = Cookies.get("token");

    const fetchAllUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/user/admin/get-all`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`
                }
            });
            setOriginalUsers(response.data.data);
            const formattedData = response?.data?.data.map((user) => ({
                id: user._id,
                fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "N/A",
                email: user.email || "N/A",
                mobile: user.phoneNumber || "N/A",
                role: user.role || "N/A",
                gender: user.gender || "N/A",
                profilePicture: user.profilePicture || "",
                createdAt: new Date(user.createdAt).toLocaleDateString(),
                isPhoneVerified: user.isPhoneVerified ? "Yes" : "No",
                address: user.addressLine1 || "N/A",
                workCategory: user.work_category || "N/A",
                workExperience: user.work_experience || "N/A",
                latitude: user.location?.coordinates?.[1] || "N/A",
                longitude: user.location?.coordinates?.[0] || "N/A",
            }));
            setAllUsers(formattedData);
            setFilteredUsers(formattedData);
        } catch (error) {
            console.log("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const applyFilters = (users, search = searchText, role = roleFilter) => {
        let result = users;
        if (search) {
            const value = search.toLowerCase();
            result = result.filter(
                user =>
                    user.fullName.toLowerCase().includes(value) ||
                    user.email.toLowerCase().includes(value) ||
                    user.mobile.toLowerCase().includes(value)
            );
        }
        if (role) {
            result = result.filter(user => user.role.toLowerCase() === role.toLowerCase());
        }
        setFilteredUsers(result);
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        applyFilters(allUsers, value, roleFilter);
    };

    const handleRoleFilterChange = (e) => {
        const value = e.target.value;
        setRoleFilter(value);
        applyFilters(allUsers, searchText, value);
    };

    const handleResetSearch = () => {
        setSearchText("");
        setRoleFilter("");
        fetchAllUsers();
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setAlertOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const response = await axios.delete(`${API_BASE_URL}/user/admin/delete/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });
            if (response?.data?.status === 200) {
                showSuccessToast(response?.data?.message || "Service deleted successfully");
                const updatedAllUsers = allUsers.filter((user) => user.id !== deleteId);
                const updatedOriginalUsers = originalUsers.filter((user) => user._id !== deleteId);
                setAllUsers(updatedAllUsers);
                setOriginalUsers(updatedOriginalUsers);
                if (searchText) {
                    const filtered = updatedAllUsers.filter(user =>
                        user.fullName.toLowerCase().includes(searchText) ||
                        user.email.toLowerCase().includes(searchText) ||
                        user.mobile.toLowerCase().includes(searchText)
                    );
                    setFilteredUsers(filtered);
                } else {
                    setFilteredUsers(updatedAllUsers);
                }
            } else {
                showErrorToast("Failed to delete service.");
            }
        } catch (error) {
            showErrorToast(error?.response?.data?.message || "An error occurred while deleting.");
        } finally {
            setDeleting(false);
            setAlertOpen(false);
            setDeleteId(null);
        }
    };

    const handleView = (user) => {
        const fullUserDetails = originalUsers.find(u => u._id === user.id);
        setSelectedUserDetails(fullUserDetails);
        setIsDetailsDialogOpen(true);
    };

    const handleOpenCategory = () => {
        setOpenCategoryDialog(true);
    };

    const handleCloseCategoryDialog = () => {
        setOpenCategoryDialog(false);
    };

    const handleCloseViewDialog = () => {
        setIsViewDialog(false);
        setViewValue("");
        setViewStatus(undefined);
    };


    const columns = userTableColumns({ handleDelete, handleView });

    return (
        <Box>
            <Header title={t("dashboard.alllaours")} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, maxWidth: "600px" }}>
                    <Box display="flex" alignItems="center" bgcolor={colors.primary[400]} sx={{ border: "1px solid purple", borderRadius: "10px", flex: 1, }}>
                        <InputBase placeholder="Search user" value={searchText} onChange={handleSearch} sx={{ ml: 2, flex: 1 }} />
                        <IconButton type="button" sx={{ p: 1 }}>
                            <SearchOutlined />
                        </IconButton>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <SelectInput value={roleFilter} onChange={handleRoleFilterChange} options={[{ value: "labour", label: "Labour" }, { value: "contractor", label: "Contractor" },]} placeholder="Filter by Role" fullWidth />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <CustomIconButton icon={<Refresh />} onClick={handleResetSearch} text="Reset Search" fontWeight="bold" color="#ff4d4d" variant="outlined" />
                    </Box>
                </Box>
                <CustomIconButton icon={<PersonAdd />} text="Create Labour/Contractor" fontWeight="bold" color="#6d295a" variant="outlined" onClick={handleOpenCategory} />
            </Box>

            <CustomTable columns={columns} rows={filteredUsers} loading={loading} />
            <ShowDetailsDialog open={isDetailsDialogOpen} onClose={() => setIsDetailsDialogOpen(false)} data={selectedUserDetails} />
            <AgentEntityDialog
                open={openCategoryDialog}
                handleClose={handleCloseCategoryDialog}
                dialogTitle="Create New Labour/Contractor"
                apiEndpoint="/admin/create-user"
                onSuccess={() => {
                    handleCloseCategoryDialog();
                    fetchAllUsers();
                }}
                inputLabel="Labour/Contractor Name"
                buttonText="Create Labour/Contractor"
            />

            <AgentEntityDialog
                open={isViewDialog}
                handleClose={handleCloseViewDialog}
                isView={true}
                inputLabel="Labour/Contractor Name"
                showPriceFields={true}
            />

            <Alert
                open={alertOpen}
                title="Delete Labour/Contractor"
                description="Are you sure you want to delete this service? This action cannot be undone."
                onClose={deleting ? undefined : () => setAlertOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={deleting}
                disableCancel={deleting}
            />
        </Box>
    );
};
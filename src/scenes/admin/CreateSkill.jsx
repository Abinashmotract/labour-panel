import { Box, Container, IconButton, InputBase, useTheme } from "@mui/material";
import { Header } from "../../components";
import { SearchOutlined, PersonAdd } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomTable from "../../custom/Table";
import { API_BASE_URL } from "../../utils/apiConfig";
import CreateSubservices from "../../components/CreateSubservices";
import EntityDialog from "../../components/EntityDialog";
import { tokens } from "../../theme";
import { showErrorToast, showSuccessToast } from "../../Toast";
import Cookies from "js-cookie";
import { CustomIconButton } from "../../custom/Button";
import { skillsTableColumns } from "../../custom/TableColumns";
import Alert from "../../custom/Alert";
import { useTranslation } from "react-i18next";

export default function ServiceCategory() {
    const [allServices, setAllServices] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    const [togglingIds, setTogglingIds] = useState({});
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [isViewDialog, setIsViewDialog] = useState(false);
    const [viewValue, setViewValue] = useState("");
    const [openSubCategoryDialog, setOpenSubCategoryDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editValue, setEditValue] = useState("");

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const authToken = Cookies.get("token");
    const { t } = useTranslation();

    const fetchAllServices = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/skill/admin/skills`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response?.data?.status === 200) {
                const skills = response?.data?.data?.skills || [];
                const formattedData = skills?.map((skill) => ({
                    id: skill._id,
                    name: skill.name || "N/A",
                    nameHindi: skill.nameHindi || "N/A",
                    category: skill.category || "N/A",
                    approved: !!skill.isActive,
                    createdAt: skill.createdAt || null,
                }));
                setAllServices(formattedData);
            }
        } catch (error) {
            showErrorToast("Error fetching services");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authToken) {
            fetchAllServices();
        }
    }, [authToken]);

    useEffect(() => {
        if (searchText === "") {
            setFilteredUsers(allServices);
        } else {
            setFilteredUsers(
                allServices.filter((service) =>
                    service.name.toLowerCase().includes(searchText)
                )
            );
        }
    }, [allServices, searchText]);

    const handleToggleStatus = async (id) => {
        setTogglingIds((prev) => ({ ...prev, [id]: true }));
        try {
            const response = await axios.patch(
                `${API_BASE_URL}/skill/admin/skills/${id}/toggle`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Toggle response:", response.data.data);
            showSuccessToast(response?.data?.message || "Service status updated!");
            await fetchAllServices();
        } catch (error) {
            console.log("Toggle error:", error);
            showErrorToast("An error occurred while toggling approval.");
        } finally {
            setTogglingIds((prev) => ({ ...prev, [id]: false }));
        }
    };

    const handleOpenCategory = () => {
        setOpenCategoryDialog(true);
    };

    const handleCloseCategoryDialog = () => {
        setOpenCategoryDialog(false);
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
            const response = await axios.delete(
                `${API_BASE_URL}/skill/admin/skills/${deleteId}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response?.data?.status === 200) {
                showSuccessToast(
                    response?.data?.message || "Service deleted successfully"
                );
                setAllServices((prevServices) =>
                    prevServices.filter((service) => service.id !== deleteId)
                );
                setFilteredUsers((prevUsers) =>
                    prevUsers.filter((user) => user.id !== deleteId)
                );
            } else {
                showErrorToast("Failed to delete service.");
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
        setViewValue(row);
        setIsViewDialog(true);
    };

    const handleEdit = (row) => {
        setEditValue(row.name);
        setEditId(row.id);
        setIsEditMode(true);
        setOpenCategoryDialog(true);
    };

    const columns = skillsTableColumns({ handleToggleStatus, handleDelete, handleView, togglingIds, handleEdit });

    return (
        <Box className="p-1">
            <Header title={t("dashboard.allSkills")} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexDirection: { xs: "column", sm: "row" }, gap: 2, }}>
                <Box display="flex" alignItems="center" bgcolor={colors.primary[400]} sx={{ border: "1px solid purple", borderRadius: "10px", width: { xs: "100%", sm: "auto" }, }}>
                    <InputBase placeholder={t("dashboard.searchSkill")} value={searchText} onChange={handleSearch} sx={{ ml: 2, flex: 1 }} />
                    <IconButton type="button" sx={{ p: 1 }}>
                        <SearchOutlined />
                    </IconButton>
                </Box>
                <CustomIconButton icon={<PersonAdd />} text={t("dashboard.addNewSkill")} fontWeight="bold" color="#6d295a" variant="outlined" onClick={handleOpenCategory} sx={{ width: { xs: "100%", sm: "auto" } }} />
            </Box>
            <CustomTable columns={columns} rows={filteredUsers} loading={loading} />

            <EntityDialog
                open={openCategoryDialog}
                handleClose={handleCloseCategoryDialog}
                dialogTitle="Add New Skill"
                apiEndpoint="/skill/admin/create"
                onSuccess={() => { handleCloseCategoryDialog(); fetchAllServices(); }}
                inputLabel="Service Name"
                buttonText="Add Skill"
                showPriceFields={true}
                viewValue={viewValue}
            />
            <EntityDialog
                open={isViewDialog}
                handleClose={() => { setIsViewDialog(false); setViewValue(""); }}
                isView={true}
                viewValue={viewValue}
                dialogTitle="View Skill"
                inputLabel="Skill Name"
            />

            <EntityDialog
                open={openCategoryDialog}
                handleClose={() => {
                    setOpenCategoryDialog(false);
                    setIsEditMode(false);
                    setEditId(null);
                    setEditValue("");
                }}
                dialogTitle={isEditMode ? "Edit Skill" : "Add New Skill"}
                apiEndpoint="/skill/admin/create"
                onSuccess={() => {
                    fetchAllServices();
                    setOpenCategoryDialog(false);
                    setIsEditMode(false);
                    setEditId(null);
                    setEditValue("");
                }}
                inputLabel="Skill Name"
                buttonText={isEditMode ? "Update Skill" : "Add Skill"}
                isEdit={isEditMode}
                editId={editId}
                editValue={editValue}
            />

            <CreateSubservices open={openSubCategoryDialog} handleClose={() => setOpenSubCategoryDialog(false)} onSuccess={fetchAllServices} />

            <Alert
                open={alertOpen}
                title="Delete Service"
                description="Are you sure you want to delete this service? This action cannot be undone."
                onClose={deleting ? undefined : () => setAlertOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={deleting}
                disableCancel={deleting}
            />
        </Box>
    );
}

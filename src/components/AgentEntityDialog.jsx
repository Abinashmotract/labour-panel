import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import Input from "../custom/Input";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";
import Divider from "@mui/material/Divider";
import { showErrorToast, showSuccessToast, showCustomMessage } from "../Toast";
import { CustomIconButton } from "../custom/Button";
import { Close, PersonAdd } from "@mui/icons-material";
import Cookies from "js-cookie";

const AgentEntityDialog = ({
  open,
  handleClose,
  dialogTitle = "Add New Agent",
  apiEndpoint = "/agent/admin/insert",
  fetchAll = () => { },
  inputLabel = "Agent",
  buttonText = "Add Agent",
  onSuccess = () => { },
  isEdit = false,
  editId = null,
  editValue = {},
  isView = false,
  viewValue = {},
}) => {
  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    commission: "",
  });
  const [loading, setLoading] = useState(false);

  const authToken = Cookies.get("token");

  // Reset / Prefill
  useEffect(() => {
    if (!open) {
      setFormValues({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        commission: "",
      });
      return;
    }

    if (isEdit && editValue) {
      setFormValues({
        fullName: editValue?.fullName || "",
        email: editValue?.email || "",
        phone: editValue?.phone || "",
        address: editValue?.address || "",
        commission:
          editValue?.commission !== undefined && editValue?.commission !== null
            ? String(editValue.commission)
            : "",
      });
    } else if (isView && viewValue) {
      setFormValues({
        fullName: viewValue?.fullName || "",
        email: viewValue?.email || "",
        phone: viewValue?.phone || "",
        address: viewValue?.address || "",
        commission:
          viewValue?.commission !== undefined && viewValue?.commission !== null
            ? String(viewValue.commission)
            : "",
      });
    } else {
      setFormValues({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        commission: "",
      });
    }
  }, [open, isEdit, editValue, isView, viewValue]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddOrUpdate = async () => {
    // Basic validations
    if (!formValues.fullName.trim()) {
      showCustomMessage("Full Name is required!");
      return;
    }
    if (!formValues.email.trim()) {
      showCustomMessage("Email is required!");
      return;
    }
    if (!formValues.phone.trim()) {
      showCustomMessage("Phone is required!");
      return;
    }

    // Prepare payload
    const requestData = {
      fullName: formValues.fullName.trim(),
      email: formValues.email.trim(),
      phone: formValues.phone.trim(),
      address: formValues.address.trim(),
      commission:
        formValues.commission !== ""
          ? Number(formValues.commission)
          : undefined,
    };

    // remove undefined/empty string keys
    Object.keys(requestData).forEach((k) => {
      if (
        requestData[k] === undefined ||
        requestData[k] === null ||
        requestData[k] === ""
      ) {
        delete requestData[k];
      }
    });

    setLoading(true);
    try {
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

      if (isEdit && editId) {
        const response = await axios.patch(
          `${API_BASE_URL}/agent/admin/update/${editId}`,
          requestData,
          { headers }
        );
        if (response?.data?.status === 200) {
          showSuccessToast(
            response?.data?.message || `${inputLabel} updated successfully`
          );
          onSuccess();
          handleDialogClose();
        }
      } else {
        const response = await axios.post(
          `${API_BASE_URL}${apiEndpoint}`,
          requestData,
          { headers }
        );
        if (response?.data?.status === 201) {
          showSuccessToast(
            response?.data?.message || `${inputLabel} added successfully`
          );
          onSuccess();
          handleDialogClose();
        }
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setFormValues({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      commission: "",
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth>
      <DialogTitle>
        <Typography variant="h5" className="fw-bold">
          {isView ? `View ${inputLabel}` : isEdit ? `Edit ${inputLabel}` : dialogTitle}
        </Typography>
      </DialogTitle>

      <Divider sx={{ borderBottomWidth: 1, borderColor: "black" }} />

      <DialogContent>
        {isView ? (
          // -------- VIEW MODE (explicit fields, no mapping) --------
          <Box sx={{ p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              pb={1}
              borderBottom="1px solid #ccc"
            >
              <InputLabel sx={{ color: "black", fontWeight: 500 }}>
                Full Name
              </InputLabel>
              <Typography sx={{ fontWeight: 500 }}>
                {formValues.fullName || "N/A"}
              </Typography>
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              pb={1}
              borderBottom="1px solid #ccc"
            >
              <InputLabel sx={{ color: "black", fontWeight: 500 }}>
                Email
              </InputLabel>
              <Typography sx={{ fontWeight: 500 }}>
                {formValues.email || "N/A"}
              </Typography>
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              pb={1}
              borderBottom="1px solid #ccc"
            >
              <InputLabel sx={{ color: "black", fontWeight: 500 }}>
                Phone
              </InputLabel>
              <Typography sx={{ fontWeight: 500 }}>
                {formValues.phone || "N/A"}
              </Typography>
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              pb={1}
              borderBottom="1px solid #ccc"
            >
              <InputLabel sx={{ color: "black", fontWeight: 500 }}>
                Address
              </InputLabel>
              <Typography sx={{ fontWeight: 500 }}>
                {formValues.address || "N/A"}
              </Typography>
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              pb={1}
              borderBottom="1px solid #ccc"
            >
              <InputLabel sx={{ color: "black", fontWeight: 500 }}>
                Commission (%)
              </InputLabel>
              <Typography sx={{ fontWeight: 500 }}>
                {formValues.commission !== "" ? `${formValues.commission}%` : "N/A"}
              </Typography>
            </Box>

            {/* Optional status chip if your backend returns approved */}
            {(viewValue?.approved !== undefined) && (
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <InputLabel sx={{ color: "black", fontWeight: 500 }}>
                  Status
                </InputLabel>
                <Chip
                  label={viewValue.approved ? "Active" : "Inactive"}
                  variant="outlined"
                  sx={{
                    fontWeight: "bold",
                    minWidth: 80,
                    textAlign: "center",
                    color: "#fff",
                    backgroundColor: viewValue.approved ? "#4caf50" : "#f44336",
                    border: "none",
                  }}
                />
              </Box>
            )}
          </Box>
        ) : (
          // -------- ADD / EDIT MODE --------
          <>
            <Box sx={{ mb: 2 }}>
              <InputLabel sx={{ color: "black", mb: 1 }}>Full Name</InputLabel>
              <Input
                placeholder="Enter full name"
                type="text"
                name="fullName"
                height={50}
                value={formValues.fullName}
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <InputLabel sx={{ color: "black", mb: 1 }}>Email</InputLabel>
              <Input
                placeholder="Enter email"
                type="email"
                height={50}
                value={formValues.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <InputLabel sx={{ color: "black", mb: 1 }}>Phone</InputLabel>
              <Input
                placeholder="Enter phone number"
                type="text"
                height={50}
                value={formValues.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <InputLabel sx={{ color: "black", mb: 1 }}>Address</InputLabel>
              <Input
                placeholder="Enter address"
                type="text"
                height={50}
                value={formValues.address}
                onChange={(e) => handleChange("address", e.target.value)}
                sx={{ mb: 2 }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel sx={{ color: "black", mb: 1 }}>Commission (%)</InputLabel>
              <Input
                placeholder="Enter commission percentage"
                type="number"
                height={50}
                value={formValues.commission}
                onChange={(e) => handleChange("commission", e.target.value)}
              />
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <CustomIconButton
          icon={<Close />}
          color="red"
          text="Close"
          onClick={handleDialogClose}
        />
        {!isView && (
          <CustomIconButton
            icon={<PersonAdd />}
            loading={loading}
            disabled={loading}
            color="black"
            text={isEdit ? "Update" : buttonText}
            onClick={handleAddOrUpdate}
          />
        )}
      </DialogActions>
    </Dialog>
  );
};
export default AgentEntityDialog;

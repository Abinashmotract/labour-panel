import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Switch,
  FormControlLabel,
  Avatar,
} from "@mui/material";
import { useState, useEffect } from "react";
import Input from "../custom/Input";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";
import Divider from "@mui/material/Divider";
import { showErrorToast, showSuccessToast, showCustomMessage } from "../Toast";
import Cookies from "js-cookie";

const UserEditDialog = ({ open, handleClose, userData, onSuccess = () => {} }) => {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    addressLine1: "",
    work_category: "",
    work_experience: "",
    gender: "",
    isAgent: false,
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const authToken = Cookies.get("token");

  useEffect(() => {
    if (open && userData) {
      setFormValues({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        addressLine1: userData.addressLine1 || "",
        work_category: userData.work_category || "",
        work_experience: userData.work_experience || "",
        gender: userData.gender || "",
        isAgent: userData.isAgent || false,
      });
      setProfileImagePreview(userData.profilePicture || null);
      setProfileImageFile(null);
    }
  }, [open, userData]);

  const handleChange = (name, value) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formValues.firstName || !formValues.lastName || !formValues.email) {
      showCustomMessage("First name, last name, and email are required");
      return;
    }

    setLoading(true);
    try {
      let response;

      if (profileImageFile) {
        // If profile image is being uploaded, use FormData
        const formData = new FormData();
        formData.append("userId", userData._id);
        formData.append("firstName", formValues.firstName);
        formData.append("lastName", formValues.lastName);
        formData.append("email", formValues.email);
        formData.append("addressLine1", formValues.addressLine1);
        formData.append("work_category", formValues.work_category);
        formData.append("work_experience", formValues.work_experience);
        formData.append("gender", formValues.gender);
        formData.append("profilePicture", profileImageFile);

        if (userData.role === "contractor") {
          formData.append("isAgent", formValues.isAgent);
        }

        response = await axios.put(
          `${API_BASE_URL}/user/admin/update-user`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // No image file, send JSON body
        const updateData = {
          userId: userData._id,
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          addressLine1: formValues.addressLine1,
          work_category: formValues.work_category,
          work_experience: formValues.work_experience,
          gender: formValues.gender,
        };

        if (userData.role === "contractor") {
          updateData.isAgent = formValues.isAgent;
        }

        response = await axios.put(
          `${API_BASE_URL}/user/admin/update-user`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.data.success) {
        showSuccessToast("User updated successfully");
        onSuccess();
        handleClose();
      } else {
        showErrorToast(response.data.message || "Failed to update user");
      }
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Error updating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Typography variant="h5" component="span" className="fw-bold">
          Edit User Details
        </Typography>
      </DialogTitle>
      <Divider sx={{ borderBottomWidth: 1, borderColor: "black" }} />
      <DialogContent>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
          <Box sx={{ flex: "1 1 100%", display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar
              src={profileImagePreview || "https://w7.pngwing.com/pngs/406/861/png-transparent-default-facebook-user-profile-blue-silhouette-neck-symbol-sky-folder-users-blue-silhouette-application-thumbnail.png"}
              alt="Profile"
              sx={{ width: 80, height: 80 }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://w7.pngwing.com/pngs/406/861/png-transparent-default-facebook-user-profile-blue-silhouette-neck-symbol-sky-folder-users-blue-silhouette-application-thumbnail.png";
              }}
            />
            <Box>
              <InputLabel sx={{ mb: 0.5 }}>Profile Picture</InputLabel>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginTop: "4px" }}
              />
            </Box>
          </Box>

          <Box sx={{ flex: "1 1 45%" }}>
            <InputLabel sx={{ mb: 0.5 }}>First Name</InputLabel>
            <Input
              placeholder="Enter first name"
              value={formValues.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: "1 1 45%" }}>
            <InputLabel sx={{ mb: 0.5 }}>Last Name</InputLabel>
            <Input
              placeholder="Enter last name"
              value={formValues.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: "1 1 45%" }}>
            <InputLabel sx={{ mb: 0.5 }}>Email</InputLabel>
            <Input
              placeholder="Enter email"
              type="email"
              value={formValues.email}
              onChange={(e) => handleChange("email", e.target.value)}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: "1 1 45%" }}>
            <InputLabel sx={{ mb: 0.5 }}>Gender</InputLabel>
            <Select
              fullWidth
              value={formValues.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              sx={{
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                height: 40,
                "& fieldset": { border: "1px solid #bdbdbd" },
                "& .MuiSelect-select": {
                  padding: "0px 14px",
                  fontSize: "14px",
                },
              }}
            >
              <MenuItem value="">Select Gender</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </Box>

          <Box sx={{ flex: "1 1 45%" }}>
            <InputLabel sx={{ mb: 0.5 }}>Work Category</InputLabel>
            <Input
              placeholder="Enter work category"
              value={formValues.work_category}
              onChange={(e) => handleChange("work_category", e.target.value)}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: "1 1 45%" }}>
            <InputLabel sx={{ mb: 0.5 }}>Work Experience</InputLabel>
            <Input
              placeholder="Enter work experience"
              value={formValues.work_experience}
              onChange={(e) => handleChange("work_experience", e.target.value)}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: "1 1 100%" }}>
            <InputLabel sx={{ mb: 0.5 }}>Address</InputLabel>
            <Input
              placeholder="Enter address"
              value={formValues.addressLine1}
              onChange={(e) => handleChange("addressLine1", e.target.value)}
              fullWidth
            />
          </Box>

          {userData?.role === "contractor" && (
            <Box sx={{ flex: "1 1 100%" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formValues.isAgent}
                    onChange={(e) => handleChange("isAgent", e.target.checked)}
                    color="primary"
                  />
                }
                label="Is Agent"
              />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserEditDialog;


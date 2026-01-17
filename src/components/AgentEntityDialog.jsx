import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import Input from "../custom/Input";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";
import Divider from "@mui/material/Divider";
import { showErrorToast, showSuccessToast, showCustomMessage } from "../Toast";
import Cookies from "js-cookie";

const AgentEntityDialog = ({ open, handleClose, dialogTitle = "Add New User", inputLabel = "User", buttonText = "Add User", onSuccess = () => { }, isView = false, }) => {
  const [otpStep, setOtpStep] = useState("send");
  const [otpPhone, setOtpPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const authToken = Cookies.get("token");

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setOtpStep("send");
      setOtpPhone("");
      setOtpCode("");
      setFormValues({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        role: "",
      });
    }
  }, [open]);

  const handleChange = (name, value) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSendOtp = async () => {
    if (!otpPhone.trim()) {
      showCustomMessage("Phone Number is required!");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/labour/send-otp`, {
        phoneNumber: otpPhone,
      });
      showSuccessToast(res?.data?.message || "OTP sent successfully");
      setOtpStep("verify");
    } catch (err) {
      showErrorToast(err?.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode.trim()) {
      showCustomMessage("Enter OTP!");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/labour/verify-otp`, {
        phoneNumber: otpPhone,
        otp: otpCode,
      });

      if (res?.data?.success) {
        showSuccessToast("Phone verified successfully");
        setFormValues(prev => ({
          ...prev,
          phoneNumber: otpPhone
        }));
        setOtpStep("details");
      }
    } catch (err) {
      showErrorToast(err?.response?.data?.message || "Invalid OTP");
    }
  };

  const handleSubmit = async () => {
    // Validate required fields (email is optional)
    if (!formValues.firstName || !formValues.firstName.trim()) {
      showCustomMessage("First name is required");
      return;
    }
    if (!formValues.lastName || !formValues.lastName.trim()) {
      showCustomMessage("Last name is required");
      return;
    }
    if (!formValues.phoneNumber || !formValues.phoneNumber.trim()) {
      showCustomMessage("Phone number is required");
      return;
    }
    if (!formValues.role) {
      showCustomMessage("Role is required");
      return;
    }
    
    // Validate email format if provided (email is optional)
    if (formValues.email && formValues.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formValues.email.trim())) {
        showCustomMessage("Invalid email format");
        return;
      }
    }
    
    setLoading(true);
    try {
      const createRes = await axios.post(
        `${API_BASE_URL}/admin/create-user`,
        formValues,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (createRes.data.success) {
        showSuccessToast("User created successfully");
        onSuccess();
        handleClose();
      }
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Error creating user");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="span" className="fw-bold">
          {isView ? `View ${inputLabel}` : dialogTitle}
        </Typography>
      </DialogTitle>
      <Divider sx={{ borderBottomWidth: 1, borderColor: "black" }} />
      <DialogContent>
        {otpStep === "send" && (
          <Box sx={{ mb: 2 }}>
            <InputLabel>Phone Number</InputLabel>
            <Input placeholder="Enter phone number" value={otpPhone} onChange={(e) => setOtpPhone(e.target.value)} fullWidth />
            <Button variant="contained" onClick={handleSendOtp} sx={{ mt: 2 }}>
              Send OTP
            </Button>
          </Box>
        )}

        {otpStep === "verify" && (
          <Box sx={{ mb: 2 }}>
            <InputLabel>Enter OTP</InputLabel>
            <Input placeholder="Enter OTP" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} fullWidth />
            <Button variant="contained" onClick={handleVerifyOtp} sx={{ mt: 2 }}>
              Verify OTP
            </Button>
          </Box>
        )}

        {otpStep === "details" && (
          <>
            <Box sx={{ mb: 2 }}>
              <InputLabel>Role <span style={{ color: "red" }}>*</span></InputLabel>
              <Select
                fullWidth
                value={formValues.role}
                onChange={(e) => handleChange("role", e.target.value)}
              >
                <MenuItem value="">Select Role</MenuItem>
                <MenuItem value="labour">Labour</MenuItem>
                <MenuItem value="contractor">Contractor</MenuItem>
              </Select>
            </Box>
            <Box sx={{ mb: 2 }}>
              <InputLabel>First Name <span style={{ color: "red" }}>*</span></InputLabel>
              <Input
                placeholder="Enter first name"
                value={formValues.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                fullWidth
                required
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <InputLabel>Last Name <span style={{ color: "red" }}>*</span></InputLabel>
              <Input
                placeholder="Enter last name"
                value={formValues.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                fullWidth
                required
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <InputLabel>Email (Optional)</InputLabel>
              <Input placeholder="Enter email (optional)" type="email" value={formValues.email} onChange={(e) => handleChange("email", e.target.value)} fullWidth />
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        {!isView && otpStep === "details" && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating..." : buttonText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AgentEntityDialog;

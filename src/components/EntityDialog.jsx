import {
  Box,
  Chip,
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
import { CustomIconButton } from "../custom/Button";
import { Close, PersonAdd } from "@mui/icons-material";
import Cookies from "js-cookie";
import sillsOptions from "../json/sillsOptions";

const EntityDialog = ({
  open,
  handleClose,
  dialogTitle = "Add New Category",
  apiEndpoint = "/category/admin/insert",
  fetchAll = () => { },
  inputLabel = "Category Name",
  buttonText = "Add Category",
  onSuccess = () => { },
  isEdit = false,
  editId = null,
  editValue = "",
  isView = false,
  viewValue = "",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [customOtherValue, setCustomOtherValue] = useState("");

  useEffect(() => {
    if (!open) {
      setInputValue("");
    } else if (isEdit && editValue) {
      setInputValue(editValue);
    } else if (isView && viewValue) {
      setInputValue(viewValue);
    }
  }, [open, isEdit, editValue, isView, viewValue]);

  const handleAddOrUpdate = async () => {
    const selectedValue = inputValue === "other" ? customOtherValue : inputValue;
    if (!selectedValue.trim()) {
      showCustomMessage(`${inputLabel} is required!`);
      return;
    }

    setLoading(true);
    try {
      // const requestData = { name: selectedValue };
      let nameHindiValue = selectedValue;
      if (inputValue !== "other") {
        const selectedOption = sillsOptions.find(opt => opt.value === selectedValue);
        if (selectedOption) {
          const match = selectedOption.label.match(/\(([^)]+)\)/);
          if (match) nameHindiValue = match[1];
        }
      }
      const requestData = {
        name: selectedValue,
        nameHindi: nameHindiValue,
        category: "technical"
      };
      const token = Cookies.get("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      if (isEdit && editId) {
        // PATCH for editing skill
        const response = await axios.put(
          `${API_BASE_URL}/skill/admin/skills/${editId}`,
          requestData,
          { headers }
        );

        if (response?.data?.status === 200) {
          showSuccessToast(response?.data?.message || `${inputLabel} updated successfully`);
          setInputValue("");
          onSuccess(); // trigger reload in parent
        } else {
          showErrorToast(response?.data?.message || `Failed to update ${inputLabel.toLowerCase()}`);
        }
      } else {
        // POST for adding new skill
        const response = await axios.post(
          `${API_BASE_URL}${apiEndpoint}`,
          requestData,
          { headers }
        );

        if (response?.data?.status === 201) {
          showSuccessToast(response?.data?.message || `${inputLabel} added successfully`);
          setInputValue("");
          onSuccess(); // trigger reload in parent
        } else {
          showErrorToast(response?.data?.message || `Failed to add ${inputLabel.toLowerCase()}`);
        }
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };


  const handleDialogClose = () => {
    setInputValue("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="span" className="fw-bold">
          {isView ? `View ${inputLabel}` : isEdit ? `Edit ${inputLabel}` : dialogTitle}
        </Typography>
      </DialogTitle>
      <Divider sx={{ borderBottomWidth: 1, borderColor: "black" }} />
      <DialogContent>
        {isView ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <Typography variant="body1">
              <strong>Skill Name:</strong> {viewValue?.name || "N/A"}
            </Typography>

            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body1"><strong>Status:</strong></Typography>
              <Chip
                label={viewValue?.approved ? "Active" : "Inactive"}
                color={viewValue?.approved ? "success" : "error"}
                sx={{
                  fontWeight: "bold",
                  color: "#fff",
                }}
              />
            </Box>
          </Box>
        ) : (
          <>
            <InputLabel sx={{ color: "black", fontWeight: 500 }}>{inputLabel}</InputLabel>
            <Select
              fullWidth
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (e.target.value !== "other") setCustomOtherValue("");
              }}
              displayEmpty
              sx={{ mt: 1 }}
            >
              <MenuItem value="" disabled>
                Select Skill
              </MenuItem>
              {sillsOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
              <MenuItem value="other">Other</MenuItem>
            </Select>

            {inputValue === "other" && (
              <Input
                placeholder={`Enter custom ${inputLabel.toLowerCase()}`}
                type="text"
                fullWidth
                sx={{ mt: 2 }}
                value={customOtherValue}
                onChange={(e) => setCustomOtherValue(e.target.value)}
              />
            )}
          </>
        )}


      </DialogContent>
      <DialogActions>
        <CustomIconButton icon={<Close />} color="red" text="Close" onClick={handleDialogClose} />
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

export default EntityDialog;

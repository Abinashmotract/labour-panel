import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Input from "../custom/Input";
import { CustomIconButton } from "../custom/Button";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";
import Cookies from "js-cookie";
import {
  Box,
  Chip,
  Stack,
  Typography,
  MenuItem,
  Select,
  FormControl,
  Grid,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import MultiSelectWithCheckbox from "../custom/MultiSelectWithCheckbox";
import { showSuccessToast, showErrorToast } from "../Toast";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const GOOGLE_API_KEY = "AIzaSyByeL4973jLw5-DqyPtVl79I3eDN4uAuAQ"; 

// 🔹 Google Geocoding API helper
const getCoordinatesFromAddress = async (address) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${GOOGLE_API_KEY}`;

  const response = await axios.get(url);

  if (response.data.status === "OK" && response.data.results.length > 0) {
    const result = response.data.results[0];
    return {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      formattedAddress: result.formatted_address,
    };
  } else {
    throw new Error("Address not found, please try again");
  }
};

export default function JobPostDialog({
  open,
  handleClose,
  onSuccess,
  viewMode = false,
  editMode = false,
  rowData = null,
}) {
  const [fields, setFields] = useState({
    title: "",
    description: "",
    location: "",
    jobTiming: "",
    labourersRequired: 1,
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    skills: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false);

  const authToken = Cookies.get("token");

  // Job timing options
  const jobTimingOptions = [
    "Full-time (9AM - 6PM)",
    "Part-time",
    "Flexible hours",
    "Shift-based",
    "Project-based",
  ];

  useEffect(() => {
    if (open) {
      setError(null);
      fetchAllSkills();

      if (viewMode || editMode) {
        setFields({
          title: rowData?.title || "",
          description: rowData?.description || "",
          location: rowData?.location?.address || "",
          jobTiming: rowData?.jobTiming || "",
          labourersRequired: rowData?.labourersRequired || 1,
          validUntil: rowData?.validUntil
            ? new Date(rowData.validUntil)
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          skills: rowData?.skills?.map((skill) => skill._id) || [],
        });
      } else {
        setFields({
          title: "",
          description: "",
          location: "",
          jobTiming: "",
          labourersRequired: 1,
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          skills: [],
        });
      }
    }
  }, [open, viewMode, editMode, rowData]);

  const fetchAllSkills = async () => {
    setSkillsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/skill/admin/skills`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.data?.status === 200 && response.data?.success) {
        setAllSkills(response.data.data?.skills || []);
      }
    } catch (err) {
      console.error("Error fetching skills:", err);
      showErrorToast("Failed to fetch skills");
    } finally {
      setSkillsLoading(false);
    }
  };

  const skillOptions = allSkills.map((skill) => ({
    label: skill.name,
    value: skill._id,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      !fields.title ||
      !fields.description ||
      !fields.location ||
      !fields.jobTiming ||
      !fields.labourersRequired ||
      !fields.validUntil
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (fields.labourersRequired < 1) {
      setError("At least 1 labourer is required");
      return;
    }

    if (fields.validUntil <= new Date()) {
      setError("Valid until date must be in the future");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 🔹 Get lat/lng from Google API
      const geo = await getCoordinatesFromAddress(fields.location);

      const payload = {
        title: fields.title,
        description: fields.description,
        location: {
          type: "Point",
          coordinates: [geo.longitude, geo.latitude],
          address: geo.formattedAddress,
        },
        jobTiming: fields.jobTiming,
        labourersRequired: Number(fields.labourersRequired),
        validUntil: fields.validUntil.toISOString(),
        skills: fields.skills,
      };

      let response;
      if (editMode && rowData && rowData._id) {
        response = await axios.put(
          `${API_BASE_URL}/contractor/update-job-posts/${rowData._id}`,
          payload,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}/contractor/job-posts`,
          payload,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
      }

      if (response.data?.success) {
        showSuccessToast(
          response.data.message ||
            (editMode ? "Job post updated" : "Job post created")
        );
        if (onSuccess) onSuccess();
        handleClose();
      } else {
        setError(response.data?.message || "Failed to save job post");
      }
    } catch (err) {
      setError(err.message || "Error fetching location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {viewMode
            ? "View Job Post"
            : editMode
            ? "Update Job Post"
            : "Create Job Post"}
        </DialogTitle>
        <DialogContent>
          {viewMode ? (
            <Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Title
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {rowData?.title || "N/A"}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">
                  {rowData?.description || "N/A"}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1">
                  {rowData?.location?.address || "N/A"}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Coordinates
                </Typography>
                <Typography variant="body1">
                  {rowData?.location?.coordinates
                    ? `Lat: ${rowData.location.coordinates[1]}, Lng: ${rowData.location.coordinates[0]}`
                    : "N/A"}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Job Timing
                </Typography>
                <Typography variant="body1">
                  {rowData?.jobTiming || "N/A"}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Labourers Required
                </Typography>
                <Typography variant="body1">
                  {rowData?.labourersRequired || "1"}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Valid Until
                </Typography>
                <Typography variant="body1">
                  {rowData?.validUntil
                    ? new Date(rowData.validUntil).toLocaleDateString()
                    : "N/A"}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Skills Required
                </Typography>
                {rowData?.skills?.length ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {rowData.skills.map((skill, i) => (
                      <Chip
                        key={skill._id || i}
                        label={skill.name}
                        size="small"
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No skills specified
                  </Typography>
                )}
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={rowData?.isActive ? "ACTIVE" : "INACTIVE"}
                  color={rowData?.isActive ? "success" : "default"}
                  size="small"
                />
              </Box>
            </Box>
          ) : (
            <>
              <Box mb={1}>
                <label style={{ fontWeight: 500 }}>Title *</label>
                <Input
                  name="title"
                  value={fields.title}
                  onChange={handleChange}
                  placeholder="Job title"
                  fullWidth
                  required
                />
              </Box>
              <Box mb={1}>
                <label style={{ fontWeight: 500 }}>Description *</label>
                <Input
                  name="description"
                  value={fields.description}
                  onChange={handleChange}
                  placeholder="Job description"
                  multiline
                  rows={3}
                  required
                />
              </Box>
              <Box mb={1}>
                <label style={{ fontWeight: 500 }}>Work Address *</label>
                <Input
                  name="location"
                  value={fields.location}
                  onChange={handleChange}
                  placeholder="Full address of the job location"
                  fullWidth
                  required
                />
              </Box>
              <Box mb={1}>
                <label style={{ fontWeight: 500 }}>Job Timing *</label>
                <FormControl fullWidth required>
                  <Select
                    name="jobTiming"
                    value={fields.jobTiming}
                    onChange={handleChange}
                    displayEmpty
                    renderValue={(selected) => selected || "Select job timing"}
                  >
                    <MenuItem value="" disabled>
                      Select job timing
                    </MenuItem>
                    {jobTimingOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box mb={1}>
                <label style={{ fontWeight: 500 }}>Labourers Required *</label>
                <Input
                  name="labourersRequired"
                  type="number"
                  value={fields.labourersRequired}
                  onChange={handleChange}
                  placeholder="Number of labourers needed"
                  fullWidth
                  required
                  inputProps={{ min: 1 }}
                />
              </Box>
              <Box mb={1}>
                <label style={{ fontWeight: 500 }}>Valid Until *</label>
                <DatePicker
                  value={fields.validUntil}
                  onChange={(newValue) =>
                    setFields((prev) => ({ ...prev, validUntil: newValue }))
                  }
                  minDate={new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </Box>
              <Box mb={1}>
                <label style={{ fontWeight: 500 }}>Skills Required</label>
                <MultiSelectWithCheckbox
                  options={skillOptions}
                  placeholder="Select required skills"
                  value={skillOptions.filter((opt) =>
                    fields.skills.includes(opt.value)
                  )}
                  onChange={(newValue) =>
                    setFields((prev) => ({
                      ...prev,
                      skills: newValue.map((item) => item.value),
                    }))
                  }
                  disabled={skillsLoading}
                />
              </Box>
            </>
          )}
          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        </DialogContent>
        <DialogActions>
          <CustomIconButton
            icon={<Close />}
            color="red"
            text="Close"
            onClick={handleClose}
          />
          {!viewMode && (
            <CustomIconButton
              text={editMode ? "Update" : "Create"}
              color="#6d295a"
              onClick={handleSubmit}
              loading={loading}
            />
          )}
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
} from "@mui/material";

const statusColors = {
  applied: "warning",
  accepted: "success",
  rejected: "error",
  pending: "warning",
  hired: "info",
  completed: "default",
};

export default function JobApplicationDialog({ open, onClose, rowData }) {
  if (!rowData) return null;

  // Helper function to format location
  const formatLocation = (locationData) => {
    if (!locationData) return "Location not specified";
    
    if (typeof locationData === 'string') {
      return locationData;
    }
    
    if (locationData.address) {
      return locationData.address;
    }
    
    if (locationData.coordinates && Array.isArray(locationData.coordinates)) {
      return `Lat: ${locationData.coordinates[1]?.toFixed(6)}, Lng: ${locationData.coordinates[0]?.toFixed(6)}`;
    }
    
    return "Location not specified";
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Job Application Details
      </DialogTitle>

      <DialogContent dividers>
        {/* Labour Details */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Labour Details
          </Typography>
          <Typography variant="body1" fontWeight="500">
            {rowData?.labourDetails?.firstName} {rowData?.labourDetails?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📞 {rowData?.labourDetails?.phoneNumber}
          </Typography>
          {rowData?.labourDetails?.email && (
            <Typography variant="body2" color="text.secondary">
              ✉️ {rowData?.labourDetails?.email}
            </Typography>
          )}
        </Box>

        <Divider />

        {/* Job Details */}
        <Box my={3}>
          <Typography variant="h6" gutterBottom>
            Job Details
          </Typography>
          <Typography variant="body1" fontWeight="500">
            {rowData?.jobDetails?.title}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {rowData?.jobDetails?.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📍 {formatLocation(rowData?.jobDetails?.location)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ⏰ {rowData?.jobDetails?.jobTiming}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            👥 {rowData?.jobDetails?.labourersFilled || 0} / {rowData?.jobDetails?.labourersRequired} labourers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Status: {rowData?.jobDetails?.isFilled ? "Filled" : "Open"}
          </Typography>
        </Box>

        <Divider />

        {/* Application Details */}
        <Box my={3}>
          <Typography variant="h6" gutterBottom>
            Application Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Applied: {new Date(rowData?.createdAt).toLocaleDateString()}
          </Typography>
          {rowData?.updatedAt && (
            <Typography variant="body2" color="text.secondary">
              Last Updated: {new Date(rowData?.updatedAt).toLocaleDateString()}
            </Typography>
          )}
        </Box>

        <Divider />

        {/* Cover Letter */}
        <Box my={3}>
          <Typography variant="h6" gutterBottom>
            Cover Letter
          </Typography>
          <Typography variant="body2" sx={{ 
            whiteSpace: "pre-line",
            p: 1,
            bgcolor: 'grey.50',
            borderRadius: 1,
            minHeight: '60px'
          }}>
            {rowData?.coverLetter || "No cover letter provided"}
          </Typography>
        </Box>

        <Divider />

        {/* Application Status */}
        <Box my={3}>
          <Typography variant="h6" gutterBottom>
            Application Status
          </Typography>
          <Chip
            label={rowData?.status?.toUpperCase()}
            color={statusColors[rowData?.status] || "default"}
            size="medium"
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
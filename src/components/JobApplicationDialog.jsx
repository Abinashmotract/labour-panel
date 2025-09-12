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
  pending: "warning",
  accepted: "success",
  rejected: "error",
  hired: "info",
  completed: "default",
};

export default function JobApplicationDialog({ open, onClose, rowData }) {
  if (!rowData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Job Application Details
      </DialogTitle>

      <DialogContent dividers>
        {/* Applicant Info */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Applicant Information
          </Typography>
          <Typography variant="body1" fontWeight="500">
            {rowData?.labourDetails?.firstName} {rowData?.labourDetails?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📞 {rowData?.labourDetails?.phoneNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ✉️ {rowData?.labourDetails?.email}
          </Typography>
        </Box>

        <Divider />

        {/* Job Info */}
        <Box my={3}>
          <Typography variant="h6" gutterBottom>
            Job Information
          </Typography>
          <Typography variant="body1" fontWeight="500">
            {rowData?.jobDetails?.title}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {rowData?.jobDetails?.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📍 {rowData?.jobDetails?.location}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            💰 ₹{rowData?.jobDetails?.budget}
          </Typography>
        </Box>

        <Divider />

        {/* Cover Letter */}
        <Box my={3}>
          <Typography variant="h6" gutterBottom>
            Cover Letter
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {rowData?.coverLetter || "No cover letter provided"}
          </Typography>
        </Box>

        <Divider />

        {/* Status */}
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

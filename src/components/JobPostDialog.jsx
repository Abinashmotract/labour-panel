import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Input from '../custom/Input';
import { CustomIconButton } from '../custom/Button';
import axios from 'axios';
import { API_BASE_URL } from '../utils/apiConfig';
import Cookies from 'js-cookie';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import MultiSelectWithCheckbox from '../custom/MultiSelectWithCheckbox';
import { showSuccessToast, showErrorToast } from '../Toast';

export default function JobPostDialog({ open, handleClose, onSuccess, viewMode = false, editMode = false, rowData = null }) {
  const [fields, setFields] = useState({
    title: '',
    description: '',
    location: '',
    budget: '',
    skills: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false);

  const authToken = Cookies.get("token");

  useEffect(() => {
    if (open) {
      setError(null);
      fetchAllSkills();

      if (viewMode || editMode) {
        setFields({
          title: rowData?.title || '',
          description: rowData?.description || '',
          location: rowData?.location || '',
          budget: rowData?.budget || '',
          skills: rowData?.skills?.map(skill => skill._id) || []
        });
      } else {
        setFields({
          title: '',
          description: '',
          location: '',
          budget: '',
          skills: []
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

  const skillOptions = allSkills.map(skill => ({
    label: skill.name,
    value: skill._id,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!fields.title || !fields.description || !fields.location || !fields.budget) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      title: fields.title,
      description: fields.description,
      location: fields.location,
      budget: Number(fields.budget),
      skills: fields.skills
    };

    try {
      let response;
      if (editMode && rowData && rowData._id) {
        // Update Job Post
        response = await axios.put(`${API_BASE_URL}/admin/job-posts/${rowData._id}`, payload, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
      } else {
        // Create Job Post
        response = await axios.post(`${API_BASE_URL}/admin/job-posts`, payload, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
      }

      if (response.data?.success) {
        showSuccessToast(response.data.message || (editMode ? 'Job post updated' : 'Job post created'));
        if (onSuccess) onSuccess();
        handleClose();
      } else {
        setError(response.data?.message || 'Failed to save job post');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while saving job post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{viewMode ? 'View Job Post' : editMode ? 'Update Job Post' : 'Create Job Post'}</DialogTitle>
      <DialogContent>
        {viewMode ? (
          <Box>
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">Title</Typography>
              <Typography variant="body1" fontWeight="500">{rowData?.title || 'N/A'}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">Description</Typography>
              <Typography variant="body1">{rowData?.description || 'N/A'}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">Location</Typography>
              <Typography variant="body1">{rowData?.location || 'N/A'}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">Budget</Typography>
              <Typography variant="body1">₹{rowData?.budget || '0'}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">Skills Required</Typography>
              {rowData?.skills?.length ? (
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {rowData.skills.map((skill, i) => (
                    <Chip key={skill._id || i} label={skill.name} size="small" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }} />
                  ))}
                </Stack>
              ) : <Typography variant="body2" color="text.secondary">No skills specified</Typography>}
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">Status</Typography>
              <Chip label={rowData?.isActive ? 'ACTIVE' : 'INACTIVE'} color={rowData?.isActive ? 'success' : 'default'} size="small" />
            </Box>
          </Box>
        ) : (
          <>
            <Box mb={1}>
              <label style={{ fontWeight: 500 }}>Title *</label>
              <Input name="title" value={fields.title} onChange={handleChange} placeholder="Job title" fullWidth required />
            </Box>
            <Box mb={1}>
              <label style={{ fontWeight: 500 }}>Description *</label>
              <Input name="description" value={fields.description} onChange={handleChange} placeholder="Job description" multiline rows={3} required />
            </Box>
            <Box mb={1}>
              <label style={{ fontWeight: 500 }}>Location *</label>
              <Input name="location" value={fields.location} onChange={handleChange} placeholder="Location" fullWidth required />
            </Box>
            <Box mb={1}>
              <label style={{ fontWeight: 500 }}>Budget (₹) *</label>
              <Input name="budget" type="number" value={fields.budget} onChange={handleChange} placeholder="Budget" fullWidth required />
            </Box>
            <Box mb={1}>
              <label style={{ fontWeight: 500 }}>Skills Required</label>
              <MultiSelectWithCheckbox
                options={skillOptions}
                placeholder="Select required skills"
                value={skillOptions.filter(opt => fields.skills.includes(opt.value))}
                onChange={(newValue) => setFields(prev => ({ ...prev, skills: newValue.map(item => item.value) }))}
                disabled={skillsLoading}
              />
            </Box>
          </>
        )}
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </DialogContent>
      <DialogActions>
        <CustomIconButton icon={<Close />} color="red" text="Close" onClick={handleClose} />
        {!viewMode && (
          <CustomIconButton text={editMode ? 'Update' : 'Create'} color="#6d295a" onClick={handleSubmit} loading={loading} />
        )}
      </DialogActions>
    </Dialog>
  );
}

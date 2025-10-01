import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  Edit,
  Work,
  PhotoCamera,
  ContentCopy,
} from "@mui/icons-material";
import { tokens } from "../../theme";
import { Header } from '../../components';
import bannerImage from '../../assets/images/AH-12.webp';
import useStylistProfile from '../../hooks/useStylistProfile';
import { showErrorToast, showSuccessToast } from '../../Toast';
import { CustomIconButton } from '../../custom/Button';
import { API_BASE_URL } from '../../utils/apiConfig';
import { useDispatch } from 'react-redux';
import { fetchStylistProfile } from '../../hooks/stylistProfileSlice';
import profileimage from '../../assets/images/profileimage.png';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CheckIcon, CloudUpload } from 'lucide-react';

const ContractorProfile = () => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [allSkills, setAllSkills] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { profile, loading, error } = useStylistProfile();

  const [formData, setFormData] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    email: profile?.email || "",
    addressLine1: profile?.addressLine1 || "",
    work_category: profile?.work_category || "",
    work_experience: profile?.work_experience || "",
    gender: profile?.gender || "",
    profilePicture: null, // For file upload
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authToken = Cookies.get("token");
  const dispatch = useDispatch();
  const { t } = useTranslation()

  useEffect(() => {
    fetchAllSkills();
  }, []);

  const fetchAllSkills = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/skill/admin/skills`);
      if (response.data?.status === 200 && response.data?.success) {
        setAllSkills(response.data.data?.skills || []);
      }
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      email: profile?.email || "",
      addressLine1: profile?.addressLine1 || "",
      work_category: profile?.work_category || "",
      work_experience: profile?.work_experience || "",
      gender: profile?.gender || "",
      lat: profile?.location?.coordinates?.[1] || "",
      lng: profile?.location?.coordinates?.[0] || "",
      profilePicture: null, // Reset file on dialog open
    });
    setOpenEditDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        showErrorToast("Please select a valid image file (JPEG, PNG, GIF)");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showErrorToast("File size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, profilePicture: file }));
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setUploading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('userId', profile?._id);
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('work_category', formData.work_category);
      formDataToSend.append('addressLine1', formData.addressLine1);
      formDataToSend.append('work_experience', formData.work_experience);
      formDataToSend.append('gender', formData.gender);

      // Append profile picture if selected
      if (formData.profilePicture) {
        formDataToSend.append('profilePicture', formData.profilePicture);
      }

      const response = await axios.put(
        `${API_BASE_URL}/user/role/update-user-details`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        showSuccessToast("Profile updated successfully!");
        dispatch(fetchStylistProfile()); // Refresh profile
        handleCloseDialog();
      }
    } catch (err) {
      console.error(err);
      showErrorToast(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = () => {
    if (!profile?.referralCode) return;
    navigator.clipboard.writeText(profile.referralCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => { });
  };

  const handleCloseDialog = () => {
    setOpenEditDialog(false);
    setFormData(prev => ({ ...prev, profilePicture: null })); // Reset file on close
  };

  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  if (loading) return <CircularProgress />;
  if (!profile) return null;

  return (
    <Box>
      <Header title={t("dashboard.contractorprofile")} subtitle="View and manage your profile information" />

      {/* Referral Code Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, mb: 2, border: '1px solid black', p: 2, borderRadius: 3 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Referral Code
          </Typography>
          {profile?.isAgent && profile?.referralCode ? (
            <Chip
              label={copied ? "Copied" : profile.referralCode.toUpperCase()}
              size="small"
              variant="filled"
              onClick={handleCopy}
              sx={{
                bgcolor: "black",
                color: "white",
                fontWeight: "bold",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              icon={!copied ? <ContentCopy style={{ color: "white", fontSize: 16 }} /> : undefined}
              deleteIcon={copied ? <CheckIcon style={{ color: "white", fontSize: 16 }} /> : undefined}
              onDelete={copied ? () => { } : undefined}
            />
          ) : (
            <Typography variant="body2" fontWeight={500}>N/A</Typography>
          )}
        </Box>

        {/* Referrals Count */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Referrals Count
          </Typography>
          {profile?.isAgent ? (
            <Chip
              label={profile.referralsCount || 0}
              size="small"
              variant="filled"
              sx={{
                bgcolor: "black",
                color: "white",
                fontWeight: "bold",
                textTransform: "uppercase",
                cursor: "default",
              }}
            />
          ) : (
            <Typography variant="body2" fontWeight={500}>0</Typography>
          )}
        </Box>
      </Box>

      {/* Profile Banner Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          mb: 6,
          borderRadius: "24px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
          overflow: "hidden",
        }}
      >
        {/* Background banner */}
        <Box
          sx={{
            position: "absolute",
            height: 200,
            width: "100%",
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.4), transparent), url(${bannerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            top: 0,
            left: 0,
          }}
        />

        {/* Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 4,
            px: { xs: 2, md: 6 },
            pt: 6,
            pb: 3,
            "@supports (backdrop-filter: blur(8px))": {
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              position: "relative",
            }}
          >
            {/* Profile Image */}
            <Avatar
              src={profile?.profilePicture}
              alt={`${profile?.firstName} ${profile?.lastName}`}
              sx={{
                width: 100,
                height: 100,
                border: "4px solid white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            />

            {/* Profile Info */}
            <Box>
              <Typography variant="h3" fontWeight={700} color="#fff">
                {profile?.firstName} {profile?.lastName}
              </Typography>
              <Typography
                variant="h5"
                color="#fff"
                fontWeight={500}
                sx={{ mb: 1 }}
              >
                {profile?.work_category || "Contractor"}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <LocationOn sx={{ color: "#4CAF50" }} />
                <Typography color="#fff">
                  {profile?.addressLine1 || "Address not specified"}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Email sx={{ color: "#2196F3" }} />
                <Typography color="#fff">
                  {profile?.email || "Email not provided"}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Phone sx={{ color: "#F44336" }} />
                <Typography color="#fff">
                  {profile?.phoneNumber}
                </Typography>
              </Stack>
            </Box>
          </Box>

          {/* Edit Button */}
          <Box>
            <IconButton
              sx={{
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
              onClick={handleOpenDialog}
            >
              <Edit sx={{ color: "#6D295A" }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Main Content Grid */}
      <Grid container spacing={4}>
        {/* Left Column - Personal Info */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 4, backgroundColor: colors.cardBackground, boxShadow: '0 4px 24px rgba(31, 38, 135, 0.10)', mb: 3, p: 3 }}>
            <CardContent>
              <Typography variant="h4" fontWeight={600} color={theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[600]} gutterBottom>
                Personal Information
              </Typography>

              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">First Name</Typography>
                  <Typography variant="body1" fontWeight="500">{profile?.firstName || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Last Name</Typography>
                  <Typography variant="body1" fontWeight="500">{profile?.lastName || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body1" fontWeight="500">{profile?.email || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Phone Number</Typography>
                  <Typography variant="body1" fontWeight="500">{profile?.phoneNumber}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Gender</Typography>
                  <Typography variant="body1" fontWeight="500">{profile?.gender || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Role</Typography>
                  <Chip label={profile?.role?.toUpperCase()} color="primary" variant="filled" sx={{ fontWeight: 'bold' }} />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h4" fontWeight={600} color={theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[600]} gutterBottom>
                Professional Information
              </Typography>

              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Work Category</Typography>
                  <Typography variant="body1" fontWeight="500">{profile?.work_category || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Experience</Typography>
                  <Typography variant="body1" fontWeight="500">{profile?.work_experience || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                  <Typography variant="body1" fontWeight="500">{profile?.addressLine1 || 'N/A'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Additional Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, backgroundColor: colors.cardBackground, boxShadow: '0 4px 24px rgba(31, 38, 135, 0.10)', mb: 3, p: 3 }}>
            <CardContent>
              <Typography variant="h4" fontWeight={600} color={theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[600]} gutterBottom>
                Account Status
              </Typography>

              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Phone Verification</Typography>
                  <Chip
                    label={profile?.isPhoneVerified ? 'VERIFIED' : 'NOT VERIFIED'}
                    color={profile?.isPhoneVerified ? 'success' : 'error'}
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Member Since</Typography>
                  <Typography variant="body1" fontWeight="500">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
                  <Typography variant="body1" fontWeight="500">
                    {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
          <Card sx={{ borderRadius: 4, backgroundColor: colors.cardBackground, boxShadow: '0 4px 24px rgba(31, 38, 135, 0.10)', p: 3 }}>
            <CardContent>
              <Typography variant="h4" fontWeight={600} color={theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[600]} gutterBottom>
                Quick Actions
              </Typography>

              <Stack spacing={2} sx={{ mt: 2 }}>
                <Link to="/job-post" className='text-decoration-none'>
                  <CustomIconButton icon={<Work />} text="View Job Posts" color="#2d5a78" variant="outlined" fullWidth />
                </Link>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Profile Picture Upload */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : profile?.profilePicture}
                  sx={{ width: 80, height: 80, mb: 2 }}
                />
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-picture-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="profile-picture-upload">
                  <Button variant="outlined" component="span" startIcon={<CloudUpload />}>
                    Upload Profile Picture
                  </Button>
                </label>
                {formData.profilePicture && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    {formData.profilePicture.name}
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="firstName"
                fullWidth
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="lastName"
                fullWidth
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="addressLine1"
                fullWidth
                value={formData.addressLine1}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="work-category-label">Work Category</InputLabel>
                <Select
                  labelId="work-category-label"
                  name="work_category"
                  value={formData?.work_category}
                  onChange={handleInputChange}
                  label="Work Category"
                >
                  {allSkills?.map((skill) => (
                    <MenuItem key={skill?._id} value={skill?.name}>
                      {skill?.name.replace(/-/g, " ").toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Experience"
                name="work_experience"
                fullWidth
                value={formData.work_experience}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Gender"
                name="gender"
                fullWidth
                value={formData.gender}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateProfile}
            variant="contained"
            color="primary"
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={16} /> : null}
          >
            {uploading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContractorProfile;
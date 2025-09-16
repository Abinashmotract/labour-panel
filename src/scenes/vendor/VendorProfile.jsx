import React from 'react';
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
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  Edit,
  Work,
  PhotoCamera,
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
import { getCoordinatesFromAddress } from '../../utils/geocode';
import { Link } from 'react-router-dom';

const ContractorProfile = () => {
  const [openEditDialog, setOpenEditDialog] = React.useState(false);

  const { profile, loading, error } = useStylistProfile();

const [formData, setFormData] = React.useState({
  firstName: profile?.firstName || "",
  lastName: profile?.lastName || "",
  email: profile?.email || "",
  addressLine1: profile?.addressLine1 || "",
  work_category: profile?.work_category || "",
  work_experience: profile?.work_experience || "",
  gender: profile?.gender || "",
});

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authToken = Cookies.get("token");
  const dispatch = useDispatch();
  const { t } = useTranslation()

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
    });
    setOpenEditDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleUpdateProfile = async () => {
  try {
    const updatedFormData = { ...formData, userId: profile?._id };
    const response = await axios.put(
      `${API_BASE_URL}/user/role/update-user-details`,
      updatedFormData,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    if (response.data.success) {
      showSuccessToast("Profile updated successfully!");
      dispatch(fetchStylistProfile()); // Refresh profile
      handleCloseDialog();
    }
  } catch (err) {
    console.error(err);
    showErrorToast(err.response?.data?.message || "Failed to update profile");
  }
};



  const handleAddressChange = async (e) => {
  const address = e.target.value;
  setFormData(prev => ({ ...prev, addressLine1: address }));

  if (address.length > 5) { // optional debounce
    const coords = await getCoordinatesFromAddress(address);
    if (coords) {
      setFormData(prev => ({
        ...prev,
        lat: coords.lat,
        lng: coords.lng,
        addressLine1: coords.formattedAddress
      }));
    }
  }
};

  const handleCloseDialog = () => setOpenEditDialog(false);

  React.useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  if (loading) return <CircularProgress />;
  if (!profile) return null;

  return (
    <Box>
      <Header title={t("dashboard.contractorprofile")} subtitle="View and manage your profile information" />
      <Box sx={{ position: 'relative', width: '100%', mb: 6, borderRadius: '24px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)', overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'absolute',
            height: 200,
            width: '100%',
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.4), transparent), url(${bannerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            top: 0, left: 0,
          }}
        />
        <Box sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 4,
          px: { xs: 2, md: 6 },
          pt: 6,
          pb: 3,
          '@supports (backdrop-filter: blur(8px))': {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>
            <Box>
              <Typography variant="h3" fontWeight={700} color="#fff">
                {profile?.firstName} {profile?.lastName}
              </Typography>
              <Typography variant="h5" color="#fff" fontWeight={500} sx={{ mb: 1 }}>
                {profile?.work_category || 'Contractor'}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <LocationOn sx={{ color: theme.palette.mode === 'dark' ? colors.greenAccent[400] : colors.greenAccent[500] }} />
                <Typography color="#fff">
                  {profile?.addressLine1 || 'Address not specified'}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Email sx={{ color: theme.palette.mode === 'dark' ? colors.blueAccent[400] : colors.blueAccent[500] }} />
                <Typography color="#fff">{profile?.email || 'Email not provided'}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Phone sx={{ color: theme.palette.mode === 'dark' ? colors.redAccent[400] : colors.redAccent[500] }} />
                <Typography color="#fff">{profile?.phoneNumber}</Typography>
              </Stack>
            </Box>
          </Box>
          <Box>
            <IconButton sx={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <Edit sx={{ color: '#6D295A' }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

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
                <CustomIconButton icon={<Edit />} onClick={handleOpenDialog} text="Edit Profile" color="#6d295a" variant="contained" fullWidth />
                <Link to="/job-post" className='text-decoration-none'>
                <CustomIconButton icon={<Work />} text="View Job Posts" color="#2d5a78" variant="outlined" fullWidth /></Link>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog open={openEditDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="First Name" name="firstName" fullWidth value={formData.firstName} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Last Name" name="lastName" fullWidth value={formData.lastName} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Email" name="email" fullWidth value={formData.email} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
<TextField
  label="Address"
  name="addressLine1"
  fullWidth
  value={formData.addressLine1}
  onChange={handleInputChange}
/>            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Work Category" name="work_category" fullWidth value={formData.work_category} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Experience" name="work_experience" fullWidth value={formData.work_experience} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Gender" name="gender" fullWidth value={formData.gender} onChange={handleInputChange} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdateProfile} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default ContractorProfile;
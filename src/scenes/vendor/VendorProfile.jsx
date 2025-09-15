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

const ContractorProfile = () => {
  const [uploading, setUploading] = React.useState(false);

  const { profile, loading, error } = useStylistProfile();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const fileInputRef = React.useRef();
  const authToken = Cookies.get("token");
  const dispatch = useDispatch();
  const { t } = useTranslation()

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('files', file);
      const response = await axios.post(
        `${API_BASE_URL}/stylist/profile-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      );
      if (response?.data?.status === 200 && response?.data?.success === true) {
        dispatch(fetchStylistProfile());
        showSuccessToast(response?.data?.data?.message || "Profile image updated!");
      }
    } catch (err) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

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

      {/* Profile Banner */}
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
            <Box sx={{ position: 'relative', width: 140, height: 140 }}>
              <Avatar
                src={profile?.profilePicture || profileimage}
                onError={(e) => { e.target.onerror = null; e.target.src = profileimage; }}
                sx={{ width: 140, height: 140, border: '6px solid #fff', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', background: '#fff' }}
              />
              <IconButton
                sx={{ position: 'absolute', bottom: 8, right: 8, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 1, zIndex: 3 }}
                onClick={handleUploadClick}
                disabled={uploading}
              >
                <PhotoCamera sx={{ color: uploading ? '#aaa' : '#6D295A' }} />
              </IconButton>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} disabled={uploading} />
              {uploading && (
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  bgcolor: 'rgba(255,255,255,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  zIndex: 4,
                }}>
                  <CircularProgress />
                </Box>
              )}
            </Box>
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
                  <Chip
                    label={profile?.role?.toUpperCase()}
                    color="primary"
                    variant="filled"
                    sx={{ fontWeight: 'bold' }}
                  />
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
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Location Coordinates</Typography>
                  <Typography variant="body1" fontWeight="500">
                    {profile?.location?.coordinates
                      ? `Longitude: ${profile.location.coordinates[0]}, Latitude: ${profile.location.coordinates[1]}`
                      : 'N/A'
                    }
                  </Typography>
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
                <CustomIconButton
                  icon={<Edit />}
                  text="Edit Profile"
                  color="#6d295a"
                  variant="contained"
                  fullWidth
                />
                <CustomIconButton
                  icon={<Work />}
                  text="View Job Posts"
                  color="#2d5a78"
                  variant="outlined"
                  fullWidth
                />
                <CustomIconButton
                  icon={<LocationOn />}
                  text="Update Location"
                  color="#4caf50"
                  variant="outlined"
                  fullWidth
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContractorProfile;
import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Select, MenuItem, FormControl, InputLabel, Slider, TextField, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { labourAvailabilityTableColumns } from '../../custom/TableColumns';
import { showErrorToast, showSuccessToast } from '../../Toast';
import { API_BASE_URL } from '../../utils/apiConfig';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { getCoordinatesFromAddress } from '../../utils/geocode';

const LabourAvailability = () => {
    const [allRequests, setAllRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deletingIds, setDeletingIds] = useState([]);
    const [statusFilter, setStatusFilter] = useState('active');
    const [userRole, setUserRole] = useState('contractor');
    const [pagination, setPagination] = useState({
        current: 1,
        pages: 1,
        total: 0
    });
    const { t } = useTranslation();

    // Contractor-side location filtering state
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [distanceKm, setDistanceKm] = useState(50); // default 50km
    const [addressQuery, setAddressQuery] = useState('');

    const [searchText, setSearchText] = useState('');

    const fetchAllRequests = async (page = 1, status = 'active', search = '') => {
        setLoading(true);
        try {
            const token = Cookies.get('token');
            const userRole = localStorage.getItem('panelType') || 'contractor';
            
            let apiUrl;
            if (userRole === 'admin') {
                // Admin endpoint - shows all requests
                apiUrl = `${API_BASE_URL}/labour-availability/admin/all-requests?page=${page}&limit=10&status=${status}`;
            } else {
                // Contractor endpoint - shows available labourers
                const params = new URLSearchParams();
                if (typeof longitude === 'number' && typeof latitude === 'number') {
                    params.append('longitude', String(longitude));
                    params.append('latitude', String(latitude));
                }
                if (distanceKm) {
                    // backend expects meters
                    params.append('maxDistance', String(Math.round(distanceKm * 1000)));
                }
                if (search && search.trim()) {
                    params.append('search', search.trim());
                }
                const qs = params.toString();
                // Use search endpoint if search is provided, otherwise use regular endpoint
                const endpoint = search && search.trim() 
                    ? '/labour-availability/search-available-labours'
                    : '/labour-availability/available-labours';
                apiUrl = `${API_BASE_URL}${endpoint}${qs ? `?${qs}` : ''}`;
            }

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                let formattedData = [];
                
                if (userRole === 'admin') {
                    // Admin response format
                    formattedData = data.data.requests?.map((request) => ({
                        id: request._id,
                        _id: request._id,
                        labour: request.labour,
                        skills: request.skills || [],
                        availabilityDate: request.availabilityDate,
                        location: request.location,
                        status: request.status,
                        createdAt: request.createdAt,
                    })) || [];
                    setPagination(data.data.pagination);
                } else {
                    // Contractor response format
                    formattedData = data.data?.map((request) => ({
                        id: request._id,
                        _id: request._id,
                        labour: request.labour,
                        skills: request.skills || [],
                        availabilityDate: request.availabilityDate,
                        location: request.location,
                        status: request.status || 'active',
                        createdAt: request.createdAt,
                    })) || [];
                    setPagination({
                        current: 1,
                        pages: 1,
                        total: formattedData.length
                    });
                }
                
                setAllRequests(formattedData);
            } else {
                showErrorToast(data.message || 'Error fetching labour availability requests');
            }
        } catch (error) {
            console.error('Error fetching labour availability requests:', error);
            showErrorToast('Error fetching labour availability requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Get user role from localStorage
        const role = localStorage.getItem('panelType') || 'contractor';
        setUserRole(role);
        if (role !== 'admin') {
            // Try to get current location for contractor side
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        setLatitude(pos.coords.latitude);
                        setLongitude(pos.coords.longitude);
                    },
                    () => {
                        // silently ignore; user can search by address
                    },
                    { enableHighAccuracy: true }
                );
            }
        }
        fetchAllRequests(1, statusFilter, searchText);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    // Refetch when contractor updates distance or coordinates
    useEffect(() => {
        if (userRole !== 'admin') {
            fetchAllRequests(1, statusFilter, searchText);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [latitude, longitude, distanceKm, searchText]);

    // Auto-search location as user types (debounced)
    useEffect(() => {
        if (userRole === 'admin') return;
        const q = (addressQuery || '').trim();
        if (q.length < 3) return; // avoid noisy calls
        const timer = setTimeout(async () => {
            try {
                const geo = await getCoordinatesFromAddress(q);
                setLatitude(geo.latitude);
                setLongitude(geo.longitude);
                fetchAllRequests(1, statusFilter, searchText);
            } catch (e) {
                // no toast on debounce to avoid noise
            }
        }, 600);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addressQuery, userRole]);

    // Handle search text change with debounce
    useEffect(() => {
        if (userRole === 'admin') return;
        const timer = setTimeout(() => {
            fetchAllRequests(1, statusFilter, searchText);
        }, 500);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText]);

    const handleView = (row) => {
        console.log('View request:', row);
        // Implement view functionality
    };

    const handleDelete = async (requestId) => {
        const userRole = localStorage.getItem('panelType') || 'contractor';
        
        if (userRole === 'contractor') {
            showErrorToast('Contractors cannot cancel availability requests. Only admins can manage requests.');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this availability request?')) {
            return;
        }

        setDeletingIds(prev => [...prev, requestId]);
        try {
            const token = Cookies.get('token');
            const response = await fetch(`${API_BASE_URL}/labour-availability/cancel/${requestId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                showSuccessToast('Availability request cancelled successfully');
                fetchAllRequests(pagination.current, statusFilter);
            } else {
                showErrorToast(data.message || 'Error cancelling availability request');
            }
        } catch (error) {
            console.error('Error cancelling availability request:', error);
            showErrorToast('Error cancelling availability request');
        } finally {
            setDeletingIds(prev => prev.filter(id => id !== requestId));
        }
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    const handlePageChange = (params) => {
        fetchAllRequests(params.page + 1, statusFilter);
    };

    const handleDistanceCommit = (_, v) => {
        setDistanceKm(Array.isArray(v) ? v[0] : v);
        // Trigger immediate refresh on slider release
        fetchAllRequests(1, statusFilter);
    };

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1">
                    {userRole === 'admin' ? 'Labour Availability Requests' : t("nav.available_labourers")}
                </Typography>
                {userRole === 'admin' && (
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Status"
                            onChange={handleStatusFilterChange}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                            <MenuItem value="expired">Expired</MenuItem>
                        </Select>
                    </FormControl>
                )}
                {userRole !== 'admin' && (
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ width: '100%', maxWidth: 700 }}>
                        <Box sx={{ minWidth: 220 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                {t('Distance')}: {distanceKm} km
                            </Typography>
                            <Slider
                                value={distanceKm}
                                min={1}
                                max={200}
                                step={1}
                                onChange={(_, v) => setDistanceKm(Array.isArray(v) ? v[0] : v)}
                                onChangeCommitted={handleDistanceCommit}
                                valueLabelDisplay="auto"
                                valueLabelFormat={(v) => `${v} km`}
                                aria-label="Distance in km"
                            />
                        </Box>
                        <TextField
                            placeholder={t('Search location (area/city)')}
                            value={addressQuery}
                            onChange={(e) => setAddressQuery(e.target.value)}
                            size="small"
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            placeholder={t('Search labour (name/phone/email)')}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            size="small"
                            sx={{ flex: 1 }}
                        />
                    </Stack>
                )}
            </Box>

            <DataGrid
                rows={allRequests}
                columns={labourAvailabilityTableColumns({ handleView, handleDelete, deletingIds })}
                loading={loading}
                pageSize={10}
                rowsPerPageOptions={[10]}
                paginationMode="server"
                rowCount={pagination.total}
                onPageChange={handlePageChange}
                disableSelectionOnClick
                sx={{
                    '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid #e0e0e0',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold',
                    },
                }}
            />
        </Box>
    );
};

export default LabourAvailability;

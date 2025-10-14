import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { labourAvailabilityTableColumns } from '../../custom/TableColumns';
import { showErrorToast, showSuccessToast } from '../../Toast';
import { API_BASE_URL } from '../../utils/apiConfig';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

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

    const fetchAllRequests = async (page = 1, status = 'active') => {
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
                apiUrl = `${API_BASE_URL}/labour-availability/available-labours`;
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
        fetchAllRequests(1, statusFilter);
    }, [statusFilter]);

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

import React from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    Divider,
} from "@mui/material";

const DeleteAccountPolicy = () => {

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={0} sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom color="primary" fontWeight="bold">
                        Delete Account Policy
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Last Updated: {new Date().toLocaleDateString()}
                    </Typography>
                </Box>
                <Divider />
                <Box>
                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                1. Account Deletion Request
                            </Typography>
                            <Typography variant="body1">
                                You can request to delete your account at any time by contacting our support team or through the account settings section. 
                                The deletion process will be initiated once we verify your identity.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                2. Data Removal Process
                            </Typography>
                            <Typography variant="body1">
                                Upon account deletion, we will permanently remove your personal information from our active databases. 
                                This includes your name, contact details, profile information, and any associated data.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                3. Retention Period
                            </Typography>
                            <Typography variant="body1">
                                Some data may be retained for legal or regulatory purposes for a limited period as required by law. 
                                This includes transaction records and other information necessary for compliance.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                4. Impact on Active Services
                            </Typography>
                            <Typography variant="body1">
                                Deleting your account will cancel any ongoing job requests or active contracts. 
                                Please ensure you complete all pending transactions before initiating account deletion.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                5. Irreversible Action
                            </Typography>
                            <Typography variant="body1">
                                Account deletion is permanent and cannot be undone. Once your account is deleted, 
                                you will need to create a new account if you wish to use our services again in the future.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                6. Data Backup Removal
                            </Typography>
                            <Typography variant="body1">
                                Your information will be removed from our backup systems within 30 days of account deletion. 
                                During this period, your data remains protected by our security measures.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                7. Third-Party Data Sharing
                            </Typography>
                            <Typography variant="body1">
                                If your data has been shared with contractors or job seekers, we will notify them about the account deletion 
                                and request removal of your information from their records where applicable.
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Footer */}
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                        If you have any questions about our Delete Account Policy, please contact us at:
                        <br />
                        <strong>nearbylabour@gmail.com</strong>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default DeleteAccountPolicy;
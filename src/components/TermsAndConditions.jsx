import React from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    Divider,
} from "@mui/material";

const TermsAndConditions = () => {

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={0} sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom color="primary" fontWeight="bold">
                        Terms and Conditions
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
                                1. Acceptance of Terms
                            </Typography>
                            <Typography variant="body1">
                                By accessing and using our platform, you accept and agree to be bound by these Terms and Conditions. 
                                If you do not agree with any part of these terms, you must not use our services.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                2. User Accounts
                            </Typography>
                            <Typography variant="body1">
                                You are responsible for maintaining the confidentiality of your account credentials. 
                                You must provide accurate and complete information during registration and keep it updated.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                3. Service Usage
                            </Typography>
                            <Typography variant="body1">
                                Our platform connects job seekers with contractors. You agree to use the service for lawful purposes only 
                                and not to engage in any fraudulent or misleading activities.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                4. Payments and Fees
                            </Typography>
                            <Typography variant="body1">
                                Any fees for services will be clearly communicated upfront. You are responsible for all charges 
                                associated with your use of the platform and agree to pay them in a timely manner.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                5. Content Responsibility
                            </Typography>
                            <Typography variant="body1">
                                You are solely responsible for the content you post on our platform. We reserve the right to remove 
                                any content that violates our policies or is deemed inappropriate.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                6. Intellectual Property
                            </Typography>
                            <Typography variant="body1">
                                All platform content, including logos, text, and software, is our intellectual property. 
                                You may not use, copy, or distribute any content without our explicit permission.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                7. Limitation of Liability
                            </Typography>
                            <Typography variant="body1">
                                We are not liable for any direct, indirect, or consequential damages arising from your use of our platform. 
                                We provide the service "as is" without warranties of any kind.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                8. Termination
                            </Typography>
                            <Typography variant="body1">
                                We reserve the right to suspend or terminate your account at our discretion if you violate these terms. 
                                You may also terminate your account at any time by contacting support.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                9. Changes to Terms
                            </Typography>
                            <Typography variant="body1">
                                We may modify these terms at any time. Continued use of the platform after changes constitutes 
                                acceptance of the new terms. We will notify users of significant changes.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                10. Governing Law
                            </Typography>
                            <Typography variant="body1">
                                These terms are governed by the laws of India. Any disputes shall be subject to the exclusive 
                                jurisdiction of the courts in your jurisdiction.
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Footer */}
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                        If you have any questions about these Terms and Conditions, please contact us at:
                        <br />
                        <strong>nearbylabour@gmail.com</strong>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default TermsAndConditions;
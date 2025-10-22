import React from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    Divider,
} from "@mui/material";

const PrivacyPolicy = () => {

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={0} sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom color="primary" fontWeight="bold">
                        Privacy Policy
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
                                1. Data Collection
                            </Typography>
                            <Typography variant="body1">
                                We collect basic information such as name, contact details, skills, and location when you register or use our services.
                                This helps us provide you with better job matching opportunities and improve your overall experience.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                2. Use of Information
                            </Typography>
                            <Typography variant="body1">
                                Your information is used to connect job seekers with contractors, manage job requests, and improve our services.
                                We may also use your data for analytics and to personalize your experience on our platform.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                3. Data Sharing
                            </Typography>
                            <Typography variant="body1">
                                We share limited details (like name, skills, and contact info) only between job seekers and contractors for hiring purposes.
                                We do not sell or misuse your data. Your information is shared only when necessary for legitimate business purposes.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                4. Security
                            </Typography>
                            <Typography variant="body1">
                                We use secure servers and encryption to protect your information from unauthorized access.
                                Regular security audits and monitoring ensure that your data remains safe and confidential.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                5. Cookies
                            </Typography>
                            <Typography variant="body1">
                                We may use cookies to enhance your user experience and website performance.
                                Cookies help us remember your preferences and provide you with a more personalized browsing experience.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                6. Your Rights
                            </Typography>
                            <Typography variant="body1">
                                You can request to view, update, or delete your data anytime by contacting our support team.
                                You also have the right to know how your data is being used and to object to certain processing activities.
                            </Typography>
                        </Box>
                    </Box>

                    <Box variant="outlined" sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="h6" color="primary" gutterBottom>
                                7. Changes
                            </Typography>
                            <Typography variant="body1">
                                We may update this policy from time to time. Continued use of the website means you accept any changes.
                                We will notify users of significant updates through email or platform notifications.
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Footer */}
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                        If you have any questions about this Privacy Policy, please contact us at:
                        <br />
                        <strong>nearbylabour@gmail.com</strong>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default PrivacyPolicy;
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Container,
    Paper,
    Typography,
    Box,
    Divider,
} from "@mui/material";
import "../css/landing-page.css";
import logo from "../assets/images/loginpagelogo.jpeg";

// Additional styles to ensure navbar displays correctly
const navbarStyles = `
    header {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        z-index: 9999 !important;
        background-color: #ffffff !important;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
    }
    .nav-links {
        display: flex !important;
        list-style: none !important;
        align-items: center !important;
    }
    @media (max-width: 768px) {
        .nav-links {
            display: none !important;
        }
        .mobile-menu-btn {
            display: block !important;
        }
    }
`;

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Add styles to ensure navbar displays correctly
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.setAttribute('data-navbar-styles', 'true');
        styleSheet.innerText = navbarStyles;
        document.head.appendChild(styleSheet);

        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', function() {
                mobileMenu.classList.toggle('active');
                
                // Change icon
                const icon = mobileMenuBtn.querySelector('i');
                if (mobileMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });

            // Close mobile menu when clicking on a link
            const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileMenu.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                });
            });
        }

        return () => {
            if (mobileMenuBtn) {
                mobileMenuBtn.removeEventListener('click', () => {});
            }
            // Remove style sheet on unmount
            const styleSheet = document.querySelector('style[data-navbar-styles]');
            if (styleSheet) {
                styleSheet.remove();
            }
        };
    }, []);

    const handleContractorLogin = () => {
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            {/* Header */}
            <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, backgroundColor: '#ffffff' }}>
                <div className="container">
                    <nav>
                        <div className="" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <img src={logo} alt="Nearby Labour" style={{ height: 70 }} />
                        </div>
                        <ul className="nav-links">
                            <li><Link to="/#features">Features</Link></li>
                            <li><Link to="/#how-it-works">How It Works</Link></li>
                            <li><Link to="/#stats">Success</Link></li>
                            <li className="nav-buttons">
                                <button className="contractor-login" onClick={handleContractorLogin}>Contractor Login</button>
                                <a href="https://play.google.com/store/apps/details?id=io.nearbylabour.app" className="cta-button">Download App</a>
                            </li>
                        </ul>
                        <button className="mobile-menu-btn">
                            <i className="fas fa-bars"></i>
                        </button>
                    </nav>
                </div>
                {/* Mobile Menu */}
                <div className="mobile-menu" id="mobileMenu">
                    <ul>
                        <li><Link to="/#features">Features</Link></li>
                        <li><Link to="/#how-it-works">How It Works</Link></li>
                        <li><Link to="/#stats">Success</Link></li>
                    </ul>
                    <div className="mobile-buttons">
                        <button className="contractor-login" onClick={handleContractorLogin}>Contractor Login</button>
                        <a href="https://play.google.com/store/apps/details?id=io.nearbylabour.app" className="cta-button">Download App</a>
                    </div>
                </div>
            </header>

            <Container maxWidth="lg" sx={{ py: 4, mt: '100px', minHeight: 'calc(100vh - 200px)' }}>
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

        {/* Footer */}
        <footer>
            <div className="container">
                <div className="footer-content">
                    <div className="footer-column">
                        <h3>Nearby Labour</h3>
                        <p>Connecting contractors with skilled labour professionals.</p>
                        <div className="social-links">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                    <div className="footer-column">
                        <h3>Quick Links</h3>
                        <ul className="footer-links">
                            <li><Link to="/#features">Features</Link></li>
                            <li><Link to="/#how-it-works">How It Works</Link></li>
                            <li><Link to="/#stats">Our Success</Link></li>
                            <li><Link to="/#download">Download</Link></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Support</h3>
                        <ul className="footer-links">
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Contact Us</a></li>
                            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                            <li><Link to="/terms-conditionos">Terms of Service</Link></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Contact Info</h3>
                        <ul className="footer-links">
                            <li><i className="fas fa-map-marker-alt"></i> 123 Construction Ave, Builder City</li>
                            <li><i className="fas fa-phone"></i> +91 76656 27330</li>
                            <li><i className="fas fa-envelope"></i>nearbylabour@gmail.com</li>
                        </ul>
                    </div>
                </div>
                <div className="copyright">
                    <p>&copy; 2023 Nearby Labour. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>
    );
};

export default PrivacyPolicy;
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

const TermsAndConditions = () => {
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
                        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                            <i className="fas fa-hard-hat"></i>
                            Nearby Labour
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

export default TermsAndConditions;
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/landing-page.css";
import phoneMockup from "../assets/samsung-galaxy-s24-ultra-mockup/phoneMockup1.png";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simple animation on scroll
    const animatedElements = document.querySelectorAll('.feature-card, .step, .stat-card');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', function () {
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
        link.addEventListener('click', function () {
          mobileMenu.classList.remove('active');
          const icon = mobileMenuBtn.querySelector('i');
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        });
      });
    }

    return () => {
      if (mobileMenuBtn) {
        mobileMenuBtn.removeEventListener('click', () => { });
      }
    };
  }, []);

  const handleContractorLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      {/* Header */}
      <header>
        <div className="container">
          <nav>
            <div className="logo">
              <i className="fas fa-hard-hat"></i>
              Nearby Labour
            </div>
            <ul className="nav-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#stats">Success</a></li>
              <li className="nav-buttons">
                <button className="contractor-login" onClick={handleContractorLogin}>Contractor Login</button>
                {/* <a href="https://play.google.com/store/apps/details?id=io.nearbylabour.app" className="cta-button">Download App</a> */}
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
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#stats">Success</a></li>
          </ul>
          <div className="mobile-buttons">
            <button className="contractor-login" onClick={handleContractorLogin}>Contractor Login</button>
            <a href="https://play.google.com/store/apps/details?id=io.nearbylabour.app" className="cta-button">Download App</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="fw-bold">Find Skilled <span>Labour Instantly</span> For Your Projects</h1>
              <p>Connect with verified workers in your area. From construction to renovation, find the right professionals for your job with just a few taps.</p>
              <div className="download-buttons">
                <a href="https://play.google.com/store/apps/details?id=io.nearbylabour.app" className="download-btn">
                  <i className="fab fa-google-play"></i>
                  <div>
                    <small>Get it on</small>
                    <div>Google Play</div>
                  </div>
                </a>
              </div>
            </div>
            <div className="hero-image">
              <img src={phoneMockup} alt="Nearby Labour App" className="app-mockup floating" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-title">
            <h2>Powerful Features</h2>
            <p>Everything you need to manage your labour requirements efficiently</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-search"></i>
              </div>
              <h3>Find Workers Fast</h3>
              <p>Search and filter through hundreds of skilled workers based on location, skills, ratings, and availability.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3>Real-time Booking</h3>
              <p>Book workers instantly with our real-time availability system. No more waiting for callbacks.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Verified Professionals</h3>
              <p>All workers are verified, background-checked, and rated by previous clients for your peace of mind.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-file-invoice-dollar"></i>
              </div>
              <h3>Transparent Pricing</h3>
              <p>See upfront pricing with no hidden fees. Pay securely through the app upon job completion.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-comments"></i>
              </div>
              <h3>In-app Messaging</h3>
              <p>Communicate directly with workers through our secure messaging system to discuss project details.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-star"></i>
              </div>
              <h3>Rating System</h3>
              <p>Rate and review workers after job completion to help maintain quality across our platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-title">
            <h2>How It Works</h2>
            <p>Get your project started in just three simple steps</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Post Your Job</h3>
              <p>Describe your project requirements, timeline, and budget</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Choose Worker</h3>
              <p>Review profiles, ratings, and quotes from available workers</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get It Done</h3>
              <p>Hire the right professional and manage the project seamlessly</p>
            </div>
          </div>
        </div>
      </section>
      <section className="stats" id="stats">
        <div className="container">
          <div className="section-title">
            <h2>Our Success in Numbers</h2>
            <p>Join thousands of contractors who trust our platform</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">10,000+</div>
              <div className="stat-text">Skilled Workers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">5,000+</div>
              <div className="stat-text">Happy Contractors</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50,000+</div>
              <div className="stat-text">Projects Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">4.8</div>
              <div className="stat-text">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
      <section className="cta-section" id="download">
        <div className="container">
          <h2>Ready to Transform Your Labour Hiring?</h2>
          <p>Join thousands of contractors who are saving time and money with Nearby Labour</p>
          <div className="download-buttons">
            <a href="https://play.google.com/store/apps/details?id=io.nearbylabour.app" className="download-btn">
              <i className="fab fa-google-play"></i>
              <div>
                <small>Get it on</small>
                <div>Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </section>
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
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#stats">Our Success</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Support</h3>
              <ul className="footer-links">
                <li><a href="#">Contact Us</a></li>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/terms-conditionos">Terms of Service</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Contact Info</h3>
              <ul className="footer-links">
                <li><i className="fas fa-map-marker-alt"></i> Kankediyas, Peelwa, Parbatsar, Didwana–Kuchaman, 341503</li>
                <li><i className="fas fa-phone"></i> +91 76656 27330</li>
                <li><i className="fas fa-envelope"></i> nearbylabour@gmail.com</li>
              </ul>
            </div>
          </div>
          <div
            className="copyright d-flex justify-content-between align-items-center"
            style={{ gap: "20px" }}
          >
            <p>&copy; 2023 Nearby Labour. All rights reserved.</p>
            <p>
              Design &amp; Developed by{" "}
              <a
                href="https://portfolio-p17s.onrender.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Abinash Sinha
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;


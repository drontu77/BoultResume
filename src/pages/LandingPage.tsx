import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/LandingPage.css';

// Component imports and interfaces remain unchanged...

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <div className="landing-page">
      <motion.header 
        className="hero"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.nav 
          className="navbar"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xl font-bold">BoultResume</span>
          </motion.div>

          <div className="nav-links hidden md:flex items-center space-x-8">
            {['Features', 'Templates', 'Pricing', 'About'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-600 hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item}
              </motion.a>
            ))}
            
            <motion.button
              className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-md transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
            >
              Sign In
            </motion.button>
            
            <motion.button
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
            >
              Get Started
            </motion.button>
          </div>
        </motion.nav>

        <div className="hero-content">
          <motion.div 
            className="hero-text"
            variants={containerVariants}
          >
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-6xl font-bold leading-tight"
            >
              Get hired at{' '}
              <span className="text-blue-600">
                top companies
                <motion.span 
                  className="absolute -bottom-2 left-0 w-full h-2 bg-blue-200 -z-10"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-xl text-gray-600 max-w-2xl"
            >
              Stand out from the crowd with AI-powered resume building. Create ATS-optimized resumes with professional templates and expert advice.
            </motion.p>

            <motion.div 
              className="mt-8 flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <motion.button
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium text-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                whileTap={{ scale: 0.95 }}
              >
                Build My Resume
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>

              <motion.button
                className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-lg font-medium text-lg hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Templates
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </motion.div>

            <motion.div 
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
            >
              {[
                { number: '200K+', label: 'Resumes Created' },
                { number: '92%', label: 'ATS Pass Rate' },
                { number: '75%', label: 'Interview Success' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="text-4xl font-bold text-blue-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-gray-600 mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-image"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img 
              src="/resume-preview.png" 
              alt="Resume Preview" 
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>
      </motion.header>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-heading">
          <h2>Powerful features to build your career</h2>
          <p>Everything you need to create a professional resume and land your dream job</p>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon ai"></div>
            <h3>AI-Powered Content</h3>
            <p>Get tailored suggestions for skills, achievements, and job descriptions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon templates"></div>
            <h3>Premium Templates</h3>
            <p>Choose from dozens of professionally designed, ATS-friendly templates.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon jobs"></div>
            <h3>Job Matching</h3>
            <p>Find relevant job listings based on your location and experience.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon export"></div>
            <h3>Multiple Export Options</h3>
            <p>Download as PDF, DOCX, or share a direct link to your resume.</p>
          </div>
        </div>
      </section>

      {/* Templates Preview Section */}
      <section id="templates" className="templates-preview">
        <div className="section-heading">
          <h2>Professional templates for every career stage</h2>
          <p>Choose the perfect design to highlight your unique skills and experience</p>
        </div>
        <div className="templates-slider">
          <div className="template">
            <div className="template-card">
              <img src="/templates/template-1.png" alt="Professional Template" />
            </div>
            <h4>Professional</h4>
          </div>
          <div className="template">
            <div className="template-card">
              <img src="/templates/template-2.png" alt="Creative Template" />
            </div>
            <h4>Creative</h4>
          </div>
          <div className="template">
            <div className="template-card">
              <img src="/templates/template-3.png" alt="Executive Template" />
            </div>
            <h4>Executive</h4>
          </div>
          <div className="template">
            <div className="template-card">
              <img src="/templates/template-4.png" alt="Modern Template" />
            </div>
            <h4>Modern</h4>
          </div>
        </div>
        <button className="btn-outline" onClick={() => navigate('/dashboard')}>
          View All Templates
        </button>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing">
        <div className="section-heading">
          <h2>Simple, transparent pricing</h2>
          <p>No hidden fees or complicated tiers. Just what you need to succeed.</p>
        </div>
        <div className="pricing-cards">
          <div className="pricing-card">
            <div className="card-header">
              <h3>Free</h3>
              <p className="price">$0</p>
              <p className="billing-cycle">Forever</p>
            </div>
            <ul className="features-list">
              <li>3 resume exports</li>
              <li>Basic templates</li>
              <li>Job suggestions</li>
              <li>24 hour support</li>
            </ul>
            <button className="btn-outline" onClick={() => navigate('/dashboard')}>
              Get Started
            </button>
          </div>
          <div className="pricing-card premium">
            <div className="ribbon">Popular</div>
            <div className="card-header">
              <h3>Premium</h3>
              <p className="price">$12</p>
              <p className="billing-cycle">Per month</p>
            </div>
            <ul className="features-list">
              <li>Unlimited exports</li>
              <li>All premium templates</li>
              <li>AI content assistance</li>
              <li>Priority support</li>
              <li>Job application tracking</li>
            </ul>
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>
              Start Premium
            </button>
          </div>
          <div className="pricing-card">
            <div className="card-header">
              <h3>Team</h3>
              <p className="price">$49</p>
              <p className="billing-cycle">Per month</p>
            </div>
            <ul className="features-list">
              <li>Everything in Premium</li>
              <li>5 team members</li>
              <li>Team templates</li>
              <li>Admin dashboard</li>
              <li>API access</li>
            </ul>
            <button className="btn-outline" onClick={() => navigate('/dashboard')}>
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/logo.svg" alt="Resume Builder Logo" />
            <span>ResumeBuilder</span>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#templates">Templates</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="link-group">
              <h4>Resources</h4>
              <a href="#">Blog</a>
              <a href="#">Resume Tips</a>
              <a href="#">Career Advice</a>
            </div>
            <div className="link-group">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
            <div className="link-group">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ResumeBuilder. All rights reserved.</p>
          <div className="social-links">
            <a href="#" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a href="#" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
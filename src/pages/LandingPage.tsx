import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/LandingPage.css';

// Authentication modals
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onSuccess: () => void;
}

// FAQ item interface
interface FAQItem {
  question: string;
  answer: string;
  isOpen?: boolean;
}

// Testimonial interface
interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Animation effect on load
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSignInClick = () => {
    setIsSignInModalOpen(true);
  };

  const handleSignUpClick = () => {
    setIsSignUpModalOpen(true);
  };

  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };
  
  // Handle mobile menu toggle
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  
  // Handle resume score check
  const handleResumeScoreCheck = () => {
    setIsChecking(true);
    // Simulate API call with timeout
    setTimeout(() => {
      setIsChecking(false);
      // Here you would normally show a score result
      alert('Your resume score is 82/100. We have suggestions to improve it!');
    }, 2000);
  };

  return (
    <div className="landing-page">
      {/* Navbar and Hero Section */}
      <header className="hero">
        <motion.nav 
          className="navbar"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 2C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2H6Z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
              <path d="M14 2V8H20" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 13H16" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 17H16" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 9H10" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-lg font-bold">BoultResume</span>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="nav-links hidden md:flex">
            <motion.a 
              href="#features" 
              whileHover={{ scale: 1.1, color: '#2563eb' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              Features
            </motion.a>
            <motion.a 
              href="#pricing" 
              whileHover={{ scale: 1.1, color: '#2563eb' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              Pricing
            </motion.a>
            <motion.a 
              href="#faq" 
              whileHover={{ scale: 1.1, color: '#2563eb' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              FAQ
            </motion.a>
            <motion.a 
              href="#testimonials" 
              whileHover={{ scale: 1.1, color: '#2563eb' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              Testimonials
            </motion.a>
            <div className="auth-buttons">
              <motion.button 
                className="btn-signin" 
                onClick={handleSignInClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
              <motion.button 
                className="btn-primary btn-sm" 
                onClick={handleSignUpClick}
                whileHover={{ scale: 1.05, boxShadow: '0 0 8px rgba(37, 99, 235, 0.5)' }}
                whileTap={{ scale: 0.95 }}
              >
                Dashboard
              </motion.button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              className="mobile-menu-button"
              onClick={toggleMobileMenu}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
            </motion.button>
          </div>
        </motion.nav>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="mobile-menu md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.a 
                href="#features"
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Features
              </motion.a>
              <motion.a 
                href="#pricing"
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Pricing
              </motion.a>
              <motion.a 
                href="#faq"
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                FAQ
              </motion.a>
              <motion.a 
                href="#testimonials"
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Testimonials
              </motion.a>
              <div className="mobile-auth-buttons">
                <motion.button 
                  className="btn-signin" 
                  onClick={handleSignInClick}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Login
                </motion.button>
                <motion.button 
                  className="btn-primary" 
                  onClick={handleSignUpClick}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Dashboard
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="hero-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="hero-text">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              Get hired at <span className="highlight">
                top companies
                <motion.span 
                  className="highlight-dot"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                ></motion.span>
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              Stand out from the crowd with AI-powered resume building. 
              Create ATS-optimized resumes with professional templates 
              and expert advice to land your dream job faster.
            </motion.p>
            <motion.div 
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
            >
              <motion.button 
                className="btn-build-resume" 
                onClick={handleSignUpClick}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(94, 53, 177, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  y: [0, -5, 0],
                  boxShadow: [
                    '0 8px 20px rgba(94, 53, 177, 0.3)',
                    '0 10px 25px rgba(94, 53, 177, 0.5)',
                    '0 8px 20px rgba(94, 53, 177, 0.3)'
                  ]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatType: "loop",
                  ease: "easeInOut" 
                }}
              >
                Build My Resume
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </motion.button>
              <motion.button 
                className="btn-check-score" 
                onClick={handleResumeScoreCheck}
                whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)' }}
                whileTap={{ scale: 0.95 }}
              >
                {isChecking ? (
                  <>
                    <motion.span
                      className="spinner"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 11l3 3L22 4"/>
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                    </svg>
                    Check Your Resume Score
                  </>
                )}
              </motion.button>
            </motion.div>
            <motion.div 
              className="key-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1 }}
            >
              <motion.div 
                className="stat"
                whileHover={{ scale: 1.05 }}
              >
                <motion.span 
                  className="stat-number"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                >
                  200K+
                </motion.span>
                <span className="stat-label">Resumes Created</span>
              </motion.div>
              
              <motion.div 
                className="stat"
                whileHover={{ scale: 1.05 }}
              >
                <motion.span 
                  className="stat-number"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop", delay: 0.3 }}
                >
                  92%
                </motion.span>
                <span className="stat-label">ATS Pass Rate</span>
              </motion.div>
              
              <motion.div 
                className="stat"
                whileHover={{ scale: 1.05 }}
              >
                <motion.span 
                  className="stat-number"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop", delay: 0.6 }}
                >
                  75%
                </motion.span>
                <span className="stat-label">Interview Improvement</span>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="social-proof"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.3 }}
            >
              <div className="users">
                <div className="user-avatars">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="avatar" style={{ backgroundImage: `url(/avatars/avatar-${i}.jpg)` }}></div>
                  ))}
                </div>
                <p>Trusted by <strong>5,000+</strong> professionals</p>
              </div>
              <div className="rating">
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>
                <p>4.9/5 from <strong>1,200+</strong> reviews</p>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="hero-image"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <div className="resume-preview">
              <img src="/resume-preview.png" alt="Resume Preview" />
              <motion.div className="floating-elements">
                <motion.div 
                  className="element skills"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <span className="icon">⚡</span>
                  <span>AI Skills Analysis</span>
                </motion.div>
                <motion.div 
                  className="element jobs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <span className="icon">💼</span>
                  <span>Location-based Jobs</span>
                </motion.div>
                <motion.div 
                  className="element templates"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                >
                  <span className="icon">🎨</span>
                  <span>Premium Templates</span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </header>

      <div className="wave-divider">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100">
            <path fill="#f8fafc" fillOpacity="1" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
          </svg>
        </div>

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
            <button className="btn-outline" onClick={handleSignUpClick}>
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
            <button className="btn-primary" onClick={handleSignUpClick}>
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
            <button className="btn-outline" onClick={handleSignUpClick}>
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="section-heading">
          <h2>What our users say</h2>
        </div>
        <div className="testimonials-slider">
          <div className="testimonial-card">
            <div className="quote">"I landed my dream job at Google after using Resume Builder. The AI suggestions and premium templates made all the difference."</div>
            <div className="author">
              <img src="/testimonials/user1.jpg" alt="Sarah Johnson" />
              <div>
                <h4>Sarah Johnson</h4>
                <p>UX Designer at Google</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="quote">"After 6 months of job hunting with no success, I tried Resume Builder and got 3 interviews in the first week!"</div>
            <div className="author">
              <img src="/testimonials/user2.jpg" alt="Michael Chen" />
              <div>
                <h4>Michael Chen</h4>
                <p>Software Engineer at Amazon</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="quote">"The location-based job suggestions feature saved me so much time in my job search. Highly recommended!"</div>
            <div className="author">
              <img src="/testimonials/user3.jpg" alt="Emma Rodriguez" />
              <div>
                <h4>Emma Rodriguez</h4>
                <p>Marketing Manager at Spotify</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to build your professional resume?</h2>
          <p>Join thousands of job seekers who've found success with our platform</p>
          <button className="btn-primary" onClick={handleSignUpClick}>
            Get Started Now
          </button>
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

      {/* Auth Modals */}
      {isSignInModalOpen && (
        <AuthModal 
          isOpen={isSignInModalOpen} 
          onClose={() => setIsSignInModalOpen(false)} 
          mode="signin"
          onSuccess={handleAuthSuccess}
        />
      )}
      {isSignUpModalOpen && (
        <AuthModal 
          isOpen={isSignUpModalOpen} 
          onClose={() => setIsSignUpModalOpen(false)} 
          mode="signup"
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

// Authentication Modal Component
const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [currentTab, setCurrentTab] = useState<'signin' | 'signup'>(mode);

  // Switch to the other tab when mode changes
  useEffect(() => {
    setCurrentTab(mode);
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, allow any login/signup
      onSuccess();
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const switchTab = (tab: 'signin' | 'signup') => {
    setCurrentTab(tab);
    // Reset form when switching tabs
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${currentTab === 'signin' ? 'active' : ''}`} 
            onClick={() => switchTab('signin')}
          >
            Sign In
          </button>
          <button 
            className={`auth-tab ${currentTab === 'signup' ? 'active' : ''}`} 
            onClick={() => switchTab('signup')}
          >
            Sign Up
          </button>
        </div>
        
        <div className="modal-header">
          <h2>{currentTab === 'signin' ? 'Welcome back!' : 'Create your account'}</h2>
          <p>{currentTab === 'signin' ? 'Sign in to access your resumes' : 'Start building your professional resume today'}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {currentTab === 'signup' && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={currentTab === 'signin' ? "Enter your password" : "Create a strong password"}
                required
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            {currentTab === 'signin' && (
              <div className="password-options">
                <div className="remember-me">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>
            )}
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="btn-primary full-width" disabled={isLoading}>
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : currentTab === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
          
          {currentTab === 'signup' && (
            <p className="terms-text">
              By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </p>
          )}
        </form>
        
        <div className="modal-divider">
          <span>or continue with</span>
        </div>
        
        <div className="social-auth">
          <button className="social-btn google">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#DB4437"/>
            </svg>
            Google
          </button>
          <button className="social-btn github">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
          <button className="social-btn linkedin">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="#0077B5"/>
            </svg>
            LinkedIn
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

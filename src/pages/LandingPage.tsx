import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/LandingPage.css';

interface Stat {
  number: string;
  label: string;
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Common animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Data for stats
  const stats: Stat[] = [
    { number: '200K+', label: 'Resumes Created' },
    { number: '92%', label: 'ATS Pass Rate' },
    { number: '75%', label: 'Interview Success' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div className="landing-page">
      {/* ============================
            Header / Hero Section
         ============================ */}
      <motion.header
        className="hero"
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        {/* Navbar */}
        <motion.nav
          className="navbar container mx-auto px-4 flex items-center justify-between py-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <motion.div
            className="logo flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {/* Consistent Branding: make sure this matches elsewhere */}
            <span className="text-xl font-bold">ResumeBuilder</span>
          </motion.div>

          {/* Desktop Links */}
          <div className="nav-links hidden md:flex items-center space-x-8">
            {['Features', 'Templates', 'Pricing', 'About'].map((item, idx) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-600 hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                {item}
              </motion.a>
            ))}

            <motion.button
              className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-md transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signin')}
            >
              Sign In
            </motion.button>

            <motion.button
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              // “X” icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </motion.nav>

        {/* Mobile Menu (conditionally rendered) */}
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu md:hidden bg-white shadow-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col p-4 space-y-4">
              {['Features', 'Templates', 'Pricing', 'About'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}

              <button
                className="w-full px-4 py-2 text-blue-600 font-medium border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/signin');
                }}
              >
                Sign In
              </button>
              <button
                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/signup');
                }}
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}

        {/* Hero Content */}
        <div className="hero-content container mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-8 py-12">
          {/* Left: Text + Stats */}
          <motion.div className="hero-text w-full md:w-1/2" variants={containerVariants}>
            {/* Title – parent is relative for the underline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl font-bold leading-tight relative"
            >
              Get hired at{' '}
              <span className="text-blue-600 relative inline-block">
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
              Stand out from the crowd with AI-powered resume building. Create ATS-optimized
              resumes with professional templates and expert advice.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <motion.button
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium text-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/build-resume')}
                aria-label="Build My Resume"
              >
                Build My Resume
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.button>

              <motion.button
                className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-lg font-medium text-lg hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/templates')}
                aria-label="View Templates"
              >
                View Templates
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
            >
              {stats.map((stat, index) => (
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

          {/* Right: Hero Image */}
          <motion.div
            className="hero-image w-full md:w-1/2"
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

      {/* ============================
            Features Section
         ============================ */}
      <section id="features" className="features py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="section-heading text-center mb-12">
            <h2 className="text-3xl font-bold">Powerful features to build your career</h2>
            <p className="mt-2 text-gray-600">
              Everything you need to create a professional resume and land your dream job
            </p>
          </div>
          <div className="feature-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="feature-card p-6 bg-white rounded-lg shadow-md text-center">
              <div className="feature-icon ai mb-4 mx-auto" aria-hidden="true"></div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Content</h3>
              <p className="text-gray-600">
                Get tailored suggestions for skills, achievements, and job descriptions.
              </p>
            </div>
            <div className="feature-card p-6 bg-white rounded-lg shadow-md text-center">
              <div className="feature-icon templates mb-4 mx-auto" aria-hidden="true"></div>
              <h3 className="text-xl font-semibold mb-2">Premium Templates</h3>
              <p className="text-gray-600">
                Choose from dozens of professionally designed, ATS-friendly templates.
              </p>
            </div>
            <div className="feature-card p-6 bg-white rounded-lg shadow-md text-center">
              <div className="feature-icon jobs mb-4 mx-auto" aria-hidden="true"></div>
              <h3 className="text-xl font-semibold mb-2">Job Matching</h3>
              <p className="text-gray-600">
                Find relevant job listings based on your location and experience.
              </p>
            </div>
            <div className="feature-card p-6 bg-white rounded-lg shadow-md text-center">
              <div className="feature-icon export mb-4 mx-auto" aria-hidden="true"></div>
              <h3 className="text-xl font-semibold mb-2">Multiple Export Options</h3>
              <p className="text-gray-600">
                Download as PDF, DOCX, or share a direct link to your resume.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================
            Templates Preview Section
         ============================ */}
      <section id="templates" className="templates-preview py-16">
        <div className="container mx-auto px-4">
          <div className="section-heading text-center mb-12">
            <h2 className="text-3xl font-bold">Professional templates for every career stage</h2>
            <p className="mt-2 text-gray-600">
              Choose the perfect design to highlight your unique skills and experience
            </p>
          </div>

          <div className="templates-slider grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="template text-center">
              <div className="template-card overflow-hidden rounded-lg shadow-md mb-4">
                <img
                  src="/templates/template-1.png"
                  alt="Professional Template"
                  className="w-full h-auto"
                />
              </div>
              <h4 className="text-lg font-medium">Professional</h4>
            </div>
            <div className="template text-center">
              <div className="template-card overflow-hidden rounded-lg shadow-md mb-4">
                <img
                  src="/templates/template-2.png"
                  alt="Creative Template"
                  className="w-full h-auto"
                />
              </div>
              <h4 className="text-lg font-medium">Creative</h4>
            </div>
            <div className="template text-center">
              <div className="template-card overflow-hidden rounded-lg shadow-md mb-4">
                <img
                  src="/templates/template-3.png"
                  alt="Executive Template"
                  className="w-full h-auto"
                />
              </div>
              <h4 className="text-lg font-medium">Executive</h4>
            </div>
            <div className="template text-center">
              <div className="template-card overflow-hidden rounded-lg shadow-md mb-4">
                <img
                  src="/templates/template-4.png"
                  alt="Modern Template"
                  className="w-full h-auto"
                />
              </div>
              <h4 className="text-lg font-medium">Modern</h4>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              onClick={() => navigate('/templates')}
            >
              View All Templates
            </button>
          </div>
        </div>
      </section>

      {/* ============================
            Pricing Section
         ============================ */}
      <section id="pricing" className="pricing py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="section-heading text-center mb-12">
            <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
            <p className="mt-2 text-gray-600">
              No hidden fees or complicated tiers. Just what you need to succeed.
            </p>
          </div>

          <div className="pricing-cards grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="pricing-card bg-white rounded-lg shadow-md p-6 flex flex-col">
              <div className="card-header text-center mb-4">
                <h3 className="text-2xl font-semibold">Free</h3>
                <p className="price text-4xl font-bold">$0</p>
                <p className="billing-cycle text-gray-600">Forever</p>
              </div>
              <ul className="features-list mb-6 space-y-2 text-gray-600 flex-1">
                <li>3 resume exports</li>
                <li>Basic templates</li>
                <li>Job suggestions</li>
                <li>24-hour support</li>
              </ul>
              <button
                className="mt-auto px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                onClick={() => navigate('/signup')}
              >
                Get Started
              </button>
            </div>

            {/* Premium Plan */}
            <div className="pricing-card bg-white rounded-lg shadow-md p-6 border-2 border-blue-600 relative flex flex-col">
              <div className="ribbon absolute top-0 right-0 bg-blue-600 text-white text-sm font-semibold px-3 py-1 transform translate-x-1/2 -translate-y-1/2 rounded-bl-lg">
                Popular
              </div>
              <div className="card-header text-center mb-4">
                <h3 className="text-2xl font-semibold">Premium</h3>
                <p className="price text-4xl font-bold">$12</p>
                <p className="billing-cycle text-gray-600">Per month</p>
              </div>
              <ul className="features-list mb-6 space-y-2 text-gray-600 flex-1">
                <li>Unlimited exports</li>
                <li>All premium templates</li>
                <li>AI content assistance</li>
                <li>Priority support</li>
                <li>Job application tracking</li>
              </ul>
              <button
                className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => navigate('/pricing/premium')}
              >
                Start Premium
              </button>
            </div>

            {/* Team Plan */}
            <div className="pricing-card bg-white rounded-lg shadow-md p-6 flex flex-col">
              <div className="card-header text-center mb-4">
                <h3 className="text-2xl font-semibold">Team</h3>
                <p className="price text-4xl font-bold">$49</p>
                <p className="billing-cycle text-gray-600">Per month</p>
              </div>
              <ul className="features-list mb-6 space-y-2 text-gray-600 flex-1">
                <li>Everything in Premium</li>
                <li>5 team members</li>
                <li>Team templates</li>
                <li>Admin dashboard</li>
                <li>API access</li>
              </ul>
              <button
                className="mt-auto px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                onClick={() => navigate('/contact-sales')}
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================
            Footer
         ============================ */}
      <footer className="footer bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Logo / Branding */}
          <div className="footer-logo flex items-center gap-2">
            <img src="/logo.svg" alt="ResumeBuilder Logo" className="w-8 h-8" />
            <span className="text-xl font-bold">ResumeBuilder</span>
          </div>

          {/* Footer Links */}
          <div className="footer-links grid grid-cols-2 sm:grid-cols-4 gap-8 w-full md:w-auto">
            <div className="link-group">
              <h4 className="font-semibold mb-2">Product</h4>
              <ul className="space-y-1 text-gray-600">
                <li>
                  <a href="#features" className="hover:text-blue-600">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#templates" className="hover:text-blue-600">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-blue-600">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div className="link-group">
              <h4 className="font-semibold mb-2">Resources</h4>
              <ul className="space-y-1 text-gray-600">
                <li>
                  <a href="/blog" className="hover:text-blue-600">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/tips" className="hover:text-blue-600">
                    Resume Tips
                  </a>
                </li>
                <li>
                  <a href="/advice" className="hover:text-blue-600">
                    Career Advice
                  </a>
                </li>
              </ul>
            </div>
            <div className="link-group">
              <h4 className="font-semibold mb-2">Company</h4>
              <ul className="space-y-1 text-gray-600">
                <li>
                  <a href="/about" className="hover:text-blue-600">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/careers" className="hover:text-blue-600">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-blue-600">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div className="link-group">
              <h4 className="font-semibold mb-2">Legal</h4>
              <ul className="space-y-1 text-gray-600">
                <li>
                  <a href="/privacy" className="hover:text-blue-600">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-blue-600">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/cookies" className="hover:text-blue-600">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-8 border-t border-gray-100 pt-4 flex flex-col md:flex-row justify-between text-gray-600">
          <p>&copy; {currentYear} ResumeBuilder. All rights reserved.</p>
          <div className="social-links flex items-center space-x-4 mt-4 md:mt-0">
            <a href="https://twitter.com/yourprofile" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a href="https://facebook.com/yourprofile" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="https://instagram.com/yourprofile" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://linkedin.com/in/yourprofile" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

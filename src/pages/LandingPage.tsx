import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom'; // Assuming this comes from react-router-dom
import { motion, AnimatePresence } from 'framer-motion';

// Mock useNavigate to allow the component to run without React Router
const useNavigate = () => {
  return (path) => console.log(`Navigating to: ${path}`);
};

// Placeholder SVG for Logo
const LogoIcon = () => (
  <svg
    className="w-9 h-9 text-blue-600" // Slightly larger logo icon
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

// Placeholder SVGs for Feature Icons
const FeatureAiIcon = () => (
  <svg className="w-12 h-12 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const FeatureTemplatesIcon = () => (
  <svg className="w-12 h-12 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);
const FeatureJobsIcon = () => (
  <svg className="w-12 h-12 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const FeatureExportIcon = () => (
  <svg className="w-12 h-12 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);


interface Stat {
  number: string;
  label: string;
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // Kept for potential future use, but not for navbar bg/shadow
  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);

  // Placeholder image URL generator
  const placeholderImg = (width: number, height: number, text: string = "Placeholder", bgColor: string = "e2e8f0", textColor: string = "94a3b8") => 
    `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}&font=lora`;

  // Array of 5 resume image placeholders for the hero section
  const heroImages = [
    placeholderImg(210, 297, "Resume 1", "dbeafe", "1e3a8a"), // Light blue bg, dark blue text
    placeholderImg(210, 297, "Resume 2", "fee2e2", "991b1b"), // Light red bg, dark red text
    placeholderImg(210, 297, "Resume 3", "d1fae5", "065f46"), // Light green bg, dark green text
    placeholderImg(210, 297, "Resume 4", "fef3c7", "92400e"), // Light yellow bg, dark yellow text
    placeholderImg(210, 297, "Resume 5", "e0e7ff", "3730a3"), // Light indigo bg, dark indigo text
  ];

  // Effect for initial page load animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Effect for tracking scroll position (can be used for other subtle effects if needed)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20); 
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect for hero image rotation
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHeroImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3500); // Change image every 3.5 seconds
    return () => clearInterval(intervalId);
  }, [heroImages.length]);


  // Common animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15, 
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }, 
  };

  // Data for stats
  const stats: Stat[] = [
    { number: '200K+', label: 'Resumes Created' },
    { number: '92%', label: 'ATS Pass Rate' },
    { number: '75%', label: 'Interview Success' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div className="landing-page bg-slate-100 font-sans antialiased"> 
      {/* ============================
            Header / Hero Section
         ============================ */}
      {/* Navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-white/95 backdrop-blur-md shadow-lg py-4" // Always white, floating with blur and shadow
        initial={{ y: -120, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "circOut" }} 
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="logo flex items-center gap-2.5 cursor-pointer" 
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.03, rotate: -2 }} 
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <LogoIcon />
            <span className="text-2xl font-bold text-slate-800 tracking-tight">Resume<span className="text-blue-600">Builder</span></span> 
          </motion.div>

          {/* Desktop Links */}
          <div className="nav-links hidden md:flex items-center space-x-5 lg:space-x-7"> 
            {['Features', 'Templates', 'Pricing', 'About'].map((item, idx) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-slate-700 hover:text-blue-600 transition-colors duration-200 font-semibold text-sm relative group" 
                whileHover={{ y: -1 }}
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 + 0.4, type: "spring", stiffness: 120 }}
              >
                {item}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center"></span> 
              </motion.a>
            ))}
            <motion.button
              className="ml-2 px-5 py-2.5 text-sm text-blue-600 font-semibold border-2 border-blue-600 rounded-lg hover:bg-blue-50 hover:shadow-lg transition-all duration-200"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/signin')}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, type: "spring", stiffness: 120 }}
            >
              Sign In
            </motion.button>
            <motion.button
              className="px-5 py-2.5 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/signup')}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, type: "spring", stiffness: 120 }}
            >
              Get Started Free
            </motion.button>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              className="p-2.5 text-slate-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="mobile-menu md:hidden bg-white shadow-2xl absolute top-full left-0 right-0 border-t border-slate-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: "circInOut" }}
            >
              <div className="flex flex-col px-5 pt-3 pb-5 space-y-2">
                {['Features', 'Templates', 'Pricing', 'About'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block px-3 py-2.5 rounded-md text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <hr className="my-3 border-slate-200" />
                <button
                  className="w-full px-4 py-3 text-blue-600 font-semibold border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-center"
                  onClick={() => { setMobileMenuOpen(false); navigate('/signin'); }}
                >
                  Sign In
                </button>
                <button
                  className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
                  onClick={() => { setMobileMenuOpen(false); navigate('/signup'); }}
                >
                  Get Started Free
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <motion.header
        className="hero pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 text-white overflow-hidden" 
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
          {/* Left: Text + Stats */}
          <motion.div className="hero-text w-full md:w-3/5 lg:w-[55%] text-center md:text-left" variants={containerVariants}>
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-tight tracking-tighter relative" 
            >
              Craft Your Future:
              <br className="hidden sm:block" />
              <span className="relative inline-block mt-1">
                AI-Powered Resumes
                <motion.svg
                  className="absolute -bottom-2.5 left-0 w-full h-4 -z-10"
                  viewBox="0 0 200 20" preserveAspectRatio="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.7, ease: "circOut" }}
                >
                  <path d="M0 10 Q50 2, 100 10 T200 10" stroke="#FFD700" strokeWidth="4" fill="transparent" />
                </motion.svg>
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-md sm:text-lg text-blue-100 max-w-lg mx-auto md:mx-0 leading-relaxed"
            >
              Build standout, ATS-friendly resumes in minutes. Leverage AI insights and professional templates to land your dream job faster.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center md:justify-start"
              variants={itemVariants}
            >
              <motion.button
                className="px-8 py-4 bg-yellow-400 text-blue-800 rounded-xl font-bold text-lg shadow-xl hover:bg-yellow-300 focus:ring-4 focus:ring-yellow-300/50 transition-all duration-200 flex items-center justify-center gap-2.5 transform hover:scale-105"
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/build-resume')}
                aria-label="Build My Resume Now"
              >
                Build My Resume Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </motion.button>
              <motion.button
                className="px-8 py-4 border-2 border-blue-300/70 text-white rounded-xl font-semibold text-lg hover:bg-white/10 hover:border-white transition-all duration-200 flex items-center justify-center gap-2.5 transform hover:scale-105"
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/templates')}
                aria-label="Explore Templates"
              >
                Explore Templates
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </motion.button>
            </motion.div>

            <motion.div
              className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6"
              variants={containerVariants}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-4 bg-white/15 rounded-xl backdrop-blur-md shadow-lg"
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.25)'}}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="text-3xl lg:text-4xl font-bold text-yellow-400"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 + 0.9, ease: "circOut" }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-blue-100 mt-1.5 text-xs sm:text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Hero Image - A4 Aspect Ratio with Rotation */}
          <motion.div
            className="hero-image-container w-full md:w-2/5 lg:w-[40%] mt-10 md:mt-0 flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "circOut" }}
            style={{ perspective: '1000px' }} 
          >
            <div className="relative w-[210px] h-[297px] sm:w-[240px] sm:h-[339px] md:w-[210px] md:h-[297px] lg:w-[250px] lg:h-[353px]"> 
              <AnimatePresence mode="sync">
                <motion.img
                  key={currentHeroImageIndex}
                  src={heroImages[currentHeroImageIndex]}
                  alt={`Resume Example ${currentHeroImageIndex + 1}`}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-2xl border-2 border-white/20"
                  initial={{ opacity: 0, rotateY: 90, scale: 0.9 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: -90, scale: 0.9 }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  onError={(e) => (e.currentTarget.src = placeholderImg(210, 297, "Error"))}
                />
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* ============================
            Features Section
         ============================ */}
      <section id="features" className="features py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-heading text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800">Powerful Features to Build Your Career</h2>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to create a professional resume and land your dream job.
            </p>
          </div>
          <motion.div 
            className="feature-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {[
              { title: "AI-Powered Content", desc: "Get tailored suggestions for skills, achievements, and job descriptions.", Icon: FeatureAiIcon },
              { title: "Premium Templates", desc: "Choose from dozens of professionally designed, ATS-friendly templates.", Icon: FeatureTemplatesIcon },
              { title: "Job Matching", desc: "Find relevant job listings based on your location and experience.", Icon: FeatureJobsIcon },
              { title: "Multiple Export Options", desc: "Download as PDF, DOCX, or share a direct link to your resume.", Icon: FeatureExportIcon },
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="feature-card p-6 bg-slate-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center flex flex-col items-center"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="mb-5 p-3 bg-blue-100 rounded-full"> <feature.Icon /> </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-700">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================
            Templates Preview Section
         ============================ */}
      <section id="templates" className="templates-preview py-16 lg:py-24 bg-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-heading text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800">Professional Templates for Every Career Stage</h2>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
              Choose the perfect design to highlight your unique skills and experience.
            </p>
          </div>

          <motion.div 
            className="templates-slider grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {['Professional', 'Creative', 'Executive', 'Modern'].map((templateName, index) => (
              <motion.div 
                key={index} 
                className="template text-center group"
                variants={itemVariants}
              >
                <div className="template-card overflow-hidden rounded-xl shadow-lg mb-4 border-4 border-transparent group-hover:border-blue-500 transition-all duration-300 transform group-hover:scale-105">
                  <img
                    src={placeholderImg(300, 400, `${templateName} Template`)}
                    alt={`${templateName} Template`}
                    className="w-full h-auto object-cover"
                    onError={(e) => (e.currentTarget.src = placeholderImg(300, 400, "Image Error"))}
                  />
                </div>
                <h4 className="text-lg font-medium text-slate-700 group-hover:text-blue-600 transition-colors duration-300">{templateName}</h4>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-12"
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, amount: 0.5}}
            transition={{delay: 0.5}}
          >
            <button
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg text-lg"
              onClick={() => navigate('/templates')}
            >
              View All Templates
            </button>
          </motion.div>
        </div>
      </section>

      {/* ============================
            Pricing Section
         ============================ */}
      <section id="pricing" className="pricing py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-heading text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800">Simple, Transparent Pricing</h2>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
              No hidden fees or complicated tiers. Just what you need to succeed.
            </p>
          </div>

          <motion.div 
            className="pricing-cards grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Free Plan */}
            <motion.div 
              className="pricing-card bg-slate-50 rounded-xl shadow-lg p-6 lg:p-8 flex flex-col hover:shadow-xl transition-shadow duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="card-header text-center mb-6">
                <h3 className="text-2xl font-semibold text-slate-700">Free</h3>
                <p className="price text-5xl font-bold text-blue-600 mt-2">$0</p>
                <p className="billing-cycle text-slate-500 text-sm">Forever</p>
              </div>
              <ul className="features-list mb-8 space-y-3 text-slate-600 flex-1 text-sm">
                {['3 resume exports', 'Basic templates', 'Job suggestions', '24-hour support'].map(feat => (
                    <li key={feat} className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{feat}</li>
                ))}
              </ul>
              <button
                className="mt-auto w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
                onClick={() => navigate('/signup')}
              >
                Get Started
              </button>
            </motion.div>

            {/* Premium Plan */}
            <motion.div 
              className="pricing-card bg-blue-600 text-white rounded-xl shadow-2xl p-6 lg:p-8 flex flex-col relative transform md:scale-105"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="ribbon absolute top-0 -right-1 bg-yellow-400 text-blue-700 text-xs font-bold px-3 py-1 transform rotate-45 translate-x-6 -translate-y-2 rounded-sm shadow-md"> 
                POPULAR
              </div>
              <div className="card-header text-center mb-6">
                <h3 className="text-2xl font-semibold">Premium</h3>
                <p className="price text-5xl font-bold mt-2">$12</p>
                <p className="billing-cycle text-blue-200 text-sm">Per month</p>
              </div>
              <ul className="features-list mb-8 space-y-3 text-blue-100 flex-1 text-sm">
                {['Unlimited exports', 'All premium templates', 'AI content assistance', 'Priority support', 'Job application tracking'].map(feat => (
                    <li key={feat} className="flex items-center"><svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{feat}</li>
                ))}
              </ul>
              <button
                className="mt-auto w-full px-6 py-3 bg-yellow-400 text-blue-700 rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-300 shadow-md"
                onClick={() => navigate('/pricing/premium')}
              >
                Start Premium
              </button>
            </motion.div>

            {/* Team Plan */}
            <motion.div 
              className="pricing-card bg-slate-50 rounded-xl shadow-lg p-6 lg:p-8 flex flex-col hover:shadow-xl transition-shadow duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="card-header text-center mb-6">
                <h3 className="text-2xl font-semibold text-slate-700">Team</h3>
                <p className="price text-5xl font-bold text-blue-600 mt-2">$49</p>
                <p className="billing-cycle text-slate-500 text-sm">Per month</p>
              </div>
              <ul className="features-list mb-8 space-y-3 text-slate-600 flex-1 text-sm">
                {['Everything in Premium', '5 team members', 'Team templates', 'Admin dashboard', 'API access'].map(feat => (
                    <li key={feat} className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{feat}</li>
                ))}
              </ul>
              <button
                className="mt-auto w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
                onClick={() => navigate('/contact-sales')}
              >
                Contact Sales
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================
            Footer
         ============================ */}
      <footer className="footer bg-slate-800 text-slate-300 py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="footer-logo flex items-center gap-3 mb-4">
                <LogoIcon />
                <span className="text-2xl font-bold text-white">Resume<span className="text-blue-400">Builder</span></span>
              </div>
              <p className="text-sm text-slate-400 max-w-md">
                Helping you craft the perfect resume to land your dream job. AI-powered, professionally designed, and ATS-friendly.
              </p>
            </div>
            {[
              { title: 'Product', links: [{label: 'Features', href:'#features'}, {label: 'Templates', href:'#templates'}, {label:'Pricing', href:'#pricing'}] },
              { title: 'Resources', links: [{label: 'Blog', href:'/blog'}, {label: 'Resume Tips', href:'/tips'}, {label: 'Career Advice', href:'/advice'}] },
              { title: 'Company', links: [{label: 'About Us', href:'/about'}, {label: 'Careers', href:'/careers'}, {label: 'Contact', href:'/contact'}] },
            ].map(group => (
              <div key={group.title} className="link-group">
                <h4 className="font-semibold text-white mb-3 text-lg">{group.title}</h4>
                <ul className="space-y-2">
                  {group.links.map(link => (
                    <li key={link.label}>
                      <a href={link.href} className="text-slate-400 hover:text-blue-400 transition-colors duration-200 text-sm">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="text-slate-400">&copy; {currentYear} ResumeBuilder. All rights reserved.</p>
            <div className="social-links flex items-center space-x-5 mt-4 md:mt-0">
              {[
                { label: 'Twitter', href: 'https://twitter.com/yourprofile', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-.422.724-.665 1.56-.665 2.452 0 1.613.823 3.043 2.074 3.873-.766-.024-1.483-.233-2.11-.583v.06c0 2.255 1.603 4.135 3.729 4.568-.39.107-.803.164-1.227.164-.3 0-.59-.028-.875-.083.593 1.85 2.307 3.198 4.338 3.235-1.593 1.246-3.604 1.991-5.786 1.991-.377 0-.748-.022-1.112-.065 2.062 1.323 4.512 2.092 7.14 2.092 8.57 0 13.255-7.098 13.255-13.254 0-.202-.005-.403-.014-.602.91-.658 1.7-1.475 2.323-2.408z"/></svg> },
                { label: 'Facebook', href: 'https://facebook.com/yourprofile', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg> },
                { label: 'Instagram', href: 'https://instagram.com/yourprofile', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.359 2.618 6.78 6.98 6.98 1.28.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
                { label: 'LinkedIn', href: 'https://linkedin.com/in/yourprofile', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg> },
              ].map(social => (
                <a key={social.label} href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors duration-200">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
        }
        /* Custom wavy underline SVG */
        .hero-underline-svg path {
          stroke-dasharray: 1000; /* A large number */
          stroke-dashoffset: 1000;
          animation: draw-underline 1s ease-out 0.7s forwards;
        }
        @keyframes draw-underline {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
       <script src="https://cdn.tailwindcss.com"></script>
      <LandingPage />
    </>
  );
};

export default App;

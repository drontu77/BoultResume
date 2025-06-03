import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, Briefcase, Award, Download, ChevronRight, Menu, X } from 'lucide-react';
import AuthModal from '../components/auth/AuthModal';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(progress);

      // Update active section based on scroll position
      const sections = ['home', 'features', 'templates', 'pricing'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Progress bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-blue-600 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ResumeBuilder</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Templates', 'Pricing', 'About'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`text-gray-600 hover:text-blue-600 transition-colors duration-200 ${
                    activeSection === item.toLowerCase() ? 'text-blue-600' : ''
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                </motion.a>
              ))}
              <motion.button
                className="px-4 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAuth('signin')}
              >
                Sign In
              </motion.button>
              <motion.button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAuth('signup')}
              >
                Get Started
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <motion.button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 pt-2 pb-3 space-y-1 bg-white shadow-lg">
                {['Features', 'Templates', 'Pricing', 'About'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-4 space-y-2">
                  <button
                    className="w-full px-3 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50"
                    onClick={() => handleAuth('signin')}
                  >
                    Sign In
                  </button>
                  <button
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => handleAuth('signup')}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div 
              className="lg:w-1/2"
              variants={itemVariants}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Create Your Perfect
                <span className="text-blue-600 block">Professional Resume</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Stand out from the crowd with AI-powered resume building. Create ATS-optimized resumes with professional templates and expert advice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-xl hover:bg-blue-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/build-resume')}
                >
                  Build My Resume
                  <ChevronRight className="inline-block ml-2" />
                </motion.button>
                <motion.button
                  className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Templates
                </motion.button>
              </div>
            </motion.div>

            <motion.div 
              className="lg:w-1/2"
              variants={itemVariants}
            >
              <div className="relative">
                <motion.img
                  src="/resume-preview.png"
                  alt="Resume Preview"
                  className="rounded-lg shadow-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                />
                <motion.div
                  className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center gap-2">
                    <Award className="text-blue-600" />
                    <span className="font-semibold">ATS-Optimized</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
            variants={containerVariants}
          >
            {[
              { number: '200K+', label: 'Resumes Created' },
              { number: '92%', label: 'ATS Pass Rate' },
              { number: '75%', label: 'Interview Success' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg text-center"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <motion.h3
                  className="text-3xl font-bold text-blue-600 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  {stat.number}
                </motion.h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Your Success
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to create a professional resume and land your dream job.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="w-8 h-8 text-blue-600" />,
                title: 'AI-Powered Content',
                description: 'Get tailored suggestions for skills, achievements, and job descriptions.',
              },
              {
                icon: <Briefcase className="w-8 h-8 text-blue-600" />,
                title: 'ATS-Friendly Templates',
                description: 'Ensure your resume gets past applicant tracking systems with our optimized templates.',
              },
              {
                icon: <Download className="w-8 h-8 text-blue-600" />,
                title: 'Easy Export',
                description: 'Download your resume in multiple formats including PDF, Word, and plain text.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20 bg-gray-50">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Professional Templates
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our collection of professionally designed templates.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((template) => (
              <motion.div
                key={template}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <img
                  src={`https://placehold.co/400x600/e2e8f0/1e40af?text=Template+${template}`}
                  alt={`Template ${template}`}
                  className="w-full h-80 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Template {template}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Professional and modern design perfect for any industry.
                  </p>
                  <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                    Use This Template
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Free',
                price: '$0',
                features: ['3 resume exports', 'Basic templates', 'Job suggestions'],
              },
              {
                name: 'Premium',
                price: '$12',
                features: ['Unlimited exports', 'All premium templates', 'AI content assistance'],
                popular: true,
              },
              {
                name: 'Team',
                price: '$49',
                features: ['Everything in Premium', '5 team members', 'API access'],
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                className={`bg-white rounded-xl p-8 ${
                  plan.popular
                    ? 'border-2 border-blue-600 shadow-xl relative'
                    : 'border border-gray-200 shadow-lg'
                }`}
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-xl rounded-tr-xl text-sm font-semibold">
                    Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-4xl font-bold text-gray-900 mb-6">
                  {plan.price}
                  <span className="text-lg text-gray-500">/month</span>
                </p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <Award className="w-5 h-5 text-blue-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <motion.button
                  className={`w-full py-3 rounded-lg font-semibold ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                  } transition-colors`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <FileText className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">ResumeBuilder</span>
              </div>
              <p className="text-gray-400">
                Create professional resumes in minutes with our AI-powered platform.
              </p>
            </div>
            {['Product', 'Company', 'Resources'].map((section) => (
              <div key={section}>
                <h4 className="text-lg font-semibold mb-4">{section}</h4>
                <ul className="space-y-2">
                  {['Features', 'Pricing', 'About', 'Contact'].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} ResumeBuilder. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default LandingPage;
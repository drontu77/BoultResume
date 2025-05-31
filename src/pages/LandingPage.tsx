import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import '../styles/LandingPage.css'; // Assuming this contains necessary global styles and feature icon styles

// --- Constants & Data ---

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Templates', href: '#templates' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '/about' }, // Assuming 'About' might be a separate page
];

const Paths = {
  HOME: '/',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  BUILD_RESUME: '/build-resume',
  TEMPLATES: '/templates',
  CONTACT_SALES: '/contact-sales',
  BLOG: '/blog',
  TIPS: '/tips',
  CAREERS: '/careers',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  COOKIES: '/cookies',
};

interface Stat {
  id: string;
  number: string;
  label: string;
}

const HERO_STATS: Stat[] = [
  { id: 'stat1', number: '200K+', label: 'Resumes Created' },
  { id: 'stat2', number: '92%', label: 'ATS Pass Rate' },
  { id: 'stat3', number: '75%', label: 'Interview Success' },
];

interface Feature {
  id: string;
  iconClass: string; // CSS class for the icon
  title: string;
  description: string;
}

const FEATURES_DATA: Feature[] = [
  { id: 'feat1', iconClass: 'ai', title: 'AI-Powered Content', description: 'Get tailored suggestions for skills, achievements, and job descriptions.' },
  { id: 'feat2', iconClass: 'templates', title: 'Premium Templates', description: 'Choose from dozens of professionally designed, ATS-friendly templates.' },
  { id: 'feat3', iconClass: 'jobs', title: 'Job Matching', description: 'Find relevant job listings based on your location and experience.' },
  { id: 'feat4', iconClass: 'export', title: 'Multiple Export Options', description: 'Download as PDF, DOCX, or share a direct link to your resume.' },
];

interface TemplateExample {
  id: string;
  imgSrc: string;
  alt: string;
  name: string;
}

const TEMPLATE_EXAMPLES: TemplateExample[] = [
  { id: 'tmpl1', imgSrc: '/templates/template-1.png', alt: 'Professional Resume Template', name: 'Professional' },
  { id: 'tmpl2', imgSrc: '/templates/template-2.png', alt: 'Creative Resume Template', name: 'Creative' },
  { id: 'tmpl3', imgSrc: '/templates/template-3.png', alt: 'Executive Resume Template', name: 'Executive' },
  { id: 'tmpl4', imgSrc: '/templates/template-4.png', alt: 'Modern Resume Template', name: 'Modern' },
];

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  billingCycle: string;
  features: string[];
  ctaText: string;
  ctaPath: string;
  isPopular?: boolean;
  ctaVariant?: 'primary' | 'secondary';
}

const PRICING_PLANS: PricingPlan[] = [
  { id: 'free', name: 'Free', price: '$0', billingCycle: 'Forever', features: ['3 resume exports', 'Basic templates', 'Job suggestions', '24-hour support'], ctaText: 'Get Started', ctaPath: Paths.SIGN_UP, ctaVariant: 'secondary' },
  { id: 'premium', name: 'Premium', price: '$12', billingCycle: 'Per month', features: ['Unlimited exports', 'All premium templates', 'AI content assistance', 'Priority support', 'Job application tracking'], ctaText: 'Start Premium', ctaPath: `${Paths.SIGN_UP}?plan=premium`, isPopular: true, ctaVariant: 'primary' },
  { id: 'team', name: 'Team', price: '$49', billingCycle: 'Per month', features: ['Everything in Premium', '5 team members', 'Team templates', 'Admin dashboard', 'API access'], ctaText: 'Contact Sales', ctaPath: Paths.CONTACT_SALES, ctaVariant: 'secondary' },
];


interface FooterLinkGroup {
  id: string;
  title: string;
  links: Array<{ id: string; label: string; href: string; isExternal?: boolean }>;
}

const FOOTER_LINKS_DATA: FooterLinkGroup[] = [
  { id: 'product', title: 'Product', links: [
    { id: 'fl1', label: 'Features', href: '#features' },
    { id: 'fl2', label: 'Templates', href: '#templates' },
    { id: 'fl3', label: 'Pricing', href: '#pricing' },
  ]},
  { id: 'resources', title: 'Resources', links: [
    { id: 'fl4', label: 'Blog', href: Paths.BLOG },
    { id: 'fl5', label: 'Resume Tips', href: Paths.TIPS },
    { id: 'fl6', label: 'Career Advice', href: '/advice' },
  ]},
  { id: 'company', title: 'Company', links: [
    { id: 'fl7', label: 'About Us', href: '/about' },
    { id: 'fl8', label: 'Careers', href: Paths.CAREERS },
    { id: 'fl9', label: 'Contact', href: Paths.CONTACT },
  ]},
  { id: 'legal', title: 'Legal', links: [
    { id: 'fl10', label: 'Privacy Policy', href: Paths.PRIVACY },
    { id: 'fl11', label: 'Terms of Service', href: Paths.TERMS },
    { id: 'fl12', label: 'Cookie Policy', href: Paths.COOKIES },
  ]},
];

// --- Animation Variants ---
const commonViewport = { once: true, amount: 0.2 };

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const heroImageVariants: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2 } },
};

// --- SVG Icon Components (Examples) ---
const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8 text-blue-600" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const MenuIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6 text-gray-700" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6 text-gray-700" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);


// --- Reusable UI Components ---

interface SectionProps {
  id: string;
  className?: string;
  ariaLabelledBy: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, className, ariaLabelledBy, children }) => (
  <motion.section
    id={id}
    className={className}
    role="region"
    aria-labelledby={ariaLabelledBy}
    initial="hidden"
    whileInView="visible"
    viewport={commonViewport}
    variants={containerVariants}
  >
    <div className="container mx-auto px-4">
      {children}
    </div>
  </motion.section>
);

interface SectionHeadingProps {
  id: string;
  title: string;
  subtitle?: string;
  className?: string;
}
const SectionHeading: React.FC<SectionHeadingProps> = React.memo(({ id, title, subtitle, className = "text-center mb-12" }) => (
  <motion.div className={className} variants={itemVariants}>
    <h2 id={id} className="text-3xl md:text-4xl font-bold">{title}</h2>
    {subtitle && <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
  </motion.div>
));


interface NavLinkProps {
  href: string;
  label: string;
  delay?: number;
  onClick?: () => void;
}
const NavLink: React.FC<NavLinkProps> = React.memo(({ href, label, delay = 0, onClick }) => (
  <motion.a
    href={href}
    className="text-gray-600 hover:text-blue-600 transition-colors"
    whileHover={{ scale: 1.05 }}
    variants={navItemVariants}
    transition={{ delay }}
    onClick={onClick}
  >
    {label}
  </motion.a>
));

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  whileHover?: object;
  whileTap?: object;
  className?: string;
  motionProps?: any;
}

const Button: React.FC<ButtonProps> = React.memo(({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  whileHover = { scale: 1.05 },
  whileTap = { scale: 0.95 },
  className = '',
  motionProps,
  ...props
}) => {
  const baseStyle = "font-medium rounded-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    outline: "border-2 border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 focus:ring-blue-500",
    text: "text-gray-600 hover:text-blue-600",
  };
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={onClick}
      whileHover={whileHover}
      whileTap={whileTap}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  );
});


// --- Landing Page Component ---
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleMobileNavLinkClick = (path: string) => {
    closeMobileMenu();
    if (path.startsWith('#')) {
      // For in-page links, ensure smooth scroll if not handled by browser
      document.querySelector(path)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };
  
  const handleNavLinkClick = (path: string) => {
     if (path.startsWith('#')) {
        const element = document.querySelector(path);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
     } else {
        navigate(path);
     }
  };


  // --- Section Components ---

  const HeaderSection: React.FC = () => (
    <motion.header
      className="hero"
      initial="hidden"
      animate="visible" // Animate on mount
      variants={containerVariants}
    >
      {/* Navbar */}
      <motion.nav
        className="navbar container mx-auto px-4 flex items-center justify-between py-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }} // Slight delay for nav after page load
      >
        <motion.div
          className="logo flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(Paths.HOME)}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <LogoIcon />
          <span className="text-xl font-bold text-gray-800">ResumeBuilder</span>
        </motion.div>

        {/* Desktop Links */}
        <div className="nav-links hidden md:flex items-center space-x-6 lg:space-x-8">
          {NAV_LINKS.map((link, idx) => (
            <NavLink key={link.label} href={link.href} label={link.label} delay={idx * 0.1} onClick={() => handleNavLinkClick(link.href)} />
          ))}
          <Button variant="secondary" size="md" onClick={() => navigate(Paths.SIGN_IN)} motionProps={{variants: navItemVariants, transition:{delay: NAV_LINKS.length * 0.1}}}>
            Sign In
          </Button>
          <Button variant="primary" size="md" onClick={() => navigate(Paths.SIGN_UP)} motionProps={{variants: navItemVariants, transition:{delay: (NAV_LINKS.length + 1) * 0.1}}}>
            Get Started
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </motion.nav>

      {/* Mobile Menu (conditionally rendered with AnimatePresence) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu md:hidden bg-white shadow-lg absolute top-16 left-0 right-0 z-50" // Adjusted for better overlay
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex flex-col p-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                  onClick={() => handleMobileNavLinkClick(link.href)}
                >
                  {link.label}
                </a>
              ))}
              <Button variant="outline" size="md" className="w-full mt-2" onClick={() => { closeMobileMenu(); navigate(Paths.SIGN_IN); }}>
                Sign In
              </Button>
              <Button variant="primary" size="md" className="w-full" onClick={() => { closeMobileMenu(); navigate(Paths.SIGN_UP); }}>
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Content */}
      <div className="hero-content container mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-8 py-12 md:py-20">
        <motion.div className="hero-text w-full md:w-1/2" variants={containerVariants}>
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-800"
          >
            Get hired at{' '}
            <span className="text-blue-600 relative inline-block">
              top companies
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-2 bg-blue-200 -z-10"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.5, ease: "circOut" }} // Enhanced animation
              />
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl">
            Stand out from the crowd with AI-powered resume building. Create ATS-optimized resumes with professional templates and expert advice.
          </motion.p>

          <motion.div className="mt-8 flex flex-col sm:flex-row gap-4" variants={itemVariants}>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(Paths.BUILD_RESUME)}
              aria-label="Build My Resume"
              className="shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 20px -5px rgba(66, 153, 225, 0.5)' }}
            >
              Build My Resume <ArrowRightIcon />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(Paths.TEMPLATES)}
              aria-label="View Templates"
              className="flex items-center justify-center gap-2"
            >
              View Templates <ChevronRightIcon />
            </Button>
          </motion.div>

          <motion.div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8" variants={containerVariants}>
            {HERO_STATS.map((stat, index) => (
              <motion.div
                key={stat.id}
                className="text-center p-2"
                variants={itemVariants}
                whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 300 } }}
              >
                <div className="text-4xl font-bold text-blue-600">
                  {stat.number}
                </div>
                <div className="text-gray-600 mt-1 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="hero-image w-full md:w-1/2" variants={heroImageVariants}>
          <img
            src="/resume-preview.png" // Ensure this path is correct (e.g., in /public)
            alt="Resume Preview"
            className="w-full h-auto rounded-lg shadow-2xl object-cover" // Added object-cover
            loading="lazy"
          />
        </motion.div>
      </div>
    </motion.header>
  );

  interface FeatureCardProps extends Feature {}
  const FeatureCard: React.FC<FeatureCardProps> = React.memo(({ iconClass, title, description }) => (
    <motion.div
      className="feature-card p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
      variants={itemVariants}
      whileHover={{ y: -5 }}
    >
      {/* Ensure your CSS defines these classes with actual icons (SVG, font icon, or background image) */}
      <div className={`feature-icon ${iconClass} text-4xl text-blue-600 mb-4 mx-auto`} aria-hidden="true">
         {/* Example: if using Heroicons or similar as components: <SparklesIcon className="w-10 h-10 text-blue-600" /> */}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.div>
  ));

  const FeaturesSection: React.FC = () => (
    <Section id="features" className="features py-16 lg:py-24 bg-gray-50" ariaLabelledBy="features-heading">
      <SectionHeading
        id="features-heading"
        title="Powerful features to build your career"
        subtitle="Everything you need to create a professional resume and land your dream job."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
        {FEATURES_DATA.map(feature => <FeatureCard key={feature.id} {...feature} />)}
      </div>
    </Section>
  );

  interface TemplateShowcaseCardProps extends TemplateExample {}
  const TemplateShowcaseCard: React.FC<TemplateShowcaseCardProps> = React.memo(({ imgSrc, alt, name }) => (
    <motion.div
      className="template text-center group"
      variants={itemVariants}
      whileHover={{ scale: 1.03 }}
    >
      <div className="template-card overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300 mb-4 border border-gray-200">
        <img src={imgSrc} alt={alt} className="w-full h-auto aspect-[3/4] object-cover object-top" loading="lazy" />
      </div>
      <h4 className="text-lg font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{name}</h4>
    </motion.div>
  ));
  
  const TemplatesSection: React.FC = () => (
    <Section id="templates" className="templates-preview py-16 lg:py-24 bg-white" ariaLabelledBy="templates-heading">
      <SectionHeading
        id="templates-heading"
        title="Professional templates for every career stage"
        subtitle="Choose the perfect design to highlight your unique skills and experience."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
        {TEMPLATE_EXAMPLES.map(template => <TemplateShowcaseCard key={template.id} {...template} />)}
      </div>
      <motion.div className="text-center mt-12" variants={itemVariants}>
        <Button variant="outline" size="lg" onClick={() => navigate(Paths.TEMPLATES)}>
          View All Templates
        </Button>
      </motion.div>
    </Section>
  );

  interface PricingCardProps extends PricingPlan {}
  const PricingCard: React.FC<PricingCardProps> = React.memo(({ name, price, billingCycle, features, ctaText, ctaPath, isPopular, ctaVariant = 'secondary' }) => (
    <motion.div
      className={`pricing-card bg-white rounded-lg shadow-lg p-6 flex flex-col ${isPopular ? 'border-2 border-blue-600 relative hover:shadow-2xl' : 'hover:shadow-xl'} transition-shadow duration-300`}
      variants={itemVariants}
      whileHover={{ y: isPopular ? -8 : -5 }}
    >
      {isPopular && (
        <div className="ribbon absolute top-0 -right-0.5 bg-blue-600 text-white text-xs font-semibold px-3 py-1 transform translate-x-0 -translate-y-1/2 rounded-full shadow-md">
          POPULAR
        </div>
      )}
      <div className="card-header text-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">{name}</h3>
        <p className="price text-5xl font-bold text-gray-900 my-2">{price}</p>
        <p className="billing-cycle text-gray-500">{billingCycle}</p>
      </div>
      <ul className="features-list mb-8 space-y-3 text-gray-600 flex-1">
        {features.map(feature => (
          <li key={feature} className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
            {feature}
          </li>
        ))}
      </ul>
      <Button
        variant={ctaVariant}
        size="md"
        className="w-full mt-auto"
        onClick={() => navigate(ctaPath)}
      >
        {ctaText}
      </Button>
    </motion.div>
  ));

  const PricingSection: React.FC = () => (
    <Section id="pricing" className="pricing py-16 lg:py-24 bg-gray-50" ariaLabelledBy="pricing-heading">
      <SectionHeading
        id="pricing-heading"
        title="Simple, transparent pricing"
        subtitle="No hidden fees or complicated tiers. Just what you need to succeed."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
        {PRICING_PLANS.map(plan => <PricingCard key={plan.id} {...plan} />)}
      </div>
    </Section>
  );
  
  const SocialIconLink: React.FC<{ href: string; label: string; children: React.ReactNode }> = ({ href, label, children }) => (
    <a href={href} aria-label={label} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
        {children}
    </a>
  );

  const FooterSection: React.FC = () => (
    <motion.footer 
        className="footer bg-white border-t border-gray-200 py-12 lg:py-16"
        initial="hidden"
        whileInView="visible"
        viewport={commonViewport}
        variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
            <motion.div className="md:col-span-2 footer-logo mb-6 md:mb-0" variants={itemVariants}>
                <div className="flex items-center gap-2 mb-3">
                    {/* Assuming you have a logo.svg in your public folder */}
                    <img src="/logo.svg" alt="ResumeBuilder Logo" className="w-8 h-8" /> 
                    <span className="text-xl font-bold text-gray-800">ResumeBuilder</span>
                </div>
                <p className="text-gray-600 text-sm max-w-xs">
                    Crafting professional resumes to help you land your dream job.
                </p>
            </motion.div>

          {FOOTER_LINKS_DATA.map(group => (
            <motion.div key={group.id} className="link-group" variants={itemVariants}>
              <h4 className="font-semibold text-gray-800 mb-3">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map(link => (
                  <li key={link.id}>
                    <a href={link.href} className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors" target={link.isExternal ? '_blank' : undefined} rel={link.isExternal ? 'noopener noreferrer' : undefined}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div 
            className="mt-8 border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500"
            variants={itemVariants}
        >
          <p>&copy; {currentYear} ResumeBuilder Inc. All rights reserved.</p>
          <div className="social-links flex items-center space-x-5 mt-4 md:mt-0">
            <SocialIconLink href="https://twitter.com/yourprofile" label="Twitter">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 002.048-2.578 9.3 9.3 0 01-2.958 1.13 4.66 4.66 0 00-7.938 4.25 13.229 13.229 0 01-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.66 4.66 0 003.96 9.824a4.647 4.647 0 01-2.11-.583v.06a4.66 4.66 0 003.737 4.568 4.692 4.692 0 01-2.104.08 4.661 4.661 0 004.35 3.234 9.348 9.348 0 01-5.786 1.995 9.5 9.5 0 01-1.112-.065 13.175 13.175 0 007.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602a9.47 9.47 0 002.323-2.41z"></path></svg>
            </SocialIconLink>
            {/* Add other social icons similarly */}
            <SocialIconLink href="https://facebook.com/yourprofile" label="Facebook">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
            </SocialIconLink>
            <SocialIconLink href="https://linkedin.com/in/yourprofile" label="LinkedIn">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>
            </SocialIconLink>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );

  return (
    <div className="landing-page bg-white antialiased text-gray-700">
      <HeaderSection />
      <main>
        <FeaturesSection />
        <TemplatesSection />
        <PricingSection />
        {/* Add other sections like Testimonials, CTA, etc. following the same pattern */}
      </main>
      <FooterSection />
    </div>
  );
};

export default LandingPage;
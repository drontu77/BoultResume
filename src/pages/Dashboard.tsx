import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useResume } from '../contexts/ResumeContext';
import { templates } from '../data/templates';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

// Lazy load components for better performance
const AIAssistant = lazy(() => import('../components/ai/AIAssistant'));
const JobSuggestions = lazy(() => import('../components/jobs/JobSuggestions'));

interface DashboardProps {
  onResumeEdit: (resumeId: string) => void;
  onCreateNewResume: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onResumeEdit, onCreateNewResume }) => {
  const { resume } = useResume();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [showUpgradeTooltip, setShowUpgradeTooltip] = useState(false);
  
  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && !sidebarOpen) setSidebarOpen(true);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Calculate resume completion percentage - memoized for performance
  const calculateCompletion = useMemo(() => {
    let score = 16; // Base score
    if (resume.personalDetails.firstName && resume.personalDetails.lastName) score += 5;
    if (resume.personalDetails.jobTitle) score += 10;
    if (resume.personalDetails.email && resume.personalDetails.phone) score += 10;
    if (resume.personalDetails.address) score += 5;
    if (resume.employmentHistory.length > 0) score += 25;
    if (resume.education.length > 0) score += 15;
    if (resume.skills.length > 0) score += 10;
    if (resume.summary && resume.summary.length > 50) score += 5;
    return Math.min(score, 100);
  }, [resume.personalDetails, resume.employmentHistory.length, resume.education.length, resume.skills.length, resume.summary]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}, ${date.toLocaleString('default', { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Get the current template
  const currentTemplate = templates.find(t => t.id === resume.templateId) || templates[0];

  // Toggle sidebar for mobile view
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Handle upgrade click
  const handleUpgradeClick = () => {
    window.open('/pricing', '_blank');
  };
  
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 relative overflow-hidden">
      {/* Mobile header */}
      {isMobile && (
        <div className="dashboard-header">
          <button className="p-2" onClick={toggleSidebar}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {resume.personalDetails.firstName ? resume.personalDetails.firstName.charAt(0) : 'U'}
            </div>
            <span className="font-medium">
              {resume.personalDetails.firstName ? resume.personalDetails.firstName : 'User'}
            </span>
          </div>
          {/* Mobile Upgrade button */}
          <button 
            className="btn-upgrade btn-sm"
            onClick={handleUpgradeClick}
            aria-label="Upgrade to Pro version"
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            Upgrade
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div 
        className={`${isMobile ? 'fixed inset-0 z-20 transform transition-transform duration-300 ease-in-out' : 'md:relative'} 
                   ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                   md:translate-x-0 md:w-64 bg-white border-r border-gray-200 flex flex-col dashboard-sidebar`}
      >
        {/* Overlay for mobile */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 z-10" 
            onClick={toggleSidebar}
          ></div>
        )}
        
        {/* Close button for mobile */}
        {isMobile && (
          <button 
            className="absolute top-2 right-2 p-2 rounded-full bg-gray-100 text-gray-600"
            onClick={toggleSidebar}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* User profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
              {resume.personalDetails.firstName ? resume.personalDetails.firstName.charAt(0) : 'U'}
            </div>
            <div className="ml-3">
              <div className="font-medium">
                {resume.personalDetails.firstName 
                  ? `${resume.personalDetails.firstName} ${resume.personalDetails.lastName}`
                  : 'User Profile'}
              </div>
              <div className="text-sm text-gray-500">
                {resume.personalDetails.jobTitle || 'Set your target role'}
              </div>
            </div>
            <div className="ml-2 p-1 bg-rose-100 text-rose-500 rounded-md text-xs font-semibold">
              {calculateCompletion}%
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex-1 overflow-y-auto">
          <div className="px-4 py-2">
            <div className="text-xs font-semibold text-gray-400  uppercase tracking-wider mb-2">
              Main
            </div>
            <ul>
              <li>
                <a href="#" className="flex items-center px-4 py-3 text-blue-600 bg-blue-50 rounded-md font-medium">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-md">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Documents
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-md">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Jobs
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-md">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Job Tracker
                </a>
              </li>
            </ul>
          </div>
          
          <div className="px-4 py-2 mt-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Tools
            </div>
            <ul>
              <li>
                <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-md">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Interview Prep
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-md">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Salary Analyzer
                </a>
              </li>
            </ul>
          </div>
        </nav>
        
        {/* Logout Button */}
        <div className="sidebar-bottom">
          <Link to="/" className="btn-logout">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4 md:p-8">
        {/* Upgrade Now Button - Top Right (hidden on mobile as it's in the header) */}
        {!isMobile && (
          <div className="absolute top-4 right-8 z-10">
            <div 
              className="relative group"
              onMouseEnter={() => setShowUpgradeTooltip(true)}
              onMouseLeave={() => setShowUpgradeTooltip(false)}
            >
              <button 
                className="btn-upgrade"
                onClick={handleUpgradeClick}
                aria-label="Upgrade to Pro version"
              >
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                Upgrade Now
              </button>
              {showUpgradeTooltip && (
                <div className="absolute -bottom-24 right-0 bg-white py-2 px-3 rounded-lg shadow-xl text-sm text-gray-600 w-64">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Unlock Premium Features</p>
                      <p className="text-xs mt-1">Get access to AI assistance, premium templates, and more!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Your Resumes</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Current Resume Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="relative">
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  <img 
                    src={currentTemplate.thumbnail} 
                    alt="Resume preview" 
                    className="h-full object-contain"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const target = e.currentTarget;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEwIiBoZWlnaHQ9IjI5NyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjEwIiBoZWlnaHQ9IjI5NyIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIj5SZXNlbXVlPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
                <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                  {calculateCompletion}%
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 flex items-center">
                      {resume.personalDetails.firstName 
                        ? `${resume.personalDetails.firstName}'s Resume` 
                        : 'Untitled'} 
                      <button className="ml-2 text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </h3>
                    <p className="text-gray-500 text-sm">Updated {formatDate(resume.updatedAt)}</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <button 
                    onClick={() => onResumeEdit(resume.id)}
                    className="w-full flex items-center justify-center text-blue-600 py-2 px-4 border border-blue-600 rounded-md font-medium text-sm hover:bg-blue-50"
                  >
                    Continue Editing
                  </button>
                  
                  <button className="w-full flex items-center justify-center text-gray-600 py-2 px-4 border border-gray-300 rounded-md font-medium text-sm hover:bg-gray-50">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
            
            {/* Create New Resume Card */}
            <div 
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={onCreateNewResume}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 text-center">New Resume</h3>
              <p className="text-gray-500 text-sm text-center mt-2">
                Create a tailored resume for each job application. Double your chances of getting hired!
              </p>
            </div>
          </div>
          
          {/* Job Suggestions Section */}
          <div className="mt-6 md:mt-8">
            <Suspense fallback={<div className="p-4 bg-white rounded-lg shadow text-center">Loading job suggestions...</div>}>
              <JobSuggestions 
                jobTitle={resume.personalDetails.jobTitle}
                city={resume.personalDetails.city}
                country={resume.personalDetails.country}
                location={resume.personalDetails.address}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* AI Assistant - Lazy loaded */}
      <Suspense fallback={<div className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-blue-100 animate-pulse"></div>}>
        <AIAssistant />
      </Suspense>
    </div>
  );
};

export default Dashboard;
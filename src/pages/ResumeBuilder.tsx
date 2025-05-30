import React, { useState, useEffect, useRef } from 'react';
import PersonalDetailsForm from '../components/resume/PersonalDetailsForm';
import EmploymentHistoryForm from '../components/resume/EmploymentHistoryForm';
import EducationForm from '../components/resume/EducationForm';
import SkillsForm from '../components/resume/SkillsForm';
import SummaryForm from '../components/resume/SummaryForm';
import TemplateSelection from '../components/resume/TemplateSelection';
import AdditionalSectionsForm from '../components/resume/AdditionalSectionsForm';
import { ResumeProvider } from '../contexts/ResumeContext';
import { TemplateProvider } from '../contexts/TemplateContext';
import { templates } from '../data/templates';
import { useResume } from '../contexts/ResumeContext';

type ViewMode = 'editor' | 'templateSelector';

interface ResumeBuilderProps {
  onDashboardClick?: () => void;
  isNewResume?: boolean;
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ onDashboardClick, isNewResume = false }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [previewScale, setPreviewScale] = useState(0.7);
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  
  const ResumeContent = () => {
    const { resume } = useResume();
    const template = templates.find(t => t.id === resume.templateId) || templates[0];
    const TemplateComponent = template.component;
    const previewContainerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const formContainerRef = useRef<HTMLDivElement>(null);

    // Handle scroll effect on sticky header
    useEffect(() => {
      const handleScroll = () => {
        if (formContainerRef.current && headerRef.current) {
          if (formContainerRef.current.scrollTop > 10) {
            headerRef.current.classList.add('scrolled');
          } else {
            headerRef.current.classList.remove('scrolled');
          }
        }
      };

      const formContainer = formContainerRef.current;
      if (formContainer) {
        formContainer.addEventListener('scroll', handleScroll);
      }

      return () => {
        if (formContainer) {
          formContainer.removeEventListener('scroll', handleScroll);
        }
      };
    }, []);
    
    // Adjust preview scale based on container size
    useEffect(() => {
      const updatePreviewScale = () => {
        if (previewContainerRef.current) {
          const containerWidth = previewContainerRef.current.clientWidth;
          const containerHeight = previewContainerRef.current.clientHeight;
          
          // A4 dimensions (595 x 842 pixels at 72dpi)
          const aspectRatio = 842 / 595;
          
          // Calculate available space with minimal padding to maximize usage
          const availableWidth = containerWidth * 0.95;
          const availableHeight = containerHeight * 0.95;
          
          let newScale;
          
          // If width is the constraining factor
          if (availableWidth / availableHeight < 595 / 842) {
            newScale = availableWidth / 595;
          } else {
            // Height is the constraining factor
            newScale = availableHeight / 842;
          }
          
          // Set a reasonable scale based on screen size
          const maxScale = window.innerWidth >= 1920 ? 0.95 : 
                           window.innerWidth >= 1440 ? 0.85 : 0.75;
          
          setPreviewScale(Math.min(newScale, maxScale));
        }
      };

      // Initial update
      updatePreviewScale();
      
      // Update on resize and after a short delay to ensure proper rendering
      window.addEventListener('resize', updatePreviewScale);
      const delayedUpdate = setTimeout(updatePreviewScale, 500);
      
      return () => {
        window.removeEventListener('resize', updatePreviewScale);
        clearTimeout(delayedUpdate);
      };
    }, []);
    
    const renderStepContent = () => {
      switch (currentStep) {
        case 0:
          return <PersonalDetailsForm onNext={() => setCurrentStep(1)} />;
        case 1:
          return <EmploymentHistoryForm />;
        case 2:
          return <EducationForm />;
        case 3:
          return <SkillsForm />;
        case 4:
          return <SummaryForm />;
        case 5:
          return <AdditionalSectionsForm />;
        default:
          return <PersonalDetailsForm onNext={() => setCurrentStep(1)} />;
      }
    };
    
    const calculateCompletion = () => {
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
    };
    
    const getImprovement = () => {
      switch (currentStep) {
        case 0:
          return resume.personalDetails.jobTitle ? '' : '+10% Add job title';
        case 1:
          return resume.employmentHistory.length === 0 ? '+25% Add employment history' : '';
        case 2:
          return resume.education.length === 0 ? '+15% Add education' : '';
        case 3:
          return resume.skills.length === 0 ? '+10% Add skills' : '';
        case 4:
          return !resume.summary ? '+5% Add professional summary' : '';
        default:
          return '';
      }
    };

    const nextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };

    const prevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

    // Switch view mode
    const openTemplateSelector = () => setViewMode('templateSelector');
    const backToEditor = () => setViewMode('editor');

    // Get the next button text based on the current step
    const getNextButtonText = () => {
      switch (currentStep) {
        case 0:
          return "Next: Employment History";
        case 1:
          return "Next: Education";
        case 2:
          return "Next: Skills";
        case 3:
          return "Next: Summary";
        case 4:
          return "Additional Section";
        case 5:
          return "Finish";
        default:
          return "Next";
      }
    };

    // Handle navigation to next step
    const handleNextStep = () => {
      if (currentStep === 5) {
        // When on Additional Sections page and user clicks Finish, go to template selector
        setViewMode('templateSelector');
      } else if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      }
    };

    // Handle navigation to previous step
    const handlePreviousStep = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    };

    // If we're in template selector mode, render the template selection UI
    if (viewMode === 'templateSelector') {
      return <TemplateSelection onBack={backToEditor} />;
    }

    // Otherwise, render the editor/preview layout
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
        {/* Left panel - Form */}
        <div className="w-1/2 flex flex-col overflow-hidden border-r border-gray-200 bg-white">
          {/* Sticky header for resume score and improvement */}
          <div ref={headerRef} className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
            {/* Dashboard button and Resume score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm mr-3"
                  onClick={onDashboardClick}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Dashboard
                </button>
                <div className="bg-rose-500 text-white px-2 py-0.5 text-sm font-medium rounded">
                  {calculateCompletion()}%
                </div>
                <div className="text-gray-500 text-sm">Resume Progress Status</div>
              </div>
              {getImprovement() && (
                <div className="text-green-600 text-sm font-medium">
                  {getImprovement()}
                </div>
              )}
            </div>
            
            {/* Progress bar */}
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-rose-500 transition-all duration-300 ease-in-out"
                style={{ width: `${calculateCompletion()}%` }}
              />
            </div>
          </div>

          <div ref={formContainerRef} className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Form content */}
              <div className="bg-white">
                {renderStepContent()}
              </div>
            </div>
          </div>

          {/* Fixed navigation at the bottom */}
          <div className="border-t border-gray-100 pt-3 pb-4 px-6 bg-white">
            <div className="flex justify-center mb-4">
              {/* Progress dots */}
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4, 5].map((step) => (
                  <div 
                    key={step} 
                    className={`w-2 h-2 rounded-full mx-1 ${
                      step === currentStep 
                        ? 'bg-blue-500' 
                        : step < currentStep
                          ? 'bg-blue-500/50'
                          : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePreviousStep}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-medium text-sm rounded-md hover:bg-gray-200 focus:outline-none transition-colors duration-200 flex-1"
                >
                  Back
                </button>
              )}
              
              <button
                onClick={handleNextStep}
                className="px-6 py-3 bg-blue-500 text-white font-medium text-sm rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex-1"
              >
                {getNextButtonText()}
              </button>
            </div>
          </div>
        </div>

        {/* Right panel - Preview */}
        <div className="w-1/2 flex-1 bg-[#f1f1f4] overflow-hidden">
          <div className="w-full h-full flex items-center justify-center p-6 relative bg-[#f1f1f4]">
            {/* Template change button - positioned at top left */}
            <div className="absolute top-4 left-4 z-10">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors shadow-md"
                onClick={openTemplateSelector}
              >
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Change template
              </button>
            </div>

            {/* Resume preview container */}
            <div 
              ref={previewContainerRef} 
              className="flex-1 flex items-center justify-center w-full h-full bg-[#f1f1f4]"
            >
              <div 
                className="bg-white shadow-xl max-w-full max-h-full"
                style={{ 
                  width: `${595 * previewScale}px`,
                  height: `${842 * previewScale}px`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top left',
                  width: '595px',
                  height: '842px'
                }}>
                  <TemplateComponent resume={resume} scale={1} />
                </div>
              </div>
            </div>

            {/* Page navigation - positioned at bottom center */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex items-center bg-gray-200 rounded-full px-2 py-1 shadow-md">
                <button 
                  className={`p-2 rounded-md hover:bg-gray-100 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500'}`}
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="black" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <div className="mx-4 text-sm font-medium text-gray-600">
                  {currentPage} / {totalPages}
                </div>
                <button 
                  className={`p-2 rounded-md hover:bg-gray-100 ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500'}`}
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="black" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Saved indicator */}
            <div 
              id="save-indicator" 
              className="absolute bottom-4 left-4 flex items-center gap-2 text-sm text-gray-500 transition-opacity duration-300 opacity-0 bg-white p-2 rounded-md shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span>Saved</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <ResumeProvider>
      <TemplateProvider>
        <ResumeContent />
      </TemplateProvider>
    </ResumeProvider>
  );
};

export default ResumeBuilder;
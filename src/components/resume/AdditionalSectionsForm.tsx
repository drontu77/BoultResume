import React, { useState } from 'react';
import { useResume } from '../../contexts/ResumeContext';
import CertificationsForm from './CertificationsForm';
import ProjectsForm from './ProjectsForm';
import CustomSectionForm from './CustomSectionForm';
import InternshipsForm from './InternshipsForm';
import HobbiesForm from './HobbiesForm';
import LanguagesForm from './LanguagesForm';

interface AdditionalSectionsFormProps {}

type SectionType = 'custom' | 'certifications' | 'projects' | 'internships' | 'hobbies' | 'languages';

const AdditionalSectionsForm: React.FC<AdditionalSectionsFormProps> = () => {
  const { resume, dispatch } = useResume();
  
  // State to track which section form is currently active
  const [activeSection, setActiveSection] = useState<SectionType | null>(null);
  // State for custom section being edited
  const [customSectionId, setCustomSectionId] = useState<string | null>(null);
  
  // Filter valid custom sections (ones with title or items)
  const validCustomSections = resume.customSections?.filter(section => 
    section.title?.trim() || section.items?.length > 0
  ) || [];
  
  // Check if sections already exist in resume
  const hasCustomSections = validCustomSections.length > 0;
  const hasCertifications = resume.certifications && resume.certifications.length > 0;
  const hasProjects = resume.projects && resume.projects.length > 0;
  const hasInternships = resume.internships && resume.internships.length > 0;
  const hasHobbies = resume.hobbies && resume.hobbies.length > 0;
  const hasLanguages = resume.languages && resume.languages.length > 0;

  // State to track if we're showing the custom sections selection screen
  const [showingCustomSections, setShowingCustomSections] = useState(false);

  const handleSectionSelect = (sectionType: SectionType) => {
    // If selecting custom, show the custom sections selection screen
    if (sectionType === 'custom') {
      if (hasCustomSections) {
        // Show selection screen if there are existing custom sections
        setShowingCustomSections(true);
      } else {
        // Create a new section if none exist
        const newSectionId = crypto.randomUUID();
        
        // Add the section to the resume data model
        const customSections = resume.customSections || [];
        dispatch({
          type: 'UPDATE_CUSTOM_SECTIONS',
          payload: [...customSections, { id: newSectionId, title: '', items: [] }]
        });
        
        // Set this section as active for editing
        setCustomSectionId(newSectionId);
        setActiveSection('custom');
      }
    } else {
      // For other section types, just activate that section
      setActiveSection(sectionType);
      
      // Initialize the section in the resume data model if it doesn't exist
      if (sectionType === 'certifications' && !hasCertifications) {
        dispatch({
          type: 'UPDATE_CERTIFICATIONS',
          payload: []
        });
      } else if (sectionType === 'projects' && !hasProjects) {
        dispatch({
          type: 'UPDATE_PROJECTS',
          payload: []
        });
      } else if (sectionType === 'internships' && !hasInternships) {
        dispatch({
          type: 'UPDATE_INTERNSHIPS',
          payload: []
        });
      } else if (sectionType === 'hobbies' && !hasHobbies) {
        dispatch({
          type: 'UPDATE_HOBBIES',
          payload: []
        });
      } else if (sectionType === 'languages' && !hasLanguages) {
        dispatch({
          type: 'UPDATE_LANGUAGES',
          payload: []
        });
      }
    }
  };
  
  // Handle editing an existing custom section
  const handleEditCustomSection = (sectionId: string) => {
    setCustomSectionId(sectionId);
    setActiveSection('custom');
    setShowingCustomSections(false);
  };
  
  // Handle creating a new custom section
  const handleCreateNewCustomSection = () => {
    const newSectionId = crypto.randomUUID();
    
    // Add the section to the resume data model
    const customSections = resume.customSections || [];
    dispatch({
      type: 'UPDATE_CUSTOM_SECTIONS',
      payload: [...customSections, { id: newSectionId, title: '', items: [] }]
    });
    
    // Set this section as active for editing
    setCustomSectionId(newSectionId);
    setActiveSection('custom');
    setShowingCustomSections(false);
  };
  
  // Handle deleting a custom section
  const handleDeleteCustomSection = (e: React.MouseEvent, sectionId: string) => {
    e.stopPropagation(); // Prevent the click from bubbling to the parent
    
    if (window.confirm('Are you sure you want to delete this section?')) {
      const updatedSections = resume.customSections?.filter(section => section.id !== sectionId) || [];
      dispatch({
        type: 'UPDATE_CUSTOM_SECTIONS',
        payload: updatedSections
      });
    }
  };
  
  // Go back to section selection
  const handleBackToSections = () => {
    setActiveSection(null);
    setCustomSectionId(null);
    setShowingCustomSections(false);
  };

  // Render the appropriate form component based on the active section
  const renderForm = () => {
    if (!activeSection) {
      return null;
    }

    switch (activeSection) {
      case 'certifications':
        return <CertificationsForm />;
      case 'projects':
        return <ProjectsForm />;
      case 'internships':
        return <InternshipsForm />;
      case 'hobbies':
        return <HobbiesForm />;
      case 'languages':
        return <LanguagesForm />;
      case 'custom':
        if (customSectionId) {
          return <CustomSectionForm sectionId={customSectionId} onClose={handleBackToSections} />;
        }
        return null;
      default:
        return null;
    }
  };

  // Get status badge for existing sections
  const getSectionStatusBadge = (exists: boolean | undefined) => {
    if (exists) {
      return (
        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          Added
        </span>
      );
    }
    return null;
  };

  return (
    <div className="max-w-3xl mx-auto">
      {activeSection === null && !showingCustomSections ? (
        // Section selection view
        <>
          <h3 className="text-xl font-semibold mb-6">Add Additional Sections</h3>
          <p className="text-gray-600 mb-6">
            Enhance your resume by adding specialized sections that highlight your skills and experiences.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Custom Section */}
            <div 
              className="flex items-center p-5 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all duration-200 group"
              onClick={() => handleSectionSelect('custom')}
            >
              <div className="mr-4 flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-gray-800 font-medium group-hover:text-blue-600 transition-colors duration-200">
                Custom Section
                {getSectionStatusBadge(hasCustomSections)}
              </span>
            </div>

            {/* Certifications */}
            <div 
              className="flex items-center p-5 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all duration-200 group"
              onClick={() => handleSectionSelect('certifications')}
            >
              <div className="mr-4 flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 14l9-5-9-5-9 5 9 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 11v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-gray-800 font-medium group-hover:text-blue-600 transition-colors duration-200">
                Certifications
                {getSectionStatusBadge(hasCertifications)}
              </span>
            </div>

            {/* Projects */}
            <div 
              className="flex items-center p-5 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all duration-200 group"
              onClick={() => handleSectionSelect('projects')}
            >
              <div className="mr-4 flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 4h2a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 2H9a1 1 0 00-1 1v2a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 12h3M8 16h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-gray-800 font-medium group-hover:text-blue-600 transition-colors duration-200">
                Projects
                {getSectionStatusBadge(hasProjects)}
              </span>
            </div>

            {/* Internships */}
            <div 
              className="flex items-center p-5 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all duration-200 group"
              onClick={() => handleSectionSelect('internships')}
            >
              <div className="mr-4 flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V8.00002C21 6.93915 20.7893 5.9 20.4 5.00002C20.1 4.10002 19.5 3.6 19 3.00002C18.5 2.40002 17.9 2.00002 17 2.00002H7C6.1 2.00002 5.5 2.40002 5 3.00002C4.5 3.60002 4 4.10002 3.6 5.00002C3.2 5.9 3 6.93915 3 8.00002V16C3 17.0609 3.42143 18.0783 4.17158 18.8284C4.92172 19.5786 5.93914 20 7 20H17C18.0609 20 19.0783 19.5786 19.8284 18.8284C20.5786 18.0783 21 17.0609 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 9.00002H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 14H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-gray-800 font-medium group-hover:text-blue-600 transition-colors duration-200">
                Internships
                {getSectionStatusBadge(hasInternships)}
              </span>
            </div>

            {/* Hobbies */}
            <div 
              className="flex items-center p-5 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all duration-200 group"
              onClick={() => handleSectionSelect('hobbies')}
            >
              <div className="mr-4 flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 11c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z" fill="currentColor"/>
                  <path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 15c-1.7 0-3-1.3-3-3 0-1.2.7-2.3 1.7-2.7L8.4 10c0-.1-.1-.1-.1-.2 0-1.1.9-2 2-2h3.4c1.1 0 2 .9 2 2 0 .1 0 .1-.1.2l-2.3 2.3c1 .4 1.7 1.5 1.7 2.7 0 1.7-1.3 3-3 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-gray-800 font-medium group-hover:text-blue-600 transition-colors duration-200">
                Hobbies
                {getSectionStatusBadge(hasHobbies)}
              </span>
            </div>

            {/* Languages */}
            <div 
              className="flex items-center p-5 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all duration-200 group"
              onClick={() => handleSectionSelect('languages')}
            >
              <div className="mr-4 flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 text-xl font-bold">
                <span className="flex items-center justify-center">
                  <span className="-mt-1">文</span>
                </span>
              </div>
              <span className="text-gray-800 font-medium group-hover:text-blue-600 transition-colors duration-200">
                Languages
                {getSectionStatusBadge(hasLanguages)}
              </span>
            </div>

            {/* Custom sections are now managed directly through the Custom Section option above */}
          </div>
        </>
      ) : showingCustomSections ? (
        // Custom sections selection view
        <div>
          <div className="flex items-center mb-6">
            <button
              type="button"
              onClick={handleBackToSections}
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Sections
            </button>
          </div>
          
          <h3 className="text-xl font-semibold mb-4">Custom Sections</h3>
          <p className="text-gray-600 mb-6">
            Select a custom section to edit or create a new one.
          </p>
          
          <div className="mb-6">
            <button
              onClick={handleCreateNewCustomSection}
              className="mb-4 w-full flex items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create New Custom Section</span>
            </button>
            
            {validCustomSections.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Your Custom Sections</h4>
                {validCustomSections.map(section => (
                  <div 
                    key={section.id}
                    className="flex justify-between items-center p-3 border border-gray-200 rounded-lg bg-white hover:border-blue-300 cursor-pointer"
                    onClick={() => handleEditCustomSection(section.id)}
                  >
                    <div className="flex items-center">
                      <div className="mr-3 text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                      </div>
                      <span>{section.title || 'Untitled Section'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">{section.items.length} items</span>
                      <button
                        onClick={(e) => handleDeleteCustomSection(e, section.id)}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full mr-2"
                        title="Delete section"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Active section form view
        <div>
          <div className="flex items-center mb-6">
            <button
              type="button"
              onClick={handleBackToSections}
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Sections
            </button>
          </div>
          
          {renderForm()}
        </div>
      )}
    </div>
  );
};

export default AdditionalSectionsForm;

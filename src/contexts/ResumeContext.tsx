import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { Resume, ResumeAction, FontSettings, PaperFormat } from '../types/resume';
import { v4 as uuidv4 } from 'uuid';

interface ResumeContextType {
  resume: Resume;
  dispatch: React.Dispatch<ResumeAction>;
}

const initialResume: Resume = {
  id: crypto.randomUUID(),
  personalDetails: {
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    phone: '',
    address: '',
    photo: ''
  },
  employmentHistory: [],
  education: [],
  skills: [],
  summary: '',
  templateId: 'toronto', // Default template
  accentColor: '#2563eb', // Default blue color
  fontSettings: {
    primary: 'Inter',
    secondary: 'Inter',
    size: 'medium',
    spacing: 100, // 100% = normal spacing
  },
  paperFormat: 'A4', // Default format
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Try to load resume from localStorage
const loadResumeFromStorage = (): Resume => {
  try {
    const savedResume = localStorage.getItem('resume');
    if (savedResume) {
      return JSON.parse(savedResume);
    }
  } catch (error) {
    console.error('Error loading resume from localStorage:', error);
  }
  return initialResume;
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

function resumeReducer(state: Resume, action: ResumeAction): Resume {
  let updatedState: Resume;
  
  switch (action.type) {
    case 'UPDATE_PERSONAL_DETAILS':
      updatedState = {
        ...state,
        personalDetails: {
          ...state.personalDetails,
          ...action.payload
        },
        updatedAt: new Date().toISOString()
      };
      break;
    case 'ADD_EMPLOYMENT':
      updatedState = {
        ...state,
        employmentHistory: [...state.employmentHistory, { ...action.payload, id: crypto.randomUUID() }],
        updatedAt: new Date().toISOString()
      };
      break;
    case 'UPDATE_EMPLOYMENT':
      updatedState = {
        ...state,
        employmentHistory: state.employmentHistory.map((item, index) => 
          index === action.payload.index ? action.payload.employment : item
        ),
        updatedAt: new Date().toISOString()
      };
      break;
    case 'DELETE_EMPLOYMENT':
      updatedState = {
        ...state,
        employmentHistory: state.employmentHistory.filter((_, index) => index !== action.payload),
        updatedAt: new Date().toISOString()
      };
      break;
    case 'ADD_EDUCATION':
      updatedState = {
        ...state,
        education: [...state.education, { ...action.payload, id: crypto.randomUUID() }],
        updatedAt: new Date().toISOString()
      };
      break;
    case 'UPDATE_EDUCATION':
      updatedState = {
        ...state,
        education: state.education.map((item, index) => 
          index === action.payload.index ? action.payload.education : item
        ),
        updatedAt: new Date().toISOString()
      };
      break;
    case 'DELETE_EDUCATION':
      updatedState = {
        ...state,
        education: state.education.filter((_, index) => index !== action.payload),
        updatedAt: new Date().toISOString()
      };
      break;
    case 'ADD_SKILL':
      updatedState = {
        ...state,
        skills: [...state.skills, { ...action.payload, id: crypto.randomUUID() }],
        updatedAt: new Date().toISOString()
      };
      break;
    case 'UPDATE_SKILL':
      updatedState = {
        ...state,
        skills: state.skills.map((item, index) => 
          index === action.payload.index ? action.payload.skill : item
        ),
        updatedAt: new Date().toISOString()
      };
      break;
    case 'DELETE_SKILL':
      updatedState = {
        ...state,
        skills: state.skills.filter((_, index) => index !== action.payload),
        updatedAt: new Date().toISOString()
      };
      break;
    case 'UPDATE_SUMMARY':
      updatedState = {
        ...state,
        summary: action.payload,
        updatedAt: new Date().toISOString()
      };
      break;
    case 'UPDATE_TEMPLATE':
      updatedState = {
        ...state,
        templateId: action.payload,
        updatedAt: new Date().toISOString()
      };
      break;
    case 'UPDATE_ACCENT_COLOR':
      updatedState = {
        ...state,
        accentColor: action.payload,
        updatedAt: new Date().toISOString()
      };
      break;
    case 'UPDATE_FONT_SETTINGS':
      updatedState = {
        ...state,
        fontSettings: {
          ...state.fontSettings,
          ...action.payload
        },
        updatedAt: new Date().toISOString()
      };
      break;
    case 'UPDATE_PAPER_FORMAT':
      updatedState = {
        ...state,
        paperFormat: action.payload,
        updatedAt: new Date().toISOString()
      };
      break;
    case 'ADD_SECTION':
      // Initialize the section if it doesn't exist
      switch (action.payload.type) {
        case 'custom':
          updatedState = {
            ...state,
            customSections: [...(state.customSections || []), {
              id: crypto.randomUUID(),
              title: 'Custom Section',
              items: []
            }],
            updatedAt: new Date().toISOString()
          };
          break;
        case 'certifications':
          updatedState = {
            ...state,
            certifications: [...(state.certifications || []), {
              id: crypto.randomUUID(),
              name: '',
              institution: '',
              date: '',
              description: ''
            }],
            updatedAt: new Date().toISOString()
          };
          break;
        case 'projects':
          updatedState = {
            ...state,
            projects: [...(state.projects || []), {
              id: crypto.randomUUID(),
              name: '',
              organization: '',
              startDate: '',
              endDate: '',
              current: false,
              description: ''
            }],
            updatedAt: new Date().toISOString()
          };
          break;
        case 'internships':
          updatedState = {
            ...state,
            internships: [...(state.internships || []), {
              id: crypto.randomUUID(),
              position: '',
              company: '',
              startDate: '',
              endDate: '',
              current: false,
              description: ''
            }],
            updatedAt: new Date().toISOString()
          };
          break;
        case 'hobbies':
          updatedState = {
            ...state,
            hobbies: [...(state.hobbies || []), {
              id: crypto.randomUUID(),
              name: '',
              description: ''
            }],
            updatedAt: new Date().toISOString()
          };
          break;
        case 'languages':
          updatedState = {
            ...state,
            languages: [...(state.languages || []), {
              id: crypto.randomUUID(),
              name: '',
              proficiency: 'Intermediate'
            }],
            updatedAt: new Date().toISOString()
          };
          break;
        // References section has been removed
        default:
          return state;
      }
      break;
    case 'UPDATE_CUSTOM_SECTIONS':
      updatedState = {
        ...state,
        customSections: action.payload,
        updatedAt: new Date().toISOString()
      };
      break;
    case 'UPDATE_CERTIFICATIONS':
      updatedState = {
        ...state,
        certifications: action.payload,
        updatedAt: new Date().toISOString()
      };
      break;
    case 'UPDATE_PROJECTS':
      updatedState = {
        ...state,
        projects: action.payload,
        updatedAt: new Date().toISOString()
      };
      break;
    case 'UPDATE_INTERNSHIPS':
      updatedState = {
        ...state,
        internships: action.payload,
        updatedAt: new Date().toISOString()
      };
      break;
    case 'UPDATE_HOBBIES':
      updatedState = {
        ...state,
        hobbies: action.payload,
        updatedAt: new Date().toISOString()
      };
      break;
    case 'UPDATE_LANGUAGES':
      updatedState = {
        ...state,
        languages: action.payload,
        updatedAt: new Date().toISOString()
      };
      break;
    default:
      return state;
  }
  
  // Save updated state to localStorage
  try {
    localStorage.setItem('resume', JSON.stringify(updatedState));
  } catch (error) {
    console.error('Error saving resume to localStorage:', error);
  }
  
  return updatedState;
}

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resume, dispatch] = useReducer(resumeReducer, loadResumeFromStorage());
  
  // Save resume to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('resume', JSON.stringify(resume));
      
      // Show save indicator
      const saveIndicator = document.getElementById('save-indicator');
      if (saveIndicator) {
        saveIndicator.classList.remove('opacity-0');
        saveIndicator.classList.add('opacity-100');
        
        setTimeout(() => {
          saveIndicator.classList.remove('opacity-100');
          saveIndicator.classList.add('opacity-0');
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving resume to localStorage:', error);
    }
  }, [resume]);
  
  return (
    <ResumeContext.Provider value={{ resume, dispatch }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = (): ResumeContextType => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
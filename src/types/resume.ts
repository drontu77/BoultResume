export interface PersonalDetails {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  photo: string;
  postalCode?: string;
  city?: string;
  country?: string;
  drivingLicense?: string;
  dateOfBirth?: string;
  nationality?: string;
}

export interface EmploymentHistory {
  id: string;
  jobTitle: string;
  employer: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  city?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  city?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category?: string;
}

export interface FontSettings {
  primary: string;
  secondary: string;
  size: 'small' | 'medium' | 'large';
  spacing: number; // percentage
}

export type PaperFormat = 'A4' | 'Letter' | 'Legal';

export interface CustomSection {
  id: string;
  title: string;
  items: {
    id: string;
    title: string;
    date?: string;
    description: string;
  }[];
}

export interface Certification {
  id: string;
  name: string;
  institution: string;
  date: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  organization: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Internship {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Hobby {
  id: string;
  name: string;
  description: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native';
}

export interface Reference {
  id: string;
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
}

export interface Resume {
  id: string;
  personalDetails: PersonalDetails;
  employmentHistory: EmploymentHistory[];
  education: Education[];
  skills: Skill[];
  summary: string;
  templateId: string;
  accentColor: string;
  fontSettings: FontSettings;
  paperFormat: PaperFormat;
  updatedAt: string;
  createdAt: string;
  customSections?: CustomSection[];
  certifications?: Certification[];
  projects?: Project[];
  internships?: Internship[];
  hobbies?: Hobby[];
  languages?: Language[];
}

export type ResumeAction =
  | { type: 'UPDATE_PERSONAL_DETAILS'; payload: Partial<PersonalDetails> }
  | { type: 'ADD_EMPLOYMENT'; payload: EmploymentHistory }
  | { type: 'UPDATE_EMPLOYMENT'; payload: { index: number; employment: EmploymentHistory } }
  | { type: 'DELETE_EMPLOYMENT'; payload: number }
  | { type: 'ADD_EDUCATION'; payload: Education }
  | { type: 'UPDATE_EDUCATION'; payload: { index: number; education: Education } }
  | { type: 'DELETE_EDUCATION'; payload: number }
  | { type: 'ADD_SKILL'; payload: Skill }
  | { type: 'UPDATE_SKILL'; payload: { index: number; skill: Skill } }
  | { type: 'DELETE_SKILL'; payload: number }
  | { type: 'UPDATE_SUMMARY'; payload: string }
  | { type: 'UPDATE_TEMPLATE'; payload: string }
  | { type: 'UPDATE_ACCENT_COLOR'; payload: string }
  | { type: 'UPDATE_FONT_SETTINGS'; payload: Partial<FontSettings> }
  | { type: 'UPDATE_PAPER_FORMAT'; payload: PaperFormat }
  | { type: 'ADD_SECTION'; payload: { type: 'custom' | 'certifications' | 'projects' | 'internships' | 'hobbies' | 'languages' } }
  | { type: 'UPDATE_CUSTOM_SECTIONS'; payload: CustomSection[] }
  | { type: 'UPDATE_CERTIFICATIONS'; payload: Certification[] }
  | { type: 'UPDATE_PROJECTS'; payload: Project[] }
  | { type: 'UPDATE_INTERNSHIPS'; payload: Internship[] }
  | { type: 'UPDATE_HOBBIES'; payload: Hobby[] }
  | { type: 'UPDATE_LANGUAGES'; payload: Language[] };
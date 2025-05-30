import { Resume } from './resume';
import React from 'react';

export interface TemplateProps {
  resume: Resume;
  scale?: number;
  showGuides?: boolean;
}

export interface Template {
  id: string;
  name: string;
  component: React.FC<TemplateProps>;
  thumbnail: string;
  supportedFormats: ('PDF' | 'DOCX' | 'TXT')[];
}
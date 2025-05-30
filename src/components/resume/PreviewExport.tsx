import React, { useState } from 'react';
import { useResume } from '../../contexts/ResumeContext';
import { templates } from '../../data/templates';
import { exportToPDF, exportToDOCX, exportToTXT } from '../../services/exportService';

interface PreviewExportProps {
  onPrevious: () => void;
}

const PreviewExport: React.FC<PreviewExportProps> = ({ onPrevious }) => {
  const { resume } = useResume();
  const [scale, setScale] = useState(0.8);
  
  const template = templates.find(t => t.id === resume.templateId) || templates[0];
  const TemplateComponent = template.component;
  
  const handleExportPDF = () => {
    exportToPDF(resume);
  };
  
  const handleExportDOCX = () => {
    exportToDOCX(resume);
  };
  
  const handleExportTXT = () => {
    exportToTXT(resume);
  };
  
  return (
    <div className="preview-export">
      <h2 className="text-2xl font-bold mb-4">Preview & Export</h2>
      <p className="text-gray-600 mb-6">
        Review your resume and export it in your preferred format.
      </p>
      
      <div className="mb-6 flex justify-center">
        <div className="flex space-x-2 items-center">
          <button 
            onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
            className="bg-gray-200 p-2 rounded-full"
            aria-label="Zoom out"
          >
            -
          </button>
          <span className="text-sm text-gray-600">Zoom: {Math.round(scale * 100)}%</span>
          <button 
            onClick={() => setScale(prev => Math.min(1.2, prev + 0.1))}
            className="bg-gray-200 p-2 rounded-full"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
      </div>
      
      <div className="mb-6 flex justify-center">
        <div className="border shadow-lg">
          <TemplateComponent resume={resume} scale={scale} />
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Export Options</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportPDF}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center"
          >
            <span className="mr-2">PDF</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          
          <button
            onClick={handleExportDOCX}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors flex items-center"
          >
            <span className="mr-2">DOCX</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          
          <button
            onClick={handleExportTXT}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors flex items-center"
          >
            <span className="mr-2">TXT</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          onClick={onPrevious}
          className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
        >
          Previous: Template Selection
        </button>
      </div>
    </div>
  );
};

export default PreviewExport;
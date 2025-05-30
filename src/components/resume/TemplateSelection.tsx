import React, { useState, useRef, useEffect } from 'react';
import { useResume } from '../../contexts/ResumeContext';
import { templates, getTemplateById } from '../../data/templates';
import { FontSettings, PaperFormat } from '../../types/resume';

interface TemplateSelectionProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onBack?: () => void;
}

type TabType = 'templates' | 'text' | 'layout';

// Added template categories
type TemplateCategory = 'Defined' | 'Essential' | 'Corporate' | 'Clear' | 'Balanced' | 'Classic' | 'Professional' | 'Pastel' | 'Industrial' | 'Traditional' | 'Minimalist';

// Organize templates into categories (for demonstration)
const categorizedTemplates: Record<TemplateCategory, string[]> = {
  'Defined': ['toronto'],
  'Essential': ['stockholm'],
  'Corporate': ['corporate'],
  'Clear': ['clear'],
  'Balanced': [],
  'Classic': [],
  'Professional': [],
  'Pastel': [],
  'Industrial': [],
  'Traditional': [],
  'Minimalist': []
};

const TemplateSelection: React.FC<TemplateSelectionProps> = ({ onNext, onPrevious, onBack }) => {
  const { resume, dispatch } = useResume();
  const { templateId, accentColor, fontSettings, paperFormat } = resume;
  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCustomColorPicker, setShowCustomColorPicker] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);
  
  // Get the current template component
  const selectedTemplate = getTemplateById(templateId);
  const TemplateComponent = selectedTemplate.component;

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleTemplateChange = (id: string) => {
    // Show loading state
    setIsLoading(true);
    
    // Change template after a short delay to provide visual feedback
    setTimeout(() => {
      dispatch({
        type: 'UPDATE_TEMPLATE',
        payload: id
      });
      setIsLoading(false);
    }, 300);
  };

  const handleColorChange = (color: string) => {
    dispatch({
      type: 'UPDATE_ACCENT_COLOR',
      payload: color
    });
    setShowCustomColorPicker(false);
  };

  const handleFontSettingsChange = (settings: Partial<FontSettings>) => {
    dispatch({
      type: 'UPDATE_FONT_SETTINGS',
      payload: settings
    });
  };

  const handlePaperFormatChange = (format: PaperFormat) => {
    dispatch({
      type: 'UPDATE_PAPER_FORMAT',
      payload: format
    });
  };

  const openCustomColorPicker = () => {
    setShowCustomColorPicker(true);
    setTimeout(() => {
      if (colorInputRef.current) {
        colorInputRef.current.click();
      }
    }, 100);
  };

  // Predefined color options
  const colorOptions = [
    '#066e52', // Green (selected in images)
    '#e74c3c', // Red-Orange
    '#2563eb', // Blue
    '#9333ea', // Purple
    '#292929', // Dark Gray
  ];

  // Font options for primary/secondary fonts
  const fontOptions = [
    'Lato',
    'PT Serif',
    'Inter',
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Roboto',
    'Open Sans'
  ];

  // Paper format options
  const paperFormatOptions: { value: PaperFormat; label: string }[] = [
    { value: 'A4', label: 'A4 (8.27" × 11.69")' },
    { value: 'Letter', label: 'Letter (8.5" × 11")' },
    { value: 'Legal', label: 'Legal (8.5" × 14")' }
  ];

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

  const handleBackToEditor = () => {
    if (onBack) onBack();
  };
  
  // Function to handle PDF download (mock functionality)
  const handleDownloadPDF = () => {
    // Show feedback to user
    const saveIndicator = document.getElementById('save-indicator');
    if (saveIndicator) {
      saveIndicator.textContent = 'Preparing PDF...'; 
      saveIndicator.classList.remove('opacity-0');
      saveIndicator.classList.add('opacity-100');
      
      // Simulate download preparation
      setTimeout(() => {
        saveIndicator.textContent = 'PDF Download Started';
        
        // Hide after a delay
        setTimeout(() => {
          saveIndicator.classList.remove('opacity-100');
          saveIndicator.classList.add('opacity-0');
        }, 2000);
      }, 1000);
    }
    
    // In a real implementation, we would use a library like html2pdf.js or jsPDF 
    // to generate the PDF from the selected template
    console.log(`Downloading PDF for template: ${templateId}`);
  };

  // Get template objects from category
  const getTemplatesInCategory = (category: TemplateCategory) => {
    return categorizedTemplates[category]
      .map(id => templates.find(t => t.id === id))
      .filter(t => t !== undefined) as any[];
  };

  return (
    <div className="template-selection flex flex-col h-screen bg-[#0F1215] w-screen overflow-hidden">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 bg-[#0F1215] flex justify-between items-center p-4 md:p-6 border-b border-gray-800/50">
        {/* Back button */}
        <button 
          onClick={handleBackToEditor}
          className="flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span className="text-sm font-medium">Back to editor</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Download status indicator */}
          <span id="save-indicator" className="text-sm text-green-400 opacity-0 transition-opacity duration-300"></span>
          
          {/* Download button */}
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-2 py-1.5 md:px-3 rounded-md bg-[#066e52] text-white hover:bg-[#058f6b] transition-colors text-xs md:text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-full w-screen overflow-hidden">
        {/* Left sidebar with fixed width */}
        <div className="w-full md:w-[300px] lg:w-[360px] flex-shrink-0 bg-[#0F1215] overflow-y-auto border-b md:border-b-0 md:border-r border-gray-800/50 custom-scrollbar h-[40vh] md:h-full">
          {/* Tab navigation */}
          <div className="flex space-x-4 md:space-x-6 lg:space-x-10 pt-3 md:pt-6 px-4 md:px-8 border-b border-gray-800/50">
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex items-center pb-3 relative ${activeTab === 'templates' 
                ? 'text-white font-medium border-b-2 border-white'
                : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4h7v7H4V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 15h7v5H4v-5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 4h5v7h-5V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 15h5v5h-5v-5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm">Templates</span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center pb-3 ${activeTab === 'text'
                ? 'text-white font-medium border-b-2 border-white'
                : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span className="mr-2 font-medium">Aa</span>
              <span className="text-sm">Text</span>
            </button>
            <button
              onClick={() => setActiveTab('layout')}
              className={`flex items-center pb-3 ${activeTab === 'layout'
                ? 'text-white font-medium border-b-2 border-white'
                : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 5H4v14h16V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 9h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm">Layout</span>
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'templates' && (
            <div className="px-4 md:px-8 pt-4 md:pt-8 overflow-y-auto">
              {/* Accent color section */}
              <div className="mb-10">
                <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-4">ACCENT COLOR</h3>
                <div className="flex gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className="w-10 h-10 rounded-full flex items-center justify-center focus:outline-none"
                      style={{ backgroundColor: color }}
                    >
                      {accentColor === color && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                          <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                  
                  {/* Custom color button */}
                  <button 
                    onClick={openCustomColorPicker}
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 focus:outline-none border border-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <input 
                      type="color"
                      ref={colorInputRef}
                      value={accentColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="opacity-0 absolute w-0 h-0"
                    />
                  </button>
                </div>
              </div>

              {/* Template categories */}
              <div className="space-y-10">
                {Object.entries(categorizedTemplates).map(([category]) => {
                  const categoryTemplates = getTemplatesInCategory(category as TemplateCategory);
                  if (categoryTemplates.length === 0) return null;
                  
                  return (
                    <div key={category} className="mb-8">
                      <h3 className="text-white text-base font-medium mb-4">{category}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                        {categoryTemplates.map(template => (
                          <div
                            key={template.id}
                            className="cursor-pointer transition-all flex flex-col"
                            onClick={() => handleTemplateChange(template.id)}
                          >
                            <div className="relative group">
                              {/* Template thumbnail with format badge */}
                              <div className={`bg-white aspect-[210/297] w-full rounded-md overflow-hidden ${templateId === template.id ? 'ring-2 ring-[#066e52] shadow-lg' : 'border border-gray-700/30 shadow-md'}`}>
                                <img 
                                  src={template.thumbnail} 
                                  alt={template.name} 
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  onError={(e) => {
                                    // Fallback if image doesn't load
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEwIiBoZWlnaHQ9IjI5NyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjEwIiBoZWlnaHQ9IjI5NyIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIj5UZW1wbGF0ZSBUaHVtYm5haWw8L3RleHQ+PC9zdmc+';
                                  }}
                                />
                                
                                {/* Template hover overlay with action button */}
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <button 
                                    className="bg-[#066e52] text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-[#055e45] transition-colors focus:outline-none"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent event from bubbling
                                      handleTemplateChange(template.id);
                                    }}
                                  >
                                    Use this template
                                  </button>
                                </div>
                                
                                {/* Format badges */}
                                <div className="absolute bottom-2 right-2 flex space-x-1">
                                  {template.supportedFormats.map((format: string, idx: number) => {
                                    // Different colors for different formats
                                    const bgColor = format === 'PDF' ? 'bg-amber-500' : 
                                                   format === 'DOCX' ? 'bg-blue-500' : 'bg-gray-500';
                                    
                                    return (
                                      <span 
                                        key={idx}
                                        className={`${bgColor} text-white text-[10px] font-medium px-1.5 py-0.5 rounded`}
                                      >
                                        {format}
                                      </span>
                                    );
                                  })}
                                </div>
                                
                                {/* Checkmark for selected template */}
                                {templateId === template.id && (
                                  <div className="absolute top-2 right-2 bg-[#066e52] rounded-full w-6 h-6 flex items-center justify-center z-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                                      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* Template name display */}
                            <div className="mt-2 text-center">
                              <p className="text-white text-sm font-medium">{template.name}</p>
                              {templateId === template.id && (
                                <p className="text-[#66e872] text-xs">Currently selected</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="px-4 md:px-8 pt-4 md:pt-8 overflow-y-auto">
              <div className="mb-8">
                <label className="block text-gray-400 text-xs font-medium uppercase tracking-wide mb-3">Primary font</label>
                <select 
                  value={fontSettings.primary} 
                  onChange={(e) => handleFontSettingsChange({ primary: e.target.value })}
                  className="w-full bg-[#1E2028] border border-gray-700/50 text-white rounded-md px-3 py-2 text-sm"
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-8">
                <label className="block text-gray-400 text-xs font-medium uppercase tracking-wide mb-3">Secondary font</label>
                <select 
                  value={fontSettings.secondary} 
                  onChange={(e) => handleFontSettingsChange({ secondary: e.target.value })}
                  className="w-full bg-[#1E2028] border border-gray-700/50 text-white rounded-md px-3 py-2 text-sm"
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-gray-400 text-xs font-medium uppercase tracking-wide">Size</label>
                  <span className="text-sm font-medium text-white bg-[#066e52] px-2 py-1 rounded">Medium</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value="5"
                    className="w-full accent-[#066e52] h-2 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span className="flex flex-col items-center">
                    <span className="h-3 w-px bg-gray-600 mb-1"></span>
                    <span>XS</span>
                  </span>
                  <span className="flex flex-col items-center">
                    <span className="h-3 w-px bg-gray-600 mb-1"></span>
                    <span>S</span>
                  </span>
                  <span className="flex flex-col items-center">
                    <span className="h-3 w-px bg-gray-600 mb-1"></span>
                    <span>M</span>
                  </span>
                  <span className="flex flex-col items-center">
                    <span className="h-3 w-px bg-gray-600 mb-1"></span>
                    <span>L</span>
                  </span>
                  <span className="flex flex-col items-center">
                    <span className="h-3 w-px bg-gray-600 mb-1"></span>
                    <span>XL</span>
                  </span>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-gray-400 text-xs font-medium uppercase tracking-wide">Spacing</label>
                  <span className="text-sm font-medium text-white bg-[#066e52] px-2 py-1 rounded">{fontSettings.spacing}%</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="90"
                    max="150"
                    step="5"
                    value={fontSettings.spacing}
                    onChange={(e) => handleFontSettingsChange({ spacing: parseInt(e.target.value) })}
                    className="w-full accent-[#066e52] h-2 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span className="flex flex-col items-center">
                    <span className="h-3 w-px bg-gray-600 mb-1"></span>
                    <span>Tight</span>
                  </span>
                  <span className="flex flex-col items-center">
                    <span className="h-3 w-px bg-gray-600 mb-1"></span>
                    <span>100%</span>
                  </span>
                  <span className="flex flex-col items-center">
                    <span className="h-3 w-px bg-gray-600 mb-1"></span>
                    <span>120%</span>
                  </span>
                  <span className="flex flex-col items-center">
                    <span className="h-3 w-px bg-gray-600 mb-1"></span>
                    <span>Loose</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="px-4 md:px-8 pt-4 md:pt-8 overflow-y-auto">
              <div className="mb-8">
                <label className="block text-gray-400 text-xs font-medium uppercase tracking-wide mb-3">Format</label>
                <select 
                  value={paperFormat} 
                  onChange={(e) => handlePaperFormatChange(e.target.value as PaperFormat)}
                  className="w-full bg-[#1E2028] border border-gray-700/50 text-white rounded-md px-3 py-2 text-sm"
                >
                  {paperFormatOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Right preview panel - stretch to full width */}
        <div className="w-full md:w-[calc(100vw-300px)] lg:w-[calc(100vw-360px)] bg-[#0F1215] overflow-hidden flex flex-col relative custom-scrollbar h-[60vh] md:h-[calc(100vh-64px)]" style={{ maxHeight: isMobile ? '60vh' : 'calc(100vh - 64px)' }}>
          {/* Zoom controls */}
          <div className="flex items-center justify-center pt-3 md:pt-4 pb-2 border-b border-gray-800/50">
            <div className="flex items-center gap-3 bg-[#1E1F26] rounded-full px-3 py-1.5 shadow-md">
              <button 
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                </svg>
              </button>
              
              <span className="text-xs font-medium text-white min-w-[40px] text-center">{zoomLevel}%</span>
              
              <button 
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
              
              <button 
                className="text-gray-400 hover:text-white transition-colors ml-1 border-l border-gray-700 pl-2"
                onClick={() => setZoomLevel(100)}
              >
                <span className="text-xs">Reset</span>
              </button>
            </div>
          </div>
          
          {/* Preview area with proper scrolling - improved for all screen sizes */}
          <div className="flex-1 overflow-y-auto w-full py-3 md:py-4 px-3 md:px-6" style={{ height: 'calc(100% - 50px)', overscrollBehavior: 'contain' }}>
            <div className="flex flex-col items-center min-h-full">
              {/* Wrapper div that maintains proper dimensions for zoomed content */}
              <div 
                style={{
                  height: `${842 * (zoomLevel / 100)}px`,
                  width: `${595 * (zoomLevel / 100)}px`,
                  maxWidth: '100%',
                  maxHeight: isMobile ? '50vh' : 'unset',
                  position: 'relative',
                  marginTop: '20px',
                  marginBottom: '300px' /* Large margin to ensure scrollability at high zoom */
                }}
              >
                {/* A4 page with proper dimensions */}
                <div
                  className="overflow-hidden"
                  style={{
                    width: '595px',
                    height: '842px',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transformOrigin: 'top center',
                    margin: '0 auto',
                    transform: `scale(${zoomLevel / 100})`,
                    transition: 'transform 0.2s ease',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                    padding: 0,
                    overflow: 'hidden'
                  }}
                >
                  {/* Loading overlay */}
                  {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#066e52]"></div>
                        <p className="mt-3 text-gray-700 font-medium">Loading template...</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Render the actual selected template with a wrapper to fill the full space */}
                  <div className="absolute inset-0 w-full h-full p-0 m-0 overflow-hidden">
                    <TemplateComponent resume={resume} scale={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fixed pagination controls at the bottom */}
          <div className="fixed bottom-4 left-1/2 md:left-[calc(150px+50vw)] lg:left-[calc(180px+50vw)] transform -translate-x-1/2 z-20">
            <div className="flex items-center justify-center bg-gray-200 rounded-full px-3 py-2 shadow-lg">
              <button 
                className="p-1 text-gray-700 hover:text-gray-900 transition-colors"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="black" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              
              <div className="px-3 text-xs font-medium text-gray-700">
                {currentPage} / {totalPages}
              </div>
              
              <button 
                className="p-1 text-gray-700 hover:text-gray-900 transition-colors"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="black" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;
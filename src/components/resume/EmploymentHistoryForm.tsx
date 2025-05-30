import React, { useState, useRef, useEffect } from 'react';
import { useResume } from '../../contexts/ResumeContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse } from 'date-fns';

interface EmploymentHistoryFormProps {
  // No props needed
}

interface DragInfo {
  isDragging: boolean;
  startIndex: number | null;
}

const EmploymentHistoryForm: React.FC<EmploymentHistoryFormProps> = () => {
  const { resume, dispatch } = useResume();
  const { employmentHistory } = resume;
  
  // State for new job entry
  const [isAdding, setIsAdding] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [employer, setEmployer] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [current, setCurrent] = useState(false);
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [city, setCity] = useState('');
  
  // State for expandable job cards
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  
  // State for drag and drop
  const [dragInfo, setDragInfo] = useState<DragInfo>({
    isDragging: false,
    startIndex: null
  });
  
  // State for showing drag tooltip
  const [showDragTooltip, setShowDragTooltip] = useState(false);
  
  // AI assistant states
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiOptions, setShowAiOptions] = useState(false);
  
  // Notification state
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false
  });

  // Show notification function
  const showNotification = (message: string) => {
    setNotification({ message, visible: true });
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
  };
  
  // Reset form fields
  const resetForm = () => {
    setJobTitle('');
    setEmployer('');
    setStartDate(null);
    setEndDate(null);
    setCurrent(false);
    setDescription('');
    setEditingId(null);
    setAiSuggestions([]);
    setShowAiOptions(false);
    setCity('');
  };
  
  // Format date as MM/YYYY
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return format(date, 'MM/yyyy');
  };
  
  // Parse date string (MM/YYYY) to Date object
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    try {
      return parse(dateStr, 'MM/yyyy', new Date());
    } catch (error) {
      return null;
    }
  };
  
  // Handle adding a new job
  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing job
      const jobToUpdate = employmentHistory.find(job => job.id === editingId);
      if (jobToUpdate) {
        dispatch({
          type: 'UPDATE_EMPLOYMENT',
          payload: {
            index: employmentHistory.indexOf(jobToUpdate),
            employment: {
              ...jobToUpdate,
              jobTitle,
              employer,
              startDate: formatDate(startDate),
              endDate: current ? '' : formatDate(endDate),
              current,
              description,
              city
            }
          }
        });
      }
    } else {
      // Add new job
      dispatch({
        type: 'ADD_EMPLOYMENT',
        payload: {
          id: crypto.randomUUID(),
          jobTitle,
          employer,
          startDate: formatDate(startDate),
          endDate: current ? '' : formatDate(endDate),
          current,
          description,
          city
        }
      });
    }
    
    // Reset form and hide it
    resetForm();
    setIsAdding(false);
  };
  
  // Handle editing a job
  const handleEditJob = (id: string) => {
    const job = employmentHistory.find(job => job.id === id);
    if (job) {
      setJobTitle(job.jobTitle);
      setEmployer(job.employer);
      setStartDate(parseDate(job.startDate));
      setEndDate(job.endDate ? parseDate(job.endDate) : null);
      setCurrent(job.current || false);
      setDescription(job.description);
      setEditingId(id);
      setCity(job.city || '');
      setIsAdding(true);
      setExpandedJobId(null);
    }
  };
  
  // Handle deleting a job
  const handleDeleteJob = (id: string) => {
    const jobToDelete = employmentHistory.find(job => job.id === id);
    if (jobToDelete) {
      dispatch({
        type: 'DELETE_EMPLOYMENT',
        payload: employmentHistory.indexOf(jobToDelete)
      });
      
      if (expandedJobId === id) {
        setExpandedJobId(null);
      }
    }
  };
  
  // Handle form cancellation
  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
  };
  
  // Handle drag start
  const handleDragStart = (index: number) => {
    setDragInfo({
      isDragging: true,
      startIndex: index
    });
    setShowDragTooltip(false);
  };
  
  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragInfo.startIndex === null) return;
    
    // Reorder jobs
    if (dragInfo.startIndex !== index) {
      const newJobs = [...employmentHistory];
      const [removed] = newJobs.splice(dragInfo.startIndex, 1);
      newJobs.splice(index, 0, removed);
      
      // Update each job individually
      newJobs.forEach((job, idx) => {
        dispatch({
          type: 'UPDATE_EMPLOYMENT',
          payload: {
            index: idx,
            employment: job
          }
        });
      });
      
      // Update start index
      setDragInfo({
        ...dragInfo,
        startIndex: index
      });
    }
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    setDragInfo({
      isDragging: false,
      startIndex: null
    });
  };

  // Generate AI suggestions for job description
  const generateAiSuggestions = () => {
    // Validate job title and employer are filled
    if (!jobTitle.trim() || !employer.trim()) {
      // Show notification instead of alert
      showNotification("Please fill in both Job Title and Employer fields to get AI suggestions.");
      return;
    }
    
    setIsGeneratingAI(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      const defaultSuggestions = [
        `<p>As a <strong>${jobTitle}</strong> at ${employer}, I managed cross-functional projects and implemented process improvements that increased team efficiency by 25%.</p>`,
        `<p>Led a team of professionals in delivering high-quality solutions to clients. Established new workflows that reduced delivery time by 30% while maintaining excellence.</p>`,
        `<p>Responsible for developing strategic plans and coordinating with stakeholders to ensure successful project outcomes. Recognized for exceptional communication skills and problem-solving abilities.</p>`
      ];
      
      // Job-specific suggestions based on job title
      const jobSpecificSuggestions: Record<string, string[]> = {
        'software engineer': [
          `<p>Developed and maintained scalable web applications using modern JavaScript frameworks and backend technologies. Implemented CI/CD pipelines that reduced deployment errors by 40%.</p>`,
          `<p>Collaborated with product managers and designers to build user-friendly interfaces. Optimized database queries resulting in 50% faster page load times.</p>`
        ],
        'product manager': [
          `<p>Oversaw product development from conception to launch, collaborating with engineering, design, and marketing teams. Conducted market research to identify customer needs and prioritize features.</p>`,
          `<p>Created detailed product roadmaps and specifications. Leveraged data analytics to make informed decisions, resulting in 35% revenue growth for key product lines.</p>`
        ],
        'marketing specialist': [
          `<p>Executed multi-channel marketing campaigns that increased brand awareness by 45%. Managed social media accounts and created engaging content that boosted audience engagement metrics.</p>`,
          `<p>Analyzed marketing performance data to optimize campaign strategies. Collaborated with design team to develop compelling marketing materials aligned with brand guidelines.</p>`
        ],
        'teacher': [
          `<p>Created and implemented lesson plans based on child-led interests and curiosities. Developed individualized education plans for students with diverse learning needs.</p>`,
          `<p>Facilitated engaging classroom discussions and hands-on learning activities. Maintained detailed student progress records and communicated regularly with parents.</p>`
        ]
      };
      
      // Check if we have specific suggestions for this job title
      const titleLower = jobTitle.toLowerCase();
      const matchingTitle = Object.keys(jobSpecificSuggestions).find(title => 
        titleLower.includes(title) || title.includes(titleLower)
      );
      
      const suggestions = matchingTitle 
        ? [...jobSpecificSuggestions[matchingTitle], ...defaultSuggestions]
        : defaultSuggestions;
      
      setAiSuggestions(suggestions);
      setShowAiOptions(true);
      setIsGeneratingAI(false);
    }, 800); // Simulate API latency
  };
  
  // Apply AI suggestion to description
  const applySuggestion = (suggestion: string) => {
    setDescription(suggestion);
    setShowAiOptions(false);
  };
  
  // Improve existing description with AI
  const improveWithAI = () => {
    // Validate job title and employer are filled
    if (!jobTitle.trim() || !employer.trim()) {
      // Show notification instead of alert
      showNotification("Please fill in both Job Title and Employer fields to get AI suggestions.");
      return;
    }
    
    setIsGeneratingAI(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      const currentText = description || '';
      const improvedText = `${currentText.trim()} Additionally, I implemented data-driven strategies that resulted in 20% improvement in key performance indicators and consistently exceeded targets by collaborating effectively with cross-functional teams.`;
      
      setAiSuggestions([improvedText]);
      setShowAiOptions(true);
      setIsGeneratingAI(false);
    }, 800);
  };

  // Rich text editor modules and formats
  const modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link'],
        ['clean']
      ]
    }
  };
  
  const formats = [
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'link'
  ];

  // Strip HTML for character count
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Character count for description
  const getCharacterCount = () => {
    return stripHtml(description).length;
  };
  
  // Get character count class
  const getCharacterCountClass = () => {
    const count = getCharacterCount();
    if (count < 50) return 'text-red-500';
    if (count < 100) return 'text-yellow-500';
    if (count > 500) return 'text-red-500';
    return 'text-green-500';
  };

  // Custom date picker header (only month and year)
  const CustomDatePickerHeader = ({ 
    date, 
    changeYear, 
    changeMonth, 
    decreaseMonth, 
    increaseMonth, 
    prevMonthButtonDisabled, 
    nextMonthButtonDisabled 
  }: any) => {
    const years = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - 39 + i);
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return (
      <div className="bg-white p-2 flex justify-between items-center">
        <button
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
          className="bg-gray-100 p-1 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex space-x-2">
          <select
            value={months[date.getMonth()]}
            onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
            className="text-sm border rounded p-1"
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          
          <select
            value={date.getFullYear()}
            onChange={({ target: { value } }) => changeYear(Number(value))}
            className="text-sm border rounded p-1"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
          className="bg-gray-100 p-1 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="employment-history-form">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Employment History</h2>
      <p className="text-gray-600 mb-6 text-sm">
        Show your relevant experience (last 10 years). Use bullet points to note your achievements, if possible - use numbers/facts (Achieved X, measured by Y, by doing Z).
      </p>
      
      {/* List of existing jobs */}
      {employmentHistory.length > 0 && (
        <div 
          className="mb-6 relative"
          onMouseEnter={() => employmentHistory.length > 1 && setShowDragTooltip(true)}
          onMouseLeave={() => setShowDragTooltip(false)}
        >
          {/* Drag tooltip */}
          {showDragTooltip && (
            <div className="absolute -left-1 top-0 bg-gray-800 text-white text-xs rounded px-2 py-1 z-10">
              Click and drag to move
            </div>
          )}
          
          {employmentHistory.map((job, index) => (
            <div
              key={job.id}
              draggable={true}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`border border-gray-200 rounded-md bg-white mb-1 overflow-hidden relative ${
                dragInfo.isDragging && dragInfo.startIndex === index ? 'opacity-50' : ''
              }`}
            >
              {/* Job header - always visible */}
              <div className="flex items-center p-4">
                <div className="flex-shrink-0 text-gray-400 mr-2 cursor-move">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="9" cy="6" r="2"></circle>
                    <circle cx="9" cy="12" r="2"></circle>
                    <circle cx="9" cy="18" r="2"></circle>
                    <circle cx="15" cy="6" r="2"></circle>
                    <circle cx="15" cy="12" r="2"></circle>
                    <circle cx="15" cy="18" r="2"></circle>
                  </svg>
                </div>
                <div className="flex-grow">
                  <div className="font-medium text-gray-900">
                    {job.jobTitle}
                  </div>
                  <div className="text-sm text-gray-500">
                    {job.employer}{job.city ? `, ${job.city}` : ''} | {job.startDate} - {job.current ? 'Present' : job.endDate}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 transition-transform ${expandedJobId === job.id ? 'transform rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteJob(job.id);
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete job"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Expanded actions */}
              {expandedJobId === job.id && (
                <div className="p-4 border-t border-gray-200">
                  <div className="mb-3">
                    <div 
                      className="text-gray-700" 
                      dangerouslySetInnerHTML={{ __html: job.description || '<p>No description provided.</p>' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleEditJob(job.id)}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 text-sm"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Add one more job button */}
      {!isAdding && (
        <div 
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer gap-1.5 mb-4" 
          onClick={() => setIsAdding(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add one more job
        </div>
      )}

      {/* Rest of the existing form for adding/editing jobs */}
      {isAdding && (
        <div className="my-6 border border-gray-200 rounded-md bg-white shadow-sm">
          {/* Form header */}
          <div className="border-b border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900">{editingId ? 'Edit position' : 'Add position'}</h3>
          </div>
          
          {/* Form body */}
          <form onSubmit={handleAddJob} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-600 mb-1">
                  Job title
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  placeholder="e.g. Product Manager"
                  required
                />
              </div>
            
              <div>
                <label htmlFor="employer" className="block text-sm font-medium text-gray-600 mb-1">
                  Employer
                </label>
                <input
                  type="text"
                  id="employer"
                  value={employer}
                  onChange={(e) => setEmployer(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  placeholder="e.g. Acme Inc"
                  required
                />
              </div>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                  Start & End Date
                  <span className="ml-1 text-gray-400 cursor-help" title="Enter the start and end dates of your employment">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </span>
                </label>
                <div className="flex space-x-2">
                  <DatePicker
                    id="startDate"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    renderCustomHeader={CustomDatePickerHeader}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    placeholderText="MM / YYYY"
                    required
                  />
                  <DatePicker
                    id="endDate"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    renderCustomHeader={CustomDatePickerHeader}
                    className={`w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 ${
                      current ? 'bg-gray-200 text-gray-500' : 'bg-gray-50'
                    }`}
                    placeholderText="MM / YYYY"
                    disabled={current}
                    required={!current}
                  />
                </div>
                <div className="mt-1 flex items-center">
                  <input
                    type="checkbox"
                    id="current"
                    checked={current}
                    onChange={(e) => {
                      setCurrent(e.target.checked);
                      if (e.target.checked) {
                        setEndDate(null);
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="current" className="ml-2 block text-sm text-gray-600">
                    I currently work here
                  </label>
                </div>
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-600 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  placeholder="e.g. New York"
                />
              </div>
            </div>
          
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="description" className="block text-sm font-medium text-gray-600">
                  Description
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={description ? improveWithAI : generateAiSuggestions}
                    disabled={isGeneratingAI}
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                    {isGeneratingAI ? 'Generating...' : 'Get help with writing'}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="relative">
                {/* Notification popup */}
                {notification.visible && (
                  <div className="absolute -top-12 left-0 right-0 z-20 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-md shadow-md text-sm animate-fadeIn">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {notification.message}
                    </div>
                  </div>
                )}
                
                <div className="bg-gray-50 rounded border border-gray-300">
                  <ReactQuill 
                    value={description}
                    onChange={setDescription}
                    modules={modules}
                    formats={formats}
                    theme="snow"
                    placeholder="e.g. Created and implemented lesson plans based on child-led interests and curiosities."
                    className="bg-gray-50 min-h-[150px] description-editor"
                  />
                </div>
                
                {/* Add custom CSS to remove the divider line */}
                <style dangerouslySetInnerHTML={{__html: `
                  /* Style the editor to match other form fields */
                  .description-editor .ql-editor {
                    border-top: none !important;
                  }
                  .description-editor .ql-container {
                    border-top: none !important;
                    border: none !important;
                    border-bottom-left-radius: 0.375rem;
                    border-bottom-right-radius: 0.375rem;
                  }
                  .description-editor .ql-toolbar {
                    border-bottom: 1px solid #E5E7EB !important;
                    background-color: #F9FAFB !important;
                    border-top-left-radius: 0.375rem;
                    border-top-right-radius: 0.375rem;
                    padding-bottom: 8px;
                    border-left: none !important;
                    border-right: none !important;
                    border-top: none !important;
                  }
                  /* Fix spacing */
                  .description-editor .ql-toolbar.ql-snow + .ql-container.ql-snow {
                    border: none !important;
                  }
                  .description-editor .ql-toolbar,
                  .description-editor .ql-container {
                    border-radius: 0;
                  }
                  .description-editor .ql-container {
                    background-color: #F9FAFB !important;
                  }
                  .description-editor .ql-editor {
                    background-color: #F9FAFB !important;
                    min-height: 120px;
                    font-size: 14px;
                    color: #374151;
                  }
                  /* Focus state to match other inputs */
                  .description-editor:focus-within {
                    outline: 2px solid transparent;
                    outline-offset: 2px;
                    border-color: #3B82F6;
                    box-shadow: 0 0 0 1px #3B82F6;
                  }
                  .description-editor .ql-editor::placeholder {
                    color: #9CA3AF;
                  }
                  .description-editor .ql-toolbar .ql-stroke {
                    stroke: #6B7280;
                  }
                  .description-editor .ql-toolbar .ql-fill {
                    fill: #6B7280;
                  }
                  .description-editor .ql-toolbar button:hover .ql-stroke {
                    stroke: #4B5563;
                  }
                  .description-editor .ql-toolbar button:hover .ql-fill {
                    fill: #4B5563;
                  }
                  .description-editor .ql-toolbar button.ql-active .ql-stroke {
                    stroke: #4F46E5;
                  }
                  .description-editor .ql-toolbar button.ql-active .ql-fill {
                    fill: #4F46E5;
                  }
                  
                  /* Animation for notification */
                  @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                  .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                  }
                `}} />
                
                {/* AI Suggestions Panel */}
                {showAiOptions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden">
                    <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                      <h4 className="font-medium text-gray-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 text-indigo-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                        </svg>
                        AI Suggestions
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">Select a suggestion to use in your description</p>
                    </div>
                    <div className="p-2 max-h-[250px] overflow-y-auto">
                      {aiSuggestions.map((suggestion, index) => (
                        <div 
                          key={index}
                          className="p-3 rounded hover:bg-gray-50 cursor-pointer mb-2 transition-colors border border-transparent hover:border-gray-200"
                          onClick={() => applySuggestion(suggestion)}
                        >
                          <div dangerouslySetInnerHTML={{ __html: suggestion }} />
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowAiOptions(false)}
                        className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className={`text-xs mt-1 flex justify-between ${getCharacterCountClass()}`}>
                <span>
                  {getCharacterCount()} characters
                  {getCharacterCount() < 100 && " (aim for 100-500 characters)"}
                </span>
                <span>
                  {getCharacterCount() > 500 && "Consider shortening your description"}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-white text-gray-600 border border-gray-300 py-1.5 px-3 text-sm rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white py-1.5 px-3 text-sm rounded hover:bg-blue-600 transition-colors"
              >
                {editingId ? 'Save' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {employmentHistory.length === 0 && !isAdding && (
        <div className="p-6 bg-gray-50 border border-gray-200 border-dashed rounded-md flex flex-col items-center justify-center text-center mt-4 mb-6">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/1063/1063183.png" 
            alt="Employment" 
            className="w-12 h-12 opacity-30 mb-2"
          />
          <p className="text-gray-500 text-sm mb-2">No employment history added yet</p>
          <p className="text-gray-400 text-xs mb-3">Adding work experience will improve your resume progress</p>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Pro Tips:</h3>
        <ul className="text-sm text-blue-700 list-disc pl-5">
          <li>Use action verbs like "achieved," "implemented," or "managed" to start bullet points</li>
          <li>Include specific achievements with measurable results (e.g., "increased sales by 20%")</li>
          <li>Tailor your descriptions to match keywords from the job posting you're applying to</li>
          <li>List your most recent positions first</li>
        </ul>
      </div>
      
      {/* Notification */}
      {notification.visible && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-up">
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default EmploymentHistoryForm;
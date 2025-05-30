import React, { useState } from 'react';
import { useResume } from '../../contexts/ResumeContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse } from 'date-fns';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface ProjectsFormProps {}

interface DragInfo {
  isDragging: boolean;
  startIndex: number | null;
}

const ProjectsForm: React.FC<ProjectsFormProps> = () => {
  const { resume, dispatch } = useResume();
  const projects = resume.projects || [];
  
  // State for new project entry
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [current, setCurrent] = useState(false);
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // State for expandable project cards
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // State for drag and drop
  const [dragInfo, setDragInfo] = useState<DragInfo>({
    isDragging: false,
    startIndex: null
  });
  
  // State for showing drag tooltip
  const [showDragTooltip, setShowDragTooltip] = useState(false);
  
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
    setName('');
    setOrganization('');
    setStartDate(null);
    setEndDate(null);
    setCurrent(false);
    setDescription('');
    setEditingId(null);
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
  
  // Handle adding a new project
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      id: editingId || crypto.randomUUID(),
      name,
      organization,
      startDate: formatDate(startDate),
      endDate: current ? '' : formatDate(endDate),
      current,
      description
    };
    
    if (editingId) {
      // Update existing project
      const projectIndex = projects.findIndex(proj => proj.id === editingId);
      if (projectIndex !== -1) {
        const updatedProjects = [...projects];
        updatedProjects[projectIndex] = projectData;
        
        dispatch({
          type: 'UPDATE_PROJECTS',
          payload: updatedProjects
        });
        
        showNotification('Project updated successfully');
      }
    } else {
      // Add new project
      dispatch({
        type: 'UPDATE_PROJECTS',
        payload: [...projects, projectData]
      });
      
      showNotification('Project added successfully');
    }
    
    // Reset form and hide it
    resetForm();
    setIsAdding(false);
  };
  
  // Handle editing a project
  const handleEditProject = (id: string) => {
    const project = projects.find(proj => proj.id === id);
    if (project) {
      setName(project.name);
      setOrganization(project.organization);
      setStartDate(project.startDate ? parseDate(project.startDate) : null);
      setEndDate(project.endDate ? parseDate(project.endDate) : null);
      setCurrent(project.current);
      setDescription(project.description);
      setEditingId(id);
      setIsAdding(true);
    }
  };
  
  // Handle deleting a project
  const handleDeleteProject = (id: string) => {
    const updatedProjects = projects.filter(proj => proj.id !== id);
    
    dispatch({
      type: 'UPDATE_PROJECTS',
      payload: updatedProjects
    });
    
    showNotification('Project removed');
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
    
    // Reorder projects
    if (dragInfo.startIndex !== index) {
      const updatedProjects = [...projects];
      const [removed] = updatedProjects.splice(dragInfo.startIndex, 1);
      updatedProjects.splice(index, 0, removed);
      
      dispatch({
        type: 'UPDATE_PROJECTS',
        payload: updatedProjects
      });
      
      setDragInfo({
        isDragging: true,
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
  
  // Custom date picker header component
  const CustomDatePickerHeader = ({ 
    date, 
    changeYear, 
    changeMonth, 
    decreaseMonth, 
    increaseMonth, 
    prevMonthButtonDisabled, 
    nextMonthButtonDisabled 
  }: any) => {
    const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    return (
      <div className="flex justify-between items-center px-2 py-2">
        <button
          type="button"
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
          className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex space-x-2">
          <select
            value={months[date.getMonth()]}
            onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
            className="text-sm bg-white border border-gray-300 rounded px-2 py-1"
          >
            {months.map(month => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          
          <select
            value={date.getFullYear()}
            onChange={({ target: { value } }) => changeYear(Number(value))}
            className="text-sm bg-white border border-gray-300 rounded px-2 py-1"
          >
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        
        <button
          type="button"
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
          className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  };
  
  // Strip HTML for character count
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
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
    if (count > 500) return 'text-orange-500';
    return 'text-gray-500';
  };
  
  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Projects</h2>
        
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Project
          </button>
        )}
      </div>
      
      {/* Project list */}
      {projects.length > 0 && (
        <div className="space-y-4 mb-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div 
                className="flex justify-between items-start p-4 cursor-pointer group"
                onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="cursor-move p-1 mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md" onClick={e => e.stopPropagation()}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-800">{project.name}</h3>
                      <div className="text-sm text-gray-500">
                        {project.organization && (
                          <span>{project.organization} • </span>
                        )}
                        <span>
                          {project.startDate && project.startDate} 
                          {project.startDate && (project.current ? ' - Present' : project.endDate ? ` - ${project.endDate}` : '')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditProject(project.id);
                    }}
                    className="text-gray-400 hover:text-blue-600 p-1 rounded-md hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Are you sure you want to delete this project?')) {
                        handleDeleteProject(project.id);
                      }
                    }}
                    className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="text-gray-400 p-1 rounded-md"
                  >
                    {expandedId === project.id ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              {expandedId === project.id && project.description && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  <div 
                    className="text-sm text-gray-600 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Add/Edit Form */}
      {isAdding && (
        <div className="border border-blue-100 bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {editingId ? 'Edit Project' : 'Add Project'}
          </h3>
          
          <form onSubmit={handleAddProject}>
            <div className="space-y-4">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-600 mb-1">
                  Project Name*
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. E-commerce Website Redesign"
                  className="w-full px-3 py-2.5 text-gray-700 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-600 mb-1">
                  Organization/Client
                </label>
                <input
                  type="text"
                  id="organization"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. ABC Company or Personal Project"
                  className="w-full px-3 py-2.5 text-gray-700 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-600 mb-1">
                    Start Date
                  </label>
                  <DatePicker
                    id="startDate"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    renderCustomHeader={CustomDatePickerHeader}
                    className="w-full px-3 py-2.5 text-gray-700 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholderText="Select start date"
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-600 mb-1">
                    End Date
                  </label>
                  <div>
                    {current ? (
                      <div className="px-3 py-2.5 text-gray-500 text-sm bg-gray-100 border border-gray-300 rounded-md">
                        Present
                      </div>
                    ) : (
                      <DatePicker
                        id="endDate"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        renderCustomHeader={CustomDatePickerHeader}
                        className="w-full px-3 py-2.5 text-gray-700 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholderText="Select end date"
                        disabled={current}
                      />
                    )}
                  </div>
                  <div className="mt-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={current}
                        onChange={() => setCurrent(!current)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">Current Project</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">
                  Description*
                </label>
                <div className="bg-white border border-gray-300 rounded-md">
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    placeholder="Describe your project, your role, and achievements..."
                    modules={{
                      toolbar: [
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ]
                    }}
                  />
                </div>
                
                <div className={`text-xs mt-1 flex justify-between ${getCharacterCountClass()}`}>
                  <span>
                    {getCharacterCount()} characters
                    {getCharacterCount() < 50 && " (add more details)"}
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
            </div>
          </form>
        </div>
      )}
      
      {projects.length === 0 && !isAdding && (
        <div className="p-6 bg-gray-50 border border-gray-200 border-dashed rounded-md flex flex-col items-center justify-center text-center mt-4 mb-6">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/3281/3281289.png" 
            alt="Projects" 
            className="w-12 h-12 opacity-30 mb-2"
          />
          <p className="text-gray-500 text-sm mb-2">No projects added yet</p>
          <p className="text-gray-400 text-xs mb-3">Adding projects will improve your resume progress</p>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Pro Tips:</h3>
        <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
          <li>Focus on measurable results and impact</li>
          <li>Include technologies and tools used</li>
          <li>Highlight your specific contributions</li>
          <li>Prioritize projects most relevant to the job you're applying for</li>
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

export default ProjectsForm;

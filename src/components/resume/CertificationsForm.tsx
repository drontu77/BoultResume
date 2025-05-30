import React, { useState } from 'react';
import { useResume } from '../../contexts/ResumeContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface CertificationsFormProps {}

interface DragInfo {
  isDragging: boolean;
  startIndex: number | null;
}

const CertificationsForm: React.FC<CertificationsFormProps> = () => {
  const { resume, dispatch } = useResume();
  const certifications = resume.certifications || [];
  
  // State for new certification entry
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // State for expandable certification cards
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
    setInstitution('');
    setDate(null);
    setDescription('');
    setEditingId(null);
  };

  // Format date display
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short'
    });
  };
  
  // Handle adding a new certification
  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    
    const certificationData = {
      id: editingId || crypto.randomUUID(),
      name,
      institution,
      date: date ? formatDate(date) : '',
      description
    };
    
    if (editingId) {
      // Update existing certification
      const certIndex = certifications.findIndex(cert => cert.id === editingId);
      if (certIndex !== -1) {
        const updatedCertifications = [...certifications];
        updatedCertifications[certIndex] = certificationData;
        
        dispatch({
          type: 'UPDATE_CERTIFICATIONS',
          payload: updatedCertifications
        });
        
        showNotification('Certification updated successfully');
      }
    } else {
      // Add new certification
      dispatch({
        type: 'UPDATE_CERTIFICATIONS',
        payload: [...certifications, certificationData]
      });
      
      showNotification('Certification added successfully');
    }
    
    // Reset form and hide it
    resetForm();
    setIsAdding(false);
  };
  
  // Handle editing a certification
  const handleEditCertification = (id: string) => {
    const cert = certifications.find(cert => cert.id === id);
    if (cert) {
      setName(cert.name);
      setInstitution(cert.institution);
      setDate(cert.date ? new Date(cert.date) : null);
      setDescription(cert.description);
      setEditingId(id);
      setIsAdding(true);
    }
  };
  
  // Handle deleting a certification
  const handleDeleteCertification = (id: string) => {
    const updatedCertifications = certifications.filter(cert => cert.id !== id);
    
    dispatch({
      type: 'UPDATE_CERTIFICATIONS',
      payload: updatedCertifications
    });
    
    showNotification('Certification removed');
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
    
    // Reorder certifications
    if (dragInfo.startIndex !== index) {
      const updatedCertifications = [...certifications];
      const [removed] = updatedCertifications.splice(dragInfo.startIndex, 1);
      updatedCertifications.splice(index, 0, removed);
      
      dispatch({
        type: 'UPDATE_CERTIFICATIONS',
        payload: updatedCertifications
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
        <h2 className="text-xl font-bold text-gray-800">Certifications</h2>
        
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Certification
          </button>
        )}
      </div>
      
      {/* Certification list */}
      {certifications.length > 0 && (
        <div className="space-y-4 mb-6">
          {certifications.map((cert, index) => (
            <div
              key={cert.id}
              className="border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div 
                className="flex justify-between items-start p-4 cursor-pointer group"
                onClick={() => setExpandedId(expandedId === cert.id ? null : cert.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="cursor-move p-1 mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md" onClick={e => e.stopPropagation()}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-800">{cert.name}</h3>
                      <div className="text-sm text-gray-500">
                        {cert.institution}
                        {cert.institution && cert.date && <span> • </span>}
                        {cert.date}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCertification(cert.id);
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
                      if (window.confirm('Are you sure you want to delete this certification?')) {
                        handleDeleteCertification(cert.id);
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
                    {expandedId === cert.id ? (
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
              
              {expandedId === cert.id && cert.description && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  <div 
                    className="text-sm text-gray-600 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: cert.description }}
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
            {editingId ? 'Edit Certification' : 'Add Certification'}
          </h3>
          
          <form onSubmit={handleAddCertification}>
            <div className="space-y-4">
              <div>
                <label htmlFor="certName" className="block text-sm font-medium text-gray-600 mb-1">
                  Certification Name
                </label>
                <input
                  type="text"
                  id="certName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="w-full px-3 py-2.5 text-gray-700 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-gray-600 mb-1">
                  Issuing Organization
                </label>
                <input
                  type="text"
                  id="institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Amazon Web Services"
                  className="w-full px-3 py-2.5 text-gray-700 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-600 mb-1">
                  Date Issued
                </label>
                <DatePicker
                  id="date"
                  selected={date}
                  onChange={(date) => setDate(date)}
                  dateFormat="MMMM yyyy"
                  showMonthYearPicker
                  className="w-full px-3 py-2.5 text-gray-700 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholderText="Select date"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">
                  Description (optional)
                </label>
                <div className="bg-white border border-gray-300 rounded-md">
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    placeholder="Add details about your certification..."
                    modules={{
                      toolbar: [
                        ['bold', 'italic', 'underline', 'list', 'bullet'],
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
      
      {certifications.length === 0 && !isAdding && (
        <div className="p-6 bg-gray-50 border border-gray-200 border-dashed rounded-md flex flex-col items-center justify-center text-center mt-4 mb-6">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/3150/3150115.png" 
            alt="Certifications" 
            className="w-12 h-12 opacity-30 mb-2"
          />
          <p className="text-gray-500 text-sm mb-2">No certifications added yet</p>
          <p className="text-gray-400 text-xs mb-3">Adding certifications will improve your resume progress</p>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Pro Tips:</h3>
        <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
          <li>Include relevant certifications that match the job requirements</li>
          <li>Add expiration dates if applicable</li>
          <li>Focus on industry-recognized certifications</li>
          <li>List certifications in order of relevance to the job you're applying for</li>
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

export default CertificationsForm;

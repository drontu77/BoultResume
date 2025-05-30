import React, { useState } from 'react';
import { useResume } from '../../contexts/ResumeContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface HobbiesFormProps {}

interface DragInfo {
  isDragging: boolean;
  startIndex: number | null;
}

const HobbiesForm: React.FC<HobbiesFormProps> = () => {
  const { resume, dispatch } = useResume();
  const hobbies = resume.hobbies || [];
  
  // State for new hobby entry
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // State for expandable hobby cards
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // State for drag and drop
  const [dragInfo, setDragInfo] = useState<DragInfo>({
    isDragging: false,
    startIndex: null
  });
  
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
    setDescription('');
    setEditingId(null);
  };
  
  // Handle adding a new hobby
  const handleAddHobby = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hobbyData = {
      id: editingId || crypto.randomUUID(),
      name,
      description
    };
    
    if (editingId) {
      // Update existing hobby
      const hobbyIndex = hobbies.findIndex(hobby => hobby.id === editingId);
      if (hobbyIndex !== -1) {
        const updatedHobbies = [...hobbies];
        updatedHobbies[hobbyIndex] = hobbyData;
        
        dispatch({
          type: 'UPDATE_HOBBIES',
          payload: updatedHobbies
        });
        
        showNotification('Hobby updated successfully');
      }
    } else {
      // Add new hobby
      dispatch({
        type: 'UPDATE_HOBBIES',
        payload: [...hobbies, hobbyData]
      });
      
      showNotification('Hobby added successfully');
    }
    
    // Reset form and hide it
    resetForm();
    setIsAdding(false);
  };
  
  // Handle editing a hobby
  const handleEditHobby = (id: string) => {
    const hobby = hobbies.find(hobby => hobby.id === id);
    if (hobby) {
      setName(hobby.name);
      setDescription(hobby.description);
      setEditingId(id);
      setIsAdding(true);
    }
  };
  
  // Handle deleting a hobby
  const handleDeleteHobby = (id: string) => {
    const updatedHobbies = hobbies.filter(hobby => hobby.id !== id);
    
    dispatch({
      type: 'UPDATE_HOBBIES',
      payload: updatedHobbies
    });
    
    showNotification('Hobby removed');
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
  };
  
  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragInfo.startIndex === null) return;
    
    // Reorder hobbies
    if (dragInfo.startIndex !== index) {
      const updatedHobbies = [...hobbies];
      const [removed] = updatedHobbies.splice(dragInfo.startIndex, 1);
      updatedHobbies.splice(index, 0, removed);
      
      dispatch({
        type: 'UPDATE_HOBBIES',
        payload: updatedHobbies
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
    if (count < 30) return 'text-red-500';
    if (count > 300) return 'text-orange-500';
    return 'text-gray-500';
  };
  
  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Hobbies & Interests</h2>
        
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Hobby
          </button>
        )}
      </div>
      
      {/* Hobby list */}
      {hobbies.length > 0 && (
        <div className="space-y-4 mb-6">
          {hobbies.map((hobby, index) => (
            <div
              key={hobby.id}
              className="border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div 
                className="flex justify-between items-start p-4 cursor-pointer group"
                onClick={() => setExpandedId(expandedId === hobby.id ? null : hobby.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="cursor-move p-1 mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md" onClick={e => e.stopPropagation()}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-800">{hobby.name}</h3>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditHobby(hobby.id);
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
                      if (window.confirm('Are you sure you want to delete this hobby?')) {
                        handleDeleteHobby(hobby.id);
                      }
                    }}
                    className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  {hobby.description && (
                    <button
                      type="button"
                      className="text-gray-400 p-1 rounded-md"
                    >
                      {expandedId === hobby.id ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>
              
              {expandedId === hobby.id && hobby.description && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  <div 
                    className="text-sm text-gray-600 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: hobby.description }}
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
            {editingId ? 'Edit Hobby' : 'Add Hobby'}
          </h3>
          
          <form onSubmit={handleAddHobby}>
            <div className="space-y-4">
              <div>
                <label htmlFor="hobbyName" className="block text-sm font-medium text-gray-600 mb-1">
                  Hobby/Interest*
                </label>
                <input
                  type="text"
                  id="hobbyName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Photography, Chess, Mountain Biking"
                  className="w-full px-3 py-2.5 text-gray-700 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
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
                    placeholder="Add details about this hobby or interest..."
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
                    {getCharacterCount() > 300 && " (consider shortening)"}
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
      
      {hobbies.length === 0 && !isAdding && (
        <div className="p-6 bg-gray-50 border border-gray-200 border-dashed rounded-md flex flex-col items-center justify-center text-center mt-4 mb-6">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/3202/3202926.png" 
            alt="Hobbies" 
            className="w-12 h-12 opacity-30 mb-2"
          />
          <p className="text-gray-500 text-sm mb-2">No hobbies added yet</p>
          <p className="text-gray-400 text-xs mb-3">Adding hobbies can make your resume more personable</p>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Pro Tips:</h3>
        <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
          <li>Include hobbies that demonstrate valuable skills</li>
          <li>Focus on active interests rather than passive ones</li>
          <li>Mention achievements related to your hobbies if relevant</li>
          <li>Keep this section brief and relevant to the job when space is limited</li>
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

export default HobbiesForm;

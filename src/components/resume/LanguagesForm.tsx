import React, { useState } from 'react';
import { useResume } from '../../contexts/ResumeContext';

interface LanguagesFormProps {}

interface DragInfo {
  isDragging: boolean;
  startIndex: number | null;
}

// Proficiency levels for languages
const proficiencyLevels = [
  { value: 'Native', label: 'Native' },
  { value: 'Fluent', label: 'Fluent' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Beginner', label: 'Beginner' }
];

type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native';

const LanguagesForm: React.FC<LanguagesFormProps> = () => {
  const { resume, dispatch } = useResume();
  const languages = resume.languages || [];
  
  // State for new language entry
  const [isAdding, setIsAdding] = useState(false);
  const [language, setLanguage] = useState('');
  const [proficiency, setProficiency] = useState<ProficiencyLevel>('Intermediate');
  const [editingId, setEditingId] = useState<string | null>(null);
  
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
    setLanguage('');
    setProficiency('Intermediate');
    setEditingId(null);
  };
  
  // Handle adding a new language
  const handleAddLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    
    const languageData = {
      id: editingId || crypto.randomUUID(),
      name: language,
      proficiency: proficiency as ProficiencyLevel
    };
    
    if (editingId) {
      // Update existing language
      const langIndex = languages.findIndex(lang => lang.id === editingId);
      if (langIndex !== -1) {
        const updatedLanguages = [...languages];
        updatedLanguages[langIndex] = languageData;
        
        dispatch({
          type: 'UPDATE_LANGUAGES',
          payload: updatedLanguages
        });
        
        showNotification('Language updated successfully');
      }
    } else {
      // Add new language
      dispatch({
        type: 'UPDATE_LANGUAGES',
        payload: [...languages, languageData]
      });
      
      showNotification('Language added successfully');
    }
    
    // Reset form and hide it
    resetForm();
    setIsAdding(false);
  };
  
  // Handle editing a language
  const handleEditLanguage = (id: string) => {
    const lang = languages.find(lang => lang.id === id);
    if (lang) {
      setLanguage(lang.name);
      setProficiency(lang.proficiency);
      setEditingId(id);
      setIsAdding(true);
    }
  };
  
  // Handle deleting a language
  const handleDeleteLanguage = (id: string) => {
    const updatedLanguages = languages.filter(lang => lang.id !== id);
    
    dispatch({
      type: 'UPDATE_LANGUAGES',
      payload: updatedLanguages
    });
    
    showNotification('Language removed');
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
    
    // Reorder languages
    if (dragInfo.startIndex !== index) {
      const updatedLanguages = [...languages];
      const [removed] = updatedLanguages.splice(dragInfo.startIndex, 1);
      updatedLanguages.splice(index, 0, removed);
      
      dispatch({
        type: 'UPDATE_LANGUAGES',
        payload: updatedLanguages
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
  
  // Get proficiency label for display
  const getProficiencyLabel = (value: string) => {
    const level = proficiencyLevels.find(level => level.value === value);
    return level?.label || value;
  };
  
  // Get proficiency class for styling
  const getProficiencyClass = (level: string) => {
    switch (level) {
      case 'native':
        return 'bg-green-100 text-green-800';
      case 'fluent':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'basic':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Languages</h2>
        
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Language
          </button>
        )}
      </div>
      
      {/* Language list */}
      {languages.length > 0 && (
        <div className="space-y-4 mb-6">
          {languages.map((lang, index) => (
            <div
              key={lang.id}
              className="border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex justify-between items-center p-4 group">
                <div className="flex items-center">
                  <div className="cursor-move p-1 mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-800">{lang.name}</h3>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getProficiencyClass(lang.proficiency)}`}>
                    {getProficiencyLabel(lang.proficiency)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEditLanguage(lang.id)}
                      className="text-gray-400 hover:text-blue-600 p-1 rounded-md hover:bg-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this language?')) {
                          handleDeleteLanguage(lang.id);
                        }
                      }}
                      className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add/Edit Form */}
      {isAdding && (
        <div className="border border-blue-100 bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {editingId ? 'Edit Language' : 'Add Language'}
          </h3>
          
          <form onSubmit={handleAddLanguage}>
            <div className="space-y-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-600 mb-1">
                  Language*
                </label>
                <input
                  type="text"
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="e.g. English, Spanish, Mandarin"
                  className="w-full px-3 py-2.5 text-gray-700 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="proficiency" className="block text-sm font-medium text-gray-600 mb-1">
                  Proficiency Level*
                </label>
                <select
                  id="proficiency"
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value as ProficiencyLevel)}
                  className="w-full px-3 py-2.5 text-gray-700 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="" disabled>Select proficiency level</option>
                  {proficiencyLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
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
      
      {languages.length === 0 && !isAdding && (
        <div className="p-6 bg-gray-50 border border-gray-200 border-dashed rounded-md flex flex-col items-center justify-center text-center mt-4 mb-6">
          <span className="text-4xl opacity-30 mb-2">🗣️</span>
          <p className="text-gray-500 text-sm mb-2">No languages added yet</p>
          <p className="text-gray-400 text-xs mb-3">Language skills can be valuable for many positions</p>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Pro Tips:</h3>
        <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
          <li>Be honest about your language proficiency levels</li>
          <li>List languages in order of proficiency</li>
          <li>Mention specific language skills like technical writing or translation if applicable</li>
          <li>Include language certifications if you have them</li>
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

export default LanguagesForm;

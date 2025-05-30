import React, { useState } from 'react';
import { useResume } from '../../contexts/ResumeContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CustomSection } from '../../types/resume';

interface CustomSectionFormProps {
  sectionId: string;
  onClose: () => void;
}

interface DragInfo {
  isDragging: boolean;
  startIndex: number | null;
}

const CustomSectionForm: React.FC<CustomSectionFormProps> = ({ sectionId, onClose }) => {
  const { resume, dispatch } = useResume();
  const customSections = resume.customSections || [];
  const currentSection = customSections.find(section => section.id === sectionId);
  
  // State for section title
  const [sectionTitle, setSectionTitle] = useState(currentSection?.title || '');
  
  // State for items
  const [items, setItems] = useState(currentSection?.items || []);
  
  // State for new item
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [itemTitle, setItemTitle] = useState('');
  const [itemSubtitle, setItemSubtitle] = useState('');
  const [itemDate, setItemDate] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  
  // State for expandable items
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  
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
  
  // Reset item form fields
  const resetItemForm = () => {
    setItemTitle('');
    setItemSubtitle('');
    setItemDate('');
    setItemDescription('');
    setEditingItemId(null);
  };
  
  // Handle saving the custom section
  const handleSaveSection = () => {
    if (!sectionTitle.trim()) {
      showNotification('Section title is required');
      return;
    }
    
    const updatedSection: CustomSection = {
      id: sectionId,
      title: sectionTitle,
      items: items
    };
    
    const sectionIndex = customSections.findIndex(section => section.id === sectionId);
    
    if (sectionIndex !== -1) {
      // Update existing section
      const updatedSections = [...customSections];
      updatedSections[sectionIndex] = updatedSection;
      
      dispatch({
        type: 'UPDATE_CUSTOM_SECTIONS',
        payload: updatedSections
      });
    } else {
      // Add new section
      dispatch({
        type: 'UPDATE_CUSTOM_SECTIONS',
        payload: [...customSections, updatedSection]
      });
    }
    
    showNotification('Section saved successfully');
    onClose();
  };
  
  // Handle adding a new item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemTitle.trim()) {
      showNotification('Title is required');
      return;
    }
    
    const newItem = {
      id: editingItemId || crypto.randomUUID(),
      title: itemTitle,
      subtitle: itemSubtitle,
      date: itemDate,
      description: itemDescription
    };
    
    if (editingItemId) {
      // Update existing item
      const itemIndex = items.findIndex(item => item.id === editingItemId);
      if (itemIndex !== -1) {
        const updatedItems = [...items];
        updatedItems[itemIndex] = newItem;
        setItems(updatedItems);
      }
    } else {
      // Add new item
      setItems([...items, newItem]);
    }
    
    // Reset form and hide it
    resetItemForm();
    setIsAddingItem(false);
  };
  
  // Handle editing an item
  const handleEditItem = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      setItemTitle(item.title);
      setItemSubtitle(item.subtitle);
      setItemDate(item.date);
      setItemDescription(item.description);
      setEditingItemId(id);
      setIsAddingItem(true);
    }
  };
  
  // Handle deleting an item
  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    showNotification('Item removed');
  };
  
  // Handle form cancellation
  const handleCancel = () => {
    resetItemForm();
    setIsAddingItem(false);
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
    
    // Reorder items
    if (dragInfo.startIndex !== index) {
      const updatedItems = [...items];
      const [removed] = updatedItems.splice(dragInfo.startIndex, 1);
      updatedItems.splice(index, 0, removed);
      
      setItems(updatedItems);
      
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
    return stripHtml(itemDescription).length;
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
        <div>
          <label htmlFor="sectionTitle" className="block text-sm font-medium text-gray-600 mb-1">
            Section Title*
          </label>
          <input
            type="text"
            id="sectionTitle"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            placeholder="e.g. Awards & Honors"
            className="w-72 px-3 py-2.5 text-gray-700 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        {!isAddingItem && (
          <button
            onClick={() => setIsAddingItem(true)}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Item
          </button>
        )}
      </div>
      
      {/* Item list */}
      {items.length > 0 && (
        <div className="space-y-4 mb-6">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div 
                className="flex justify-between items-start p-4 cursor-pointer group"
                onClick={() => setExpandedItemId(expandedItemId === item.id ? null : item.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="cursor-move p-1 mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md" onClick={e => e.stopPropagation()}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-800">{item.title}</h3>
                      <div className="text-sm text-gray-500">
                        {item.subtitle && (
                          <span>{item.subtitle}</span>
                        )}
                        {item.subtitle && item.date && <span> • </span>}
                        {item.date && (
                          <span>{item.date}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditItem(item.id);
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
                      if (window.confirm('Are you sure you want to delete this item?')) {
                        handleDeleteItem(item.id);
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
                    {expandedItemId === item.id ? (
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
              
              {expandedItemId === item.id && item.description && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  <div 
                    className="text-sm text-gray-600 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Add/Edit Item Form */}
      {isAddingItem && (
        <div className="border border-blue-100 bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {editingItemId ? 'Edit Item' : 'Add Item'}
          </h3>
          
          <form onSubmit={handleAddItem}>
            <div className="space-y-4">
              <div>
                <label htmlFor="itemTitle" className="block text-sm font-medium text-gray-600 mb-1">
                  Title*
                </label>
                <input
                  type="text"
                  id="itemTitle"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  placeholder="e.g. Outstanding Achievement Award"
                  className="w-full px-3 py-2.5 text-gray-700 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="itemSubtitle" className="block text-sm font-medium text-gray-600 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  id="itemSubtitle"
                  value={itemSubtitle}
                  onChange={(e) => setItemSubtitle(e.target.value)}
                  placeholder="e.g. XYZ Organization"
                  className="w-full px-3 py-2.5 text-gray-700 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="itemDate" className="block text-sm font-medium text-gray-600 mb-1">
                  Date
                </label>
                <input
                  type="text"
                  id="itemDate"
                  value={itemDate}
                  onChange={(e) => setItemDate(e.target.value)}
                  placeholder="e.g. May 2023 or 2020-2022"
                  className="w-full px-3 py-2.5 text-gray-700 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <div className="bg-white border border-gray-300 rounded-md">
                  <ReactQuill
                    theme="snow"
                    value={itemDescription}
                    onChange={setItemDescription}
                    placeholder="Add details about this item..."
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
                  {editingItemId ? 'Save' : 'Add'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {items.length === 0 && !isAddingItem && (
        <div className="p-6 bg-gray-50 border border-gray-200 border-dashed rounded-md flex flex-col items-center justify-center text-center mt-4 mb-6">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png" 
            alt="Custom Section" 
            className="w-12 h-12 opacity-30 mb-2"
          />
          <p className="text-gray-500 text-sm mb-2">No items added yet</p>
          <p className="text-gray-400 text-xs mb-3">Add items to fill out this custom section</p>
        </div>
      )}
      
      <div className="flex justify-end space-x-2 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="bg-white text-gray-600 border border-gray-300 py-1.5 px-3 text-sm rounded hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveSection}
          className="bg-blue-500 text-white py-1.5 px-3 text-sm rounded hover:bg-blue-600 transition-colors"
        >
          Save Section
        </button>
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

export default CustomSectionForm;

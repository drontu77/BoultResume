import React, { useState } from 'react';
import { useResume } from '../../contexts/ResumeContext';

interface SkillsFormProps {}

const SkillsForm: React.FC<SkillsFormProps> = () => {
  const { resume, dispatch } = useResume();
  const { skills } = resume;
  
  // State for new skill entry
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [level, setLevel] = useState(3); // Default to medium level (3 out of 5)
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Reset form fields
  const resetForm = () => {
    setName('');
    setLevel(3);
    setEditingId(null);
  };
  
  // Handle adding a new skill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing skill
      dispatch({
        type: 'UPDATE_SKILL',
        payload: {
          index: skills.findIndex(skill => skill.id === editingId),
          skill: {
            id: editingId || '',
            name,
            level
          }
        }
      });
    } else {
      // Add new skill
      dispatch({
        type: 'ADD_SKILL',
        payload: {
          id: crypto.randomUUID(),
          name,
          level
        }
      });
    }
    
    // Reset form and hide it
    resetForm();
    setIsAdding(false);
  };
  
  // Handle editing a skill
  const handleEditSkill = (id: string) => {
    const skill = skills.find(skill => skill.id === id);
    if (skill) {
      setName(skill.name);
      setLevel(skill.level);
      setEditingId(id);
      setIsAdding(true);
    }
  };
  
  // Handle deleting a skill
  const handleDeleteSkill = (id: string) => {
    const index = skills.findIndex(skill => skill.id === id);
    if (index !== -1) {
      dispatch({
        type: 'DELETE_SKILL',
        payload: index
      });
    }
  };
  
  // Handle form cancellation
  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
  };
  
  // Get level label
  const getLevelLabel = (level: number) => {
    switch (level) {
      case 1: return 'Novice';
      case 2: return 'Beginner';
      case 3: return 'Intermediate';
      case 4: return 'Advanced';
      case 5: return 'Expert';
      default: return 'Intermediate';
    }
  };

  return (
    <div className="skills-form">
      <h2 className="text-2xl font-bold mb-4">Skills</h2>
      <p className="text-gray-600 mb-6">
        Add 5-10 relevant skills that showcase your strengths and expertise.
        Rate your proficiency level for each skill to stand out to employers.
      </p>
      
      {/* List of existing skills */}
      {skills.length > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div 
              key={skill.id} 
              className="p-3 border border-gray-200 rounded-md hover:border-gray-300 transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{skill.name}</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditSkill(skill.id)}
                    className="text-blue-500 hover:text-blue-700"
                    aria-label="Edit skill"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Delete skill"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${skill.level * 20}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-xs text-gray-500">{getLevelLabel(skill.level)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add skill button or form */}
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {editingId ? 'Edit Skill' : 'Add Skill'}
        </button>
      ) : (
        <form onSubmit={handleAddSkill} className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
          <h3 className="text-lg font-medium mb-4">{editingId ? 'Edit Skill' : 'Add Skill'}</h3>
          
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Skill Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. JavaScript, Project Management, Customer Service"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
              Proficiency Level: {getLevelLabel(level)}
            </label>
            <input
              type="range"
              id="level"
              min="1"
              max="5"
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Novice</span>
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Advanced</span>
              <span>Expert</span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              {editingId ? 'Update Skill' : 'Add Skill'}
            </button>
          </div>
        </form>
      )}
      
      <div className="mt-4 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Pro Tips:</h3>
        <ul className="text-sm text-blue-700 list-disc pl-5">
          <li>Include a mix of technical (hard) and interpersonal (soft) skills</li>
          <li>Be honest about your proficiency levels</li>
          <li>Prioritize skills mentioned in the job description you're applying to</li>
          <li>Use industry-standard terminology for technical skills</li>
        </ul>
      </div>
      
      {/* Navigation buttons removed - now handled in ResumeBuilder.tsx */}
    </div>
  );
};

export default SkillsForm;
import React, { createContext, useState, useContext } from 'react';

// We'll define actual templates in a separate file
// This is just the context to manage template selection
interface TemplateContextType {
  currentTemplateId: string;
  setCurrentTemplateId: (id: string) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export const TemplateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTemplateId, setCurrentTemplateId] = useState('toronto');
  const [accentColor, setAccentColor] = useState('#008080');
  
  return (
    <TemplateContext.Provider value={{ 
      currentTemplateId, 
      setCurrentTemplateId,
      accentColor,
      setAccentColor
    }}>
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
};
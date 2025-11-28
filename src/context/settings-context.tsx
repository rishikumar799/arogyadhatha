'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState('light');

  return (
    <SettingsContext.Provider value={{ theme, setTheme }}>
      {children}
    </SettingsContext.Provider>
  );
};

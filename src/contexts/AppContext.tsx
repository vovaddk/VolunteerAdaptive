import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'volunteer' | 'organization' | 'coordinator' | 'deliverer' | 'displaced' | null;

export type AppMode = {
  dark: boolean;
  lowBandwidth: boolean;
  frontline: boolean;
  compact: boolean;
  largeUI: boolean; // Accessibility mode with enlarged UI
};

export type UserProfile = {
  name: string;
  role: UserRole;
  location: 'frontline' | 'rear' | 'deoccupied' | 'online';
  verified: boolean;
  stats: {
    hours: number;
    deliveries: number;
    rating: number;
  };
  preferences: string[];
};

type AppContextType = {
  mode: AppMode;
  setMode: (mode: Partial<AppMode>) => void;
  toggleDarkMode: () => void;
  toggleLowBandwidth: () => void;
  toggleFrontlineMode: () => void;
  toggleLargeUI: () => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  behavioralData: {
    frequentCategories: string[];
    recentSearches: string[];
    preferredUrgency: boolean;
  };
  updateBehavior: (data: Partial<AppContextType['behavioralData']>) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<AppMode>({
    dark: false,
    lowBandwidth: false,
    frontline: false,
    compact: false,
    largeUI: false,
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [behavioralData, setBehavioralData] = useState({
    frequentCategories: [] as string[],
    recentSearches: [] as string[],
    preferredUrgency: false,
  });

  // Auto-detect and suggest modes based on context
  useEffect(() => {
    // Detect mobile
    const isMobile = window.innerWidth < 768;
    
    // Detect slow connection (if available)
    const connection = (navigator as any).connection;
    if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
      setModeState(prev => ({ ...prev, lowBandwidth: true }));
    }

    // Auto-compact on mobile
    if (isMobile) {
      setModeState(prev => ({ ...prev, compact: true }));
    }

    // Detect dark mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      setModeState(prev => ({ ...prev, dark: true }));
    }
  }, []);

  const setMode = (newMode: Partial<AppMode>) => {
    setModeState(prev => ({ ...prev, ...newMode }));
  };

  const toggleDarkMode = () => {
    setModeState(prev => ({ ...prev, dark: !prev.dark }));
  };

  const toggleLowBandwidth = () => {
    setModeState(prev => ({ ...prev, lowBandwidth: !prev.lowBandwidth }));
  };

  const toggleFrontlineMode = () => {
    setModeState(prev => ({ ...prev, frontline: !prev.frontline }));
  };

  const toggleLargeUI = () => {
    setModeState(prev => ({ ...prev, largeUI: !prev.largeUI }));
  };

  const updateBehavior = (data: Partial<AppContextType['behavioralData']>) => {
    setBehavioralData(prev => ({ ...prev, ...data }));
  };

  // Apply large UI styles to document
  useEffect(() => {
    if (mode.largeUI) {
      document.documentElement.style.setProperty('--scale-factor', '1.3');
      document.documentElement.classList.add('large-ui');
    } else {
      document.documentElement.style.setProperty('--scale-factor', '1');
      document.documentElement.classList.remove('large-ui');
    }
  }, [mode.largeUI]);

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        toggleDarkMode,
        toggleLowBandwidth,
        toggleFrontlineMode,
        toggleLargeUI,
        userProfile,
        setUserProfile,
        behavioralData,
        updateBehavior,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
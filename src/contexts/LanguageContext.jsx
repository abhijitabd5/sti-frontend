import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  currentLanguage: 'English',
  isLoading: false
};

// Action types
const LANGUAGE_ACTIONS = {
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_LOADING: 'SET_LOADING'
};

// Available languages
export const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
];

// Reducer function
const languageReducer = (state, action) => {
  switch (action.type) {
    case LANGUAGE_ACTIONS.SET_LANGUAGE:
      return {
        ...state,
        currentLanguage: action.payload,
        isLoading: false
      };
    
    case LANGUAGE_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    default:
      return state;
  }
};

// Create context
const LanguageContext = createContext();

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(languageReducer, initialState);

  // Load saved language on app start
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && AVAILABLE_LANGUAGES.find(lang => lang.name === savedLanguage)) {
      dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: savedLanguage });
    }
  }, []);

  // Change language function
  const changeLanguage = (language) => {
    dispatch({ type: LANGUAGE_ACTIONS.SET_LOADING, payload: true });
    
    // Save to localStorage
    localStorage.setItem('language', language);
    
    // Update state
    dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: language });
    
    // Here you could add API calls to fetch language-specific data
    // For now, we'll just simulate loading
    setTimeout(() => {
      dispatch({ type: LANGUAGE_ACTIONS.SET_LOADING, payload: false });
    }, 300);
  };

  // Get current language object
  const getCurrentLanguageObj = () => {
    return AVAILABLE_LANGUAGES.find(lang => lang.name === state.currentLanguage) || AVAILABLE_LANGUAGES[0];
  };

  // Check if language is current
  const isCurrentLanguage = (language) => {
    return state.currentLanguage === language;
  };

  // Context value
  const value = {
    // State
    currentLanguage: state.currentLanguage,
    isLoading: state.isLoading,
    
    // Actions
    changeLanguage,
    
    // Helpers
    getCurrentLanguageObj,
    isCurrentLanguage,
    availableLanguages: AVAILABLE_LANGUAGES
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Toast = ({ 
  type = 'info', 
  message, 
  isVisible = false, 
  onClose, 
  autoClose = true, 
  duration = 4000 
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef(null);
  const isClosingRef = useRef(false);

  const handleClose = useCallback(() => {
    // Prevent multiple close calls
    if (isClosingRef.current) return;
    
    isClosingRef.current = true;
    setIsExiting(true);
    
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      onClose();
      setIsExiting(false);
      isClosingRef.current = false;
    }, 300);
  }, [onClose]);

  useEffect(() => {
    // Reset closing flag when toast becomes visible
    if (isVisible) {
      setIsExiting(false);
      isClosingRef.current = false;
      
      // Set up auto-close timer
      if (autoClose) {
        timerRef.current = setTimeout(() => {
          handleClose();
        }, duration);
      }
    }

    // Cleanup timer on unmount or when visibility changes
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isVisible, autoClose, duration, handleClose]);

  if (!isVisible && !isExiting) return null;

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          textColor: 'text-green-800 dark:text-green-400',
          borderColor: 'border-green-200 dark:border-green-800',
          icon: CheckCircleIcon,
          iconColor: 'text-green-500'
        };
      case 'error':
        return {
          bgColor: 'bg-red-100 dark:bg-red-900/20',
          textColor: 'text-red-800 dark:text-red-400',
          borderColor: 'border-red-200 dark:border-red-800',
          icon: XCircleIcon,
          iconColor: 'text-red-500'
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
          textColor: 'text-yellow-800 dark:text-yellow-400',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          icon: ExclamationTriangleIcon,
          iconColor: 'text-yellow-500'
        };
      default: // info
        return {
          bgColor: 'bg-blue-100 dark:bg-blue-900/20',
          textColor: 'text-blue-800 dark:text-blue-400',
          borderColor: 'border-blue-200 dark:border-blue-800',
          icon: InformationCircleIcon,
          iconColor: 'text-blue-500'
        };
    }
  };

  const config = getToastConfig();
  const IconComponent = config.icon;

  return (
    <div className="fixed top-4 right-4 z-[99999] max-w-sm w-full pointer-events-none">
      <div className={`${config.bgColor} ${config.borderColor} ${config.textColor} border rounded-lg shadow-lg p-4 pointer-events-auto transition-all duration-300 ${
        isExiting ? 'animate-[slideOutRight_0.3s_ease-in-out] opacity-0' : 'animate-[slideInRight_0.3s_ease-in-out] opacity-100'
      }`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
              }}
              className={`inline-flex rounded-md hover:bg-black/10 dark:hover:bg-white/10 p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${config.textColor}`}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
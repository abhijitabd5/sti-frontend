import React, { useState, useEffect } from 'react';

// Icons
import { 
  CheckCircleIcon,
  DocumentArrowUpIcon,
  UserPlusIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleIconSolid
} from '@heroicons/react/24/solid';

function ProgressModal({ isOpen, hasDocuments }) {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      
      // Simulate enrollment progress
      const timer1 = setTimeout(() => {
        setCurrentStep(2);
      }, 1000);

      // Simulate document upload progress (if documents are present)
      const timer2 = setTimeout(() => {
        if (hasDocuments) {
          setCurrentStep(3);
        } else {
          setCurrentStep(4); // Skip to completion
        }
      }, 1500);

      // Final completion
      const timer3 = setTimeout(() => {
        setCurrentStep(4);
      }, hasDocuments ? 2500 : 2000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen, hasDocuments]);

  if (!isOpen) return null;

  const steps = [
    {
      id: 1,
      title: 'Enrolling Student',
      description: 'Creating student profile and enrollment record',
      icon: UserPlusIcon,
    },
    {
      id: 2,
      title: 'Processing Payment',
      description: 'Recording payment information and fee calculations',
      icon: CheckCircleIconSolid,
      show: true
    },
    {
      id: 3,
      title: 'Uploading Documents',
      description: 'Uploading and processing student documents',
      icon: DocumentArrowUpIcon,
      show: hasDocuments
    },
    {
      id: 4,
      title: 'Enrollment Complete',
      description: 'Student has been successfully enrolled!',
      icon: SparklesIcon,
      show: true
    }
  ];

  const visibleSteps = steps.filter(step => step.show !== false);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500/60 dark:bg-gray-900/70"
          aria-hidden="true"
        />

        {/* Center modal */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal panel */}
        <div className="relative z-[10000] inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <div className="flex items-center mb-6">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900 sm:mx-0 sm:h-10 sm:w-10">
                  <UserPlusIcon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="ml-4 text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                  Student Enrollment Progress
                </h3>
              </div>
              
              <div className="space-y-4">
                {visibleSteps.map((step, index) => {
                  const isCompleted = currentStep > step.id;
                  const isActive = currentStep === step.id;
                  const isPending = currentStep < step.id;

                  return (
                    <div key={step.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300' 
                            : isActive 
                            ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-300' 
                            : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                        }`}>
                          {isCompleted ? (
                            <CheckCircleIconSolid className="w-6 h-6" />
                          ) : isActive ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                          ) : (
                            <step.icon className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${
                          isCompleted 
                            ? 'text-green-900 dark:text-green-100' 
                            : isActive 
                            ? 'text-violet-900 dark:text-violet-100' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {step.title}
                          {isCompleted && (
                            <CheckCircleIcon className="inline-block w-4 h-4 ml-2 text-green-600 dark:text-green-300" />
                          )}
                        </div>
                        <div className={`text-xs mt-1 ${
                          isCompleted 
                            ? 'text-green-700 dark:text-green-300' 
                            : isActive 
                            ? 'text-violet-700 dark:text-violet-300' 
                            : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          {step.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {currentStep === visibleSteps.length && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
                    <SparklesIcon className="w-8 h-8 text-green-600 dark:text-green-300" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Enrollment Successful!
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    The student has been successfully enrolled. You will be redirected to the students list shortly.
                  </p>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${(Math.min(currentStep, visibleSteps.length) / visibleSteps.length) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>Progress</span>
                  <span>{Math.min(currentStep, visibleSteps.length)} of {visibleSteps.length} complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressModal;

'use client';

import { CheckCircle, Circle } from 'lucide-react';
import { useBillStore } from '@/store/useBillStore';

export function ProgressIndicator() {
  const { currentStep } = useBillStore();

  const steps = [
    { number: 1, title: 'Upload', description: 'Upload receipt' },
    { number: 2, title: 'Confirm', description: 'Confirm items' },
    { number: 3, title: 'Assign', description: 'Assign to members' },
    { number: 4, title: 'Summary', description: 'View summary' },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                currentStep > step.number
                  ? 'bg-green-500 border-green-500 text-white'
                  : currentStep === step.number
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {currentStep > step.number ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.number}</span>
                )}
              </div>
              <div className="text-center mt-2">
                <p className={`text-sm font-medium ${
                  currentStep >= step.number ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${
                currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
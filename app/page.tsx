'use client';

import { ProgressIndicator } from '@/components/ProgressIndicator';
import { UploadStep } from '@/components/steps/UploadStep';
import { ConfirmStep } from '@/components/steps/ConfirmStep';
import { AssignStep } from '@/components/steps/AssignStep';
import { SummaryStep } from '@/components/steps/SummaryStep';
import { useBillStore } from '@/store/useBillStore';

export default function Home() {
  const { currentStep, error } = useBillStore();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <UploadStep />;
      case 2:
        return <ConfirmStep />;
      case 3:
        return <AssignStep />;
      case 4:
        return <SummaryStep />;
      default:
        return <UploadStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Split Bill
          </h1>
          <p className="text-gray-600 text-lg">
            Upload a receipt, confirm items, and split the bill with friends
          </p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator />

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Current Step */}
        {renderCurrentStep()}
      </div>
    </div>
  );
}
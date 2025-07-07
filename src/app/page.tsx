// src/app/page.tsx
"use client";

import { useBillStore } from "@/store/billStore";
import UploadStep from "@/components/steps/UploadStep";
import ConfirmStep from "@/components/steps/ConfirmStep";
import AssignStep from "@/components/steps/AssignStep";
import SummaryStep from "@/components/steps/SummaryStep";

export default function Home() {
  const { ocrProcessingStatus, items, members } = useBillStore();

  // Determine which step to show based on state
  const getCurrentStep = () => {
    if (ocrProcessingStatus === "idle") {
      return 1; // Upload step
    }
    if (ocrProcessingStatus === "pending" || ocrProcessingStatus === "error") {
      return 2; // Confirm step (with loading/error state)
    }
    if (ocrProcessingStatus === "success" && items.length > 0) {
      if (members.length === 0) {
        return 3; // Assign step (need to add members first)
      }
      return 4; // Summary step
    }
    return 1; // Default to upload step
  };

  const currentStep = getCurrentStep();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Split Bill App
          </h1>
          <p className="text-gray-600">
            Upload your receipt and split the bill with friends
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-center items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      step < currentStep ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 text-sm text-gray-600">
            <span>
              Step {currentStep}:{" "}
              {currentStep === 1
                ? "Upload Receipt"
                : currentStep === 2
                ? "Confirm Items"
                : currentStep === 3
                ? "Assign Items"
                : "Summary"}
            </span>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {currentStep === 1 && <UploadStep />}
          {currentStep === 2 && <ConfirmStep />}
          {currentStep === 3 && <AssignStep />}
          {currentStep === 4 && <SummaryStep />}
        </div>
      </div>
    </main>
  );
}

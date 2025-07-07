// src/components/steps/UploadStep.tsx
"use client";

import { useCallback } from "react";
import { useBillStore } from "@/store/billStore";
import { processReceiptAPI } from "@/lib/api";

export default function UploadStep() {
  const {
    imageFile,
    imageUrl,
    ocrProcessingStatus,
    setImageFile,
    setImageUrl,
    setOcrProcessingStatus,
    setItems,
  } = useBillStore();

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setImageFile(file);
        setImageUrl(URL.createObjectURL(file));
      }
    },
    [setImageFile, setImageUrl]
  );

  const handleProcessReceipt = useCallback(async () => {
    if (!imageFile) return;

    setOcrProcessingStatus("pending");
    try {
      const response = await processReceiptAPI(imageFile);
      setItems(
        response.items.map((item) => ({
          ...item,
          id: crypto.randomUUID(),
        }))
      );
      setOcrProcessingStatus("success");
    } catch (error) {
      console.error("Failed to process receipt:", error);
      setOcrProcessingStatus("error");
    }
  }, [imageFile, setOcrProcessingStatus, setItems]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Upload Your Receipt
        </h2>
        <p className="text-gray-600 mb-6">
          Take a photo or select an image of your receipt to get started
        </p>
      </div>

      {/* File Input */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, JPEG (MAX. 10MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      {/* Image Preview */}
      {imageUrl && (
        <div className="flex flex-col items-center">
          <div className="relative max-w-md">
            <img
              src={imageUrl}
              alt="Receipt preview"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <button
            onClick={() => {
              setImageFile(null);
              setImageUrl(null);
            }}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Remove image
          </button>
        </div>
      )}

      {/* Process Button */}
      {imageFile && (
        <div className="flex justify-center">
          <button
            onClick={handleProcessReceipt}
            disabled={ocrProcessingStatus === "pending"}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {ocrProcessingStatus === "pending"
              ? "Processing..."
              : "Process Receipt"}
          </button>
        </div>
      )}
    </div>
  );
}

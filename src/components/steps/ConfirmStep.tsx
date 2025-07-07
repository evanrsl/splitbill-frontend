// src/components/steps/ConfirmStep.tsx
"use client";

import { useState } from "react";
import { useBillStore } from "@/store/billStore";
import EditableListItem from "@/components/ui/EditableListItem";

export default function ConfirmStep() {
  const {
    ocrProcessingStatus,
    items,
    addItem,
    updateItem,
    deleteItem,
    setOcrProcessingStatus,
  } = useBillStore();

  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");

  const handleAddItem = () => {
    if (newItemDescription.trim() && newItemPrice.trim()) {
      const price = parseFloat(newItemPrice);
      if (!isNaN(price) && price > 0) {
        addItem(newItemDescription.trim(), price);
        setNewItemDescription("");
        setNewItemPrice("");
      }
    }
  };

  const handleRetry = () => {
    setOcrProcessingStatus("idle");
  };

  // Loading state
  if (ocrProcessingStatus === "pending") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Processing Your Receipt
        </h2>
        <p className="text-gray-600">
          Please wait while we extract the items from your receipt...
        </p>
      </div>
    );
  }

  // Error state
  if (ocrProcessingStatus === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 mb-4">
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Processing Failed
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn't process your receipt. Please try again or add items
          manually.
        </p>
        <button
          onClick={handleRetry}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Success state - show items for confirmation
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Confirm Receipt Items
        </h2>
        <p className="text-gray-600 mb-6">
          Review and edit the items we found. You can modify descriptions,
          prices, or add new items.
        </p>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No items found. Add some items below to get started.</p>
          </div>
        ) : (
          items.map((item) => (
            <EditableListItem
              key={item.id}
              item={item}
              onUpdate={(updates) => updateItem(item.id, updates)}
              onDelete={() => deleteItem(item.id)}
            />
          ))
        )}
      </div>

      {/* Add New Item */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Item</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              placeholder="Item description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="w-full sm:w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddItem}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
            >
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      {items.length > 0 && (
        <div className="flex justify-center pt-6">
          <button
            onClick={() => setOcrProcessingStatus("success")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Continue to Assignment
          </button>
        </div>
      )}
    </div>
  );
}

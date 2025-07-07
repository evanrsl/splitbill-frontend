// src/components/ui/EditableListItem.tsx
"use client";

import { useState } from "react";
import { OCRItem } from "@/types";

interface EditableListItemProps {
  item: OCRItem;
  onUpdate: (updates: Partial<OCRItem>) => void;
  onDelete: () => void;
}

export default function EditableListItem({
  item,
  onUpdate,
  onDelete,
}: EditableListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(item.description);
  const [editPrice, setEditPrice] = useState(item.price.toString());

  const handleSave = () => {
    const price = parseFloat(editPrice);
    if (!isNaN(price) && price > 0 && editDescription.trim()) {
      onUpdate({
        description: editDescription.trim(),
        price: price,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditDescription(item.description);
    setEditPrice(item.price.toString());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex-1">
          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Item description"
          />
        </div>
        <div className="w-full sm:w-32">
          <input
            type="number"
            step="0.01"
            min="0"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
      <div className="flex-1 mb-3 sm:mb-0">
        <h4 className="font-medium text-gray-900">{item.description}</h4>
        <p className="text-lg font-semibold text-green-600">
          ${item.price.toFixed(2)}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// src/components/steps/AssignStep.tsx
"use client";

import { useState } from "react";
import { useBillStore } from "@/store/billStore";

export default function AssignStep() {
  const { items, members, assignments, addMember, deleteMember, assignItem } =
    useBillStore();

  const [newMemberName, setNewMemberName] = useState("");

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      addMember(newMemberName.trim());
      setNewMemberName("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddMember();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Assign Items to Members
        </h2>
        <p className="text-gray-600 mb-6">
          Add the people who will split the bill and assign items to them
        </p>
      </div>

      {/* Add Members Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add Members</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter member name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleAddMember}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Add Member
          </button>
        </div>

        {/* Members List */}
        {members.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Current Members:
            </h4>
            <div className="flex flex-wrap gap-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center bg-white px-3 py-1 rounded-full border border-gray-200"
                >
                  <span className="text-sm">{member.name}</span>
                  <button
                    onClick={() => deleteMember(member.id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Assignment Section */}
      {members.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Assign Items
          </h3>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex-1 mb-3 sm:mb-0">
                  <h4 className="font-medium text-gray-900">
                    {item.description}
                  </h4>
                  <p className="text-lg font-semibold text-green-600">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-sm text-gray-600 sm:mr-2">
                    Assign to:
                  </label>
                  <select
                    value={assignments[item.id] || ""}
                    onChange={(e) =>
                      assignItem(item.id, e.target.value || null)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning if no members */}
      {members.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Add at least one member to start assigning items.</p>
        </div>
      )}
    </div>
  );
}

// src/components/steps/SummaryStep.tsx
"use client";

import { useBillStore } from "@/store/billStore";

export default function SummaryStep() {
  const { items, getMemberTotals, resetBill } = useBillStore();

  const memberTotals = getMemberTotals();
  const totalBill = items.reduce((sum, item) => sum + item.price, 0);
  const assignedTotal = memberTotals.reduce(
    (sum, member) => sum + member.totalOwed,
    0
  );
  const unassignedTotal = totalBill - assignedTotal;

  const handleStartOver = () => {
    resetBill();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Bill Summary
        </h2>
        <p className="text-gray-600 mb-6">
          Here's how the bill is split among members
        </p>
      </div>

      {/* Total Bill Summary */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Total Bill</p>
            <p className="text-2xl font-bold text-gray-900">
              ${totalBill.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Assigned</p>
            <p className="text-2xl font-bold text-green-600">
              ${assignedTotal.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Unassigned</p>
            <p className="text-2xl font-bold text-red-600">
              ${unassignedTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Member Totals */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Individual Totals
        </h3>
        <div className="space-y-4">
          {memberTotals.map((member) => (
            <div
              key={member.memberId}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  {member.memberName}
                </h4>
                <p className="text-xl font-bold text-blue-600">
                  ${member.totalOwed.toFixed(2)}
                </p>
              </div>

              {member.assignedItems.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Assigned items:</p>
                  <div className="space-y-1">
                    {member.assignedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-700">
                          {item.description}
                        </span>
                        <span className="text-gray-900 font-medium">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {member.assignedItems.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  No items assigned
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Unassigned Items */}
      {unassignedTotal > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-red-800 mb-2">
            Unassigned Items (${unassignedTotal.toFixed(2)})
          </h4>
          <div className="space-y-1">
            {items
              .filter(
                (item) =>
                  !Object.values(useBillStore.getState().assignments).includes(
                    item.id
                  )
              )
              .map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-red-700">{item.description}</span>
                  <span className="text-red-900 font-medium">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleStartOver}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700"
        >
          Start Over
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          Print Summary
        </button>
      </div>
    </div>
  );
}

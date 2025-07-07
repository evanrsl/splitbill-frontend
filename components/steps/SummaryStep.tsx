'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Receipt, Users, Share2 } from 'lucide-react';
import { useBillStore } from '@/store/useBillStore';

export function SummaryStep() {
  const { items, getMemberTotals, setCurrentStep, reset } = useBillStore();

  const memberTotals = getMemberTotals();
  const totalBill = items.reduce((sum, item) => sum + item.price, 0);

  const handleNewBill = () => {
    reset();
  };

  const handleShare = () => {
    const summaryText = `Bill Summary - Total: $${totalBill.toFixed(2)}\n\n` +
      memberTotals.map(member => 
        `${member.memberName}: $${member.totalOwed.toFixed(2)}\n` +
        member.assignedItems.map(item => `  • ${item.description}: $${item.price.toFixed(2)}`).join('\n')
      ).join('\n\n');

    if (navigator.share) {
      navigator.share({
        title: 'Bill Split Summary',
        text: summaryText,
      });
    } else {
      navigator.clipboard.writeText(summaryText);
      alert('Summary copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Bill Summary
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Here's how the bill is split among members
          </p>
          <div className="flex justify-center mt-4">
            <Badge variant="secondary" className="px-6 py-3 text-xl">
              <DollarSign className="w-5 h-5 mr-2" />
              Total Bill: ${totalBill.toFixed(2)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <Card className="border border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <Receipt className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold text-blue-800">{items.length}</p>
                <p className="text-sm text-blue-600">Items</p>
              </CardContent>
            </Card>
            <Card className="border border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold text-purple-800">{memberTotals.length}</p>
                <p className="text-sm text-purple-600">Members</p>
              </CardContent>
            </Card>
            <Card className="border border-green-200 bg-green-50">
              <CardContent className="p-4">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold text-green-800">
                  ${(totalBill / memberTotals.length).toFixed(2)}
                </p>
                <p className="text-sm text-green-600">Avg per Person</p>
              </CardContent>
            </Card>
          </div>

          {/* Member Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Member Breakdown
            </h3>
            {memberTotals.map((member) => (
              <Card key={member.memberId} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xl font-bold text-gray-800">{member.memberName}</h4>
                    <Badge variant="secondary" className="px-3 py-1 text-lg">
                      ${member.totalOwed.toFixed(2)}
                    </Badge>
                  </div>
                  <Separator className="mb-3" />
                  <div className="space-y-2">
                    {member.assignedItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span className="text-gray-600">{item.description}</span>
                        <span className="font-medium text-green-600">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                    {member.assignedItems.length === 0 && (
                      <p className="text-gray-500 italic">No items assigned</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setCurrentStep(3)}
              variant="outline"
              className="flex-1"
            >
              Back to Assign
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Summary
            </Button>
            <Button
              onClick={handleNewBill}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Split New Bill
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
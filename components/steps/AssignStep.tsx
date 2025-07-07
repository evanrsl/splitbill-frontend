'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, Trash2, UserPlus } from 'lucide-react';
import { useBillStore } from '@/store/useBillStore';

export function AssignStep() {
  const {
    items,
    members,
    assignments,
    addMember,
    deleteMember,
    assignItem,
    setCurrentStep,
  } = useBillStore();

  const [newMemberName, setNewMemberName] = useState('');

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      addMember(newMemberName.trim());
      setNewMemberName('');
    }
  };

  const getAssignedMemberName = (itemId: string) => {
    const memberId = assignments[itemId];
    return memberId ? members.find(m => m.id === memberId)?.name : 'Unassigned';
  };

  const unassignedItems = items.filter(item => !assignments[item.id]);
  const assignedItems = items.filter(item => assignments[item.id]);

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Assign Items
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Add members and assign items to split the bill
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Members Section */}
          <Card className="border border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Members ({members.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Enter member name"
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
                />
                <Button
                  onClick={handleAddMember}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>
              
              {members.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {members.map((member) => (
                    <Badge
                      key={member.id}
                      variant="secondary"
                      className="px-3 py-1 text-sm flex items-center gap-2"
                    >
                      {member.name}
                      <Button
                        onClick={() => deleteMember(member.id)}
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 hover:bg-red-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items Assignment Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Unassigned Items */}
            <Card className="border border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-orange-700">
                  Unassigned Items ({unassignedItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {unassignedItems.map((item) => (
                  <Card key={item.id} className="border border-orange-100 bg-orange-50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-800">{item.description}</p>
                          <p className="text-sm font-bold text-green-600">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Select
                        value={assignments[item.id] || ''}
                        onValueChange={(value) => assignItem(item.id, value || null)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Assign to member" />
                        </SelectTrigger>
                        <SelectContent>
                          {members.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                ))}
                {unassignedItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>All items have been assigned!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assigned Items */}
            <Card className="border border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-700">
                  Assigned Items ({assignedItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {assignedItems.map((item) => (
                  <Card key={item.id} className="border border-green-100 bg-green-50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-800">{item.description}</p>
                          <p className="text-sm font-bold text-green-600">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {getAssignedMemberName(item.id)}
                        </Badge>
                      </div>
                      <Select
                        value={assignments[item.id] || ''}
                        onValueChange={(value) => assignItem(item.id, value || null)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Reassign to member" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Unassign</SelectItem>
                          {members.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                ))}
                {assignedItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No items assigned yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setCurrentStep(2)}
              variant="outline"
              className="flex-1"
            >
              Back to Confirm
            </Button>
            <Button
              onClick={() => setCurrentStep(4)}
              disabled={members.length === 0 || unassignedItems.length > 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              View Summary
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
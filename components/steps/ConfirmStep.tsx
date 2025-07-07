'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Edit2, Check, X } from 'lucide-react';
import { useBillStore } from '@/store/useBillStore';

export function ConfirmStep() {
  const {
    items,
    ocrProcessingStatus,
    updateItem,
    deleteItem,
    addItem,
    setCurrentStep,
  } = useBillStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const startEditing = (item: any) => {
    setEditingId(item.id);
    setEditDescription(item.description);
    setEditPrice(item.price.toString());
  };

  const saveEdit = () => {
    if (editingId && editDescription.trim() && !isNaN(parseFloat(editPrice))) {
      updateItem(editingId, {
        description: editDescription.trim(),
        price: parseFloat(editPrice),
      });
      setEditingId(null);
      setEditDescription('');
      setEditPrice('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDescription('');
    setEditPrice('');
  };

  const handleAddItem = () => {
    if (newDescription.trim() && !isNaN(parseFloat(newPrice))) {
      addItem(newDescription.trim(), parseFloat(newPrice));
      setNewDescription('');
      setNewPrice('');
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  if (ocrProcessingStatus === 'pending') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-lg">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
              <h3 className="text-lg font-medium text-gray-700">
                Processing Your Receipt...
              </h3>
              <p className="text-gray-500">
                We're extracting items and prices from your receipt
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Confirm Items
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Review and edit the extracted items from your receipt
          </p>
          <div className="flex justify-center mt-4">
            <Badge variant="secondary" className="px-4 py-2 text-lg">
              Total: ${totalAmount.toFixed(2)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="border border-gray-200">
              <CardContent className="p-4">
                {editingId === item.id ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Item description"
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        step="0.01"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        placeholder="Price"
                        className="w-24"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={saveEdit}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        onClick={cancelEdit}
                        size="sm"
                        variant="outline"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.description}</p>
                      <p className="text-lg font-bold text-green-600">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startEditing(item)}
                        size="sm"
                        variant="outline"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteItem(item.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Add new item description"
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="Price"
                    className="w-24"
                  />
                </div>
                <Button
                  onClick={handleAddItem}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setCurrentStep(1)}
              variant="outline"
              className="flex-1"
            >
              Back to Upload
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              disabled={items.length === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Continue to Assign
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Camera, Image as ImageIcon, X } from 'lucide-react';
import { useBillStore } from '@/store/useBillStore';
import { v4 as uuidv4 } from 'uuid';

export function UploadStep() {
  const {
    imageFile,
    imageUrl,
    ocrProcessingStatus,
    setImageFile,
    setImageUrl,
    setOcrProcessingStatus,
    setItems,
    setCurrentStep,
    setError,
  } = useBillStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setError(null);
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processReceipt = async () => {
    if (!imageFile) return;

    setOcrProcessingStatus('pending');
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      // Mock API call - replace with actual endpoint
      const response = await fetch('/api/v1/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process receipt');
      }

      const data = await response.json();
      
      // Transform API response to include client-side IDs
      const itemsWithIds = data.items.map((item: any) => ({
        ...item,
        id: uuidv4(),
      }));

      setItems(itemsWithIds);
      setOcrProcessingStatus('success');
      setCurrentStep(2);
    } catch (error) {
      console.error('OCR processing error:', error);
      setOcrProcessingStatus('error');
      setError('Failed to process receipt. Please try again.');
      
      // Mock successful processing for demo
      setTimeout(() => {
        const mockItems = [
          { id: uuidv4(), description: 'Burger Deluxe', price: 15.50 },
          { id: uuidv4(), description: 'French Fries', price: 4.25 },
          { id: uuidv4(), description: 'Coca-Cola', price: 2.75 },
          { id: uuidv4(), description: 'Caesar Salad', price: 8.99 },
        ];
        setItems(mockItems);
        setOcrProcessingStatus('success');
        setCurrentStep(2);
      }, 1000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Upload Receipt
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Take a photo or select an image of your receipt to get started
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!imageUrl ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    Drag and drop your receipt here
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    or click to select from your device
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Select Image
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Receipt preview"
                  className="w-full h-64 object-cover rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={clearImage}
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={processReceipt}
                disabled={ocrProcessingStatus === 'pending'}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
              >
                {ocrProcessingStatus === 'pending' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing Receipt...
                  </>
                ) : (
                  'Process Receipt'
                )}
              </Button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  );
}
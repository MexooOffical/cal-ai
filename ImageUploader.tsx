'use client';

import React, { useState, useRef } from 'react';
import { analyzeFoodImage, imageToBase64 } from './api';
import { AIAnalysisResult } from './index';

interface ImageUploaderProps {
  onAnalysisComplete: (result: AIAnalysisResult, imageUrl: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onAnalysisComplete, isLoading, setIsLoading }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Please choose an image smaller than 8 MB.');
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await analyzeFoodImage(await imageToBase64(file));
      onAnalysisComplete(result, previewUrl ?? '');
    } catch (uploadError) {
      console.error(uploadError);
      setError(uploadError instanceof Error ? uploadError.message : 'Failed to analyze image.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <label htmlFor="food-image" className="mb-4 block w-full cursor-pointer rounded-lg border-2 border-dashed p-4 text-center hover:bg-gray-50">
        <span className="text-sm font-medium text-gray-600">{previewUrl ? 'Change image' : 'Upload a food photo'}</span>
        <input ref={fileInputRef} id="food-image" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>
      {previewUrl && <div className="mb-4"><img src={previewUrl} alt="Food preview" className="h-48 w-full rounded-lg object-cover" /><button onClick={handleReset} className="mt-2 text-sm text-gray-500 underline" type="button">Remove image</button></div>}
      {error && <div className="mb-4 rounded-md bg-red-50 p-2 text-sm text-red-600">{error}</div>}
      {previewUrl && <button onClick={handleUpload} disabled={isLoading} className="w-full rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300" type="button">{isLoading ? 'Analyzing...' : 'Analyze Food'}</button>}
    </div>
  );
};

export default ImageUploader;

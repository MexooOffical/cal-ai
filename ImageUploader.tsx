'use client';

import React, { useState, useRef } from 'react';
import { analyzeFoodImage, imageToBase64 } from '../utils/api';
import { AIAnalysisResult } from '../types';

interface ImageUploaderProps {
  onAnalysisComplete: (result: AIAnalysisResult, imageUrl: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onAnalysisComplete, 
  isLoading, 
  setIsLoading 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Create a preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setError(null);
  };

  const handleUpload = async () => {
    if (!previewUrl || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const file = fileInputRef.current?.files?.[0];
      if (!file) {
        setError('No file selected');
        setIsLoading(false);
        return;
      }

      // Convert image to base64
      const base64Image = await imageToBase64(file);
      
      // Analyze image using OpenAI
      const analysisResult = await analyzeFoodImage(base64Image);
      
      // Call the callback with the analysis result
      onAnalysisComplete(analysisResult, previewUrl);
      
    } catch (err) {
      console.error('Error during image analysis:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label 
          htmlFor="food-image" 
          className="block w-full p-4 border-2 border-dashed rounded-lg cursor-pointer text-center hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col items-center justify-center">
            <svg 
              className="w-8 h-8 mb-2 text-gray-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            <span className="text-sm font-medium text-gray-600">
              {previewUrl ? 'Change image' : 'Upload a food photo'}
            </span>
          </div>
          <input
            ref={fileInputRef}
            id="food-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
      
      {previewUrl && (
        <div className="mb-4">
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={previewUrl} 
              alt="Food preview" 
              className="w-full h-48 object-cover"
            />
            <button
              onClick={handleReset}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
              type="button"
            >
              <svg 
                className="w-5 h-5 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-500 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {previewUrl && (
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading 
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          type="button"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Food'}
        </button>
      )}
    </div>
  );
};

export default ImageUploader; 
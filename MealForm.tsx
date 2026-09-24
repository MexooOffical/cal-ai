'use client';

import React, { useState } from 'react';
import { Food, Meal } from '../types';

interface MealFormProps {
  foods: Food[];
  imageUrl: string | null;
  onSubmit: (meal: Meal) => void;
  onCancel: () => void;
}

const MealForm: React.FC<MealFormProps> = ({ 
  foods, 
  imageUrl, 
  onSubmit, 
  onCancel 
}) => {
  const [mealName, setMealName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!mealName.trim()) {
      setError('Please enter a meal name');
      return;
    }

    if (foods.length === 0) {
      setError('Please add at least one food item');
      return;
    }

    // Create new meal
    const newMeal: Meal = {
      id: Math.random().toString(36).substring(2, 15),
      name: mealName,
      timestamp: new Date().toISOString(),
      foods: foods,
      image: imageUrl || undefined
    };

    // Submit meal
    onSubmit(newMeal);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div>
        <label 
          htmlFor="meal-name" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Meal Name
        </label>
        <input
          id="meal-name"
          type="text"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          placeholder="e.g., Breakfast, Lunch, Snack, etc."
          className="w-full p-2 border rounded-md"
          autoFocus
        />
      </div>

      {foods.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">
            Meal Summary
          </h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Total Calories:</span>
              <span>
                {foods.reduce((sum, food) => sum + food.calories, 0)} cal
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Total Items:</span>
              <span>{foods.length}</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-2 bg-red-50 text-red-500 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Log Meal
        </button>
      </div>
    </form>
  );
};

export default MealForm; 
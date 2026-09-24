'use client';

import React, { useState } from 'react';
import { Food, Meal } from './index';

interface MealFormProps {
  foods: Food[];
  imageUrl: string | null;
  onSubmit: (meal: Meal) => void;
  onCancel: () => void;
}

const MealForm: React.FC<MealFormProps> = ({ foods, imageUrl, onSubmit, onCancel }) => {
  const [mealName, setMealName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!mealName.trim()) {
      setError('Please enter a meal name');
      return;
    }
    if (foods.length === 0) {
      setError('Please add at least one food item');
      return;
    }

    onSubmit({
      id: Math.random().toString(36).substring(2, 15),
      name: mealName.trim(),
      timestamp: new Date().toISOString(),
      foods,
      image: imageUrl || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div>
        <label htmlFor="meal-name" className="mb-1 block text-sm font-medium text-gray-700">Meal Name</label>
        <input id="meal-name" type="text" value={mealName} onChange={e => setMealName(e.target.value)} placeholder="e.g., Breakfast, Lunch, Snack, etc." className="w-full rounded-md border p-2" autoFocus />
      </div>

      {foods.length > 0 && (
        <div>
          <h3 className="mb-1 text-sm font-medium text-gray-700">Meal Summary</h3>
          <div className="rounded-md bg-gray-50 p-3">
            <div className="mb-2 flex justify-between text-sm"><span className="font-medium">Total Calories:</span><span>{foods.reduce((sum, food) => sum + food.calories, 0)} cal</span></div>
            <div className="flex justify-between text-sm"><span className="font-medium">Total Items:</span><span>{foods.length}</span></div>
          </div>
        </div>
      )}

      {error && <div className="rounded-md bg-red-50 p-2 text-sm text-red-500">{error}</div>}

      <div className="flex space-x-3">
        <button type="button" onClick={onCancel} className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
        <button type="submit" className="flex-1 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Log Meal</button>
      </div>
    </form>
  );
};

export default MealForm;

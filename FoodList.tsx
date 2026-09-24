'use client';

import React, { useState } from 'react';
import { Food } from './index';

interface FoodListProps {
  foods: Food[];
  onFoodsChange: (foods: Food[]) => void;
}

const FoodList: React.FC<FoodListProps> = ({ foods, onFoodsChange }) => {
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);

  const handleFoodChange = (updatedFood: Food) => {
    onFoodsChange(foods.map(food => food.id === updatedFood.id ? updatedFood : food));
  };

  const handleRemoveFood = (id: string) => {
    onFoodsChange(foods.filter(food => food.id !== id));
    setEditingFoodId(null);
  };

  const handleAddFood = () => {
    const newFood: Food = {
      id: Math.random().toString(36).substring(2, 15),
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      portion: 'serving'
    };

    onFoodsChange([...foods, newFood]);
    setEditingFoodId(newFood.id);
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">Detected Food Items</h3>
        <p className="text-sm text-gray-500">Review and edit these items before logging your meal</p>
      </div>

      {foods.length === 0 ? (
        <div className="rounded-lg bg-gray-50 py-8 text-center">
          <p className="text-gray-500">No food items detected. Add manually or try a different image.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {foods.map(food => (
            <div key={food.id} className="rounded-lg border bg-white p-3 shadow-sm">
              {editingFoodId === food.id ? (
                <div className="space-y-2">
                  <input type="text" value={food.name} onChange={e => handleFoodChange({ ...food, name: e.target.value })} className="w-full rounded-md border p-2" placeholder="Food name" />
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="block text-xs text-gray-500">Calories</label><input type="number" value={food.calories} onChange={e => handleFoodChange({ ...food, calories: Number(e.target.value) })} className="w-full rounded-md border p-2" min="0" /></div>
                    <div><label className="block text-xs text-gray-500">Portion</label><input type="text" value={food.portion} onChange={e => handleFoodChange({ ...food, portion: e.target.value })} className="w-full rounded-md border p-2" placeholder="e.g., 1 cup" /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div><label className="block text-xs text-gray-500">Protein (g)</label><input type="number" value={food.protein} onChange={e => handleFoodChange({ ...food, protein: Number(e.target.value) })} className="w-full rounded-md border p-2" min="0" /></div>
                    <div><label className="block text-xs text-gray-500">Carbs (g)</label><input type="number" value={food.carbs} onChange={e => handleFoodChange({ ...food, carbs: Number(e.target.value) })} className="w-full rounded-md border p-2" min="0" /></div>
                    <div><label className="block text-xs text-gray-500">Fats (g)</label><input type="number" value={food.fats} onChange={e => handleFoodChange({ ...food, fats: Number(e.target.value) })} className="w-full rounded-md border p-2" min="0" /></div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <button onClick={() => setEditingFoodId(null)} className="rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-800 hover:bg-gray-300" type="button">Done</button>
                    <button onClick={() => handleRemoveFood(food.id)} className="rounded-md bg-red-100 px-3 py-1 text-sm text-red-600 hover:bg-red-200" type="button">Remove</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{food.name}</h4>
                    <p className="text-sm text-gray-500">{food.portion}</p>
                    <div className="mt-1 flex space-x-3 text-xs text-gray-500"><span>{food.calories} cal</span><span>{food.protein}g protein</span><span>{food.carbs}g carbs</span><span>{food.fats}g fat</span></div>
                  </div>
                  <button onClick={() => setEditingFoodId(food.id)} className="p-1 text-gray-400 hover:text-gray-600" type="button" aria-label={`Edit ${food.name || 'food item'}`}>Edit</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button onClick={handleAddFood} className="mt-4 w-full rounded-lg border-2 border-dashed border-gray-300 py-2 text-gray-500 hover:bg-gray-50" type="button">+ Add Food Item Manually</button>
    </div>
  );
};

export default FoodList;

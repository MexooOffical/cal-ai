'use client';

import React, { useState } from 'react';
import { Food } from '../types';

interface FoodListProps {
  foods: Food[];
  onFoodsChange: (foods: Food[]) => void;
}

const FoodList: React.FC<FoodListProps> = ({ foods, onFoodsChange }) => {
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);

  // Handle changes to a food item
  const handleFoodChange = (updatedFood: Food) => {
    const updatedFoods = foods.map(food => 
      food.id === updatedFood.id ? updatedFood : food
    );
    onFoodsChange(updatedFoods);
  };

  // Remove a food item
  const handleRemoveFood = (id: string) => {
    const updatedFoods = foods.filter(food => food.id !== id);
    onFoodsChange(updatedFoods);
  };

  // Add a new empty food item
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
        <p className="text-sm text-gray-500">
          Review and edit these items before logging your meal
        </p>
      </div>

      {foods.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No food items detected. Add manually or try a different image.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {foods.map(food => (
            <div 
              key={food.id} 
              className="border rounded-lg p-3 bg-white shadow-sm"
            >
              {editingFoodId === food.id ? (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={food.name}
                      onChange={(e) => handleFoodChange({
                        ...food,
                        name: e.target.value
                      })}
                      className="w-full p-2 border rounded-md"
                      placeholder="Food name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500">
                        Calories
                      </label>
                      <input
                        type="number"
                        value={food.calories}
                        onChange={(e) => handleFoodChange({
                          ...food,
                          calories: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded-md"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">
                        Portion
                      </label>
                      <input
                        type="text"
                        value={food.portion}
                        onChange={(e) => handleFoodChange({
                          ...food,
                          portion: e.target.value
                        })}
                        className="w-full p-2 border rounded-md"
                        placeholder="e.g., 1 cup"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500">
                        Protein (g)
                      </label>
                      <input
                        type="number"
                        value={food.protein}
                        onChange={(e) => handleFoodChange({
                          ...food,
                          protein: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded-md"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">
                        Carbs (g)
                      </label>
                      <input
                        type="number"
                        value={food.carbs}
                        onChange={(e) => handleFoodChange({
                          ...food,
                          carbs: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded-md"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">
                        Fats (g)
                      </label>
                      <input
                        type="number"
                        value={food.fats}
                        onChange={(e) => handleFoodChange({
                          ...food,
                          fats: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded-md"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setEditingFoodId(null)}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300"
                      type="button"
                    >
                      Done
                    </button>
                    <button
                      onClick={() => handleRemoveFood(food.id)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-sm hover:bg-red-200"
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{food.name}</h4>
                    <p className="text-sm text-gray-500">{food.portion}</p>
                    <div className="mt-1 flex space-x-3 text-xs text-gray-500">
                      <span>{food.calories} cal</span>
                      <span>{food.protein}g protein</span>
                      <span>{food.carbs}g carbs</span>
                      <span>{food.fats}g fat</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingFoodId(food.id)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    type="button"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      ></path>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleAddFood}
        className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50"
        type="button"
      >
        + Add Food Item Manually
      </button>
    </div>
  );
};

export default FoodList; 
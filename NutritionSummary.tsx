'use client';

import React from 'react';
import { DailyNutrition, Meal } from '../types';

interface NutritionSummaryProps {
  nutrition: DailyNutrition;
  onDeleteMeal: (mealId: string) => void;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ 
  nutrition, 
  onDeleteMeal 
}) => {
  // Define daily targets (these could be configurable in a real app)
  const targets = {
    calories: 2000,
    protein: 120,
    carbs: 200,
    fats: 65
  };

  // Calculate percentages for progress bars
  const percentages = {
    calories: Math.min(100, (nutrition.totalCalories / targets.calories) * 100),
    protein: Math.min(100, (nutrition.totalProtein / targets.protein) * 100),
    carbs: Math.min(100, (nutrition.totalCarbs / targets.carbs) * 100),
    fats: Math.min(100, (nutrition.totalFats / targets.fats) * 100)
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">Nutrition Summary</h3>
        <p className="text-sm text-gray-500">
          {new Date(nutrition.date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="space-y-4">
        {/* Calories */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Calories</span>
            <span>
              {nutrition.totalCalories} / {targets.calories} cal
            </span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${percentages.calories}%` }}
            ></div>
          </div>
        </div>

        {/* Macros grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Protein */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Protein</span>
              <span>{nutrition.totalProtein}g</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${percentages.protein}%` }}
              ></div>
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Carbs</span>
              <span>{nutrition.totalCarbs}g</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 rounded-full"
                style={{ width: `${percentages.carbs}%` }}
              ></div>
            </div>
          </div>

          {/* Fats */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Fats</span>
              <span>{nutrition.totalFats}g</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 rounded-full"
                style={{ width: `${percentages.fats}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Meals list */}
      <div className="mt-8">
        <h4 className="text-md font-medium text-gray-900 mb-4">Logged Meals</h4>
        
        {nutrition.meals.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No meals logged for today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {nutrition.meals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onDelete={() => onDeleteMeal(meal.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for rendering individual meal cards
const MealCard: React.FC<{ 
  meal: Meal; 
  onDelete: () => void;
}> = ({ meal, onDelete }) => {
  // Calculate meal totals
  const mealTotals = {
    calories: meal.foods.reduce((sum, food) => sum + food.calories, 0),
    protein: meal.foods.reduce((sum, food) => sum + food.protein, 0),
    carbs: meal.foods.reduce((sum, food) => sum + food.carbs, 0),
    fats: meal.foods.reduce((sum, food) => sum + food.fats, 0),
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="flex border-b">
        {meal.image && (
          <div className="w-24 h-24 shrink-0">
            <img 
              src={meal.image} 
              alt={meal.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-3 flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h5 className="font-medium text-gray-900">{meal.name}</h5>
              <p className="text-xs text-gray-500">
                {new Date(meal.timestamp).toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit' 
                })}
              </p>
              <div className="mt-1 flex space-x-3 text-xs text-gray-500">
                <span>{mealTotals.calories} cal</span>
                <span>{mealTotals.protein}g protein</span>
              </div>
            </div>
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-500"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-gray-50">
        <h6 className="text-xs font-medium text-gray-500 mb-2">Food Items</h6>
        <ul className="text-sm space-y-1">
          {meal.foods.map((food) => (
            <li key={food.id} className="flex justify-between">
              <span>{food.name} ({food.portion})</span>
              <span>{food.calories} cal</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NutritionSummary; 
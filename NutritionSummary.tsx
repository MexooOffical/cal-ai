'use client';

import React from 'react';
import { DailyNutrition, Meal } from './index';

interface NutritionSummaryProps {
  nutrition: DailyNutrition;
  onDeleteMeal: (mealId: string) => void;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ nutrition, onDeleteMeal }) => {
  const targets = { calories: 2000, protein: 120, carbs: 200, fats: 65 };
  const percentages = {
    calories: Math.min(100, (nutrition.totalCalories / targets.calories) * 100),
    protein: Math.min(100, (nutrition.totalProtein / targets.protein) * 100),
    carbs: Math.min(100, (nutrition.totalCarbs / targets.carbs) * 100),
    fats: Math.min(100, (nutrition.totalFats / targets.fats) * 100),
  };

  return (
    <div className="w-full">
      <div className="mb-6"><h3 className="text-lg font-medium text-gray-900">Nutrition Summary</h3><p className="text-sm text-gray-500">{new Date(nutrition.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p></div>
      <div className="space-y-4">
        <Progress label="Calories" value={`${nutrition.totalCalories} / ${targets.calories} cal`} percentage={percentages.calories} color="bg-blue-500" />
        <div className="grid grid-cols-3 gap-4">
          <Progress label="Protein" value={`${nutrition.totalProtein}g`} percentage={percentages.protein} color="bg-green-500" />
          <Progress label="Carbs" value={`${nutrition.totalCarbs}g`} percentage={percentages.carbs} color="bg-yellow-500" />
          <Progress label="Fats" value={`${nutrition.totalFats}g`} percentage={percentages.fats} color="bg-red-500" />
        </div>
      </div>

      <div className="mt-8"><h4 className="mb-4 text-md font-medium text-gray-900">Logged Meals</h4>{nutrition.meals.length === 0 ? <div className="rounded-lg bg-gray-50 py-8 text-center"><p className="text-gray-500">No meals logged for today</p></div> : <div className="space-y-3">{nutrition.meals.map(meal => <MealCard key={meal.id} meal={meal} onDelete={() => onDeleteMeal(meal.id)} />)}</div>}</div>
    </div>
  );
};

const Progress: React.FC<{ label: string; value: string; percentage: number; color: string }> = ({ label, value, percentage, color }) => (
  <div><div className="mb-1 flex justify-between text-sm"><span className="font-medium">{label}</span><span>{value}</span></div><div className="h-2 w-full overflow-hidden rounded-full bg-gray-200"><div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} /></div></div>
);

const MealCard: React.FC<{ meal: Meal; onDelete: () => void }> = ({ meal, onDelete }) => {
  const mealTotals = meal.foods.reduce((totals, food) => ({
    calories: totals.calories + food.calories,
    protein: totals.protein + food.protein,
    carbs: totals.carbs + food.carbs,
    fats: totals.fats + food.fats,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="flex border-b">{meal.image && <div className="h-24 w-24 shrink-0"><img src={meal.image} alt={meal.name} className="h-full w-full object-cover" /></div>}<div className="flex-grow p-3"><div className="flex items-start justify-between"><div><h5 className="font-medium text-gray-900">{meal.name}</h5><p className="text-xs text-gray-500">{new Date(meal.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p><div className="mt-1 flex space-x-3 text-xs text-gray-500"><span>{mealTotals.calories} cal</span><span>{mealTotals.protein}g protein</span></div></div><button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-500" type="button" aria-label={`Delete ${meal.name}`}>Delete</button></div></div></div>
      <div className="bg-gray-50 p-3"><h6 className="mb-2 text-xs font-medium text-gray-500">Food Items</h6><ul className="space-y-1 text-sm">{meal.foods.map(food => <li key={food.id} className="flex justify-between"><span>{food.name} ({food.portion})</span><span>{food.calories} cal</span></li>)}</ul></div>
    </div>
  );
};

export default NutritionSummary;

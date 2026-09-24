import { DailyNutrition, Meal } from "../types";

// Get meals for a specific date
export const getMealsForDate = (date: string): DailyNutrition => {
  if (typeof window === 'undefined') {
    return {
      date,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      meals: [],
    };
  }

  const storedData = localStorage.getItem(`cal-ai-${date}`);
  
  if (!storedData) {
    return {
      date,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      meals: [],
    };
  }

  return JSON.parse(storedData) as DailyNutrition;
};

// Save a meal for a specific date
export const saveMeal = (date: string, newMeal: Meal): DailyNutrition => {
  const currentData = getMealsForDate(date);
  
  // Add the new meal
  currentData.meals.push(newMeal);
  
  // Recalculate totals
  const totals = calculateTotals(currentData.meals);
  
  const updatedData: DailyNutrition = {
    ...currentData,
    ...totals,
  };
  
  // Save to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(`cal-ai-${date}`, JSON.stringify(updatedData));
  }
  
  return updatedData;
};

// Delete a meal for a specific date
export const deleteMeal = (date: string, mealId: string): DailyNutrition => {
  const currentData = getMealsForDate(date);
  
  // Filter out the meal to delete
  const updatedMeals = currentData.meals.filter(meal => meal.id !== mealId);
  
  // Recalculate totals
  const totals = calculateTotals(updatedMeals);
  
  const updatedData: DailyNutrition = {
    ...currentData,
    meals: updatedMeals,
    ...totals,
  };
  
  // Save to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(`cal-ai-${date}`, JSON.stringify(updatedData));
  }
  
  return updatedData;
};

// Update a meal for a specific date
export const updateMeal = (date: string, updatedMeal: Meal): DailyNutrition => {
  const currentData = getMealsForDate(date);
  
  // Update the meal
  const updatedMeals = currentData.meals.map(meal => 
    meal.id === updatedMeal.id ? updatedMeal : meal
  );
  
  // Recalculate totals
  const totals = calculateTotals(updatedMeals);
  
  const updatedData: DailyNutrition = {
    ...currentData,
    meals: updatedMeals,
    ...totals,
  };
  
  // Save to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(`cal-ai-${date}`, JSON.stringify(updatedData));
  }
  
  return updatedData;
};

// Helper function to calculate nutrition totals
const calculateTotals = (meals: Meal[]) => {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;
  
  meals.forEach(meal => {
    meal.foods.forEach(food => {
      totalCalories += food.calories;
      totalProtein += food.protein;
      totalCarbs += food.carbs;
      totalFats += food.fats;
    });
  });
  
  return {
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFats,
  };
}; 
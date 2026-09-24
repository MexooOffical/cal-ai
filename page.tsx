'use client';

import React, { useState, useEffect } from 'react';
import ImageUploader from '../components/ImageUploader';
import FoodList from '../components/FoodList';
import MealForm from '../components/MealForm';
import TabNavigation, { TabType } from '../components/TabNavigation';
import NutritionSummary from '../components/NutritionSummary';
import { AIAnalysisResult, DailyNutrition, Food, Meal } from '../types';
import { saveMeal, getMealsForDate, deleteMeal } from '../utils/storage';

export default function Home() {
  // States
  const [activeTab, setActiveTab] = useState<TabType>('track');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<Food[]>([]);
  const [foodImageUrl, setFoodImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [showMealForm, setShowMealForm] = useState(false);
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition>({
    date: new Date().toISOString().split('T')[0],
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
    meals: []
  });

  // Load nutrition data on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const nutrition = getMealsForDate(today);
    setDailyNutrition(nutrition);
  }, []);

  // Handle AI analysis completed
  const handleAnalysisComplete = (result: AIAnalysisResult, imageUrl: string) => {
    setAnalysisResult(result);
    setDetectedFoods(result.foods);
    setFoodImageUrl(imageUrl);
  };

  // Handle changes to food items
  const handleFoodsChange = (updatedFoods: Food[]) => {
    setDetectedFoods(updatedFoods);
  };

  // Handle meal submission
  const handleMealSubmit = (meal: Meal) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedNutrition = saveMeal(today, meal);
    
    setDailyNutrition(updatedNutrition);
    setShowMealForm(false);
    resetMealTracking();
    setActiveTab('summary');
  };

  // Handle meal deletion
  const handleDeleteMeal = (mealId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedNutrition = deleteMeal(today, mealId);
    setDailyNutrition(updatedNutrition);
  };

  // Reset meal tracking state
  const resetMealTracking = () => {
    setDetectedFoods([]);
    setFoodImageUrl(null);
    setAnalysisResult(null);
  };

  // Cancel meal form
  const handleCancelMeal = () => {
    setShowMealForm(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto bg-white min-h-screen shadow-sm p-6">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Cal AI</h1>
          <p className="text-gray-500">AI-powered meal tracking</p>
        </header>

        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
        />

        {/* Track Meal Tab */}
        {activeTab === 'track' && (
          <div>
            {!showMealForm ? (
              <>
                <ImageUploader 
                  onAnalysisComplete={handleAnalysisComplete}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />

                {detectedFoods.length > 0 && (
                  <div className="mt-8">
                    <FoodList 
                      foods={detectedFoods} 
                      onFoodsChange={handleFoodsChange}
                    />
                    
                    <button
                      onClick={() => setShowMealForm(true)}
                      className="mt-6 w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      type="button"
                    >
                      Continue to Log Meal
                    </button>
                  </div>
                )}

                {analysisResult && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
                    <p className="text-blue-800">
                      AI Confidence: {analysisResult.confidence}%
                    </p>
                    {analysisResult.confidence < 70 && (
                      <p className="text-blue-600 mt-1">
                        The AI is not very confident in these results. Please review and edit the detected foods.
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <MealForm 
                foods={detectedFoods}
                imageUrl={foodImageUrl}
                onSubmit={handleMealSubmit}
                onCancel={handleCancelMeal}
              />
            )}
          </div>
        )}

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <NutritionSummary 
            nutrition={dailyNutrition}
            onDeleteMeal={handleDeleteMeal}
          />
        )}

        <footer className="mt-12 pt-6 border-t text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Cal AI - Powered by GPT-4o</p>
        </footer>
      </div>
    </main>
  );
}

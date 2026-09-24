'use client';

import React, { useEffect, useState } from 'react';
import ImageUploader from '../ImageUploader';
import FoodList from '../FoodList';
import MealForm from '../MealForm';
import TabNavigation, { TabType } from '../TabNavigation';
import NutritionSummary from '../NutritionSummary';
import { AIAnalysisResult, DailyNutrition, Food, Meal } from '../index';
import { deleteMeal, getMealsForDate, saveMeal } from '../storage';

export default function Home() {
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
    meals: [],
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDailyNutrition(getMealsForDate(today));
  }, []);

  const handleAnalysisComplete = (result: AIAnalysisResult, imageUrl: string) => {
    setAnalysisResult(result);
    setDetectedFoods(result.foods);
    setFoodImageUrl(imageUrl);
  };

  const handleMealSubmit = (meal: Meal) => {
    const today = new Date().toISOString().split('T')[0];
    setDailyNutrition(saveMeal(today, meal));
    setShowMealForm(false);
    setDetectedFoods([]);
    setFoodImageUrl(null);
    setAnalysisResult(null);
    setActiveTab('summary');
  };

  const handleDeleteMeal = (mealId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setDailyNutrition(deleteMeal(today, mealId));
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto min-h-screen max-w-lg bg-white p-6 shadow-sm">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Cal AI</h1>
          <p className="text-gray-500">AI-powered meal tracking</p>
        </header>

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

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
                    <FoodList foods={detectedFoods} onFoodsChange={setDetectedFoods} />
                    <button
                      onClick={() => setShowMealForm(true)}
                      className="mt-6 w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                      type="button"
                    >
                      Continue to Log Meal
                    </button>
                  </div>
                )}

                {analysisResult && (
                  <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm">
                    <p className="text-blue-800">AI Confidence: {analysisResult.confidence}%</p>
                    {analysisResult.confidence < 70 && (
                      <p className="mt-1 text-blue-600">
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
                onCancel={() => setShowMealForm(false)}
              />
            )}
          </div>
        )}

        {activeTab === 'summary' && (
          <NutritionSummary nutrition={dailyNutrition} onDeleteMeal={handleDeleteMeal} />
        )}

        <footer className="mt-12 border-t pt-6 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Cal AI - Powered by GPT-4o</p>
        </footer>
      </div>
    </main>
  );
}

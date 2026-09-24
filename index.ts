export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  portion: string;
}

export interface Meal {
  id: string;
  name: string;
  timestamp: string;
  foods: Food[];
  image?: string;
}

export interface DailyNutrition {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  meals: Meal[];
}

export interface AIAnalysisResult {
  foods: Food[];
  confidence: number;
} 
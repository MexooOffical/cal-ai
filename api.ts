import { AIAnalysisResult, Food } from "../types";
import OpenAI from "openai";

// Placeholder for your OpenAI API key - should be stored in environment variables
// We'll use a client-side approach for this MVP
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true, // Only for demo purposes
});

// Convert image to base64
export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Analyze food image using OpenAI's vision capability
export const analyzeFoodImage = async (base64Image: string): Promise<AIAnalysisResult> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a nutrition expert. Analyze the image of food and identify all the food items. 
          For each food item, provide:
          1. The name of the food
          2. Estimated calories (per portion shown)
          3. Estimated protein (in grams)
          4. Estimated carbs (in grams)
          5. Estimated fats (in grams)
          6. Portion description (e.g., "1 cup", "3 oz", etc.)
          
          Be as accurate as possible. If you're uncertain about any items, make your best guess.
          Return your analysis in this JSON format:
          {
            "foods": [
              {
                "name": "Food Name",
                "calories": number,
                "protein": number,
                "carbs": number,
                "fats": number,
                "portion": "portion description"
              }
            ],
            "confidence": number (0-100)
          }`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "What food items do you see in this image? Please analyze the nutritional content."
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
    });

    // Parse the response and extract the JSON data
    const content = response.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/{[\s\S]*}/);
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as { foods: Omit<Food, 'id'>[]; confidence: number };
      
      // Add IDs to the foods
      const foodsWithIds: Food[] = parsed.foods.map(food => ({
        ...food,
        id: generateId(),
      }));
      
      return {
        foods: foodsWithIds,
        confidence: parsed.confidence
      };
    }
    
    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Error analyzing food image:', error);
    throw error;
  }
};

// Generate a unique ID (simple implementation for demo)
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}; 
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { Food } from '../../../index';

export const runtime = 'nodejs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_IMAGE_LENGTH = 12_000_000;

type AnalysisResponse = {
  foods: Array<Omit<Food, 'id'>>;
  confidence: number;
};

const createFoodId = () => crypto.randomUUID();

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'The OPENAI_API_KEY environment variable is not configured.' },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as { image?: unknown };

    if (typeof body.image !== 'string' || !body.image.startsWith('data:image/')) {
      return NextResponse.json({ error: 'A valid image is required.' }, { status: 400 });
    }

    if (body.image.length > MAX_IMAGE_LENGTH) {
      return NextResponse.json(
        { error: 'The image is too large. Please choose an image smaller than 8 MB.' },
        { status: 413 },
      );
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content:
            'You are a nutrition expert. Analyze the food image and return only valid JSON with this shape: {"foods":[{"name":string,"calories":number,"protein":number,"carbs":number,"fats":number,"portion":string}],"confidence":number}. Use numbers for nutrition values and a confidence from 0 to 100.',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Identify the food and estimate its nutrition.' },
            { type: 'image_url', image_url: { url: body.image } },
          ],
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: 'The AI returned an empty response.' }, { status: 502 });
    }

    const parsed = JSON.parse(content) as Partial<AnalysisResponse>;
    const foods = Array.isArray(parsed.foods)
      ? parsed.foods
          .filter((food): food is Omit<Food, 'id'> => Boolean(food && typeof food === 'object'))
          .map((food) => ({
            id: createFoodId(),
            name: String(food.name ?? 'Unknown food'),
            calories: Number(food.calories) || 0,
            protein: Number(food.protein) || 0,
            carbs: Number(food.carbs) || 0,
            fats: Number(food.fats) || 0,
            portion: String(food.portion ?? '1 serving'),
          }))
      : [];

    return NextResponse.json({
      foods,
      confidence: Math.max(0, Math.min(100, Number(parsed.confidence) || 0)),
    });
  } catch (error) {
    console.error('Food analysis failed:', error);
    return NextResponse.json({ error: 'Unable to analyze this image right now.' }, { status: 502 });
  }
}

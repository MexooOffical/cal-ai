import type { AIAnalysisResult } from './index';

export const imageToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Unable to read the image.'));
    };
    reader.onerror = () => reject(reader.error ?? new Error('Unable to read the image.'));
    reader.readAsDataURL(file);
  });

export const analyzeFoodImage = async (image: string): Promise<AIAnalysisResult> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image }),
  });

  const data = (await response.json()) as AIAnalysisResult & { error?: string };
  if (!response.ok) throw new Error(data.error || 'Food analysis failed.');
  return data;
};

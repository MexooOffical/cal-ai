# Cal AI - AI-Powered Meal Tracking

Cal AI is an AI-powered meal tracking web application that uses GPT-4o to analyze food photos and estimate nutritional information. This MVP allows users to upload photos of their meals, get AI-driven food detection, edit the results, and track their daily nutrition intake.

## Features

- **AI-Powered Food Recognition**: Upload a meal photo and get AI detection of food items
- **Nutritional Analysis**: Get estimated calories, protein, carbs, and fats for each food item
- **Manual Adjustment**: Edit or add food items if the AI predictions aren't accurate
- **Meal Logging**: Store your meals with complete nutritional information
- **Nutrition Dashboard**: View your daily nutrition summary with progress bars
- **Mobile-friendly UI**: Clean, responsive design built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js (React)
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4o
- **State Management**: React Hooks + LocalStorage (no backend required)

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/cal-ai.git
cd cal-ai
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with your OpenAI API key:

```
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

> **Important**: For a production application, you should NEVER expose your API key in the client-side code. This MVP uses the client-side approach for simplicity, but a proper implementation would use a backend API to securely handle the OpenAI API calls.

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. On the "Track Meal" tab, upload a photo of your meal.
2. The AI will analyze the image and identify food items with estimated nutritional values.
3. Review and edit the detected food items if needed.
4. Click "Continue to Log Meal" and give your meal a name (e.g., "Lunch", "Dinner").
5. Click "Log Meal" to save it to your daily tracker.
6. Switch to the "Daily Summary" tab to see your nutrition totals and meal log.

## Project Structure

```
cal-ai/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── components/           # React components
│   │   │   ├── FoodList.tsx      # Food items editor
│   │   │   ├── ImageUploader.tsx # Image upload component
│   │   │   ├── MealForm.tsx      # Meal logging form
│   │   │   ├── NutritionSummary.tsx # Daily summary display
│   │   │   └── TabNavigation.tsx # Tab navigation component
│   │   ├── types/                # TypeScript type definitions
│   │   │   └── index.ts          # Types for food, meals, etc.
│   │   └── utils/                # Utility functions
│   │       ├── api.ts            # OpenAI API integration
│   │       └── storage.ts        # LocalStorage management
│   ├── .env.local                # Environment variables (create this)
│   ├── next.config.js            # Next.js configuration
│   ├── package.json              # Project dependencies
│   └── tailwind.config.js        # Tailwind CSS configuration
└── README.md                 # Project documentation
```

## Limitations & Future Improvements

This is an MVP with several limitations:

1. **Client-side API calls**: The OpenAI API is called directly from the client, which isn't secure for production use.
2. **Limited accuracy**: GPT-4o makes educated guesses about nutritional content but may not be 100% accurate.
3. **Local storage only**: Data is stored in browser local storage and will be lost if cleared.

Future improvements could include:

- Backend API for secure OpenAI integration
- User accounts and cloud storage
- Custom nutrition goals
- Meal plans and recommendations
- Integration with fitness tracking
- More detailed nutritional analysis
- Barcode scanning for packaged foods

## License

MIT

---

Created as an MVP demo for AI-powered food tracking capabilities.
# cal-ai

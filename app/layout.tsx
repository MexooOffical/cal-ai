import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Cal AI | AI-Powered Meal Tracking',
  description: 'Track your meals and nutrition with AI-powered food recognition and calorie estimation.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

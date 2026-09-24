'use client';

import React from 'react';

export type TabType = 'track' | 'summary';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  return (
    <div className="flex border-b mb-6">
      <button
        onClick={() => onTabChange('track')}
        className={`py-2 px-4 text-center flex-1 ${
          activeTab === 'track'
            ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        type="button"
      >
        Track Meal
      </button>
      <button
        onClick={() => onTabChange('summary')}
        className={`py-2 px-4 text-center flex-1 ${
          activeTab === 'summary'
            ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        type="button"
      >
        Daily Summary
      </button>
    </div>
  );
};

export default TabNavigation; 
import React from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabSwitcherProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-6 py-2.5 rounded-full text-sm font-medium
              flex items-center gap-2 min-w-[120px] justify-center
              transition-all duration-200
              ${isActive 
                ? 'bg-gray-800 text-white' 
                : 'text-blue-400 hover:bg-gray-800/50'
              }
            `}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="min-w-[24px] h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TabSwitcher;

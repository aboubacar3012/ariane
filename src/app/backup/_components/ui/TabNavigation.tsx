import React from "react";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string }[];
}

/**
 * Composant de navigation par onglets réutilisable
 */
const TabNavigation = ({ activeTab, onTabChange, tabs }: TabNavigationProps) => {
  return (
    <div className="flex space-x-1 rounded-lg bg-gray-700 p-1 mb-6">
      {tabs.map((tab) => (
        <button 
          key={tab.id}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.id 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:text-white hover:bg-gray-600'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
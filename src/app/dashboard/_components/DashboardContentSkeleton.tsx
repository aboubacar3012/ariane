'use client';
import React from 'react';

const DashboardContentSkeleton: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto animate-pulse">
      {/* Header avec informations utilisateur et sélecteur de projets */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl shadow-lg mb-6 border border-gray-700">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full mr-4 border-2 border-blue-500 bg-gray-700"></div>
              <div className="absolute bottom-0 right-3 w-4 h-4 bg-gray-600 rounded-full border-2 border-gray-800"></div>
            </div>
            <div>
              <div className="h-6 bg-gray-700 rounded w-40 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
              <div className="flex items-center text-xs mt-1 text-gray-400 space-x-2">
                <div className="h-3 bg-gray-700 rounded w-20"></div>
                <div className="h-3 bg-gray-700 rounded w-24"></div>
                <div className="h-3 bg-gray-700 rounded w-24"></div>
              </div>
            </div>
          </div>
          
          <div className="flex-grow max-w-md w-full md:w-auto">
            <div className="h-4 bg-gray-700 rounded w-40 mb-2"></div>
            <div className="h-10 bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Statistiques des Pull Requests - Colonne latérale */}
        <div className="lg:col-span-4">
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            <div className="p-4 bg-gray-750 border-b border-gray-700">
              <div className="h-6 bg-gray-700 rounded w-32"></div>
            </div>
            <div className="p-4">
              <div>
                {/* Card Grid for Stats - Skeleton */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-750 p-3 rounded-lg border border-gray-700">
                    <div className="h-3 bg-gray-700 rounded w-10 mb-2"></div>
                    <div className="h-6 bg-gray-700 rounded w-8"></div>
                  </div>
                  <div className="bg-gray-750 p-3 rounded-lg border border-gray-700">
                    <div className="h-3 bg-gray-700 rounded w-16 mb-2"></div>
                    <div className="h-6 bg-gray-700 rounded w-8"></div>
                  </div>
                  <div className="bg-gray-750 p-3 rounded-lg border border-gray-700">
                    <div className="h-3 bg-gray-700 rounded w-14 mb-2"></div>
                    <div className="h-6 bg-gray-700 rounded w-8"></div>
                  </div>
                </div>
                
                {/* Detailed Stats Table - Skeleton */}
                <div className="h-[200px] bg-gray-700 rounded-lg w-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Liste des Pull Requests - Partie principale */}
        <div className="lg:col-span-8">
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            <div className="p-4 bg-gray-750 border-b border-gray-700 flex justify-between items-center">
              <div className="h-6 bg-gray-700 rounded w-32"></div>
              
              <div className="flex space-x-1 rounded-lg bg-gray-700 p-1">
                <div className="h-8 bg-gray-600 rounded w-16"></div>
                <div className="h-8 bg-gray-600 rounded w-16"></div>
                <div className="h-8 bg-gray-600 rounded w-16"></div>
              </div>
            </div>
            
            <div className="p-4">
              {/* Pull Requests Table - Skeleton */}
              <div className="space-y-4">
                {Array(5).fill(0).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border-b border-gray-700">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-700 mr-3"></div>
                      <div>
                        <div className="h-4 bg-gray-700 rounded w-48 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
                    <div className="text-center">
                      <div className="h-4 bg-gray-700 rounded w-20 mb-1 mx-auto"></div>
                      <div className="h-3 bg-gray-700 rounded w-16 mx-auto"></div>
                    </div>
                    <div className="h-8 w-16 bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContentSkeleton;
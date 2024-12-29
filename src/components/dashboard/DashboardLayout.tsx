import React from 'react';
import ApiKeyManager from './ApiKeyManager';

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      <div className="max-w-7xl mx-auto p-8 pt-24">
        <div className="relative">
          <ApiKeyManager />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

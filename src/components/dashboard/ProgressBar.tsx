import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, className = '' }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={`relative h-2.5 w-full rounded-2xl bg-gray-700/50 ${className}`}>
      <div 
        className="bg-blue-500 absolute top-0 left-0 h-full rounded-2xl transition-all duration-300"
        style={{ width: `${percentage}%` }}
      >
        <span className="bg-blue-500 absolute -right-4 bottom-full mb-2 rounded-sm px-3.5 py-1 text-sm text-white">
          <span className="bg-blue-500 absolute bottom-[-2px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm"></span>
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;

import React, { useState } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import BrushIcon from '@mui/icons-material/Brush';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';

const CustomSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    color: '#475569',
    '&.Mui-checked': {
      color: '#3b82f6',
      '& + .MuiSwitch-track': {
        backgroundColor: '#3b82f6',
        opacity: 0.5,
      },
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#1f2937',
    opacity: 0.5,
  },
}));

const Settings: React.FC = () => {
  const [volume, setVolume] = useState(75);
  const [autoPlay, setAutoPlay] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="space-y-8">
      {/* Audio Settings */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-lg font-medium">
          <VolumeUpIcon className="text-blue-400" />
          <h2>Audio Settings</h2>
        </div>

        <div className="space-y-6">
          {/* Master Volume */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Master Volume</span>
              <span className="text-blue-400">{volume}%</span>
            </div>
            <div className="relative h-2 bg-gray-700 rounded-full">
              <div 
                className="absolute h-full bg-blue-500 rounded-full"
                style={{ width: `${volume}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Auto-Play */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm text-gray-400">Auto-Play New Sequences</div>
            </div>
            <CustomSwitch
              checked={autoPlay}
              onChange={(e) => setAutoPlay(e.target.checked)}
            />
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-lg font-medium">
          <BrushIcon className="text-blue-400" />
          <h2>Theme Settings</h2>
        </div>

        <div className="space-y-6">
          {/* Theme Selector */}
          <div className="space-y-2">
            <div className="text-sm text-gray-400">Theme</div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                className={`p-4 rounded-xl border transition-all ${
                  !darkMode 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => setDarkMode(false)}
              >
                <div className="text-sm font-medium">Light Theme</div>
              </button>
              <button 
                className={`p-4 rounded-xl border transition-all ${
                  darkMode 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => setDarkMode(true)}
              >
                <div className="text-sm font-medium">Dark Theme</div>
              </button>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm text-gray-400">Dark Mode</div>
            </div>
            <CustomSwitch
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-medium transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;

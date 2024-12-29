import React, { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LaunchIcon from '@mui/icons-material/Launch';
import { motion, AnimatePresence } from 'framer-motion';

interface ApiKey {
  name: string;
  key: string;
  description: string;
  requestsLeft: number;
  totalRequests: number;
  link: string;
}

const API_KEYS: ApiKey[] = [
  {
    name: 'OpenWeather API',
    key: '',
    description: 'Required for weather information. Free tier includes 60 calls/minute',
    requestsLeft: 60,
    totalRequests: 60,
    link: 'https://openweathermap.org/api'
  },
  {
    name: 'News API',
    key: '',
    description: 'Required for news feed. Free tier includes 100 requests/day',
    requestsLeft: 100,
    totalRequests: 100,
    link: 'https://www.thenewsapi.com/'
  }
];

const ApiKeyManager: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(API_KEYS);
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});

  const handleSave = (name: string, newKey: string) => {
    const updatedKeys = apiKeys.map(key => 
      key.name === name ? { ...key, key: newKey } : key
    );
    setApiKeys(updatedKeys);
    localStorage.setItem('apiKeys', JSON.stringify(updatedKeys));
  };

  const toggleKeyVisibility = (name: string) => {
    setShowKeys(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="space-y-12">
      {apiKeys.map((apiKey, index) => (
        <motion.div
          key={apiKey.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            delay: index * 0.2,
            ease: "easeOut"
          }}
          className="bg-[#0F1A2A] rounded-xl p-6 hover:bg-[#131f32] transition-colors duration-200"
        >
          <div className="flex items-center gap-2 mb-3">
            <motion.h2 
              className="text-lg font-medium text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2 + 0.2 }}
            >
              {apiKey.name}
            </motion.h2>
            <motion.a
              href={apiKey.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              <LaunchIcon className="w-4 h-4" />
            </motion.a>
          </div>

          <motion.p 
            className="text-sm text-gray-400 mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.2 + 0.3 }}
          >
            {apiKey.description}
          </motion.p>

          <div className="relative mb-8">
            <motion.input
              type={showKeys[apiKey.name] ? 'text' : 'password'}
              value={apiKey.key || ''}
              placeholder="Enter API key..."
              onChange={(e) => handleSave(apiKey.name, e.target.value)}
              className="w-full bg-[#1A2737] border border-gray-700/30 rounded-lg pl-4 pr-20 py-3 text-sm font-mono focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 placeholder-gray-500 transition-all duration-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 + 0.4 }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <motion.button
                onClick={() => toggleKeyVisibility(apiKey.name)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/30 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={showKeys[apiKey.name] ? 'hide' : 'show'}
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    {showKeys[apiKey.name] ? (
                      <VisibilityOffIcon className="w-4 h-4" />
                    ) : (
                      <VisibilityIcon className="w-4 h-4" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
              <motion.button 
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/30 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <EditIcon className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          <div className="space-y-2">
            <motion.div 
              className="flex justify-between text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2 + 0.5 }}
            >
              <span className="text-gray-400">API Usage</span>
              <span className="text-gray-400">
                {apiKey.requestsLeft}/{apiKey.totalRequests} requests left
              </span>
            </motion.div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(apiKey.requestsLeft / apiKey.totalRequests) * 100}%` }}
                transition={{ 
                  duration: 1,
                  delay: index * 0.2 + 0.6,
                  ease: "easeOut"
                }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ApiKeyManager;

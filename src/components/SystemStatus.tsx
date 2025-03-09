import { useEffect, useState } from 'react';
import { BoltIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useThemeStore } from '../store/themeStore';

export default function SystemStatus() {
  const { isDark } = useThemeStore();
  const [isActive, setIsActive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate system status check
  useEffect(() => {
    const checkSystem = () => {
      // Here you would typically make an API call to check system status
      setIsActive(Math.random() > 0.1); // 90% chance of being active
      setLastUpdate(new Date());
    };

    // Check immediately
    checkSystem();

    // Then check every 30 seconds
    const interval = setInterval(checkSystem, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className={`flex items-center px-3 py-1.5 rounded-full transition-colors duration-200 ${
        isActive
          ? isDark 
            ? 'bg-green-900/50 text-green-300' 
            : 'bg-green-100 text-green-800'
          : isDark
            ? 'bg-red-900/50 text-red-300'
            : 'bg-red-100 text-red-800'
      }`}>
        <BoltIcon className={`w-4 h-4 mr-1.5 ${
          isActive ? 'animate-pulse' : ''
        }`} />
        <span className="text-sm font-medium whitespace-nowrap">
          {isActive ? 'Système actif' : 'Système inactif'}
        </span>
      </div>

      <div className={`flex items-center px-3 py-1.5 rounded-full ${
        isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
      }`}>
        <ClockIcon className="w-4 h-4 mr-1.5" />
        <span className="text-sm font-medium whitespace-nowrap">
          {lastUpdate.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
} 
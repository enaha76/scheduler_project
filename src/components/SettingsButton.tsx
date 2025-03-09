import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  LanguageIcon,
  BellIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import { useThemeStore } from '../store/themeStore';

export default function SettingsMenu() {
  const { isDark, toggleTheme } = useThemeStore();

  const handleThemeToggle = () => {
    // Add a ripple effect to the body before theme change
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.top = '0';
    ripple.style.left = '0';
    ripple.style.width = '100%';
    ripple.style.height = '100%';
    ripple.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
    ripple.style.transition = 'opacity 400ms ease-out';
    ripple.style.zIndex = '9999';
    document.body.appendChild(ripple);

    // Trigger the theme change
    toggleTheme();

    // Fade out and remove the ripple
    setTimeout(() => {
      ripple.style.opacity = '0';
      setTimeout(() => ripple.remove(), 400);
    }, 50);
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
        isDark 
          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
      } group`}>
        <Cog6ToothIcon className="w-5 h-5 transition-transform duration-700 ease-in-out group-hover:rotate-180" />
        <span className="ml-2 text-sm font-medium hidden sm:block">Paramètres</span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className={`absolute right-0 mt-2 w-56 rounded-xl ${
          isDark 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        } shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-2 z-50`}>
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Paramètres du système
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Personnalisez votre expérience
            </p>
          </div>

          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleThemeToggle}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    active
                      ? isDark 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-gray-50 text-gray-900'
                      : isDark
                        ? 'text-gray-300'
                        : 'text-gray-700'
                  } group relative overflow-hidden`}
                >
                  <div className="flex items-center relative z-10">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
                        {isDark ? (
                          <SunIcon className="h-5 w-5 mr-3 transition-transform duration-500 group-hover:rotate-90" />
                        ) : (
                          <MoonIcon className="h-5 w-5 mr-3 transition-transform duration-500 group-hover:-rotate-90" />
                        )}
                      </div>
                      <div className="w-5 h-5 mr-3" /> {/* Spacer */}
                    </div>
                    <span>Thème {isDark ? 'clair' : 'sombre'}</span>
                  </div>
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button className={`flex items-center w-full px-4 py-2 text-sm ${
                  active
                    ? isDark 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-50 text-gray-900'
                    : isDark
                      ? 'text-gray-300'
                      : 'text-gray-700'
                }`}>
                  <BellIcon className="mr-3 h-5 w-5" />
                  Notifications
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button className={`flex items-center w-full px-4 py-2 text-sm ${
                  active
                    ? isDark 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-50 text-gray-900'
                    : isDark
                      ? 'text-gray-300'
                      : 'text-gray-700'
                }`}>
                  <ComputerDesktopIcon className="mr-3 h-5 w-5" />
                  Système
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 
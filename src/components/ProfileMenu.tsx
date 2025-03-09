import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  KeyIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useThemeStore } from '../store/themeStore';

export default function ProfileMenu() {
  const { isDark } = useThemeStore();

  return (
    <Menu as="div" className="relative">
      <Menu.Button className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors duration-200 ${
        isDark 
          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}>
        <UserCircleIcon className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:block">Admin</span>
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
              Administrateur
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              admin@supnum.ma
            </p>
          </div>

          <div className="py-1">
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
                  <UserIcon className="mr-3 h-5 w-5" />
                  Mon profil
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
                  <KeyIcon className="mr-3 h-5 w-5" />
                  Mot de passe
                </button>
              )}
            </Menu.Item>
          </div>

          <div className="py-1 border-t border-gray-200 dark:border-gray-700">
            <Menu.Item>
              {({ active }) => (
                <button className={`flex items-center w-full px-4 py-2 text-sm ${
                  active
                    ? isDark 
                      ? 'bg-gray-700 text-red-300' 
                      : 'bg-gray-50 text-red-700'
                    : isDark
                      ? 'text-red-400'
                      : 'text-red-600'
                }`}>
                  <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                  Se déconnecter
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 
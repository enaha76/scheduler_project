import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useThemeStore } from '../store/themeStore';
import useAuthStore from '../store/authStore';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  const { isDark } = useThemeStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`flex justify-end px-4 py-2 ${isDark ? 'bg-gray-800' : 'bg-white'} border-b ${
      isDark ? 'border-gray-700' : 'border-gray-200'
    }`}>
      <Menu as="div" className="relative">
        <Menu.Button className={`flex items-center gap-2 p-2 rounded-lg ${
          isDark 
            ? 'hover:bg-gray-700 text-gray-300' 
            : 'hover:bg-gray-100 text-gray-700'
        }`}>
          <UserCircleIcon className="h-6 w-6" />
          <span className="text-sm font-medium">Admin</span>
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
          <Menu.Items className={`absolute right-0 mt-2 w-48 rounded-lg ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={classNames(
                    active 
                      ? isDark ? 'bg-gray-700' : 'bg-gray-100'
                      : '',
                    `${isDark ? 'text-gray-300' : 'text-gray-700'} group flex w-full items-center px-4 py-2 text-sm`
                  )}
                >
                  <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                  Déconnexion
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
} 
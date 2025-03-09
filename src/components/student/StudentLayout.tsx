import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import { useThemeStore } from '../../store/themeStore';
import Logo from '../Logo';
import SettingsMenu from '../SettingsButton';

interface StudentLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Accueil', href: '/student', icon: UserIcon },
  { name: 'Emploi du temps', href: '/student/schedule', icon: CalendarIcon },
];

export default function StudentLayout({ children }: StudentLayoutProps) {
  const location = useLocation();
  const { isDark } = useThemeStore();

  return (
    <div className={`min-h-screen ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className={`flex grow flex-col gap-y-5 overflow-y-auto border-r ${
          isDark 
            ? 'bg-gray-900 border-gray-800 scrollbar-dark' 
            : 'bg-white border-gray-200 scrollbar-light'
        }`}>
          <div className="flex h-16 shrink-0 items-center px-6 pt-3">
            <Logo />
          </div>
          <nav className="flex flex-1 flex-col px-6">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`
                          group flex gap-x-3 rounded-xl p-2 text-sm leading-6 font-semibold transition-all duration-300
                          ${location.pathname === item.href
                            ? isDark 
                              ? 'bg-gray-800 text-white shadow-lg shadow-gray-900/20' 
                              : 'bg-gradient-to-r from-blue-50 to-teal-50 text-blue-600'
                            : isDark
                              ? 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                          }
                        `}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 transition-all duration-300 ${
                            location.pathname === item.href 
                              ? isDark 
                                ? 'text-white' 
                                : 'text-blue-600'
                              : isDark 
                                ? 'text-gray-400 group-hover:text-white' 
                                : 'text-gray-400 group-hover:text-blue-600'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className={`sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b ${
          isDark 
            ? 'bg-gray-900 border-gray-800' 
            : 'bg-white border-gray-200'
        } px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8`}>
          <div className="flex flex-1 items-center justify-end gap-x-4 lg:gap-x-6">
            <div className="flex items-center gap-4">
              <SettingsMenu />
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 
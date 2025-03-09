import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Link, useLocation } from 'react-router-dom'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'
import { useThemeStore } from '../store/themeStore'
import Logo from './Logo'
import SystemStatus from './SystemStatus'
import ProfileMenu from './ProfileMenu'
import SettingsMenu from './SettingsButton'

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: HomeIcon },
  { name: 'Matières', href: '/matieres', icon: BookOpenIcon },
  { name: 'Enseignants', href: '/enseignants', icon: AcademicCapIcon },
  { name: 'Groupes', href: '/groupes', icon: UserGroupIcon },
  { name: 'Planning', href: '/planning', icon: CalendarIcon },
]

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { isDark } = useThemeStore()

  return (
    <div className={`min-h-screen ${
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className={`flex grow flex-col gap-y-5 ${
                  isDark ? 'bg-gray-900' : 'bg-white'
                } md:scrollbar-none`}>
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
                                  group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                                  ${location.pathname === item.href
                                    ? isDark 
                                      ? 'bg-gray-700 text-white'
                                      : 'bg-supnum-blue-light text-supnum-blue'
                                    : isDark
                                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                      : 'text-gray-700 hover:text-supnum-blue hover:bg-supnum-gray-light'
                                  }
                                `}
                              >
                                <item.icon
                                  className={`h-6 w-6 shrink-0 ${
                                    location.pathname === item.href 
                                      ? isDark ? 'text-white' : 'text-supnum-blue'
                                      : isDark ? 'text-gray-400' : 'text-gray-400'
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className={`flex grow flex-col gap-y-5 border-r ${
          isDark 
            ? 'bg-gray-900 border-gray-800 scrollbar-dark' 
            : 'bg-white border-gray-200 scrollbar-light'
        } overflow-y-auto`}>
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
                          group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200
                          ${location.pathname === item.href
                            ? isDark 
                              ? 'bg-gray-800 text-white'
                              : 'bg-supnum-blue-light text-supnum-blue'
                            : isDark
                              ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                              : 'text-gray-600 hover:text-supnum-blue hover:bg-gray-50'
                          }
                        `}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 transition-colors duration-200 ${
                            location.pathname === item.href 
                              ? isDark ? 'text-white' : 'text-supnum-blue'
                              : isDark ? 'text-gray-400' : 'text-gray-400'
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
          <button
            type="button"
            className={`-m-2.5 p-2.5 rounded-md ${
              isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            } lg:hidden`}
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Ouvrir la barre latérale</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex flex-1 items-center justify-end gap-x-4 lg:gap-x-6">
            <div className="flex items-center gap-4">
              <div className="max-sm:hidden">
                <SystemStatus />
              </div>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
              <SettingsMenu />
              <ProfileMenu />
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:hidden mb-6 space-y-4">
              <SystemStatus />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 
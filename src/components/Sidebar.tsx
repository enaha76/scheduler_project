import { Link, useLocation } from 'react-router-dom';
import { 
  UserGroupIcon, 
  AcademicCapIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  BookOpenIcon,
  UserIcon,
  HomeIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { useThemeStore } from '../store/themeStore';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: HomeIcon 
  },
  { 
    name: 'Planning', 
    href: '/planning', 
    icon: CalendarIcon 
  },
  { 
    name: 'Matières', 
    href: '/matieres', 
    icon: BookmarkIcon 
  },
  { 
    name: 'Enseignants', 
    href: '/enseignants', 
    icon: AcademicCapIcon 
  },
  { 
    name: 'Groupes', 
    href: '/groupes', 
    icon: UserGroupIcon 
  },
  { 
    name: 'Cours', 
    href: '/cours', 
    icon: BookOpenIcon 
  },
  { 
    name: 'Salles', 
    href: '/salles', 
    icon: BuildingOfficeIcon 
  },
  { 
    name: 'Utilisateurs', 
    href: '/utilisateurs', 
    icon: UserIcon 
  }
];

export default function Sidebar() {
  const { isDark } = useThemeStore();
  const location = useLocation();

  return (
    <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 dark:border-gray-800 pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center px-4">
          <img
            className="h-8 w-auto"
            src="/logo.svg"
            alt="Logo"
          />
          <span className={`ml-3 text-xl font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            EDT Manager
          </span>
        </div>
        <nav className="mt-8 flex-1 space-y-1 px-2" aria-label="Sidebar">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : `${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'}`
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive
                      ? 'text-primary-700 dark:text-primary-300'
                      : `${isDark ? 'text-gray-400' : 'text-gray-500'}`
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 
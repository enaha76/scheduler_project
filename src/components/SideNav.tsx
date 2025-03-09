import { Link, useLocation } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { 
  HomeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function SideNav() {
  const location = useLocation();
  const { isDark } = useThemeStore();

  const navigation = [
    { name: 'Tableau de bord', href: '/', icon: HomeIcon },
    { name: 'Matières', href: '/matieres', icon: BookOpenIcon },
    { name: 'Enseignants', href: '/enseignants', icon: AcademicCapIcon },
    { name: 'Groupes', href: '/groupes', icon: UserGroupIcon },
    { name: 'Planning', href: '/planning', icon: CalendarIcon },
    { name: 'Cours', href: '/cours', icon: BookOpenIcon },
    { name: 'Salles', href: '/salles', icon: BuildingOfficeIcon },
    { name: 'Utilisateurs', href: '/utilisateurs', icon: UserIcon }
  ];

  return (
    <div className={`w-64 flex-shrink-0 ${isDark ? 'bg-[#1a1b1e]' : 'bg-white'}`}>
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className={`flex items-center px-6 h-16 ${
          isDark ? 'bg-[#141517] border-[#2c2d31]' : 'bg-gray-50 border-gray-200'
        } border-b`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
              <img
                className="h-8 w-8"
                src="/logo.png"
                alt="SupNum"
              />
            </div>
            <div>
              <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                SupNum
              </h1>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Gestion d'emplois
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? isDark
                      ? 'bg-[#25262b] text-white shadow-sm'
                      : 'bg-gray-100 text-blue-600 shadow-sm'
                    : isDark
                    ? 'text-gray-400 hover:bg-[#25262b] hover:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                    isActive
                      ? isDark
                        ? 'text-blue-400'
                        : 'text-blue-600'
                      : isDark
                      ? 'text-gray-500 group-hover:text-white'
                      : 'text-gray-400 group-hover:text-blue-600'
                  }`}
                  aria-hidden="true"
                />
                <span className={`font-medium ${
                  isActive 
                    ? isDark 
                      ? 'text-white' 
                      : 'text-blue-600'
                    : ''
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className={`p-4 ${isDark ? 'border-[#2c2d31]' : 'border-gray-200'} border-t`}>
          <div className={`p-4 rounded-xl ${
            isDark ? 'bg-[#25262b]' : 'bg-gray-50'
          }`}>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Version 1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
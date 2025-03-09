import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useThemeStore } from '../store/themeStore';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <div className="flex items-center justify-between mb-8 transition-colors duration-200">
      <div>
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-supnum-blue to-supnum-teal bg-clip-text text-transparent">
            {title}
          </h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isDark 
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        {subtitle && (
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-4">{actions}</div>}
    </div>
  );
} 
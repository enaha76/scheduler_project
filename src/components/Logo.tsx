import { useThemeStore } from '../store/themeStore';

export default function Logo() {
  const { isDark } = useThemeStore();
  
  return (
    <div className="flex items-center">
      <div className={`flex items-center px-4 py-3 rounded-xl ${
        isDark 
          ? 'bg-gradient-to-r from-gray-900 to-gray-800' 
          : 'bg-gradient-to-r from-gray-50 to-white'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`relative rounded-lg overflow-hidden ${
            isDark ? 'bg-gray-700' : 'bg-white'
          } p-2`}>
            <div className={`absolute inset-0 opacity-50 ${
              isDark ? 'bg-gradient-to-br from-supnum-blue/30 to-supnum-teal/30' : 'bg-gradient-to-br from-supnum-blue/10 to-supnum-teal/10'
            }`} />
            <img
              src="/supnum.png"
              alt="SupNum"
              className="h-7 w-auto relative z-10"
            />
          </div>
          <div className="flex flex-col">
            <h1 className={`text-lg font-bold tracking-tight ${
              isDark 
                ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-supnum-blue to-supnum-teal bg-clip-text text-transparent'
            }`}>
              SupNum
            </h1>
            <p className={`text-xs font-medium tracking-wide ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Gestion d'emplois
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
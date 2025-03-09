import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';

type AuthMode = 'login' | 'signup' | 'forgot';

interface AuthSwitcherProps {
  currentMode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}

export default function AuthSwitcher({ currentMode, onModeChange }: AuthSwitcherProps) {
  const { isDark } = useThemeStore();

  return (
    <div className={`rounded-full ${
      isDark ? 'bg-gray-800' : 'bg-white'
    } shadow-lg p-1.5 flex gap-2`}>
      <motion.button
        onClick={() => onModeChange('login')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          currentMode === 'login'
            ? 'bg-gradient-to-r from-supnum-blue to-supnum-teal text-white'
            : isDark
              ? 'text-gray-400 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Connexion
      </motion.button>

      <motion.button
        onClick={() => onModeChange('signup')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          currentMode === 'signup'
            ? 'bg-gradient-to-r from-supnum-blue to-supnum-teal text-white'
            : isDark
              ? 'text-gray-400 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Inscription
      </motion.button>

      <motion.button
        onClick={() => onModeChange('forgot')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          currentMode === 'forgot'
            ? 'bg-gradient-to-r from-supnum-blue to-supnum-teal text-white'
            : isDark
              ? 'text-gray-400 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Mot de passe oublié
      </motion.button>
    </div>
  );
} 
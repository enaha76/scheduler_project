import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useThemeStore } from '../store/themeStore';
import useAuthStore from '../store/authStore';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import AuthSwitcher from '../components/AuthSwitcher';

type AuthMode = 'login' | 'signup' | 'forgot';
type UserRole = 'student' | 'teacher' | 'admin';

interface LoginFormData {
  email: string;
  password: string;
  role: UserRole;
}

type SignupStep = 'personal' | 'account';

interface SignupFormData extends LoginFormData {
  name: string;
  confirmPassword: string;
  studentId: string;
}

interface ForgotFormData {
  email: string;
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [signupStep, setSignupStep] = useState<SignupStep>('personal');
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();
  const login = useAuthStore(state => state.login);

  const loginForm = useForm<LoginFormData>();
  const signupForm = useForm<SignupFormData>({
    mode: 'onChange'
  });
  const forgotForm = useForm<ForgotFormData>();

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password, data.role);
      toast.success('Connexion réussie');
      navigate('/');
    } catch (error) {
      toast.error('Email ou mot de passe incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  const onSignupNext = async (data: SignupFormData) => {
    const isValid = await signupForm.trigger(['name', 'studentId']);
    if (isValid) {
      setSignupStep('account');
    }
  };

  const onSignupBack = () => {
    setSignupStep('personal');
  };

  const onSignup = async (data: SignupFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    setIsLoading(true);
    try {
      // Here you would typically call your signup API
      toast.success('Inscription réussie! Veuillez vous connecter.');
      setAuthMode('login');
      setSignupStep('personal'); // Reset step for next time
    } catch (error) {
      toast.error('Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const onForgot = async (data: ForgotFormData) => {
    setIsLoading(true);
    try {
      // Here you would typically call your password reset API
      toast.success('Instructions envoyées par email');
      setAuthMode('login');
    } catch (error) {
      toast.error('Erreur lors de l\'envoi des instructions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="flex flex-col items-center p-4">
        <div className="w-full flex items-center justify-between mb-2">
          <Logo />
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
        <AuthSwitcher currentMode={authMode} onModeChange={setAuthMode} />
      </div>

      <div className="flex-1 flex items-start justify-center px-4 sm:px-6 lg:px-8 pt-4">
        <AnimatePresence mode="wait">
          {authMode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`w-full max-w-sm ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              <div>
                <h2 className="text-center text-3xl font-bold tracking-tight bg-gradient-to-r from-supnum-blue to-supnum-teal bg-clip-text text-transparent">
                  Connexion
                </h2>
                <p className={`mt-2 text-center text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Bienvenue sur la plateforme de gestion
                </p>
              </div>

              <form className="mt-6 space-y-6" onSubmit={loginForm.handleSubmit(onLogin)}>
                <div className="space-y-4 rounded-md">
                  <div>
                    <label className={`block text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Type de compte
                    </label>
                    <div className="mt-1 grid grid-cols-3 gap-3">
                      {(['student', 'teacher', 'admin'] as UserRole[]).map((role) => (
                        <div key={role}>
                          <input
                            type="radio"
                            id={role}
                            value={role}
                            className="sr-only peer"
                            {...loginForm.register('role', { required: true })}
                          />
                          <label
                            htmlFor={role}
                            className={`flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${
                              isDark
                                ? 'peer-checked:bg-supnum-blue text-gray-300 peer-checked:text-white bg-gray-800 hover:bg-gray-700'
                                : 'peer-checked:bg-supnum-blue peer-checked:text-white text-gray-900 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {role === 'student' ? 'Étudiant' : role === 'teacher' ? 'Enseignant' : 'Admin'}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        {...loginForm.register('email', {
                          required: 'L\'email est requis',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email invalide'
                          }
                        })}
                        type="email"
                        className={`block w-full rounded-md px-3 py-2 text-sm ${
                          isDark 
                            ? 'bg-gray-800 border-gray-700 text-white focus:border-supnum-blue focus:ring-supnum-blue' 
                            : 'border-gray-300 focus:border-supnum-blue focus:ring-supnum-blue'
                        } shadow-sm`}
                        placeholder="admin@supnum.mr"
                      />
                      {loginForm.formState.errors.email && (
                        <p className="mt-1 text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className={`block text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Mot de passe
                    </label>
                    <div className="mt-1">
                      <input
                        {...loginForm.register('password', {
                          required: 'Le mot de passe est requis',
                          minLength: {
                            value: 8,
                            message: 'Le mot de passe doit contenir au moins 8 caractères'
                          }
                        })}
                        type="password"
                        className={`block w-full rounded-md px-3 py-2 text-sm ${
                          isDark 
                            ? 'bg-gray-800 border-gray-700 text-white focus:border-supnum-blue focus:ring-supnum-blue' 
                            : 'border-gray-300 focus:border-supnum-blue focus:ring-supnum-blue'
                        } shadow-sm`}
                        placeholder="••••••••"
                      />
                      {loginForm.formState.errors.password && (
                        <p className="mt-1 text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative flex w-full justify-center rounded-md bg-gradient-to-r from-supnum-blue to-supnum-teal py-2 px-3 text-sm font-semibold text-white hover:from-supnum-blue/90 hover:to-supnum-teal/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-supnum-blue disabled:opacity-50 transition-all duration-200"
                  >
                    {isLoading ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    Se connecter
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {authMode === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`w-full max-w-sm ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              <div>
                <h2 className="text-center text-3xl font-bold tracking-tight bg-gradient-to-r from-supnum-blue to-supnum-teal bg-clip-text text-transparent">
                  Inscription Étudiant
                </h2>
                <p className={`mt-2 text-center text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {signupStep === 'personal' ? 'Informations personnelles' : 'Créez vos identifiants'}
                </p>
              </div>

              <form className="mt-6 space-y-6" onSubmit={signupForm.handleSubmit(signupStep === 'personal' ? onSignupNext : onSignup)}>
                <AnimatePresence mode="wait">
                  {signupStep === 'personal' ? (
                    <motion.div
                      key="personal"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4 rounded-md"
                    >
                      <div>
                        <label className={`block text-sm font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Nom complet
                        </label>
                        <div className="mt-1">
                          <input
                            {...signupForm.register('name', {
                              required: 'Le nom est requis'
                            })}
                            type="text"
                            className={`block w-full rounded-md px-3 py-2 text-sm ${
                              isDark 
                                ? 'bg-gray-800 border-gray-700 text-white focus:border-supnum-blue focus:ring-supnum-blue' 
                                : 'border-gray-300 focus:border-supnum-blue focus:ring-supnum-blue'
                            } shadow-sm`}
                            placeholder="Saucrate Dahmed"
                          />
                          {signupForm.formState.errors.name && (
                            <p className="mt-1 text-sm text-red-500">{signupForm.formState.errors.name.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Numéro étudiant
                        </label>
                        <div className="mt-1">
                          <input
                            {...signupForm.register('studentId', {
                              required: 'Le numéro étudiant est requis'
                            })}
                            type="text"
                            className={`block w-full rounded-md px-3 py-2 text-sm ${
                              isDark 
                                ? 'bg-gray-800 border-gray-700 text-white focus:border-supnum-blue focus:ring-supnum-blue' 
                                : 'border-gray-300 focus:border-supnum-blue focus:ring-supnum-blue'
                            } shadow-sm`}
                            placeholder="12345"
                          />
                          {signupForm.formState.errors.studentId && (
                            <p className="mt-1 text-sm text-red-500">{signupForm.formState.errors.studentId.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="group relative flex w-full justify-center rounded-md bg-gradient-to-r from-supnum-blue to-supnum-teal py-2 px-3 text-sm font-semibold text-white hover:from-supnum-blue/90 hover:to-supnum-teal/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-supnum-blue disabled:opacity-50 transition-all duration-200"
                        >
                          Suivant
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="account"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4 rounded-md"
                    >
                      <div>
                        <label className={`block text-sm font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Email
                        </label>
                        <div className="mt-1">
                          <input
                            {...signupForm.register('email', {
                              required: 'L\'email est requis',
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@student\.supnum\.mr$/i,
                                message: 'L\'email doit être un email étudiant valide (@student.supnum.mr)'
                              }
                            })}
                            type="email"
                            className={`block w-full rounded-md px-3 py-2 text-sm ${
                              isDark 
                                ? 'bg-gray-800 border-gray-700 text-white focus:border-supnum-blue focus:ring-supnum-blue' 
                                : 'border-gray-300 focus:border-supnum-blue focus:ring-supnum-blue'
                            } shadow-sm`}
                            placeholder="etudient@student.supnum.mr"
                          />
                          {signupForm.formState.errors.email && (
                            <p className="mt-1 text-sm text-red-500">{signupForm.formState.errors.email.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Mot de passe
                        </label>
                        <div className="mt-1">
                          <input
                            {...signupForm.register('password', {
                              required: 'Le mot de passe est requis',
                              minLength: {
                                value: 8,
                                message: 'Le mot de passe doit contenir au moins 8 caractères'
                              }
                            })}
                            type="password"
                            className={`block w-full rounded-md px-3 py-2 text-sm ${
                              isDark 
                                ? 'bg-gray-800 border-gray-700 text-white focus:border-supnum-blue focus:ring-supnum-blue' 
                                : 'border-gray-300 focus:border-supnum-blue focus:ring-supnum-blue'
                            } shadow-sm`}
                            placeholder="••••••••"
                          />
                          {signupForm.formState.errors.password && (
                            <p className="mt-1 text-sm text-red-500">{signupForm.formState.errors.password.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Confirmer le mot de passe
                        </label>
                        <div className="mt-1">
                          <input
                            {...signupForm.register('confirmPassword', {
                              required: 'Veuillez confirmer votre mot de passe',
                              validate: value => value === signupForm.watch('password') || 'Les mots de passe ne correspondent pas'
                            })}
                            type="password"
                            className={`block w-full rounded-md px-3 py-2 text-sm ${
                              isDark 
                                ? 'bg-gray-800 border-gray-700 text-white focus:border-supnum-blue focus:ring-supnum-blue' 
                                : 'border-gray-300 focus:border-supnum-blue focus:ring-supnum-blue'
                            } shadow-sm`}
                            placeholder="••••••••"
                          />
                          {signupForm.formState.errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">{signupForm.formState.errors.confirmPassword.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={onSignupBack}
                          className="flex-1 rounded-md bg-gray-600 py-2 px-3 text-sm font-semibold text-white hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled:opacity-50 transition-all duration-200"
                        >
                          Retour
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 group relative flex justify-center rounded-md bg-gradient-to-r from-supnum-blue to-supnum-teal py-2 px-3 text-sm font-semibold text-white hover:from-supnum-blue/90 hover:to-supnum-teal/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-supnum-blue disabled:opacity-50 transition-all duration-200"
                        >
                          {isLoading ? (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : null}
                          S'inscrire
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          )}

          {authMode === 'forgot' && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`w-full max-w-sm ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              <div>
                <h2 className="text-center text-3xl font-bold tracking-tight bg-gradient-to-r from-supnum-blue to-supnum-teal bg-clip-text text-transparent">
                  Mot de passe oublié
                </h2>
                <p className={`mt-2 text-center text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Nous vous enverrons les instructions par email
                </p>
              </div>

              <form className="mt-6 space-y-6" onSubmit={forgotForm.handleSubmit(onForgot)}>
                <div>
                  <label className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      {...forgotForm.register('email', {
                        required: 'L\'email est requis',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email invalide'
                        }
                      })}
                      type="email"
                      className={`block w-full rounded-md px-3 py-2 text-sm ${
                        isDark 
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-supnum-blue focus:ring-supnum-blue' 
                          : 'border-gray-300 focus:border-supnum-blue focus:ring-supnum-blue'
                      } shadow-sm`}
                      placeholder="nom@email.com"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative flex w-full justify-center rounded-md bg-gradient-to-r from-supnum-blue to-supnum-teal py-2 px-3 text-sm font-semibold text-white hover:from-supnum-blue/90 hover:to-supnum-teal/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-supnum-blue disabled:opacity-50 transition-all duration-200"
                  >
                    {isLoading ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    Envoyer les instructions
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 
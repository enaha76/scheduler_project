import { useState } from 'react';
import { useThemeStore } from '../store/themeStore';
import { 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  KeyIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import PageHeader from '../components/PageHeader';
import toast from 'react-hot-toast';

export default function Profile() {
  const { isDark, toggleTheme } = useThemeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@supnum.mr',
    phone: '+222 12345678',
    role: 'Administrateur',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to update the profile
    toast.success('Profil mis à jour avec succès');
    setIsEditing(false);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    // Here you would typically make an API call to change the password
    toast.success('Mot de passe modifié avec succès');
    setIsChangingPassword(false);
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Mon Profil"
          subtitle="Gérer vos informations personnelles"
        />

        <div className="mt-8 space-y-6">
          {/* Profile Info Card */}
          <div className={`rounded-xl shadow-sm ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-lg font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Informations personnelles
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors duration-200`}
                >
                  {isEditing ? 'Annuler' : 'Modifier'}
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className={`block text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Nom complet
                    </label>
                    <div className={`mt-1 flex rounded-lg shadow-sm ring-1 ring-inset ${
                      isDark ? 'ring-gray-700' : 'ring-gray-300'
                    }`}>
                      <span className={`flex select-none items-center pl-3 ${
                        isDark ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        <UserCircleIcon className="h-5 w-5" />
                      </span>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`block w-full border-0 bg-transparent py-1.5 pl-2 ${
                          isDark 
                            ? 'text-white placeholder:text-gray-500' 
                            : 'text-gray-900 placeholder:text-gray-400'
                        } focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Email
                    </label>
                    <div className={`mt-1 flex rounded-lg shadow-sm ring-1 ring-inset ${
                      isDark ? 'ring-gray-700' : 'ring-gray-300'
                    }`}>
                      <span className={`flex select-none items-center pl-3 ${
                        isDark ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        <EnvelopeIcon className="h-5 w-5" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`block w-full border-0 bg-transparent py-1.5 pl-2 ${
                          isDark 
                            ? 'text-white placeholder:text-gray-500' 
                            : 'text-gray-900 placeholder:text-gray-400'
                        } focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Téléphone
                    </label>
                    <div className={`mt-1 flex rounded-lg shadow-sm ring-1 ring-inset ${
                      isDark ? 'ring-gray-700' : 'ring-gray-300'
                    }`}>
                      <span className={`flex select-none items-center pl-3 ${
                        isDark ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        <PhoneIcon className="h-5 w-5" />
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`block w-full border-0 bg-transparent py-1.5 pl-2 ${
                          isDark 
                            ? 'text-white placeholder:text-gray-500' 
                            : 'text-gray-900 placeholder:text-gray-400'
                        } focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Rôle
                    </label>
                    <div className={`mt-1 flex rounded-lg shadow-sm ring-1 ring-inset ${
                      isDark ? 'ring-gray-700' : 'ring-gray-300'
                    }`}>
                      <span className={`flex select-none items-center pl-3 ${
                        isDark ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        <AcademicCapIcon className="h-5 w-5" />
                      </span>
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        disabled
                        className={`block w-full border-0 bg-transparent py-1.5 pl-2 ${
                          isDark 
                            ? 'text-white placeholder:text-gray-500' 
                            : 'text-gray-900 placeholder:text-gray-400'
                        } focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
                    >
                      Enregistrer
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Settings Card */}
          <div className={`rounded-xl shadow-sm ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <h2 className={`text-lg font-medium mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Paramètres
              </h2>

              <div className="space-y-4">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isDark ? (
                      <MoonIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <SunIcon className="h-5 w-5 text-gray-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Thème {isDark ? 'sombre' : 'clair'}
                    </span>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      isDark ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isDark ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Password Change */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    <KeyIcon className="h-5 w-5" />
                    Changer le mot de passe
                  </button>

                  {isChangingPassword && (
                    <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
                      <div>
                        <label className={`block text-sm font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Mot de passe actuel
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm text-sm ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600 focus:border-blue-600' 
                              : 'border-gray-300 focus:ring-blue-600 focus:border-blue-600'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm text-sm ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600 focus:border-blue-600' 
                              : 'border-gray-300 focus:ring-blue-600 focus:border-blue-600'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Confirmer le mot de passe
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm text-sm ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600 focus:border-blue-600' 
                              : 'border-gray-300 focus:ring-blue-600 focus:border-blue-600'
                          }`}
                        />
                      </div>
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsChangingPassword(false)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg ${
                            isDark
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          } transition-colors duration-200`}
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
                        >
                          Changer
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
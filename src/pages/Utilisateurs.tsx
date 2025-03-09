import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog } from '@headlessui/react';
import { 
  PlusIcon, 
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  KeyIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useThemeStore } from '../store/themeStore';
import { useStore } from '../store';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';

interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  roleId: number;
  isActive: boolean;
  lastLogin?: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

const ROLES: Role[] = [
  {
    id: 1,
    name: 'Admin',
    description: 'Accès complet au système',
    permissions: ['all']
  },
  {
    id: 2,
    name: 'Enseignant',
    description: 'Gestion des disponibilités et consultation de l\'emploi du temps',
    permissions: ['view_schedule', 'manage_availability']
  },
  {
    id: 3,
    name: 'Gestionnaire',
    description: 'Gestion des emplois du temps et des ressources',
    permissions: ['manage_schedule', 'manage_resources']
  }
];

const SAMPLE_USER: User = {
  id: 1,
  username: 'John Doe',
  email: 'john.doe@example.com',
  roleId: 1,
  isActive: true,
  lastLogin: '12/03/2024'
};

export default function Utilisateurs() {
  const { isDark } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<User>();

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setValue('username', user.username);
      setValue('email', user.email);
      setValue('roleId', user.roleId);
      setValue('isActive', user.isActive);
    } else {
      setEditingUser(null);
      reset();
    }
    setIsOpen(true);
  };

  const onSubmit = async (data: User) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call
      toast.success(editingUser ? 'Utilisateur modifié avec succès' : 'Utilisateur ajouté avec succès');
      setIsOpen(false);
      reset();
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        // TODO: Implement API call
        toast.success('Utilisateur supprimé avec succès');
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      } catch (error) {
        toast.error('Une erreur est survenue');
      }
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between mb-8">
        <PageHeader
          title="Utilisateurs"
          subtitle="Gestion des utilisateurs et des rôles"
        />
        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Ajouter un utilisateur
        </button>
      </div>

      {/* User List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className={`${
          isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
        } rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300`}>
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <UserCircleIcon className={`h-8 w-8 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <div className="ml-3">
                  <h3 className={`text-base sm:text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {SAMPLE_USER.username}
                  </h3>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {SAMPLE_USER.email}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenModal(SAMPLE_USER)}
                  className={`${
                    isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  } transition-colors duration-200`}
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(SAMPLE_USER)}
                  className="text-red-500 hover:text-red-600 transition-colors duration-200"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className={`flex items-center text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                <span>{ROLES.find(r => r.id === SAMPLE_USER.roleId)?.name || 'Rôle inconnu'}</span>
              </div>
              <div className={`flex items-center text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <KeyIcon className="h-5 w-5 mr-2" />
                <span>Dernière connexion: {SAMPLE_USER.lastLogin}</span>
              </div>
            </div>

            <div className="mt-4">
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                SAMPLE_USER.isActive
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }`}>
                {SAMPLE_USER.isActive ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className={`mx-auto max-w-md rounded-xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } p-6 shadow-lg w-full`}>
            <Dialog.Title className={`text-lg font-medium mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
            </Dialog.Title>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Nom d'utilisateur
                </label>
                <input
                  {...register('username', { required: 'Le nom d\'utilisateur est requis' })}
                  type="text"
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'
                  } focus:border-primary-600 focus:ring-primary-600`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email
                </label>
                <input
                  {...register('email', { 
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide'
                    }
                  })}
                  type="email"
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'
                  } focus:border-primary-600 focus:ring-primary-600`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {!editingUser && (
                <div>
                  <label className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Mot de passe
                  </label>
                  <input
                    {...register('password', { 
                      required: 'Le mot de passe est requis',
                      minLength: {
                        value: 8,
                        message: 'Le mot de passe doit contenir au moins 8 caractères'
                      }
                    })}
                    type="password"
                    className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'
                    } focus:border-primary-600 focus:ring-primary-600`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Rôle
                </label>
                <select
                  {...register('roleId', { required: 'Le rôle est requis' })}
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'
                  } focus:border-primary-600 focus:ring-primary-600`}
                >
                  <option value="">Sélectionner</option>
                  {ROLES.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                {errors.roleId && (
                  <p className="mt-1 text-sm text-red-500">{errors.roleId.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  {...register('isActive')}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                />
                <label className={`ml-2 block text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Compte actif
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    reset();
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md border ${
                    isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition-colors duration-200`}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enregistrement...
                    </>
                  ) : (
                    editingUser ? 'Modifier' : 'Ajouter'
                  )}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className={`mx-auto max-w-sm rounded-xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } p-6 shadow-lg w-full`}>
            <Dialog.Title className={`text-lg font-medium ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Confirmer la suppression
            </Dialog.Title>
            <div className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
              <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
              {userToDelete && (
                <div className="mt-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {userToDelete.username}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {userToDelete.email}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className={`px-4 py-2 text-sm font-medium rounded-md border ${
                  isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } transition-colors duration-200`}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Supprimer
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 
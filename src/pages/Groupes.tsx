import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog } from '@headlessui/react';
import { 
  PlusIcon, 
  UsersIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  AcademicCapIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { useThemeStore } from '../store/themeStore';
import { useStore } from '../store';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';

interface Groupe {
  id: number;
  nom: string;
  semestre: number;
  filiere: string;
  effectif: number;
}

const SPECIALIZATIONS = ['Informatique', 'Réseaux', 'Cybersécurité', 'Intelligence Artificielle'];
const SEMESTERS = [1, 2, 3, 4, 5, 6];

export default function Groupes() {
  const { groupes, addGroupe, updateGroupe, deleteGroupe } = useStore();
  const { isDark } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<Groupe | null>(null);
  const [editingGroupe, setEditingGroupe] = useState<Groupe | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Groupe>();

  // Filter groupes based on search term and selected semester
  const filteredGroupes = groupes.filter(groupe =>
    (groupe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    groupe.filiere.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedSemester === null || groupe.semestre === selectedSemester)
  );

  const handleOpenModal = (groupe?: Groupe) => {
    if (groupe) {
      setEditingGroupe(groupe);
      setValue('nom', groupe.nom);
      setValue('semestre', groupe.semestre);
      setValue('filiere', groupe.filiere);
      setValue('effectif', groupe.effectif);
    } else {
      setEditingGroupe(null);
      reset();
    }
    setIsOpen(true);
  };

  const onSubmit = async (data: Groupe) => {
    setIsSubmitting(true);
    try {
      if (editingGroupe) {
        await updateGroupe(editingGroupe.id, data);
        toast.success('Groupe modifié avec succès');
      } else {
        await addGroupe({
          ...data,
          id: Math.max(0, ...groupes.map(g => g.id)) + 1
        });
        toast.success('Groupe ajouté avec succès');
      }
      setIsOpen(false);
      reset();
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (groupe: Groupe) => {
    setGroupToDelete(groupe);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (groupToDelete) {
      try {
        await deleteGroupe(groupToDelete.id);
        toast.success('Groupe supprimé avec succès');
        setIsDeleteModalOpen(false);
        setGroupToDelete(null);
      } catch (error) {
        toast.error('Une erreur est survenue');
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setGroupToDelete(null);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <PageHeader
            title="Groupes"
            subtitle="Liste des groupes d'étudiants"
          />
        </div>
        <div className="flex justify-center sm:justify-end">
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Ajouter un groupe
          </button>
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <div className="w-full sm:max-w-md">
          <label htmlFor="search" className="sr-only">Rechercher</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FunnelIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`block w-full rounded-md border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 text-sm ${
                isDark ? 'bg-gray-700 text-white ring-gray-600' : ''
              }`}
              placeholder="Rechercher un groupe..."
            />
          </div>
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedSemester(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              selectedSemester === null
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Tous les semestres
          </button>
          {SEMESTERS.map(sem => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedSemester === sem
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Semestre {sem}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredGroupes.map((groupe) => (
          <div
            key={groupe.id}
            className={`${
              isDark 
                ? 'bg-gray-800 hover:bg-gray-700' 
                : 'bg-white hover:bg-gray-50'
            } rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300`}
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className={`text-base sm:text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                } flex-grow`}>
                  {groupe.nom}
                </h3>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleOpenModal(groupe)}
                    className={`${
                      isDark 
                        ? 'text-gray-300 hover:text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    } transition-colors duration-200 p-1`}
                  >
                    <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(groupe)}
                    className="text-red-500 hover:text-red-600 transition-colors duration-200 p-1"
                  >
                    <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className={`flex items-center text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <AcademicCapIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span>Semestre {groupe.semestre}</span>
                </div>
                <div className={`flex items-center text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <BookOpenIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span>{groupe.filiere}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onClose={handleCancelDelete} className="relative z-50">
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
              <p>Êtes-vous sûr de vouloir supprimer ce groupe ?</p>
              {groupToDelete && (
                <div className="mt-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {groupToDelete.nom}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Semestre {groupToDelete.semestre} • {groupToDelete.filiere}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                className={`px-4 py-2 text-sm font-medium rounded-md border ${
                  isDark 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
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

      {/* Modal Ajout/Modification Groupe */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className={`mx-auto max-w-md rounded-xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } p-6 shadow-lg w-full`}>
            <Dialog.Title className={`text-lg font-medium mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {editingGroupe ? 'Modifier le groupe' : 'Ajouter un groupe'}
            </Dialog.Title>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Nom du groupe
                </label>
                <input
                  {...register('nom', { 
                    required: 'Le nom est requis',
                    pattern: {
                      value: /^G[0-9]+(-[A-Z])?$/,
                      message: 'Format invalide (ex: G1, G1-A)'
                    }
                  })}
                  type="text"
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300 text-gray-900'
                  } focus:border-primary-600 focus:ring-primary-600`}
                  placeholder="ex: G1, G1-A"
                />
                {errors.nom && (
                  <p className="mt-1 text-sm text-red-500">{errors.nom.message}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Semestre
                </label>
                <select
                  {...register('semestre', { 
                    required: 'Le semestre est requis'
                  })}
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300 text-gray-900'
                  } focus:border-primary-600 focus:ring-primary-600`}
                >
                  <option value="">Sélectionner</option>
                  {SEMESTERS.map((sem) => (
                    <option key={sem} value={sem}>S{sem}</option>
                  ))}
                </select>
                {errors.semestre && (
                  <p className="mt-1 text-sm text-red-500">{errors.semestre.message}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Filière
                </label>
                <select
                  {...register('filiere', { 
                    required: 'La filière est requise'
                  })}
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300 text-gray-900'
                  } focus:border-primary-600 focus:ring-primary-600`}
                >
                  <option value="">Sélectionner</option>
                  {SPECIALIZATIONS.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                {errors.filiere && (
                  <p className="mt-1 text-sm text-red-500">{errors.filiere.message}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Effectif
                </label>
                <input
                  {...register('effectif', { 
                    required: 'L\'effectif est requis',
                    min: {
                      value: 1,
                      message: 'L\'effectif doit être supérieur à 0'
                    }
                  })}
                  type="number"
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300 text-gray-900'
                  } focus:border-primary-600 focus:ring-primary-600`}
                />
                {errors.effectif && (
                  <p className="mt-1 text-sm text-red-500">{errors.effectif.message}</p>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    reset();
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md border ${
                    isDark 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
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
                    editingGroupe ? 'Modifier' : 'Ajouter'
                  )}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 
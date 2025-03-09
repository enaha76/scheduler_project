import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog } from '@headlessui/react';
import { 
  PlusIcon, 
  PencilIcon,
  TrashIcon,
  ClockIcon,
  UserGroupIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import { useThemeStore } from '../store/themeStore';
import { useStore } from '../store';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';

interface Course {
  id: number;
  name: string;
  type: string;
  totalHours: number;
  weeklyHours: number;
  requiredRoomType: string;
  minCapacity: number;
}

interface WeeklyTeachingLoad {
  id: number;
  courseId: number;
  groupId: number;
  professorId: number;
  hoursPerWeek: number;
}

const COURSE_TYPES = ['CM', 'TD', 'TP'];
const ROOM_TYPES = ['Amphi', 'Salle de cours', 'Salle TP', 'Labo'];

const SAMPLE_COURSE: Course = {
  id: 1,
  name: 'Algorithmes et Structures de Données',
  type: 'CM',
  totalHours: 48,
  weeklyHours: 4,
  requiredRoomType: 'Salle TP',
  minCapacity: 30
};

export default function Cours() {
  const { isDark } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Course>();

  const handleOpenModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setValue('name', course.name);
      setValue('type', course.type);
      setValue('totalHours', course.totalHours);
      setValue('weeklyHours', course.weeklyHours);
      setValue('requiredRoomType', course.requiredRoomType);
      setValue('minCapacity', course.minCapacity);
    } else {
      setEditingCourse(null);
      reset();
    }
    setIsOpen(true);
  };

  const onSubmit = async (data: Course) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call
      toast.success(editingCourse ? 'Cours modifié avec succès' : 'Cours ajouté avec succès');
      setIsOpen(false);
      reset();
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (courseToDelete) {
      try {
        // TODO: Implement API call
        toast.success('Cours supprimé avec succès');
        setIsDeleteModalOpen(false);
        setCourseToDelete(null);
      } catch (error) {
        toast.error('Une erreur est survenue');
      }
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between mb-8">
        <PageHeader
          title="Cours"
          subtitle="Gestion des cours et charges d'enseignement"
        />
        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Ajouter un cours
        </button>
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className={`${
          isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
        } rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300`}>
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-base sm:text-lg font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {SAMPLE_COURSE.name}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenModal(SAMPLE_COURSE)}
                  className={`${
                    isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  } transition-colors duration-200`}
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(SAMPLE_COURSE)}
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
                <ClockIcon className="h-5 w-5 mr-2" />
                <span>{SAMPLE_COURSE.totalHours}h total • {SAMPLE_COURSE.weeklyHours}h/semaine</span>
              </div>
              <div className={`flex items-center text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <BuildingLibraryIcon className="h-5 w-5 mr-2" />
                <span>{SAMPLE_COURSE.requiredRoomType} (min. {SAMPLE_COURSE.minCapacity} places)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Course Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className={`mx-auto max-w-md rounded-xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } p-6 shadow-lg w-full`}>
            <Dialog.Title className={`text-lg font-medium mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {editingCourse ? 'Modifier le cours' : 'Ajouter un cours'}
            </Dialog.Title>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Nom du cours
                </label>
                <input
                  {...register('name', { required: 'Le nom est requis' })}
                  type="text"
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'
                  } focus:border-primary-600 focus:ring-primary-600`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Type
                </label>
                <select
                  {...register('type', { required: 'Le type est requis' })}
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'
                  } focus:border-primary-600 focus:ring-primary-600`}
                >
                  <option value="">Sélectionner</option>
                  {COURSE_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Heures totales
                  </label>
                  <input
                    {...register('totalHours', { 
                      required: 'Le nombre d\'heures est requis',
                      min: { value: 1, message: 'Minimum 1 heure' }
                    })}
                    type="number"
                    className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'
                    } focus:border-primary-600 focus:ring-primary-600`}
                  />
                  {errors.totalHours && (
                    <p className="mt-1 text-sm text-red-500">{errors.totalHours.message}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Heures par semaine
                  </label>
                  <input
                    {...register('weeklyHours', { 
                      required: 'Les heures par semaine sont requises',
                      min: { value: 1, message: 'Minimum 1 heure' }
                    })}
                    type="number"
                    className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'
                    } focus:border-primary-600 focus:ring-primary-600`}
                  />
                  {errors.weeklyHours && (
                    <p className="mt-1 text-sm text-red-500">{errors.weeklyHours.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Type de salle requis
                </label>
                <select
                  {...register('requiredRoomType', { required: 'Le type de salle est requis' })}
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'
                  } focus:border-primary-600 focus:ring-primary-600`}
                >
                  <option value="">Sélectionner</option>
                  {ROOM_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.requiredRoomType && (
                  <p className="mt-1 text-sm text-red-500">{errors.requiredRoomType.message}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Capacité minimale
                </label>
                <input
                  {...register('minCapacity', { 
                    required: 'La capacité minimale est requise',
                    min: { value: 1, message: 'Minimum 1 place' }
                  })}
                  type="number"
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'
                  } focus:border-primary-600 focus:ring-primary-600`}
                />
                {errors.minCapacity && (
                  <p className="mt-1 text-sm text-red-500">{errors.minCapacity.message}</p>
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
                    editingCourse ? 'Modifier' : 'Ajouter'
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
              <p>Êtes-vous sûr de vouloir supprimer ce cours ?</p>
              {courseToDelete && (
                <div className="mt-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {courseToDelete.name}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {courseToDelete.type} • {courseToDelete.totalHours}h total
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
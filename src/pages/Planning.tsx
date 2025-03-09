import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { useThemeStore } from '../store/themeStore';
import PageHeader from '../components/PageHeader';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const timeSlots = ['8h-10h', '10h-12h', '14h-16h', '16h-18h', '18h-20h'];
const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

interface CourseSession {
  id: number;
  matiere: string;
  enseignant: string;
  groupe: string;
  type: 'CM' | 'TD' | 'TP';
  salle: string;
  day: string;
  timeSlot: string;
}

// Initial sample data
const initialSessions: CourseSession[] = [
  {
    id: 1,
    matiere: 'Mathématiques',
    enseignant: 'Dr. Ahmed',
    groupe: 'G1',
    type: 'CM',
    salle: 'A101',
    day: 'Lundi',
    timeSlot: '8h-10h'
  },
  {
    id: 2,
    matiere: 'Programmation',
    enseignant: 'Prof. Mohamed',
    groupe: 'G2',
    type: 'TP',
    salle: 'Lab 3',
    day: 'Mardi',
    timeSlot: '14h-16h'
  },
  {
    id: 3,
    matiere: 'Base de données',
    enseignant: 'Dr. Fatima',
    groupe: 'G1-A',
    type: 'TD',
    salle: 'B205',
    day: 'Mercredi',
    timeSlot: '10h-12h'
  }
];

export default function Planning() {
  const { isDark } = useThemeStore();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<CourseSession | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; timeSlot: string } | null>(null);
  const [sessions, setSessions] = useState<CourseSession[]>(initialSessions);
  const [editingSession, setEditingSession] = useState<CourseSession | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<CourseSession>();

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => Math.max(1, prev - 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => Math.min(52, prev + 1));
  };

  const handleSlotClick = (day: string, timeSlot: string) => {
    const existingSession = sessions.find(s => s.day === day && s.timeSlot === timeSlot);
    if (existingSession) {
      setEditingSession(existingSession);
      setValue('matiere', existingSession.matiere);
      setValue('type', existingSession.type);
      setValue('enseignant', existingSession.enseignant);
      setValue('groupe', existingSession.groupe);
      setValue('salle', existingSession.salle);
    } else {
      setEditingSession(null);
      reset();
    }
    setSelectedSlot({ day, timeSlot });
    setIsAddModalOpen(true);
  };

  const getSessionForSlot = (day: string, timeSlot: string) => {
    return sessions.find(s => s.day === day && s.timeSlot === timeSlot);
  };

  const handleDeleteClick = (session: CourseSession) => {
    setSessionToDelete(session);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (sessionToDelete) {
      setSessions(prev => prev.filter(s => s.id !== sessionToDelete.id));
      toast.success('Séance supprimée avec succès');
      setIsDeleteModalOpen(false);
      setSessionToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSessionToDelete(null);
  };

  const onSubmit = async (data: Partial<CourseSession>) => {
    setIsSubmitting(true);
    try {
      if (editingSession) {
        // Update existing session
        setSessions(prev => prev.map(session => 
          session.id === editingSession.id 
            ? { ...session, ...data } 
            : session
        ));
        toast.success('Séance modifiée avec succès');
      } else {
        // Add new session
        const newId = Math.max(0, ...sessions.map(s => s.id)) + 1;
        const newSession: CourseSession = {
          matiere: data.matiere!,
          enseignant: data.enseignant!,
          groupe: data.groupe!,
          type: data.type!,
          salle: data.salle!,
          id: newId,
          day: selectedSlot?.day || '',
          timeSlot: selectedSlot?.timeSlot || ''
        };
        setSessions(prev => [...prev, newSession]);
        toast.success('Séance ajoutée avec succès');
      }
      setIsAddModalOpen(false);
      reset();
      setEditingSession(null);
      setSelectedSlot(null);
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingSession(null);
    setSelectedSlot(null);
    reset();
  };

  const handleExportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = sessions.map(session => ({
        'Jour': session.day,
        'Horaire': session.timeSlot,
        'Matière': session.matiere,
        'Type': session.type,
        'Enseignant': session.enseignant,
        'Groupe': session.groupe,
        'Salle': session.salle
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Planning');

      // Generate Excel file
      XLSX.writeFile(wb, `planning_semaine_${currentWeek}.xlsx`);
      
      toast.success('Planning exporté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'exportation');
      console.error('Export error:', error);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 overflow-hidden">
        <div className="h-full">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <PageHeader
                  title="Planning"
                  subtitle="Gestion des emplois du temps"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className={`flex justify-center items-center space-x-2 text-sm rounded-lg p-2 ${
                  isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                }`}>
                  <button
                    onClick={handlePreviousWeek}
                    disabled={currentWeek <= 1}
                    className={`p-1.5 rounded-lg transition-colors duration-200 ${
                      isDark 
                        ? 'hover:bg-gray-700 disabled:text-gray-600' 
                        : 'hover:bg-white disabled:text-gray-300'
                    } disabled:cursor-not-allowed`}
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <span className={`min-w-[90px] text-center font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Semaine {currentWeek}
                  </span>
                  <button
                    onClick={handleNextWeek}
                    disabled={currentWeek >= 52}
                    className={`p-1.5 rounded-lg transition-colors duration-200 ${
                      isDark 
                        ? 'hover:bg-gray-700 disabled:text-gray-600' 
                        : 'hover:bg-white disabled:text-gray-300'
                    } disabled:cursor-not-allowed`}
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={handleExportToExcel}
                  className="inline-flex items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900 w-full sm:w-auto"
                >
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Exporter
                </button>
              </div>
            </div>
          </div>

    <div className="px-4 sm:px-6 lg:px-8">
            <div className={`rounded-xl border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  <div className="rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Horaire
                          </th>
                          {days.map((day) => (
                            <th key={day} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${
                        isDark ? 'bg-gray-900' : 'bg-white'
                      }`}>
                        {timeSlots.map((timeSlot, timeIndex) => (
                          <tr key={timeSlot} className={timeIndex % 2 === 0 ? undefined : isDark ? 'bg-gray-800/50' : 'bg-gray-50'}>
                            <td className={`whitespace-nowrap px-1 sm:px-2 py-2 text-xs sm:text-sm ${
                              isDark ? 'text-gray-300' : 'text-gray-500'
                            }`}>
                              {timeSlot}
                            </td>
                            {days.map((day) => {
                              const session = getSessionForSlot(day, timeSlot);
                              return (
                                <td
                                  key={`${day}-${timeSlot}`}
                                  className="p-0.5 sm:p-1 h-24 sm:h-28"
                                >
                                  {session ? (
                                    <div
                                      className={`h-full rounded-lg p-1 sm:p-2 group relative ${
                                        session.type === 'CM'
                                          ? isDark ? 'bg-blue-900/50' : 'bg-blue-50'
                                          : session.type === 'TD'
                                          ? isDark ? 'bg-green-900/50' : 'bg-green-50'
                                          : isDark ? 'bg-purple-900/50' : 'bg-purple-50'
                                      }`}
                                    >
                                      <div className="flex flex-col h-full justify-between">
                                        <div className="space-y-0.5 sm:space-y-1">
                                          <div className={`text-xs sm:text-sm font-medium truncate ${
                                            isDark ? 'text-white' : 'text-gray-900'
                                          }`}>
                                            {session.matiere}
                                          </div>
                                          <div className="flex items-center text-[10px] sm:text-xs space-x-1">
                                            <span className={`inline-flex items-center rounded px-1 py-0.5 text-[10px] sm:text-xs font-medium ${
                                              session.type === 'CM'
                                                ? isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
                                                : session.type === 'TD'
                                                ? isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'
                                                : isDark ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700'
                                            }`}>
                                              {session.type}
                                            </span>
                                            <span className={`truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                              {session.salle}
                                            </span>
                                          </div>
                                        </div>
                                        <div className={`text-[10px] sm:text-xs truncate ${
                                          isDark ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                          {session.enseignant} • {session.groupe}
                                        </div>
                                      </div>
                                      <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-0.5 sm:space-x-1">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleSlotClick(day, timeSlot);
                                          }}
                                          className={`p-0.5 rounded-full ${
                                            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                                          }`}
                                        >
                                          <PencilIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(session);
                                          }}
                                          className="p-0.5 rounded-full hover:bg-red-100 text-red-600"
                                        >
                                          <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => handleSlotClick(day, timeSlot)}
                                      className={`w-full h-full rounded-lg border border-dashed ${
                                        isDark 
                                          ? 'border-gray-700 hover:border-gray-600' 
                                          : 'border-gray-200 hover:border-gray-300'
                                      } transition-colors duration-200`}
                                    >
                                      <span className="sr-only">Ajouter une séance</span>
                                    </button>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
              <p>Êtes-vous sûr de vouloir supprimer cette séance ?</p>
              {sessionToDelete && (
                <div className="mt-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {sessionToDelete.matiere} - {sessionToDelete.type}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {sessionToDelete.day} • {sessionToDelete.timeSlot}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {sessionToDelete.enseignant} • {sessionToDelete.groupe} • {sessionToDelete.salle}
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

      {/* Modal d'ajout/modification de séance */}
      <Dialog open={isAddModalOpen} onClose={handleCloseModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className={`mx-auto max-w-md rounded-xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } p-6 shadow-lg w-full`}>
            <Dialog.Title className={`text-lg font-medium mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {editingSession ? 'Modifier la séance' : 'Nouvelle séance'}
              {selectedSlot && (
                <span className={`block text-sm mt-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {selectedSlot.day} • {selectedSlot.timeSlot}
                </span>
              )}
            </Dialog.Title>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Matière
                </label>
                <div className={`mt-1 flex rounded-md shadow-sm ring-1 ring-inset ${
                  isDark ? 'ring-gray-600' : 'ring-gray-300'
                }`}>
                  <span className={`flex select-none items-center pl-3 text-gray-500 sm:text-sm ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <BookOpenIcon className="h-5 w-5" />
                  </span>
                <select
                    {...register('matiere', { required: 'Ce champ est requis' })}
                    className={`block w-full rounded-r-md border-0 py-1.5 pl-3 ${
                      isDark 
                        ? 'bg-gray-700 text-white focus:ring-primary-600' 
                        : 'bg-white text-gray-900 focus:ring-primary-600'
                    } sm:text-sm sm:leading-6`}
                >
                  <option value="">Sélectionner une matière</option>
                    <option value="Mathématiques">Mathématiques</option>
                    <option value="Programmation">Programmation</option>
                    <option value="Base de données">Base de données</option>
                </select>
                </div>
                {errors.matiere && (
                  <p className="mt-1 text-sm text-red-600">{errors.matiere.message}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Type de cours
                </label>
                <div className={`mt-1 flex rounded-md shadow-sm ring-1 ring-inset ${
                  isDark ? 'ring-gray-600' : 'ring-gray-300'
                }`}>
                  <span className={`flex select-none items-center pl-3 text-gray-500 sm:text-sm ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <CalendarIcon className="h-5 w-5" />
                  </span>
                <select
                    {...register('type', { required: 'Ce champ est requis' })}
                    className={`block w-full rounded-r-md border-0 py-1.5 pl-3 ${
                      isDark 
                        ? 'bg-gray-700 text-white focus:ring-primary-600' 
                        : 'bg-white text-gray-900 focus:ring-primary-600'
                    } sm:text-sm sm:leading-6`}
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="CM">Cours Magistral (CM)</option>
                    <option value="TD">Travaux Dirigés (TD)</option>
                    <option value="TP">Travaux Pratiques (TP)</option>
                </select>
                </div>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Enseignant
                </label>
                <div className={`mt-1 flex rounded-md shadow-sm ring-1 ring-inset ${
                  isDark ? 'ring-gray-600' : 'ring-gray-300'
                }`}>
                  <span className={`flex select-none items-center pl-3 text-gray-500 sm:text-sm ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <AcademicCapIcon className="h-5 w-5" />
                  </span>
                <select
                    {...register('enseignant', { required: 'Ce champ est requis' })}
                    className={`block w-full rounded-r-md border-0 py-1.5 pl-3 ${
                      isDark 
                        ? 'bg-gray-700 text-white focus:ring-primary-600' 
                        : 'bg-white text-gray-900 focus:ring-primary-600'
                    } sm:text-sm sm:leading-6`}
                  >
                    <option value="">Sélectionner un enseignant</option>
                    <option value="Dr. Ahmed">Dr. Ahmed</option>
                    <option value="Prof. Mohamed">Prof. Mohamed</option>
                    <option value="Dr. Fatima">Dr. Fatima</option>
                </select>
                </div>
                {errors.enseignant && (
                  <p className="mt-1 text-sm text-red-600">{errors.enseignant.message}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Groupe
                </label>
                <div className={`mt-1 flex rounded-md shadow-sm ring-1 ring-inset ${
                  isDark ? 'ring-gray-600' : 'ring-gray-300'
                }`}>
                  <span className={`flex select-none items-center pl-3 text-gray-500 sm:text-sm ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <UserGroupIcon className="h-5 w-5" />
                  </span>
                <select
                    {...register('groupe', { required: 'Ce champ est requis' })}
                    className={`block w-full rounded-r-md border-0 py-1.5 pl-3 ${
                      isDark 
                        ? 'bg-gray-700 text-white focus:ring-primary-600' 
                        : 'bg-white text-gray-900 focus:ring-primary-600'
                    } sm:text-sm sm:leading-6`}
                  >
                    <option value="">Sélectionner un groupe</option>
                    <option value="G1">G1</option>
                    <option value="G1-A">G1-A</option>
                    <option value="G1-B">G1-B</option>
                    <option value="G2">G2</option>
                </select>
              </div>
                {errors.groupe && (
                  <p className="mt-1 text-sm text-red-600">{errors.groupe.message}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Salle
                </label>
                <div className={`mt-1 flex rounded-md shadow-sm ring-1 ring-inset ${
                  isDark ? 'ring-gray-600' : 'ring-gray-300'
                }`}>
                  <span className={`flex select-none items-center pl-3 text-gray-500 sm:text-sm ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <ClockIcon className="h-5 w-5" />
                  </span>
                <select
                    {...register('salle', { required: 'Ce champ est requis' })}
                    className={`block w-full rounded-r-md border-0 py-1.5 pl-3 ${
                      isDark 
                        ? 'bg-gray-700 text-white focus:ring-primary-600' 
                        : 'bg-white text-gray-900 focus:ring-primary-600'
                    } sm:text-sm sm:leading-6`}
                >
                  <option value="">Sélectionner une salle</option>
                    <option value="A101">A101</option>
                    <option value="B205">B205</option>
                    <option value="Lab 3">Lab 3</option>
                </select>
                </div>
                {errors.salle && (
                  <p className="mt-1 text-sm text-red-600">{errors.salle.message}</p>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
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
                  ) : editingSession ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 
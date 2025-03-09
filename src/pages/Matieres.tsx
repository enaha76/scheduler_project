import { useState } from 'react';
import { useStore } from '../store';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { 
  PlusIcon, 
  AcademicCapIcon, 
  ClockIcon, 
  BookOpenIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useThemeStore } from '../store/themeStore';
import { useFiliereStore } from '../store/filiereStore';
import type { FiliereSettings } from '../store/filiereStore';
import toast from 'react-hot-toast';
import type { Matiere, Filiere, TypeCours } from '../types/matiere';

type MatiereFormData = Omit<Matiere, 'readonly'>;

interface FiliereFormData {
  filiere: Filiere;
  fullName: string;
  color: string;
}

export default function Matieres() {
  const { matieres, addMatiere, updateMatiere, deleteMatiere } = useStore();
  const { isDark } = useThemeStore();
  const { filiereSettings, availableColors, addFiliereSettings, updateFiliereSettings } = useFiliereStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isFiliereModalOpen, setIsFiliereModalOpen] = useState(false);
  const [selectedMatiere, setSelectedMatiere] = useState<Matiere | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiliere, setSelectedFiliere] = useState<Filiere | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm<MatiereFormData>();

  const {
    register: registerFiliere,
    handleSubmit: handleSubmitFiliere,
    reset: resetFiliere,
    setValue: setFiliereValue,
    formState: { errors: filiereErrors },
  } = useForm<FiliereFormData>();

  // Filter matieres based on search term and selected filiere
  const filteredMatieres = matieres.filter(matiere => {
    const matchesSearch = matiere.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         matiere.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFiliere = selectedFiliere ? matiere.filiere === selectedFiliere : true;
    return matchesSearch && matchesFiliere;
  });

  // Group filtered matieres by filiere
  const matieresByFiliere = filteredMatieres.reduce((acc, matiere) => {
    const filiere = matiere.filiere;
    if (!acc[filiere]) {
      acc[filiere] = [];
    }
    acc[filiere].push(matiere);
    return acc;
  }, {} as Record<Filiere, Matiere[]>);

  const getFiliereColor = (filiere: Filiere) => {
    const settings = filiereSettings.find(f => f.filiere === filiere);
    return settings?.color || 'from-gray-500 to-gray-600';
  };

  const getFiliereFullName = (filiere: Filiere) => {
    const settings = filiereSettings.find(f => f.filiere === filiere);
    return settings?.fullName || filiere;
  };

  const handleOpenModal = (matiere?: MatiereFormData) => {
    if (matiere) {
      setSelectedMatiere(matiere as Matiere);
      setValue('id', matiere.id);
      setValue('code', matiere.code);
      setValue('nom', matiere.nom);
      setValue('credits', matiere.credits);
      setValue('semestre', matiere.semestre);
      setValue('filiere', matiere.filiere);
      setValue('volumeHoraire', matiere.volumeHoraire);
      setValue('type', matiere.type);
    } else {
      setSelectedMatiere(null);
      reset();
    }
    setIsOpen(true);
  };

  const onSubmit = async (data: MatiereFormData) => {
    setIsSubmitting(true);
    try {
      if (selectedMatiere) {
        await updateMatiere(selectedMatiere.id, data as Matiere);
        toast.success('Matière modifiée avec succès');
      } else {
        await addMatiere({
          ...data,
          id: Math.max(0, ...matieres.map(m => m.id)) + 1
        } as Matiere);
        toast.success('Matière ajoutée avec succès');
      }
      setIsOpen(false);
      reset();
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (matiere: Matiere) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
      try {
        await deleteMatiere(matiere.id);
        toast.success('Matière supprimée avec succès');
      } catch (error) {
        toast.error('Une erreur est survenue');
      }
    }
  };

  const onSubmitFiliere = async (data: FiliereFormData) => {
    const id = data.filiere.toLowerCase();
    const existingSettings = filiereSettings.find(f => f.id === id);
    
    if (existingSettings) {
      updateFiliereSettings(id, {
        color: data.color,
        fullName: data.fullName
      });
      toast.success('Filière mise à jour avec succès');
    } else {
      addFiliereSettings({
        id,
        filiere: data.filiere,
        color: data.color,
        fullName: data.fullName
      });
      toast.success('Filière ajoutée avec succès');
    }
    
    setIsFiliereModalOpen(false);
    resetFiliere();
  };

  const handleOpenFiliereModal = (settings?: FiliereSettings) => {
    if (settings) {
      setFiliereValue('filiere', settings.filiere);
      setFiliereValue('fullName', settings.fullName);
      setFiliereValue('color', settings.color);
      setSelectedColor(settings.color);
    } else {
      resetFiliere();
      setSelectedColor('');
    }
    setIsFiliereModalOpen(true);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className={`text-2xl font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Matières
          </h1>
          <p className={`mt-2 text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-700'
          }`}>
            Liste des matières par filière
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => handleOpenFiliereModal()}
            className="inline-flex items-center justify-center rounded-md bg-supnum-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-supnum-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-supnum-blue transition-all duration-200"
          >
            <Cog6ToothIcon className="h-5 w-5 mr-2" />
            Gérer les filières
          </button>
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="inline-flex items-center justify-center rounded-md bg-supnum-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-supnum-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-supnum-blue transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Ajouter une matière
          </button>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4">
        <div className="w-full">
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
              className={`block w-full rounded-md border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-supnum-blue text-sm ${
                isDark ? 'bg-gray-700 text-white ring-gray-600' : ''
              }`}
              placeholder="Rechercher une matière..."
            />
          </div>
        </div>
        <div className="w-full">
          <select
            value={selectedFiliere}
            onChange={(e) => setSelectedFiliere(e.target.value as Filiere | '')}
            className={`block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-supnum-blue text-sm ${
              isDark ? 'bg-gray-700 text-white ring-gray-600' : ''
            }`}
          >
            <option value="">Toutes les filières</option>
            {filiereSettings.map((settings) => (
              <option key={settings.id} value={settings.filiere}>
                {settings.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(matieresByFiliere).map(([filiere, matieres]) => (
          <div key={filiere} className={`rounded-xl p-6 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } shadow-sm`}>
            <h2 className="flex items-center text-lg font-semibold mb-4">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getFiliereColor(filiere as Filiere)} flex items-center justify-center mr-3`}>
                <AcademicCapIcon className="h-5 w-5 text-white" />
              </div>
              <span className={isDark ? 'text-white' : 'text-gray-900'}>
                {getFiliereFullName(filiere as Filiere)}
              </span>
              <span className={`ml-3 text-sm font-normal ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                ({matieres.length} matières)
              </span>
            </h2>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matieres.map((matiere) => (
                <div
                  key={matiere.id}
                  className={`${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-white hover:bg-gray-50'
                  } rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className={`text-lg font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      } flex-grow`}>
                        {matiere.nom}
                      </h3>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleOpenModal(matiere as MatiereFormData)}
                          className={`${
                            isDark 
                              ? 'text-gray-300 hover:text-white' 
                              : 'text-gray-600 hover:text-gray-900'
                          } transition-colors duration-200`}
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(matiere)}
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
                        <AcademicCapIcon className="h-5 w-5 mr-2" />
                        <span>Filière: {matiere.filiere}</span>
                      </div>
                      <div className={`flex items-center text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        <ClockIcon className="h-5 w-5 mr-2" />
                        <span>Volume horaire: {matiere.volumeHoraire}h</span>
                      </div>
                      <div className={`flex items-center text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        <BookOpenIcon className="h-5 w-5 mr-2" />
                        <span>Type: {matiere.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog 
        open={isOpen} 
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className={`mx-auto max-w-md rounded-xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } p-6 shadow-lg w-full`}>
            <Dialog.Title className={`text-lg font-medium mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {selectedMatiere ? 'Modifier la matière' : 'Ajouter une matière'}
            </Dialog.Title>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Code
                </label>
                <input
                  {...register('code', { 
                    required: 'Le code est requis',
                    pattern: {
                      value: /^[A-Z]{2,4}[0-9]{3}$/,
                      message: 'Format invalide (ex: MATH101)'
                    }
                  })}
                  type="text"
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300 text-gray-900'
                  } focus:border-supnum-blue focus:ring-supnum-blue`}
                  placeholder="ex: MATH101"
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-500">{errors.code.message}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Nom
                </label>
                <input
                  {...register('nom', { 
                    required: 'Le nom est requis',
                    minLength: {
                      value: 3,
                      message: 'Le nom doit contenir au moins 3 caractères'
                    }
                  })}
                  type="text"
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300 text-gray-900'
                  } focus:border-supnum-blue focus:ring-supnum-blue`}
                  placeholder="ex: Mathématiques"
                />
                {errors.nom && (
                  <p className="mt-1 text-sm text-red-500">{errors.nom.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Crédits
                  </label>
                  <input
                    {...register('credits', { 
                      required: 'Les crédits sont requis',
                      min: {
                        value: 1,
                        message: 'Minimum 1 crédit'
                      },
                      max: {
                        value: 10,
                        message: 'Maximum 10 crédits'
                      }
                    })}
                    type="number"
                    min="1"
                    max="10"
                    className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300 text-gray-900'
                    } focus:border-supnum-blue focus:ring-supnum-blue`}
                  />
                  {errors.credits && (
                    <p className="mt-1 text-sm text-red-500">{errors.credits.message}</p>
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
                    } focus:border-supnum-blue focus:ring-supnum-blue`}
                  >
                    <option value="">Sélectionner</option>
                    {[1, 2, 3, 4, 5, 6].map((sem) => (
                      <option key={sem} value={sem}>S{sem}</option>
                    ))}
                  </select>
                  {errors.semestre && (
                    <p className="mt-1 text-sm text-red-500">{errors.semestre.message}</p>
                  )}
                </div>
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
                  } focus:border-supnum-blue focus:ring-supnum-blue`}
                >
                  <option value="">Sélectionner</option>
                  <option value="TC">Tronc Commun</option>
                  <option value="DWM">Développement Web et Mobile</option>
                  <option value="DSI">Développement des Systèmes d'Information</option>
                  <option value="RSS">Réseaux et Sécurité des Systèmes</option>
                </select>
                {errors.filiere && (
                  <p className="mt-1 text-sm text-red-500">{errors.filiere.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Volume horaire
                  </label>
                  <input
                    {...register('volumeHoraire', { 
                      required: 'Le volume horaire est requis',
                      min: {
                        value: 1,
                        message: 'Minimum 1 heure'
                      },
                      max: {
                        value: 100,
                        message: 'Maximum 100 heures'
                      }
                    })}
                    type="number"
                    min="1"
                    max="100"
                    className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300 text-gray-900'
                    } focus:border-supnum-blue focus:ring-supnum-blue`}
                  />
                  {errors.volumeHoraire && (
                    <p className="mt-1 text-sm text-red-500">{errors.volumeHoraire.message}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Type de cours
                  </label>
                  <select
                    {...register('type', { 
                      required: 'Le type de cours est requis'
                    })}
                    className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300 text-gray-900'
                    } focus:border-supnum-blue focus:ring-supnum-blue`}
                  >
                    <option value="">Sélectionner</option>
                    <option value="CM">Cours Magistral (CM)</option>
                    <option value="TD">Travaux Dirigés (TD)</option>
                    <option value="TP">Travaux Pratiques (TP)</option>
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md border ${
                    isDark 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition-colors duration-200`}
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-supnum-blue text-white hover:bg-supnum-blue/90 transition-colors duration-200 disabled:opacity-50"
                >
                  {isSubmitting && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {selectedMatiere ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog 
        open={isFiliereModalOpen} 
        onClose={() => setIsFiliereModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className={`mx-auto max-w-md rounded-xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } p-6 shadow-lg w-full`}>
            <Dialog.Title className={`text-lg font-medium mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Gérer les filières
            </Dialog.Title>

            <form onSubmit={handleSubmitFiliere(onSubmitFiliere)} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Code filière
                </label>
                <input
                  {...registerFiliere('filiere', { 
                    required: 'Le code est requis',
                    pattern: {
                      value: /^[A-Z]{2,4}$/,
                      message: 'Format invalide (ex: TC, DWM)'
                    }
                  })}
                  type="text"
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300 text-gray-900'
                  } focus:border-supnum-blue focus:ring-supnum-blue`}
                  placeholder="ex: TC"
                />
                {filiereErrors.filiere && (
                  <p className="mt-1 text-sm text-red-500">{filiereErrors.filiere.message}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Nom complet
                </label>
                <input
                  {...registerFiliere('fullName', { 
                    required: 'Le nom est requis'
                  })}
                  type="text"
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300 text-gray-900'
                  } focus:border-supnum-blue focus:ring-supnum-blue`}
                  placeholder="ex: Tronc Commun"
                />
                {filiereErrors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{filiereErrors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Couleur
                </label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {Object.entries(availableColors).map(([name, { color, isUsed }]) => (
                    <button
                      key={name}
                      type="button"
                      disabled={isUsed && color !== selectedColor}
                      onClick={() => {
                        setSelectedColor(color);
                        setFiliereValue('color', color);
                      }}
                      className={`h-8 w-full rounded-md bg-gradient-to-r ${color} ${
                        isUsed && color !== selectedColor 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:opacity-90'
                      } ${
                        color === selectedColor 
                          ? 'ring-2 ring-offset-2 ring-supnum-blue' 
                          : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFiliereModalOpen(false)}
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
                  className="px-4 py-2 text-sm font-medium rounded-md bg-supnum-blue text-white hover:bg-supnum-blue/90 transition-colors duration-200"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 
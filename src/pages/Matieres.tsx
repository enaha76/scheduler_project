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
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useThemeStore } from '../store/themeStore';
import { useFiliereStore } from '../store/filiereStore';
import type { FiliereSettings } from '../store/filiereStore';
import toast from 'react-hot-toast';
import type { Matiere, Filiere, TypeCours } from '../types/matiere';
import PageHeader from '../components/PageHeader';

interface TeachingLoad {
  id?: number;
  matiereId: number;
  type: 'CM' | 'TD' | 'TP';
  hoursRequired: number;
  groupIds: number[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProfessorAssignment {
  id?: number;
  matiereId: number;
  professorId: number;
  teachingType: 'CM' | 'TD' | 'TP';
  groupId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MatiereFormData {
  id?: number;
  code: string;
  nom: string;
  credits: number;
  semestre: number;
  filiere: Filiere;
  type: TypeCours;
  volumeHoraire: number;
  description?: string;
  objectives?: string;
  prerequisites?: string;
  createdAt?: Date;
  updatedAt?: Date;
  teachingLoads: {
    CM: TeachingLoad;
    TD: TeachingLoad;
    TP: TeachingLoad;
  };
  professorAssignments: {
    CM: ProfessorAssignment;
    TD: ProfessorAssignment;
    TP: ProfessorAssignment;
  };
}

interface FiliereFormData {
  filiere: Filiere;
  fullName: string;
  color: string;
}

const FILIERES: Filiere[] = ['TC', 'DWM', 'DSI', 'RSS'];

// Ajout des exemples de professeurs
const EXAMPLE_PROFESSORS = [
  { id: 1, name: "Dr. Sarah Martinez", speciality: "Mathématiques" },
  { id: 2, name: "Prof. Thomas Anderson", speciality: "Informatique" },
  { id: 3, name: "Dr. Marie Dubois", speciality: "Physique" },
  { id: 4, name: "Prof. John Smith", speciality: "Algorithmique" },
  { id: 5, name: "Dr. Emma Wilson", speciality: "Base de données" },
  { id: 6, name: "Prof. David Brown", speciality: "Réseaux" },
  { id: 7, name: "Dr. Lisa Chen", speciality: "Intelligence Artificielle" },
  { id: 8, name: "Prof. Mohammed Ali", speciality: "Développement Web" }
];

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [matiereToDelete, setMatiereToDelete] = useState<Matiere | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'loads' | 'professors'>('general');
  const [formErrors, setFormErrors] = useState<string[]>([]);

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

  const handleOpenModal = (matiere?: Matiere) => {
    if (matiere) {
      setSelectedMatiere(matiere);
      setValue('code', matiere.code);
      setValue('nom', matiere.nom);
      setValue('credits', matiere.credits);
      setValue('semestre', matiere.semestre);
      setValue('filiere', matiere.filiere);
      setValue('type', matiere.type);
      setValue('volumeHoraire', matiere.volumeHoraire);
      setValue('description', matiere.description || '');
      setValue('objectives', matiere.objectives || '');
      setValue('prerequisites', matiere.prerequisites || '');
      
      // Initialiser les charges d'enseignement
      setValue('teachingLoads', {
        CM: matiere.teachingLoads?.find((load: TeachingLoad) => load.type === 'CM') || { hoursRequired: 0, type: 'CM', matiereId: matiere.id, groupIds: [] },
        TD: matiere.teachingLoads?.find((load: TeachingLoad) => load.type === 'TD') || { hoursRequired: 0, type: 'TD', matiereId: matiere.id, groupIds: [] },
        TP: matiere.teachingLoads?.find((load: TeachingLoad) => load.type === 'TP') || { hoursRequired: 0, type: 'TP', matiereId: matiere.id, groupIds: [] }
      });

      // Initialiser les assignations de professeurs
      setValue('professorAssignments', {
        CM: matiere.professorAssignments?.find((assign: ProfessorAssignment) => assign.teachingType === 'CM') || { professorId: 0, teachingType: 'CM', matiereId: matiere.id, groupId: 0 },
        TD: matiere.professorAssignments?.find((assign: ProfessorAssignment) => assign.teachingType === 'TD') || { professorId: 0, teachingType: 'TD', matiereId: matiere.id, groupId: 0 },
        TP: matiere.professorAssignments?.find((assign: ProfessorAssignment) => assign.teachingType === 'TP') || { professorId: 0, teachingType: 'TP', matiereId: matiere.id, groupId: 0 }
      });
    } else {
      setSelectedMatiere(null);
      reset({
        code: '',
        nom: '',
        credits: 0,
        semestre: 1,
        filiere: 'TC',
        type: 'CM',
        volumeHoraire: 0,
        description: '',
        objectives: '',
        prerequisites: '',
        teachingLoads: {
          CM: { hoursRequired: 0, type: 'CM', matiereId: 0, groupIds: [] },
          TD: { hoursRequired: 0, type: 'TD', matiereId: 0, groupIds: [] },
          TP: { hoursRequired: 0, type: 'TP', matiereId: 0, groupIds: [] }
        },
        professorAssignments: {
          CM: { professorId: 0, teachingType: 'CM', matiereId: 0, groupId: 0 },
          TD: { professorId: 0, teachingType: 'TD', matiereId: 0, groupId: 0 },
          TP: { professorId: 0, teachingType: 'TP', matiereId: 0, groupId: 0 }
        }
      });
    }
    setIsOpen(true);
  };

  const validateForm = (data: MatiereFormData) => {
    const errors: string[] = [];

    // Validation onglet "Informations générales"
    if (!data.code) errors.push("Le code de la matière est requis");
    if (!data.nom) errors.push("Le nom de la matière est requis");
    if (!data.credits || data.credits < 1) errors.push("Les crédits doivent être supérieurs à 0");
    if (!data.semestre) errors.push("Le semestre est requis");
    if (!data.filiere) errors.push("La filière est requise");
    if (!data.type) errors.push("Le type de cours est requis");
    if (!data.volumeHoraire || data.volumeHoraire < 1) errors.push("Le volume horaire doit être supérieur à 0");

    // Validation onglet "Charges d'enseignement"
    if (!data.teachingLoads.CM.hoursRequired) errors.push("Les heures de CM sont requises");
    if (!data.teachingLoads.TD.hoursRequired) errors.push("Les heures de TD sont requises");
    if (!data.teachingLoads.TP.hoursRequired) errors.push("Les heures de TP sont requises");

    // Validation onglet "Assignation des professeurs"
    if (!data.professorAssignments.CM.professorId) errors.push("L'assignation du professeur pour le CM est requise");
    if (!data.professorAssignments.TD.professorId) errors.push("L'assignation du professeur pour le TD est requise");
    if (!data.professorAssignments.TP.professorId) errors.push("L'assignation du professeur pour le TP est requise");

    return errors;
  };

  const onSubmit = async (data: MatiereFormData) => {
    const errors = validateForm(data);
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const matiereData: Matiere = {
        id: selectedMatiere?.id || Math.max(0, ...matieres.map(m => m.id)) + 1,
        code: data.code,
        nom: data.nom,
        credits: data.credits,
        semestre: data.semestre,
        filiere: data.filiere,
        type: data.type,
        volumeHoraire: data.volumeHoraire,
        description: data.description,
        objectives: data.objectives,
        prerequisites: data.prerequisites,
        createdAt: data.createdAt || new Date(),
        updatedAt: new Date()
      };

      // Préparer les charges d'enseignement
      const teachingLoads = Object.entries(data.teachingLoads).map(([type, load]) => ({
        ...load,
        matiereId: matiereData.id,
        type: type as TypeCours,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      // Préparer les assignations de professeurs
      const professorAssignments = Object.entries(data.professorAssignments).map(([type, assignment]) => ({
        ...assignment,
        matiereId: matiereData.id,
        teachingType: type as TypeCours,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      const matiereWithRelations: Matiere = {
        ...matiereData,
        teachingLoads,
        professorAssignments
      };

      if (selectedMatiere) {
        await updateMatiere(selectedMatiere.id, matiereWithRelations);
        toast.success('Matière modifiée avec succès');
      } else {
        await addMatiere(matiereWithRelations);
        toast.success('Matière ajoutée avec succès');
      }
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error(error);
      toast.error('Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (matiere: Matiere) => {
    setMatiereToDelete(matiere);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (matiereToDelete) {
      try {
        await deleteMatiere(matiereToDelete.id);
        toast.success('Matière supprimée avec succès');
        setIsDeleteModalOpen(false);
        setMatiereToDelete(null);
      } catch (error) {
        toast.error('Une erreur est survenue');
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setMatiereToDelete(null);
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

  const tabs = [
    { id: 'general', name: 'Informations générales' },
    { id: 'loads', name: 'Charges d\'enseignement' },
    { id: 'professors', name: 'Assignation des professeurs' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ex: MATH101"
                    className={`w-full rounded-lg border shadow-sm transition-all duration-200 ${
                      errors.code
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 hover:border-blue-400'
                    } dark:bg-gray-700 dark:text-white`}
                    {...register('code', { required: "Le code est requis" })}
                  />
                  {errors.code && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.code.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Mathématiques"
                    className={`w-full rounded-lg border shadow-sm transition-all duration-200 ${
                      errors.nom
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 hover:border-blue-400'
                    } dark:bg-gray-700 dark:text-white`}
                    {...register('nom', { required: "Le nom est requis" })}
                  />
                  {errors.nom && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nom.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Crédits <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className={`w-full rounded-lg border shadow-sm transition-all duration-200 ${
                      errors.credits
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 hover:border-blue-400'
                    } dark:bg-gray-700 dark:text-white`}
                    {...register('credits', { 
                      required: "Les crédits sont requis",
                      min: { value: 1, message: "Minimum 1 crédit" }
                    })}
                  />
                  {errors.credits && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.credits.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Semestre <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full rounded-lg border shadow-sm transition-all duration-200 ${
                      errors.semestre
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 hover:border-blue-400'
                    } dark:bg-gray-700 dark:text-white`}
                    {...register('semestre', { required: "Le semestre est requis" })}
                  >
                    <option value="">Sélectionner</option>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>Semestre {num}</option>
                    ))}
                  </select>
                  {errors.semestre && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.semestre.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Filière <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full rounded-lg border shadow-sm transition-all duration-200 ${
                      errors.filiere
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 hover:border-blue-400'
                    } dark:bg-gray-700 dark:text-white`}
                    {...register('filiere', { required: "La filière est requise" })}
                  >
                    <option value="">Sélectionner</option>
                    {FILIERES.map((filiere) => (
                      <option key={filiere} value={filiere}>{filiere}</option>
                    ))}
                  </select>
                  {errors.filiere && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.filiere.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Type de cours <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full rounded-lg border shadow-sm transition-all duration-200 ${
                      errors.type
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 hover:border-blue-400'
                    } dark:bg-gray-700 dark:text-white`}
                    {...register('type', { required: "Le type est requis" })}
                  >
                    <option value="">Sélectionner</option>
                    {['CM', 'TD', 'TP'].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Volume horaire total <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className={`w-full rounded-lg border shadow-sm transition-all duration-200 ${
                  errors.volumeHoraire
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 hover:border-blue-400'
                } dark:bg-gray-700 dark:text-white`}
                {...register('volumeHoraire', { 
                  required: "Le volume horaire est requis",
                  min: { value: 1, message: "Minimum 1 heure" }
                })}
              />
              {errors.volumeHoraire && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.volumeHoraire.message}</p>
              )}
            </div>
          </div>
        );

      case 'loads':
        return (
          <div className="space-y-6">
            {['CM', 'TD', 'TP'].map((type) => (
              <div key={type} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                      <ClockIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </span>
                    {type}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Heures <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        min="0"
                        className="w-32 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:border-blue-400 transition-all duration-200"
                        {...register(`teachingLoads.${type}.hoursRequired` as any, { required: true, min: 0 })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'professors':
        return (
          <div className="space-y-6">
            {['CM', 'TD', 'TP'].map((type) => (
              <div key={type} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                      <AcademicCapIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </span>
                    Assignation pour {type}
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Professeur <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:border-blue-400 transition-all duration-200"
                      {...register(`professorAssignments.${type}.professorId` as any, { required: true })}
                    >
                      <option value="">Sélectionner un professeur</option>
                      {EXAMPLE_PROFESSORS.map((prof) => (
                        <option key={prof.id} value={prof.id}>
                          {prof.name} - {prof.speciality}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Sélectionnez le professeur responsable pour les cours de {type}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-4 sm:gap-6 mb-8">
        <PageHeader
          title="Matières"
          subtitle="Liste des matières par filière"
        />
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:justify-end">
          <button
            type="button"
            onClick={() => handleOpenFiliereModal()}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-blue-500 hover:to-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200"
          >
            <Cog6ToothIcon className="h-5 w-5 mr-2" />
            Gérer les filières
          </button>
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-gradient-to-r from-primary-600 to-primary-700 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-primary-500 hover:to-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Ajouter une matière
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une matière..."
            className={`block w-full rounded-lg border pl-10 pr-3 py-2 text-sm ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500'
            }`}
          />
        </div>
        <div className="sm:w-48">
          <select
            value={selectedFiliere}
            onChange={(e) => setSelectedFiliere(e.target.value as Filiere | '')}
            className={`block w-full rounded-lg border py-2 pl-3 pr-10 text-sm ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white focus:border-primary-500 focus:ring-primary-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-primary-500 focus:ring-primary-500'
            }`}
          >
            <option value="">Toutes les filières</option>
            {FILIERES.map((filiere) => (
              <option key={filiere} value={filiere}>
                {getFiliereFullName(filiere)}
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
                          onClick={() => handleOpenModal(matiere as Matiere)}
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <Dialog.Panel className={`w-full max-w-2xl transform overflow-hidden rounded-xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } p-6 shadow-xl transition-all`}>
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {selectedMatiere ? 'Modifier la matière' : 'Ajouter une matière'}
              </Dialog.Title>
              <button
                onClick={() => setIsOpen(false)}
                className={`rounded-full p-2 transition-colors duration-200 ${
                  isDark 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                }`}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-6 max-h-[calc(100vh-20rem)] overflow-y-auto px-1">
              {renderTabContent()}
            </div>

            {formErrors.length > 0 && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400 dark:text-red-300 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Veuillez corriger les erreurs suivantes :
                    </h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                      <ul className="list-disc space-y-1 pl-5">
                        {formErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                  isDark 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement en cours...
                  </>
                ) : selectedMatiere ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
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

      <Dialog 
        open={isDeleteModalOpen} 
        onClose={handleCancelDelete}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className={`mx-auto max-w-sm rounded-xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } p-6 shadow-lg w-full`}>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <Dialog.Title className={`text-lg font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Confirmer la suppression
              </Dialog.Title>
            </div>

            <div className="mt-4">
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                Êtes-vous sûr de vouloir supprimer cette matière ? Cette action est irréversible.
              </p>
              {matiereToDelete && (
                <div className="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {matiereToDelete.nom}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Code: {matiereToDelete.code}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Filière: {matiereToDelete.filiere}
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
                className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
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
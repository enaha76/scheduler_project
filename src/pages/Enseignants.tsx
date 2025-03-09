import { useState } from 'react';
import { useForm } from 'react-hook-form';
import DataTable from '../components/DataTable';
import { Enseignant, Disponibilite } from '../types';
import { useStore } from '../store';
import { Dialog } from '@headlessui/react';
import { 
  PlusIcon, 
  CalendarIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  AcademicCapIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import { useThemeStore } from '../store/themeStore';
import { EnhancedTable } from '../components/EnhancedTable';
import type { Column } from '../components/EnhancedTable';

const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const creneaux = ['8h-10h', '10h-12h', '14h-16h', '16h-18h', '18h-20h'];

// Define the type for the availability data structure
type WeekAvailability = {
  [key: number]: boolean[];
};

type AvailabilityData = {
  [key: number]: WeekAvailability;
};

// Sample data for availabilities with proper typing
const SAMPLE_AVAILABILITIES: AvailabilityData = {
  1: { // Week 1
    0: [true, false, true, true, false], // Monday
    1: [true, true, false, true, true],  // Tuesday
    2: [false, true, true, false, true], // Wednesday
    3: [true, false, true, true, false], // Thursday
    4: [false, true, false, true, true], // Friday
    5: [true, true, true, false, false]  // Saturday
  },
  2: { // Week 2
    0: [false, true, true, false, true],
    1: [true, false, true, true, false],
    2: [true, true, false, true, true],
    3: [false, true, true, false, true],
    4: [true, false, true, true, false],
    5: [false, true, false, true, true]
  }
};

// Add these constants
const TIME_SLOTS = [
  { start: '08:00', end: '10:00' },
  { start: '10:00', end: '12:00' },
  { start: '14:00', end: '16:00' },
  { start: '16:00', end: '18:00' },
  { start: '18:00', end: '20:00' }
];

// Add these interfaces
interface Course {
  id: number;
  name: string;
  type: 'CM' | 'TD' | 'TP';
  hours: number;
  groupId: number;
  semester: number;
  specialization: string;
  color: string;
  description?: string;
  totalSessions: number;
  completedSessions: number;
}

interface ScheduleEntry {
  id: number;
  courseId: number;
  courseName: string;
  type: 'CM' | 'TD' | 'TP';
  groupId: number;
  groupName: string;
  roomId: number;
  roomName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  weekNumber: number;
  color: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

// Add these constants
const COURSE_TYPES = {
  CM: { 
    label: 'Cours Magistral', 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25'
  },
  TD: { 
    label: 'Travaux Dirigés', 
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
    icon: 'M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75'
  },
  TP: { 
    label: 'Travaux Pratiques', 
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
    icon: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5'
  }
};

const SEMESTERS = [1, 2, 3, 4, 5, 6];
const SPECIALIZATIONS = ['Informatique', 'Réseaux', 'Cybersécurité', 'Intelligence Artificielle'];
const GROUPS = [
  { id: 1, name: 'G1', semester: 1, specialization: 'Informatique' },
  { id: 2, name: 'G2', semester: 1, specialization: 'Informatique' },
  { id: 3, name: 'G1', semester: 2, specialization: 'Réseaux' },
  { id: 4, name: 'G2', semester: 2, specialization: 'Réseaux' },
  { id: 5, name: 'G1', semester: 3, specialization: 'Cybersécurité' },
  { id: 6, name: 'G2', semester: 3, specialization: 'Intelligence Artificielle' }
];
const ROOMS = ['Amphi A', 'Amphi B', 'Salle 101', 'Salle 102', 'Lab Info 1', 'Lab Info 2'];

export default function Enseignants() {
  const { enseignants, addEnseignant, updateEnseignant, deleteEnseignant } = useStore();
  const { isDark } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isDispoOpen, setIsDispoOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Enseignant | null>(null);
  const [editingEnseignant, setEditingEnseignant] = useState<Enseignant | null>(null);
  const [selectedEnseignant, setSelectedEnseignant] = useState<Enseignant | null>(null);
  const [selectedSemaine, setSelectedSemaine] = useState(1);
  const [disponibilites, setDisponibilites] = useState<Disponibilite[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'assignments' | 'schedule' | 'availability'>('info');
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [courses, setCourses] = useState<Course[]>([
    { 
      id: 1, 
      name: 'Mathématiques', 
      type: 'CM', 
      hours: 24, 
      groupId: 1,
      semester: 1,
      specialization: 'Informatique',
      color: COURSE_TYPES.CM.color,
      totalSessions: 12,
      completedSessions: 4
    },
    { 
      id: 2, 
      name: 'Algorithmique', 
      type: 'TD', 
      hours: 16, 
      groupId: 2,
      semester: 2,
      specialization: 'Informatique',
      color: COURSE_TYPES.TD.color,
      totalSessions: 8,
      completedSessions: 3
    },
    { 
      id: 3, 
      name: 'Programmation', 
      type: 'TP', 
      hours: 20, 
      groupId: 3,
      semester: 3,
      specialization: 'Réseaux',
      color: COURSE_TYPES.TP.color,
      totalSessions: 10,
      completedSessions: 2
    },
  ]);
  
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([
    {
      id: 1,
      courseId: 1,
      courseName: 'Mathématiques',
      type: 'CM',
      groupId: 1,
      groupName: 'L1 Info',
      roomId: 1,
      roomName: 'Amphi A',
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '10:00',
      weekNumber: 1,
      color: COURSE_TYPES.CM.color,
      status: 'scheduled'
    },
    // Add more sample schedule entries as needed
  ]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Enseignant>();

  const columns: Column<Enseignant>[] = [
    { 
      header: 'NOM',
      accessor: 'nom',
      sortable: true,
    },
    { 
      header: 'EMAIL',
      accessor: 'email',
      sortable: true,
    },
    { 
      header: 'SPÉCIALITÉ',
      accessor: 'specialite',
      sortable: true,
    },
    {
      header: 'ACTIONS',
      accessor: 'id',
      render: (enseignant: Enseignant) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDisponibilites(enseignant)}
            className={`p-2 rounded-lg ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
            title="Voir les disponibilités"
          >
            <CalendarIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleEdit(enseignant)}
            className={`p-2 rounded-lg ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}
            title="Modifier"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDeleteClick(enseignant)}
            className={`p-2 rounded-lg ${isDark ? 'text-red-400' : 'text-red-600'}`}
            title="Supprimer"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  // Filter enseignants based on search term
  const filteredEnseignants = enseignants.filter(enseignant => 
    enseignant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enseignant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enseignant.specialite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredEnseignants.length / itemsPerPage);

  // Get current page data
  const currentTableData = filteredEnseignants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const onSubmit = async (data: Enseignant) => {
    setIsSubmitting(true);
    try {
      if (editingEnseignant) {
        await updateEnseignant(editingEnseignant.id, {
          ...data,
          weeklyProfessorAvailability: disponibilites.map(d => ({
            id: d.id,
            professorId: editingEnseignant.id,
            dayOfWeek: d.dayOfWeek,
            startTime: d.startTime,
            endTime: d.endTime
          }))
        });
        toast.success('Enseignant modifié avec succès');
      } else {
        const newId = enseignants.length + 1;
        await addEnseignant({
          ...data,
          id: newId,
          weeklyProfessorAvailability: disponibilites.map((d, index) => ({
            id: index + 1, // Generate temporary IDs for new availabilities
            professorId: newId,
            dayOfWeek: d.dayOfWeek,
            startTime: d.startTime,
            endTime: d.endTime
          }))
        });
        toast.success('Enseignant ajouté avec succès');
      }
      setIsOpen(false);
      reset();
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (enseignant: Enseignant) => {
    setEditingEnseignant(enseignant);
    setValue('nom', enseignant.nom);
    setValue('email', enseignant.email);
    setValue('specialite', enseignant.specialite);
    setDisponibilites(enseignant.weeklyProfessorAvailability?.map(d => ({
      id: d.id,
      enseignantId: d.professorId,
      dayOfWeek: d.dayOfWeek,
      startTime: d.startTime,
      endTime: d.endTime,
      createdAt: new Date(),
      updatedAt: new Date()
    })) || []);
    setIsOpen(true);
  };

  const handleDeleteClick = (enseignant: Enseignant) => {
    setTeacherToDelete(enseignant);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (teacherToDelete) {
      try {
        await deleteEnseignant(teacherToDelete.id);
        toast.success('Enseignant supprimé avec succès');
        setIsDeleteModalOpen(false);
        setTeacherToDelete(null);
      } catch (error) {
        toast.error('Une erreur est survenue');
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setTeacherToDelete(null);
  };

  const handleDisponibilites = (enseignant: Enseignant) => {
    setSelectedEnseignant(enseignant);
    setIsDispoOpen(true);
  };

  const [availabilityData, setAvailabilityData] = useState<AvailabilityData>(SAMPLE_AVAILABILITIES);

  const toggleDisponibilite = (jour: number, creneau: number) => {
    setAvailabilityData(prev => {
      // Create a deep copy of the previous state
      const newData = JSON.parse(JSON.stringify(prev));
      
      // Initialize the week if it doesn't exist
      if (!newData[selectedSemaine]) {
        newData[selectedSemaine] = {};
      }
      
      // Initialize the day if it doesn't exist
      if (!newData[selectedSemaine][jour]) {
        newData[selectedSemaine][jour] = Array(5).fill(false);
      }
      
      // Toggle the value
      newData[selectedSemaine][jour][creneau] = !newData[selectedSemaine][jour][creneau];
      
      return newData;
    });
  };

  const getDisponibilite = (jour: number, creneau: number) => {
    return availabilityData[selectedSemaine]?.[jour]?.[creneau] ?? false;
  };

  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    type: 'CM' as 'CM' | 'TD' | 'TP',
    hours: 0,
    groupId: 0,
    semester: 1,
    specialization: ''
  });

  const handleAddCourse = () => {
    setIsAddCourseModalOpen(true);
  };

  const handleSaveCourse = () => {
    if (!newCourse.name || !newCourse.groupId || newCourse.hours <= 0) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const courseId = courses.length + 1;
    const color = COURSE_TYPES[newCourse.type].color;
    const selectedGroup = GROUPS.find(g => g.id === newCourse.groupId);
    
    const newCourseEntry: Course = {
      id: courseId,
      name: newCourse.name,
      type: newCourse.type,
      hours: newCourse.hours,
      groupId: newCourse.groupId,
      semester: selectedGroup?.semester || 1,
      specialization: selectedGroup?.specialization || '',
      color,
      totalSessions: Math.ceil(newCourse.hours / 2),
      completedSessions: 0
    };
    
    setCourses([...courses, newCourseEntry]);
    
    setIsAddCourseModalOpen(false);
    setNewCourse({
      name: '',
      type: 'CM',
      hours: 0,
      groupId: 0,
      semester: 1,
      specialization: ''
    });
    toast.success('Cours ajouté avec succès');
  };

  const handleDeleteCourse = (courseId: number) => {
    setCourses(courses.filter(course => course.id !== courseId));
  };

  const handleAddScheduleEntry = (e: React.MouseEvent, course?: Course) => {
    e.stopPropagation();
    setIsAddCourseModalOpen(true);
    if (course) {
      setNewCourse({
        name: course.name,
        type: course.type,
        hours: course.hours,
        groupId: course.groupId,
        semester: course.semester,
        specialization: course.specialization
      });
    }
  };

  const handleDeleteScheduleEntry = (entryId: number) => {
    setSchedule(schedule.filter(entry => entry.id !== entryId));
  };

  const handleAddAvailability = () => {
    setDisponibilites([...disponibilites, {
      id: disponibilites.length + 1,
      enseignantId: editingEnseignant?.id || 0,
      dayOfWeek: 0,
      startTime: '08:00',
      endTime: '10:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  };

  const renderAssignedCourses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Cours assignés
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Gérez les cours et suivez leur progression
          </p>
        </div>
            <button
              type="button"
          onClick={handleAddCourse}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nouveau cours
        </button>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {SEMESTERS.map(sem => (
          <button
            key={sem}
            onClick={() => setSelectedSemester(sem)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              selectedSemester === sem
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Semestre {sem}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses
          .filter(course => course.semester === selectedSemester)
          .map((course) => (
            <div
              key={course.id}
              className={`relative rounded-xl border p-5 ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } hover:shadow-lg transition-all duration-300 group`}
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddScheduleEntry(e, course);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    title="Ajouter à l'emploi du temps"
                  >
                    <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteCourse(course.id);
                    }}
                    className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200"
                    title="Supprimer"
                  >
                    <TrashIcon className="h-5 w-5 text-red-500 dark:text-red-400" />
            </button>
          </div>
        </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${COURSE_TYPES[course.type].color} ${COURSE_TYPES[course.type].border}`}>
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={COURSE_TYPES[course.type].icon} />
                    </svg>
                    {COURSE_TYPES[course.type].label}
                  </span>
                  <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {course.name}
                  </h4>
            </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <AcademicCapIcon className={`h-5 w-5 mr-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      Groupe {GROUPS.find(g => g.id === course.groupId)?.name} • {' '}
                      {GROUPS.find(g => g.id === course.groupId)?.specialization} • {' '}
                      Semestre {course.semester}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <ClockIcon className={`h-5 w-5 mr-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {course.hours}h au total
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Add Course Modal */}
      <Dialog 
        open={isAddCourseModalOpen} 
        onClose={() => setIsAddCourseModalOpen(false)}
        className="relative z-[80]"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className={`mx-auto max-w-md rounded-lg ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } p-6 shadow-xl w-full`}>
            <Dialog.Title className={`text-lg font-medium mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Ajouter un nouveau cours
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nom du cours
                </label>
            <input
              type="text"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
            />
          </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Type
                </label>
                <select
                  value={newCourse.type}
                  onChange={(e) => setNewCourse({ ...newCourse, type: e.target.value as 'CM' | 'TD' | 'TP' })}
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                >
                  <option value="CM">Cours Magistral</option>
                  <option value="TD">Travaux Dirigés</option>
                  <option value="TP">Travaux Pratiques</option>
                </select>
        </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Heures totales
                </label>
                <input
                  type="number"
                  value={newCourse.hours}
                  onChange={(e) => setNewCourse({ ...newCourse, hours: Number(e.target.value) })}
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
            />
          </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Groupe
                </label>
                <select
                  value={newCourse.groupId}
                  onChange={(e) => {
                    const selectedGroup = GROUPS.find(g => g.id === Number(e.target.value));
                    setNewCourse({ 
                      ...newCourse, 
                      groupId: Number(e.target.value),
                      semester: selectedGroup?.semester || 1,
                      specialization: selectedGroup?.specialization || ''
                    });
                  }}
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                >
                  <option value="0">Sélectionner un groupe</option>
                  {GROUPS.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name} - Semestre {group.semester} - {group.specialization}
                    </option>
                  ))}
                </select>
        </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Semestre
                </label>
                <select
                  value={newCourse.semester}
                  onChange={(e) => setNewCourse({ ...newCourse, semester: Number(e.target.value) })}
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                >
                  {SEMESTERS.map((sem) => (
                    <option key={sem} value={sem}>Semestre {sem}</option>
                  ))}
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-3">
              <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Annuler
              </button>
              <button
                  type="button"
                  onClick={handleSaveCourse}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    isDark 
                      ? 'bg-blue-600 text-white hover:bg-blue-500' 
                      : 'bg-supnum-blue text-white hover:bg-primary-700'
                  }`}
                >
                  Ajouter
              </button>
            </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingScheduleEntry, setEditingScheduleEntry] = useState<ScheduleEntry | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  } | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>('');

  const handleScheduleClick = (dayIndex: number, timeSlot: { start: string; end: string }, entry?: ScheduleEntry) => {
    if (entry) {
      setEditingScheduleEntry(entry);
      setSelectedCourse(courses.find(c => c.id === entry.courseId) || null);
      setSelectedRoom(entry.roomName);
    } else {
      setEditingScheduleEntry(null);
      setSelectedCourse(null);
      setSelectedRoom('');
      setSelectedTimeSlot({
        dayOfWeek: dayIndex,
        startTime: timeSlot.start,
        endTime: timeSlot.end
      });
    }
    setIsScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsScheduleModalOpen(false);
    setEditingScheduleEntry(null);
    setSelectedTimeSlot(null);
    setSelectedCourse(null);
    setSelectedRoom('');
  };

  const handleSaveScheduleEntry = () => {
    if (!selectedCourse || !selectedRoom) {
      toast.error('Veuillez sélectionner un cours et une salle');
      return;
    }

    const newEntry: ScheduleEntry = {
      id: editingScheduleEntry?.id || schedule.length + 1,
      courseId: selectedCourse.id,
      courseName: selectedCourse.name,
      type: selectedCourse.type,
      groupId: selectedCourse.groupId,
      groupName: GROUPS.find(g => g.id === selectedCourse.groupId)?.name || '',
      roomId: ROOMS.findIndex(r => r === selectedRoom) + 1,
      roomName: selectedRoom,
      dayOfWeek: selectedTimeSlot?.dayOfWeek || editingScheduleEntry?.dayOfWeek || 0,
      startTime: selectedTimeSlot?.startTime || editingScheduleEntry?.startTime || '',
      endTime: selectedTimeSlot?.endTime || editingScheduleEntry?.endTime || '',
      weekNumber: selectedWeek,
      color: COURSE_TYPES[selectedCourse.type].color,
      status: 'scheduled'
    };

    if (editingScheduleEntry) {
      setSchedule(schedule.map(entry => 
        entry.id === editingScheduleEntry.id ? newEntry : entry
      ));
      toast.success('Séance modifiée avec succès');
    } else {
      setSchedule([...schedule, newEntry]);
      toast.success('Séance ajoutée avec succès');
    }

    handleCloseScheduleModal();
  };

  const renderSchedule = () => {
    const timeSlots = [
      { start: '08:00', end: '10:00' },
      { start: '10:00', end: '12:00' },
      { start: '14:00', end: '16:00' },
      { start: '16:00', end: '18:00' }
    ];

    const getScheduleForSlot = (day: number, start: string, end: string) => {
      return schedule.find(s => 
        s.dayOfWeek === day && 
        s.startTime === start && 
        s.endTime === end &&
        s.weekNumber === selectedWeek
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Emploi du temps
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Semaine {selectedWeek} • {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </p>
              </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1">
                  <button
                onClick={() => setSelectedWeek(Math.max(1, selectedWeek - 1))}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                <ChevronLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                className="mx-2 text-sm bg-transparent border-0 focus:ring-0 text-gray-700 dark:text-gray-300"
              >
                {Array.from({ length: 52 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>Semaine {i + 1}</option>
                ))}
              </select>
                  <button
                onClick={() => setSelectedWeek(Math.min(52, selectedWeek + 1))}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                <ChevronRightIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
              </div>
            </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-4 bg-gray-50 dark:bg-gray-900 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">
                    Horaire
                  </th>
                  {jours.map((jour) => (
                    <th
                      key={jour}
                      className="px-6 py-4 bg-gray-50 dark:bg-gray-900 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {jour}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {timeSlots.map((timeSlot) => (
                  <tr key={`${timeSlot.start}-${timeSlot.end}`} className="group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                      {timeSlot.start} - {timeSlot.end}
                    </td>
                    {Array.from({ length: 6 }).map((_, dayIndex) => {
                      const entry = getScheduleForSlot(dayIndex, timeSlot.start, timeSlot.end);
                      return (
                        <td 
                          key={dayIndex} 
                          className="px-6 py-4 relative group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                          onClick={() => handleScheduleClick(dayIndex, timeSlot, entry)}
                        >
                          {entry ? (
                            <div className={`rounded-lg p-4 ${COURSE_TYPES[entry.type].color} ${COURSE_TYPES[entry.type].border} border relative group-hover:shadow-md transition-all duration-200`}>
                              <div className="font-medium">{entry.courseName}</div>
                              <div className="mt-2 space-y-1.5">
                                <div className="flex items-center text-sm">
                                  <AcademicCapIcon className="h-4 w-4 mr-1.5" />
                                  {entry.groupName}
                                </div>
                                <div className="flex items-center text-sm">
                                  <BuildingLibraryIcon className="h-4 w-4 mr-1.5" />
                                  {entry.roomName}
                                </div>
                              </div>
                              {entry.status === 'completed' && (
                                <div className="absolute bottom-2 right-2">
                                  <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        )}
                            </div>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                              <PlusIcon className="h-5 w-5 text-gray-400" />
                            </div>
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
    );
  };

  const renderForm = () => (
    <div className="space-y-4">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`${
              activeTab === 'info'
                ? 'border-primary-500 text-primary-600 dark:text-primary-500'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Informations
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('assignments')}
            className={`${
              activeTab === 'assignments'
                ? 'border-primary-500 text-primary-600 dark:text-primary-500'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Cours assignés
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`${
              activeTab === 'schedule'
                ? 'border-primary-500 text-primary-600 dark:text-primary-500'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Emploi du temps
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('availability')}
            className={`${
              activeTab === 'availability'
                ? 'border-primary-500 text-primary-600 dark:text-primary-500'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Disponibilités
          </button>
        </nav>
      </div>

      {activeTab === 'info' && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
                <div>
              <label className={`block text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Nom complet
                  </label>
                  <input
                    {...register('nom', { required: 'Le nom est requis' })}
                type="text"
                className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600 focus:border-blue-600' 
                    : 'border-gray-300 focus:ring-supnum-blue focus:border-supnum-blue'
                }`}
                  />
                  {errors.nom && (
                <p className="mt-1 text-sm text-red-500">{errors.nom.message}</p>
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
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600 focus:border-blue-600' 
                    : 'border-gray-300 focus:ring-supnum-blue focus:border-supnum-blue'
                }`}
                  />
                  {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
              <label className={`block text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                    Spécialité
                  </label>
                  <input
                    {...register('specialite', { required: 'La spécialité est requise' })}
                type="text"
                className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600 focus:border-blue-600' 
                    : 'border-gray-300 focus:ring-supnum-blue focus:border-supnum-blue'
                }`}
                  />
                  {errors.specialite && (
                <p className="mt-1 text-sm text-red-500">{errors.specialite.message}</p>
                  )}
                </div>
          </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      reset();
                    }}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                isDark 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors duration-200`}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                isDark 
                  ? 'bg-blue-600 hover:bg-blue-500' 
                  : 'bg-supnum-blue hover:bg-primary-700'
              } text-white transition-colors duration-200 disabled:opacity-50`}
            >
              {isSubmitting ? 'Enregistrement...' : editingEnseignant ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
      )}

      {activeTab === 'assignments' && (
        <div onClick={(e) => e.preventDefault()}>
          {renderAssignedCourses()}
          </div>
      )}

      {activeTab === 'schedule' && (
        <div onClick={(e) => e.preventDefault()}>
          {renderSchedule()}
                </div>
      )}

      {activeTab === 'availability' && (
        <div onClick={(e) => e.preventDefault()} className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Disponibilités
            </h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Disponible
                </span>
              </div>
              <div className="flex items-center gap-2">
                <XCircleIcon className="h-5 w-5 text-red-500" />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Indisponible
                </span>
              </div>
            </div>
          </div>
          <div className={`rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jour
                      </th>
                      {creneaux.map((creneau, index) => (
                        <th
                          key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {creneau}
                        </th>
                      ))}
                    </tr>
                  </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {jours.map((jour, jourIndex) => (
                  <tr key={jour} className={isDark ? 'bg-gray-900' : 'bg-white'}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      isDark ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                          {jour}
                        </td>
                        {creneaux.map((_, creneauIndex) => (
                      <td key={creneauIndex} className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          type="button"
                          onClick={() => toggleDisponibilite(jourIndex, creneauIndex)}
                          className="transition-all duration-200 hover:scale-110 focus:outline-none"
                          title={getDisponibilite(jourIndex, creneauIndex) ? 'Marquer comme indisponible' : 'Marquer comme disponible'}
                          >
                            {getDisponibilite(jourIndex, creneauIndex) ? (
                            <CheckCircleIcon className="h-6 w-6 text-green-500 hover:text-green-600" />
                            ) : (
                            <XCircleIcon className="h-6 w-6 text-red-500 hover:text-red-600" />
                            )}
                        </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
        </div>
      )}
    </div>
  );

  const ScheduleModal = () => (
    <Dialog 
      open={isScheduleModalOpen} 
      onClose={() => handleCloseScheduleModal()}
      className="relative z-[70]"
    >
      <div 
        className="fixed inset-0 bg-black/30" 
        aria-hidden="true" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }} 
      />
      <div 
        className="fixed inset-0 flex items-center justify-center p-4" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Dialog.Panel 
          className={`mx-auto max-w-2xl rounded-lg ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } p-6 shadow-xl w-full`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="space-y-4">
            <Dialog.Title className={`text-lg font-medium mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {editingScheduleEntry ? 'Modifier la séance' : 'Ajouter une séance'}
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Cours
                </label>
                <select
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  value={selectedCourse?.id || ''}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const course = courses.find(c => c.id === Number(e.target.value));
                    setSelectedCourse(course || null);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <option value="">Sélectionner un cours</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name} - {COURSE_TYPES[course.type].label} - Groupe {GROUPS.find(g => g.id === course.groupId)?.name} ({GROUPS.find(g => g.id === course.groupId)?.specialization})
                    </option>
                  ))}
                </select>
                  </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Salle
                </label>
                <select
                  className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  value={selectedRoom}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedRoom(e.target.value);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <option value="">Sélectionner une salle</option>
                  {ROOMS.map((room) => (
                    <option key={room} value={room}>{room}</option>
                  ))}
                </select>
                  </div>

              {selectedTimeSlot && (
                <div className={`mt-4 p-3 rounded-lg ${
                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {jours[selectedTimeSlot.dayOfWeek]} • {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
                  </p>
                </div>
              )}
                
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCloseScheduleModal();
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSaveScheduleEntry();
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    isDark 
                      ? 'bg-blue-600 text-white hover:bg-blue-500' 
                    : 'bg-supnum-blue text-white hover:bg-primary-700'
                  }`}
                >
                  {editingScheduleEntry ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between mb-8">
          <PageHeader
            title="Enseignants"
            subtitle="Liste des enseignants de SupNum"
          />
          <button
            type="button"
            onClick={() => {
              setEditingEnseignant(null);
              setIsOpen(true);
            }}
            className={`w-full sm:w-auto inline-flex items-center justify-center rounded-md ${
              isDark 
                ? 'bg-blue-600 hover:bg-blue-500' 
                : 'bg-supnum-blue hover:bg-primary-700'
            } px-4 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDark ? 'focus:ring-blue-600' : 'focus:ring-supnum-blue'
            } transition-colors duration-200`}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Ajouter un enseignant
          </button>
        </div>

        <div className="mb-8">
          <div className="w-full sm:max-w-md">
            <label htmlFor="search" className="sr-only">
              Rechercher
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FunnelIcon className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className={`block w-full rounded-md border-0 py-2.5 pl-10 pr-3 ${
                  isDark 
                    ? 'bg-gray-800 text-white placeholder-gray-400 ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-blue-600' 
                    : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-supnum-blue'
                } text-sm leading-6`}
                placeholder="Rechercher un enseignant..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <EnhancedTable
            data={currentTableData}
            columns={columns}
          />

          {/* Pagination Controls */}
          {filteredEnseignants.length > itemsPerPage && (
            <div className={`flex items-center justify-between px-4 py-3 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow`}>
              <div className="flex items-center">
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Page {currentPage} sur {totalPages}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    isDark 
                      ? `${currentPage === 1 ? 'bg-gray-800 text-gray-600' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`
                      : `${currentPage === 1 ? 'bg-gray-50 text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                  } transition-colors duration-200`}
                >
                  <div className="flex items-center">
                    <ChevronLeftIcon className="h-4 w-4 mr-1" />
                    Précédent
                  </div>
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    // Show first page, last page, current page, and pages around current page
                    const shouldShow = pageNum === 1 || 
                                    pageNum === totalPages || 
                                    Math.abs(pageNum - currentPage) <= 1;
                    
                    if (!shouldShow && pageNum === currentPage - 2) {
                      return <span key="ellipsis-start" className={`px-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>...</span>;
                    }
                    
                    if (!shouldShow && pageNum === currentPage + 2) {
                      return <span key="ellipsis-end" className={`px-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>...</span>;
                    }
                    
                    if (!shouldShow) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                          currentPage === pageNum
                            ? isDark 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-supnum-blue text-white'
                            : isDark 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    isDark 
                      ? `${currentPage === totalPages ? 'bg-gray-800 text-gray-600' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`
                      : `${currentPage === totalPages ? 'bg-gray-50 text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                  } transition-colors duration-200`}
                >
                  <div className="flex items-center">
                    Suivant
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <Dialog 
          open={isDeleteModalOpen} 
          onClose={() => handleCancelDelete()} 
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className={`mx-auto max-w-sm rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } p-6 shadow-xl`}>
              <Dialog.Title className={`text-lg font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Confirmer la suppression
              </Dialog.Title>
              <div className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                <p>Êtes-vous sûr de vouloir supprimer cet enseignant ?</p>
                {teacherToDelete && (
                  <div className={`mt-2 p-3 rounded-lg ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <p className={`text-sm font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {teacherToDelete.nom}
                    </p>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {teacherToDelete.email}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleCancelDelete()}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors duration-200`}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-500 transition-colors duration-200"
                >
                  Supprimer
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Add/Edit Modal */}
        <Dialog 
          open={isOpen} 
          onClose={() => {
            if (!isScheduleModalOpen) {
              setIsOpen(false);
            }
          }} 
          className="relative z-[60]"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" onClick={(e) => e.stopPropagation()} />
          <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <Dialog.Panel 
              className={`mx-auto max-w-5xl rounded-lg ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } p-6 shadow-xl w-full my-8`}
              onClick={(e) => e.stopPropagation()}
            >
              <Dialog.Title className={`text-lg font-medium mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {editingEnseignant ? 'Modifier l\'enseignant' : 'Ajouter un enseignant'}
              </Dialog.Title>

              {renderForm()}
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Modal Disponibilités */}
        <Dialog 
          open={isDispoOpen} 
          onClose={() => setIsDispoOpen(false)} 
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className={`mx-auto max-w-4xl rounded-xl ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } p-6 shadow-xl w-full`}>
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className={`text-xl font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Disponibilités de {selectedEnseignant?.nom}
                </Dialog.Title>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSemaine(Math.max(1, selectedSemaine - 1))}
                    className={`p-1 rounded-full ${
                      isDark 
                        ? 'hover:bg-gray-700 text-gray-400' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    Semaine {selectedSemaine}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedSemaine(selectedSemaine + 1)}
                    className={`p-1 rounded-full ${
                      isDark 
                        ? 'hover:bg-gray-700 text-gray-400' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className={`rounded-lg overflow-hidden ${
                isDark ? 'bg-gray-900' : 'bg-white'
              }`}>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                        JOUR
                      </th>
                      {creneaux.map((creneau, index) => (
                        <th
                          key={index}
                          className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                        >
                          {creneau}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${
                    isDark ? 'divide-gray-700' : 'divide-gray-200'
                  }`}>
                    {jours.map((jour, jourIndex) => (
                      <tr key={jour} className={
                        isDark ? 'bg-gray-900' : 'bg-white'
                      }>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          isDark ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {jour}
                        </td>
                        {creneaux.map((_, creneauIndex) => (
                          <td key={creneauIndex} className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              type="button"
                              onClick={() => toggleDisponibilite(jourIndex, creneauIndex)}
                              className="transition-all duration-200 hover:scale-110 focus:outline-none"
                              title={getDisponibilite(jourIndex, creneauIndex) ? 'Marquer comme indisponible' : 'Marquer comme disponible'}
                            >
                              {getDisponibilite(jourIndex, creneauIndex) ? (
                                <CheckCircleIcon className="h-6 w-6 text-green-500 hover:text-green-600" />
                              ) : (
                                <XCircleIcon className="h-6 w-6 text-red-500 hover:text-red-600" />
                              )}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Disponible
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                    <span className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Indisponible
                    </span>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsDispoOpen(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors duration-200`}
                >
                  Fermer
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        <ScheduleModal />
      </div>
    </div>
  );
} 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  AcademicCapIcon,
  BuildingOfficeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../../store/authStore';

type CourseType = 'CM' | 'TD' | 'TP';

interface Course {
  name: string;
  type: CourseType;
  professor: string;
  room: string;
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  group: string;
  specialization: string;
  semester: number;
}

// Sample schedule data
const TIME_SLOTS = [
  '08:30 - 10:00',
  '10:15 - 11:45',
  '12:00 - 13:30',
  '13:45 - 15:15',
  '15:30 - 17:00'
];

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const SAMPLE_COURSES: Course[] = [
  {
    name: 'Algorithmes',
    type: 'CM',
    professor: 'Dr. Ahmed',
    room: 'Salle 101'
  },
  {
    name: 'Base de données',
    type: 'TD',
    professor: 'Dr. Sarah',
    room: 'Salle 205'
  },
  {
    name: 'Programmation Web',
    type: 'TP',
    professor: 'Dr. Mohamed',
    room: 'Lab 305'
  }
];

const SAMPLE_STUDENT: Student = {
  id: 1,
  firstName: 'Mohammed',
  lastName: 'Ahmed',
  group: 'Groupe A',
  specialization: 'Génie Logiciel',
  semester: 2
};

// Add color mapping for course types
const COURSE_TYPE_STYLES: Record<CourseType, {
  light: string;
  dark: string;
  icon: string;
}> = {
  CM: {
    light: 'bg-blue-50 text-blue-900',
    dark: 'bg-blue-900/30 text-blue-100',
    icon: 'text-blue-500'
  },
  TD: {
    light: 'bg-green-50 text-green-900',
    dark: 'bg-green-900/30 text-green-100',
    icon: 'text-green-500'
  },
  TP: {
    light: 'bg-purple-50 text-purple-900',
    dark: 'bg-purple-900/30 text-purple-100',
    icon: 'text-purple-500'
  }
};

export default function Welcome() {
  const { isDark, toggleTheme } = useThemeStore();
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  // Add state for weekly schedule
  const [weeklySchedule] = useState(() => {
    // Generate schedule once when component mounts
    return TIME_SLOTS.map(() => 
      Array(6).fill(null).map(() => 
        Math.random() > 0.5 ? SAMPLE_COURSES[Math.floor(Math.random() * SAMPLE_COURSES.length)] : null
      )
    );
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatWeekRange = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1);
    const end = new Date(start);
    end.setDate(end.getDate() + 4);
    return `${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} - ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`;
  };

  const previousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  return (
    <div className={`min-h-screen ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`fixed top-0 right-0 left-0 z-10 ${
        isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
      } backdrop-blur-sm border-b`}>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <img
              src="/supnum.png"
              alt="SupNum"
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDark
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {isDark ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
            <div className={`w-px h-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                isDark
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="text-sm font-medium hidden sm:block">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      <div className="pt-16 px-2 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl mx-auto">
        {/* Welcome Card */}
        <div className={`${
          isDark ? 'bg-gray-800' : 'bg-white'
        } rounded-xl sm:rounded-2xl shadow-lg overflow-hidden mb-4 sm:mb-8`}>
          <div className={`px-4 sm:px-6 py-6 sm:py-8 ${
            isDark ? 'bg-gradient-to-r from-blue-900/20 to-teal-900/20' : 'bg-gradient-to-r from-blue-50 to-teal-50'
          }`}>
            <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Bienvenue, {SAMPLE_STUDENT.firstName} 👋
            </h1>
            <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-4">
              <div className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl ${
                isDark ? 'bg-gray-700' : 'bg-white'
              } shadow-sm`}>
                <CalendarDaysIcon className={`h-4 sm:h-5 w-4 sm:w-5 mr-1.5 sm:mr-2 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {SAMPLE_STUDENT.group}
                </span>
              </div>
              <div className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl ${
                isDark ? 'bg-gray-700' : 'bg-white'
              } shadow-sm`}>
                <ClockIcon className={`h-4 sm:h-5 w-4 sm:w-5 mr-1.5 sm:mr-2 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Semestre {SAMPLE_STUDENT.semester}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule View */}
        <div className={`${
          isDark ? 'bg-gray-800' : 'bg-white'
        } rounded-xl sm:rounded-2xl shadow-lg overflow-hidden`}>
          <div className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 mb-4 sm:mb-6">
              <h2 className={`text-lg sm:text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Emploi du temps
              </h2>
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={previousWeek}
                  className={`p-1.5 sm:p-2 rounded-lg ${
                    isDark 
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <span className={`text-xs sm:text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {formatWeekRange(currentWeek)}
                </span>
                <button
                  onClick={nextWeek}
                  className={`p-1.5 sm:p-2 rounded-lg ${
                    isDark 
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <div className="min-w-[900px] px-3 sm:px-0">
                {/* Schedule Header */}
                <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-2 sm:mb-4">
                  <div className={`text-xs sm:text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Horaire
                  </div>
                  {DAYS.map((day) => (
                    <div key={day} className={`text-xs sm:text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {day}
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                {TIME_SLOTS.map((timeSlot, timeIndex) => (
                  <div key={timeSlot} className="grid grid-cols-7 gap-2 sm:gap-4 mb-2 sm:mb-4">
                    <div className={`text-xs sm:text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {timeSlot}
                    </div>
                    {weeklySchedule[timeIndex].map((course, dayIndex) => (
                      course ? (
                        <div
                          key={dayIndex}
                          className={`p-2 sm:p-3 rounded-lg sm:rounded-xl text-xs sm:text-sm ${
                            isDark 
                              ? COURSE_TYPE_STYLES[course.type].dark
                              : COURSE_TYPE_STYLES[course.type].light
                          } transition-colors duration-200`}
                        >
                          <div className="font-medium mb-1">
                            {course.name}
                            <span className={`ml-1 text-[10px] font-normal ${
                              COURSE_TYPE_STYLES[course.type].icon
                            }`}>
                              ({course.type})
                            </span>
                          </div>
                          <div className="space-y-0.5 sm:space-y-1">
                            <div className={`flex items-center text-[10px] sm:text-xs ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              <AcademicCapIcon className={`h-3 sm:h-4 w-3 sm:w-4 mr-1 ${
                                COURSE_TYPE_STYLES[course.type].icon
                              }`} />
                              {course.professor}
                            </div>
                            <div className={`flex items-center text-[10px] sm:text-xs ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              <BuildingOfficeIcon className={`h-3 sm:h-4 w-3 sm:w-4 mr-1 ${
                                COURSE_TYPE_STYLES[course.type].icon
                              }`} />
                              {course.room}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div key={dayIndex} />
                      )
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
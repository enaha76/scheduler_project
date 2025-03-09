import { useStore } from '../store';
import { useThemeStore } from '../store/themeStore';
import {
  AcademicCapIcon,
  BookOpenIcon,
  UserGroupIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { TypeCours } from '../types';
import PageHeader from '../components/PageHeader';

interface RecentPlanning {
  id: number;
  matiere: string;
  enseignant: string;
  groupe: string;
  type: TypeCours;
  status: 'Confirmé' | 'En attente';
}

export default function Dashboard() {
  const { isDark } = useThemeStore();

  // Example data with Mauritanian names
  const mockData = {
    matieres: [
      { id: 1, nom: 'Algèbre Linéaire', filiere: 'TC' },
      { id: 2, nom: 'Programmation Web', filiere: 'DWM' },
      { id: 3, nom: 'Base de données', filiere: 'DSI' },
      { id: 4, nom: 'Réseaux', filiere: 'RSS' },
      { id: 5, nom: 'Intelligence Artificielle', filiere: 'DSI' },
      { id: 6, nom: 'Cybersécurité', filiere: 'RSS' },
      { id: 7, nom: 'Analyse Numérique', filiere: 'TC' },
      { id: 8, nom: 'Développement Mobile', filiere: 'DWM' }
    ],
    enseignants: [
      { id: 1, nom: 'Dr. Sidi Mohamed Abdallahi' },
      { id: 2, nom: 'Prof. Mariem Mint Ahmed' },
      { id: 3, nom: 'Dr. Moussa Ould Ibrahim' },
      { id: 4, nom: 'Dr. Aïcha Mint Mohamed' },
      { id: 5, nom: 'Prof. Ahmed Ould Abdallah' }
    ],
    groupes: [
      { id: 1, nom: 'TC1-A' },
      { id: 2, nom: 'DWM2' },
      { id: 3, nom: 'DSI2' },
      { id: 4, nom: 'RSS2' },
      { id: 5, nom: 'TC1-B' }
    ]
  };

  const stats = [
    {
      name: 'Matières',
      value: mockData.matieres.length,
      description: 'Matières enregistrées',
      href: '/matieres',
      icon: BookOpenIcon,
      color: 'from-blue-600 to-blue-500'
    },
    {
      name: 'Enseignants',
      value: mockData.enseignants.length,
      description: 'Enseignants actifs',
      href: '/enseignants',
      icon: AcademicCapIcon,
      color: 'from-green-600 to-green-500'
    },
    {
      name: 'Groupes',
      value: mockData.groupes.length,
      description: 'Groupes d\'étudiants',
      href: '/groupes',
      icon: UserGroupIcon,
      color: 'from-purple-600 to-purple-500'
    },
    {
      name: 'Séances',
      value: 12, // Example number of sessions
      description: 'Séances planifiées',
      href: '/planning',
      icon: CalendarIcon,
      color: 'from-orange-600 to-orange-500'
    }
  ];

  // Example recent plannings with Mauritanian context
  const recentPlannings: RecentPlanning[] = [
    {
      id: 1,
      matiere: 'Algèbre Linéaire',
      enseignant: 'Dr. Sidi Mohamed Abdallahi',
      groupe: 'TC1-A',
      type: 'CM',
      status: 'Confirmé'
    },
    {
      id: 2,
      matiere: 'Programmation Web',
      enseignant: 'Prof. Mariem Mint Ahmed',
      groupe: 'DWM2',
      type: 'TD',
      status: 'Confirmé'
    },
    {
      id: 3,
      matiere: 'Base de données',
      enseignant: 'Dr. Moussa Ould Ibrahim',
      groupe: 'DSI2',
      type: 'TP',
      status: 'En attente'
    },
    {
      id: 4,
      matiere: 'Cybersécurité',
      enseignant: 'Dr. Aïcha Mint Mohamed',
      groupe: 'RSS2',
      type: 'CM',
      status: 'Confirmé'
    },
    {
      id: 5,
      matiere: 'Intelligence Artificielle',
      enseignant: 'Prof. Ahmed Ould Abdallah',
      groupe: 'DSI2',
      type: 'TD',
      status: 'En attente'
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'} py-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Tableau de Bord"
          subtitle="Bienvenue sur votre espace de gestion SupNum"
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Link key={stat.name} to={stat.href}>
              <div className={`relative overflow-hidden rounded-2xl ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  } mb-1`}>
                    {stat.value}
                  </h3>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{stat.name}</p>
                  <p className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  } mt-1`}>{stat.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Activités Récentes</h2>
              <Link 
                to="/planning"
                className="text-sm text-supnum-blue hover:text-supnum-teal transition-colors duration-200"
              >
                Voir tout →
              </Link>
            </div>
            <div className="space-y-4">
              {recentPlannings.map((planning) => (
                <div
                  key={planning.id}
                  className={`flex items-center p-4 rounded-xl ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  } transition-colors duration-200`}
                >
                  <div className="flex-1">
                    <h3 className={isDark ? 'text-white' : 'text-gray-900'}>{planning.matiere}</h3>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {planning.enseignant} • {planning.groupe}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      planning.type === 'CM' 
                        ? isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                        : planning.type === 'TD'
                        ? isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                        : isDark ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {planning.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      planning.status === 'Confirmé'
                        ? isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                        : isDark ? 'bg-amber-900 text-amber-300' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {planning.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6`}>
            <h2 className={`text-xl font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            } mb-6`}>Distribution par Filière</h2>
            <div className="space-y-6">
              {['TC', 'DWM', 'DSI', 'RSS'].map((filiere) => {
                const count = mockData.matieres.filter((m) => m.filiere === filiere).length;
                const percentage = (count / mockData.matieres.length) * 100;
                
                return (
                  <div key={filiere} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="w-3 h-3 rounded-full bg-gradient-to-r from-supnum-blue to-supnum-teal" />
                        <span className={`font-medium ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>{filiere}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          {count} matières
                        </span>
                        <span className={`text-sm font-medium ${
                          isDark ? 'text-blue-400' : 'text-supnum-blue'
                        }`}>
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className={`relative h-3 rounded-full ${
                      isDark ? 'bg-gray-700' : 'bg-gray-100'
                    } overflow-hidden`}>
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-supnum-blue to-supnum-teal transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
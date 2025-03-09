import { Link, useLocation } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { 
  HomeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function SideNav() {
  const location = useLocation();
  const { isDark } = useThemeStore();

  const navigation = [
    { name: 'Tableau de bord', href: '/', icon: HomeIcon },
    { name: 'Matières', href: '/matieres', icon: BookOpenIcon },
    { name: 'Enseignants', href: '/enseignants', icon: AcademicCapIcon },
    { name: 'Groupes', href: '/groupes', icon: UserGroupIcon },
    { name: 'Planning', href: '/planning', icon: CalendarIcon },
    { name: 'Cours', href: '/cours', icon: BookOpenIcon },
    { name: 'Salles', href: '/salles', icon: BuildingOfficeIcon },
    { name: 'Utilisateurs', href: '/utilisateurs', icon: UserIcon }
  ];

  return (
    <div className={`
export interface Professor {
  id: number;
  nom: string;
  prenom: string;
  email: string | null;
  telephone: string | null;
  specialite: string | null;
  grade: ProfessorGrade;
  dateNaissance: string;
  lieuNaissance: string;
  adresse: string;
  cin: string;
  dateRecrutement: string;
  status: ProfessorStatus;
  availabilities: ProfessorAvailability[];
}

export type ProfessorGrade = 'PA' | 'PH' | 'PES';
export type ProfessorStatus = 'ACTIVE' | 'INACTIVE';

export interface ProfessorAvailability {
  id?: number;
  professorId?: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProfessorFormData {
  nom: string;
  prenom: string;
  email: string | null;
  telephone: string | null;
  specialite: string | null;
  grade: ProfessorGrade;
  dateNaissance: string;
  lieuNaissance: string;
  adresse: string;
  cin: string;
  dateRecrutement: string;
  status: ProfessorStatus;
  availabilities?: ProfessorAvailability[];
}

export interface ProfessorFilters {
  searchTerm: string;
  specialite?: string;
  grade?: ProfessorGrade;
  status?: ProfessorStatus;
} 
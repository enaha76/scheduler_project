export interface Enseignant {
  id: number;
  nom: string;
  email: string;
  specialite: string;
  professorAssignments?: ProfessorAssignment[];
  schedule?: Schedule[];
  weeklyProfessorAvailability?: WeeklyProfessorAvailability[];
}

export interface Disponibilite {
  id: number;
  enseignantId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Groupe {
  id: number;
  nom: string;
  semestre: number;
  filiere: string;
  effectif: number;
  parentId?: number | null;
  subgroups?: Groupe[];
}

export interface Planning {
  id: number;
  groupeId: number;
  matiereId: number;
  enseignantId: number;
  salleId: number;
  jour: string;
  heureDebut: string;
  heureFin: string;
  semaine: number;
  typeCours: TypeCours;
}

export interface Salle {
  id: number;
  nom: string;
  capacite: number;
  type: string;
}

export type TypeCours = 'CM' | 'TD' | 'TP';

export interface WeeklyProfessorAvailability {
  id: number;
  professorId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface ProfessorAssignment {
  id: number;
  professorId: number;
  courseId: number;
}

export interface Schedule {
  id: number;
  professorId: number;
  courseId: number;
  groupId: number;
  roomId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  weekNumber: number;
} 
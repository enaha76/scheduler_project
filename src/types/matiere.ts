export type Filiere = 'TC' | 'DWM' | 'DSI' | 'RSS';
export type TypeCours = 'CM' | 'TD' | 'TP';

export interface TeachingLoad {
  id?: number;
  matiereId: number;
  type: TypeCours;
  hoursRequired: number;
  groupIds: number[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProfessorAssignment {
  id?: number;
  matiereId: number;
  professorId: number;
  teachingType: TypeCours;
  groupId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Matiere {
  id: number;
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
  teachingLoads?: TeachingLoad[];
  professorAssignments?: ProfessorAssignment[];
} 
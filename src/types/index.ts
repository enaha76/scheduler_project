export * from './matiere';

export type Filiere = 'TC' | 'DWM' | 'DSI' | 'RSS';
export type TypeCours = 'CM' | 'TD' | 'TP';
export type TypeSalle = 'Amphi' | 'Salle TD' | 'Salle TP';
export type JourSemaine = 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi';

export interface Creneau {
  debut: string;
  fin: string;
}

export interface CreneauxType {
  [key: string]: Creneau;
}

// Define the Matiere interface with all required properties
export type Matiere = {
  id: number;
  code: string;
  nom: string;
  credits: number;
  semestre: number;
  filiere: Filiere;
  volumeHoraire: number;
  type: TypeCours;
};

export interface Enseignant {
  id: number;
  nom: string;
  email: string;
  specialite: string;
  disponibilites?: Disponibilite[];
}

export interface Groupe {
  id: number;
  nom: string;
  semestre: number;
  filiere: Filiere;
  effectif: number;
  parentId?: number;
  matieres?: Matiere[];
}

export interface Disponibilite {
  id: number;
  enseignantId: number;
  jour: number;
  creneau: number;
  disponible: boolean;
  semaine: number;
}

export interface Planning {
  id: number;
  matiere: Matiere;
  enseignant: Enseignant;
  groupe: Groupe;
  jour: number;
  creneau: number;
  semaine: number;
  typeCours: TypeCours;
}

export interface Salle {
  id: number;
  nom: string;
  capacite: number;
  type: TypeSalle;
} 
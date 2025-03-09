import type { 
  Matiere,
  Filiere,
  TypeCours
} from '../types/matiere';

import type {
  Enseignant,
  Groupe,
  Planning,
  Salle
} from '../types';

interface Creneau {
  id: string;
  debut: string;
  fin: string;
}

export const matieres: Matiere[] = [
  {
    id: 1,
    code: 'MATH101',
    nom: 'Mathématiques',
    credits: 4,
    semestre: 1,
    filiere: 'TC',
    volumeHoraire: 48,
    type: 'CM'
  },
  {
    id: 2,
    code: 'INFO201',
    nom: 'Programmation Web',
    credits: 6,
    semestre: 2,
    filiere: 'DWM',
    volumeHoraire: 60,
    type: 'TP'
  },
  {
    id: 3,
    code: 'SYST301',
    nom: 'Systèmes d\'exploitation',
    credits: 5,
    semestre: 3,
    filiere: 'DSI',
    volumeHoraire: 54,
    type: 'TD'
  },
  {
    id: 4,
    code: 'RESX401',
    nom: 'Réseaux',
    credits: 5,
    semestre: 4,
    filiere: 'RSS',
    volumeHoraire: 45,
    type: 'CM'
  }
];

export const enseignants: Enseignant[] = [
  { 
    id: 1, 
    nom: 'Saucrate Dahmed', 
    email: 'saucrate.dahmed@supnum.mr',
    specialite: 'Mathématiques'
  },
  { 
    id: 2, 
    nom: 'Ahmedou Naha', 
    email: 'ahmedou.naha@supnum.mr',
    specialite: 'Informatique'
  }
];

export const groupes: Groupe[] = [
  { 
    id: 1, 
    nom: 'Groupe A', 
    semestre: 1, 
    filiere: 'TC',
    effectif: 30
  },
  { 
    id: 2, 
    nom: 'Groupe B', 
    semestre: 1, 
    filiere: 'TC',
    effectif: 28
  },
  { 
    id: 3, 
    nom: 'Groupe C', 
    semestre: 2, 
    filiere: 'DWM',
    effectif: 25
  }
];

export const salles: Salle[] = [
  { id: 1, nom: 'Amphi A', capacite: 120, type: 'Amphi' },
  { id: 2, nom: 'Salle 101', capacite: 30, type: 'Salle TD' },
  { id: 3, nom: 'Labo Info 1', capacite: 20, type: 'Salle TP' },
  { id: 4, nom: 'Salle 102', capacite: 30, type: 'Salle TD' },
  { id: 5, nom: 'Labo Info 2', capacite: 20, type: 'Salle TP' }
];

export const creneauxArray: Creneau[] = [
  { id: '08:00-09:30', debut: '08:00', fin: '09:30' },
  { id: '10:00-11:30', debut: '10:00', fin: '11:30' },
  { id: '14:00-15:30', debut: '14:00', fin: '15:30' },
  { id: '16:00-17:30', debut: '16:00', fin: '17:30' }
];

export const creneaux = Object.fromEntries(
  creneauxArray.map(creneau => [
    creneau.id,
    { debut: creneau.debut, fin: creneau.fin }
  ])
);

export const plannings: Planning[] = []; 
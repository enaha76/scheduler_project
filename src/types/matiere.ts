export type Filiere = 'TC' | 'DWM' | 'DSI' | 'RSS';
export type TypeCours = 'CM' | 'TD' | 'TP';

export interface Matiere {
  readonly id: number;
  readonly code: string;
  readonly nom: string;
  readonly credits: number;
  readonly semestre: number;
  readonly filiere: Filiere;
  readonly volumeHoraire: number;
  readonly type: TypeCours;
} 
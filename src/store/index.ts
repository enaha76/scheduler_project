import { create } from 'zustand';
import type { Matiere } from '../types/matiere';
import type { Enseignant, Groupe, Planning } from '../types';
import { matieres as mockMatieres, enseignants as mockEnseignants, groupes as mockGroupes, plannings as mockPlannings } from '../data/mockData';

interface Store {
  matieres: Matiere[];
  enseignants: Enseignant[];
  groupes: Groupe[];
  plannings: Planning[];
  
  // Actions
  addMatiere: (matiere: Matiere) => Promise<void>;
  updateMatiere: (id: number, matiere: Matiere) => Promise<void>;
  deleteMatiere: (id: number) => Promise<void>;
  
  addEnseignant: (enseignant: Enseignant) => void;
  updateEnseignant: (id: number, enseignant: Enseignant) => void;
  deleteEnseignant: (id: number) => void;
  
  addGroupe: (groupe: Groupe) => void;
  updateGroupe: (id: number, groupe: Groupe) => void;
  deleteGroupe: (id: number) => void;
  
  addPlanning: (planning: Planning) => void;
  updatePlanning: (id: number, planning: Planning) => void;
  deletePlanning: (id: number) => void;
}

export const useStore = create<Store>((set) => ({
  // Initial state
  matieres: mockMatieres,
  enseignants: mockEnseignants,
  groupes: mockGroupes,
  plannings: mockPlannings,
  
  // Matiere actions
  addMatiere: async (matiere) => {
    set((state) => ({
      matieres: [...state.matieres, matiere],
    }));
  },
  
  updateMatiere: async (id, matiere) => {
    set((state) => ({
      matieres: state.matieres.map((m) => (m.id === id ? matiere : m)),
    }));
  },
  
  deleteMatiere: async (id) => {
    set((state) => ({
      matieres: state.matieres.filter((m) => m.id !== id),
    }));
  },
  
  // Enseignant actions
  addEnseignant: (enseignant) =>
    set((state) => ({
      enseignants: [...state.enseignants, enseignant]
    })),
  
  updateEnseignant: (id, enseignant) =>
    set((state) => ({
      enseignants: state.enseignants.map((e) =>
        e.id === id ? enseignant : e
      )
    })),
  
  deleteEnseignant: (id) =>
    set((state) => ({
      enseignants: state.enseignants.filter((e) => e.id !== id)
    })),
  
  // Groupe actions
  addGroupe: (groupe) =>
    set((state) => ({
      groupes: [...state.groupes, groupe]
    })),
  
  updateGroupe: (id, groupe) =>
    set((state) => ({
      groupes: state.groupes.map((g) =>
        g.id === id ? groupe : g
      )
    })),
  
  deleteGroupe: (id) =>
    set((state) => ({
      groupes: state.groupes.filter((g) => g.id !== id)
    })),
  
  // Planning actions
  addPlanning: (planning) =>
    set((state) => ({
      plannings: [...state.plannings, planning]
    })),
  
  updatePlanning: (id, planning) =>
    set((state) => ({
      plannings: state.plannings.map((p) =>
        p.id === id ? planning : p
      )
    })),
  
  deletePlanning: (id) =>
    set((state) => ({
      plannings: state.plannings.filter((p) => p.id !== id)
    })),
})); 
import { create } from 'zustand';
import type { Professor, ProfessorFormData } from '../types/professor';
import axios from 'axios';

interface ProfessorStore {
  professors: Professor[];
  isLoading: boolean;
  error: string | null;
  fetchProfessors: () => Promise<void>;
  createProfessor: (data: ProfessorFormData) => Promise<Professor>;
  updateProfessor: (id: number, data: ProfessorFormData) => Promise<Professor>;
  deleteProfessor: (id: number) => Promise<void>;
}

export const useProfessorStore = create<ProfessorStore>((set, get) => ({
  professors: [],
  isLoading: false,
  error: null,

  fetchProfessors: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/professors');
      set({ professors: response.data });
    } catch (error) {
      set({ error: 'Erreur lors du chargement des professeurs' });
      console.error('Error fetching professors:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createProfessor: async (data: ProfessorFormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/api/professors', data);
      const newProfessor = response.data;
      set(state => ({
        professors: [...state.professors, newProfessor]
      }));
      return newProfessor;
    } catch (error) {
      set({ error: 'Erreur lors de la création du professeur' });
      console.error('Error creating professor:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfessor: async (id: number, data: ProfessorFormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`/api/professors/${id}`, data);
      const updatedProfessor = response.data;
      set(state => ({
        professors: state.professors.map(p => 
          p.id === id ? updatedProfessor : p
        )
      }));
      return updatedProfessor;
    } catch (error) {
      set({ error: 'Erreur lors de la mise à jour du professeur' });
      console.error('Error updating professor:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProfessor: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/api/professors/${id}`);
      set(state => ({
        professors: state.professors.filter(p => p.id !== id)
      }));
    } catch (error) {
      set({ error: 'Erreur lors de la suppression du professeur' });
      console.error('Error deleting professor:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
})); 
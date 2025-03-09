import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Filiere } from '../types/matiere';

interface FiliereColor {
  color: string;
  isUsed: boolean;
}

export interface FiliereSettings {
  id: string;
  filiere: Filiere;
  color: string;
  fullName: string;
}

interface FiliereStore {
  availableColors: Record<string, FiliereColor>;
  filiereSettings: FiliereSettings[];
  addFiliereSettings: (settings: FiliereSettings) => void;
  updateFiliereSettings: (id: string, settings: Partial<FiliereSettings>) => void;
  deleteFiliereSettings: (id: string) => void;
  setColorUsed: (color: string, used: boolean) => void;
}

const initialColors = {
  'blue': { color: 'from-blue-500 to-blue-600', isUsed: true },
  'purple': { color: 'from-purple-500 to-purple-600', isUsed: true },
  'green': { color: 'from-green-500 to-green-600', isUsed: true },
  'orange': { color: 'from-orange-500 to-orange-600', isUsed: true },
  'red': { color: 'from-red-500 to-red-600', isUsed: false },
  'yellow': { color: 'from-yellow-500 to-yellow-600', isUsed: false },
  'indigo': { color: 'from-indigo-500 to-indigo-600', isUsed: false },
  'pink': { color: 'from-pink-500 to-pink-600', isUsed: false },
};

const initialFiliereSettings: FiliereSettings[] = [
  { id: 'tc', filiere: 'TC' as Filiere, color: 'from-blue-500 to-blue-600', fullName: 'Tronc Commun' },
  { id: 'dwm', filiere: 'DWM' as Filiere, color: 'from-purple-500 to-purple-600', fullName: 'Développement Web et Mobile' },
  { id: 'dsi', filiere: 'DSI' as Filiere, color: 'from-green-500 to-green-600', fullName: 'Développement des Systèmes d\'Information' },
  { id: 'rss', filiere: 'RSS' as Filiere, color: 'from-orange-500 to-orange-600', fullName: 'Réseaux et Sécurité des Systèmes' },
];

export const useFiliereStore = create<FiliereStore>()(
  persist(
    (set) => ({
      availableColors: initialColors,
      filiereSettings: initialFiliereSettings,
      
      addFiliereSettings: (settings) => 
        set((state) => {
          // Mark the new color as used
          const newColors = { ...state.availableColors };
          Object.entries(newColors).forEach(([name, colorData]) => {
            if (colorData.color === settings.color) {
              newColors[name].isUsed = true;
            }
          });

          return {
            filiereSettings: [...state.filiereSettings, settings],
            availableColors: newColors
          };
        }),
      
      updateFiliereSettings: (id, settings) =>
        set((state) => {
          const oldSettings = state.filiereSettings.find(f => f.id === id);
          const newColors = { ...state.availableColors };
          
          // If color is being changed, update color usage
          if (settings.color && oldSettings?.color !== settings.color) {
            // Mark old color as unused
            Object.entries(newColors).forEach(([name, colorData]) => {
              if (colorData.color === oldSettings?.color) {
                newColors[name].isUsed = false;
              }
              if (colorData.color === settings.color) {
                newColors[name].isUsed = true;
              }
            });
          }

          return {
            filiereSettings: state.filiereSettings.map(f => 
              f.id === id ? { ...f, ...settings } : f
            ),
            availableColors: newColors
          };
        }),
      
      deleteFiliereSettings: (id) =>
        set((state) => {
          const settingsToDelete = state.filiereSettings.find(f => f.id === id);
          const newColors = { ...state.availableColors };
          
          // Mark the color as unused
          if (settingsToDelete) {
            Object.entries(newColors).forEach(([name, colorData]) => {
              if (colorData.color === settingsToDelete.color) {
                newColors[name].isUsed = false;
              }
            });
          }

          return {
            filiereSettings: state.filiereSettings.filter(f => f.id !== id),
            availableColors: newColors
          };
        }),
      
      setColorUsed: (color, used) =>
        set((state) => ({
          availableColors: {
            ...state.availableColors,
            [color]: { ...state.availableColors[color], isUsed: used }
          }
        })),
    }),
    {
      name: 'filiere-settings',
      partialize: (state) => ({
        filiereSettings: state.filiereSettings,
        availableColors: state.availableColors,
      }),
    }
  )
); 
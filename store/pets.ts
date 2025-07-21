import { create } from 'zustand';
import { Pet, PetType } from '../types';
import { 
  insertPet, 
  updatePet, 
  deletePet, 
  getAllPets, 
  getPetById 
} from '../lib/db';

interface PetStore {
  pets: Pet[];
  loading: boolean;
  selectedPet: Pet | null;
  
  // Actions
  loadPets: () => Promise<void>;
  addPet: (pet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePetData: (id: string, updates: Partial<Pet>) => Promise<void>;
  removePet: (id: string) => Promise<void>;
  selectPet: (id: string) => Promise<void>;
  clearSelectedPet: () => void;
}

export const usePetStore = create<PetStore>((set, get) => ({
  pets: [],
  loading: false,
  selectedPet: null,

  loadPets: async () => {
    set({ loading: true });
    try {
      const pets = await getAllPets();
      set({ pets, loading: false });
    } catch (error) {
      console.error('Failed to load pets:', error);
      set({ loading: false });
    }
  },

  addPet: async (petData) => {
    try {
      const newPet: Pet = {
        ...petData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await insertPet(newPet);
      await get().loadPets();
    } catch (error) {
      console.error('Failed to add pet:', error);
      throw error;
    }
  },

  updatePetData: async (id, updates) => {
    try {
      const updatedPet = {
        ...updates,
        id,
        updatedAt: new Date().toISOString(),
      };
      
      await updatePet(id, updatedPet);
      await get().loadPets();
      
      // Update selected pet if it's the one being updated
      if (get().selectedPet?.id === id) {
        await get().selectPet(id);
      }
    } catch (error) {
      console.error('Failed to update pet:', error);
      throw error;
    }
  },

  removePet: async (id) => {
    try {
      await deletePet(id);
      await get().loadPets();
      
      // Clear selected pet if it was deleted
      if (get().selectedPet?.id === id) {
        set({ selectedPet: null });
      }
    } catch (error) {
      console.error('Failed to remove pet:', error);
      throw error;
    }
  },

  selectPet: async (id) => {
    try {
      const pet = await getPetById(id);
      set({ selectedPet: pet });
    } catch (error) {
      console.error('Failed to select pet:', error);
    }
  },

  clearSelectedPet: () => {
    set({ selectedPet: null });
  },
}));
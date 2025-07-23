import { create } from 'zustand';
import { HealthLog } from '../types';
import { 
  insertHealthLog,
  getHealthLogsByPetId,
  updateHealthLog,
  deleteHealthLog,
} from '../lib/db';
import { useReminderStore } from './reminders';

export type HealthLogType = 'vaccination' | 'medication' | 'weight' | 'temperature' | 'vet_visit' | 'observation' | 'other';

interface HealthLogStore {
  logs: HealthLog[];
  loading: boolean;
  selectedPetId: string | null;
  
  // Actions
  loadHealthLogs: (petId: string) => Promise<void>;
  addHealthLog: (log: Omit<HealthLog, 'id'>) => Promise<void>;
  updateHealthLogData: (id: string, updates: Partial<HealthLog>) => Promise<void>;
  removeHealthLog: (id: string) => Promise<void>;
  setSelectedPetId: (petId: string | null) => void;
  
  // Specialized getters
  getVaccinationLogs: (petId: string) => HealthLog[];
  getMedicationLogs: (petId: string) => HealthLog[];
  getWeightLogs: (petId: string) => HealthLog[];
  getObservationLogs: (petId: string) => HealthLog[];
  
  // Vaccination due date tracking
  addVaccination: (
    petId: string, 
    name: string, 
    date: Date, 
    notes?: string, 
    nextDueDate?: Date
  ) => Promise<void>;
  
  // Medication tracking
  addMedication: (
    petId: string,
    name: string,
    dosage: string,
    frequency: string,
    startDate: Date,
    endDate?: Date,
    notes?: string,
    reminderEnabled?: boolean
  ) => Promise<void>;
}

export const useHealthLogStore = create<HealthLogStore>((set, get) => ({
  logs: [],
  loading: false,
  selectedPetId: null,

  loadHealthLogs: async (petId) => {
    set({ loading: true, selectedPetId: petId });
    try {
      const logs = await getHealthLogsByPetId(petId);
      set({ logs, loading: false });
    } catch (error) {
      console.error('Failed to load health logs:', error);
      set({ loading: false });
    }
  },

  addHealthLog: async (logData) => {
    try {
      const newLog: HealthLog = {
        ...logData,
        id: Date.now().toString(),
      };
      
      await insertHealthLog(newLog);
      
      // Reload logs if this is for the currently selected pet
      if (get().selectedPetId === newLog.petId) {
        await get().loadHealthLogs(newLog.petId);
      }
    } catch (error) {
      console.error('Failed to add health log:', error);
      throw error;
    }
  },

  updateHealthLogData: async (id, updates) => {
    try {
      await updateHealthLog(id, updates);
      
      // Reload logs if necessary
      const petId = get().selectedPetId;
      if (petId) {
        await get().loadHealthLogs(petId);
      }
    } catch (error) {
      console.error('Failed to update health log:', error);
      throw error;
    }
  },

  removeHealthLog: async (id) => {
    try {
      await deleteHealthLog(id);
      
      // Reload logs if necessary
      const petId = get().selectedPetId;
      if (petId) {
        await get().loadHealthLogs(petId);
      }
    } catch (error) {
      console.error('Failed to remove health log:', error);
      throw error;
    }
  },

  setSelectedPetId: (petId) => {
    set({ selectedPetId: petId });
    if (petId) {
      get().loadHealthLogs(petId);
    }
  },

  // Specialized getters for different health log types
  getVaccinationLogs: (petId) => {
    return get().logs.filter(log => 
      log.petId === petId && 
      log.type === 'vaccination'
    ).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  getMedicationLogs: (petId) => {
    return get().logs.filter(log => 
      log.petId === petId && 
      log.type === 'medication'
    ).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  getWeightLogs: (petId) => {
    return get().logs.filter(log => 
      log.petId === petId && 
      log.type === 'weight'
    ).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  },

  getObservationLogs: (petId) => {
    return get().logs.filter(log => 
      log.petId === petId && 
      (log.type === 'observation' || log.type === 'symptom')
    ).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  // Add a vaccination with optional due date reminder
  addVaccination: async (petId, name, date, notes, nextDueDate) => {
    // First add the vaccination log
    await get().addHealthLog({
      petId,
      date: date.toISOString(),
      type: 'vaccination',
      value: name,
      notes: notes || `Vaccination: ${name}`,
    });

    // If a next due date is provided, create a reminder
    if (nextDueDate) {
      const reminderStore = useReminderStore.getState();
      await reminderStore.addReminder({
        petId,
        title: `${name} Vaccination Due`,
        description: `Vaccination ${name} is due for your pet`,
        type: 'vet',
        scheduledDate: nextDueDate.toISOString(),
        recurring: 'yearly',
        completed: false,
        notificationEnabled: true,
      });
    }
  },

  // Add medication with tracking
  addMedication: async (petId, name, dosage, frequency, startDate, endDate, notes, reminderEnabled = true) => {
    // Add the medication log
    await get().addHealthLog({
      petId,
      date: startDate.toISOString(),
      type: 'medication',
      value: `${name} - ${dosage}`,
      notes: notes || `Medication: ${name}, Dosage: ${dosage}, Frequency: ${frequency}${endDate ? `, Until: ${endDate.toLocaleDateString()}` : ''}`,
    });

    // Create reminders based on frequency if enabled
    if (reminderEnabled) {
      const reminderStore = useReminderStore.getState();
      
      let recurring: 'daily' | 'weekly' | 'monthly' | undefined;
      
      // Parse frequency to determine recurring pattern
      if (frequency.includes('day') || frequency.includes('daily')) {
        recurring = 'daily';
      } else if (frequency.includes('week') || frequency.includes('weekly')) {
        recurring = 'weekly';
      } else if (frequency.includes('month') || frequency.includes('monthly')) {
        recurring = 'monthly';
      }

      await reminderStore.addReminder({
        petId,
        title: `${name} Medication`,
        description: `Give ${dosage} of ${name} to your pet`,
        type: 'medication',
        scheduledDate: startDate.toISOString(),
        recurring,
        completed: false,
        notificationEnabled: true,
      });
    }
  },
}));

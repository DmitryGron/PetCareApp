import { create } from 'zustand';
import { Reminder } from '../types';
import { 
  insertReminder, 
  updateReminder, 
  deleteReminder, 
  getAllReminders,
  getRemindersByPetId,
  getReminderById 
} from '../lib/db';
import { scheduleNotification, cancelNotification } from '../lib/notifications';

interface ReminderStore {
  reminders: Reminder[];
  loading: boolean;
  
  // Actions
  loadReminders: () => Promise<void>;
  loadRemindersByPet: (petId: string) => Promise<void>;
  getReminderById: (id: string) => Promise<Reminder | null>;
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => Promise<void>;
  updateReminderData: (id: string, updates: Partial<Reminder>) => Promise<void>;
  removeReminder: (id: string) => Promise<void>;
  toggleReminderComplete: (id: string) => Promise<void>;
}

export const useReminderStore = create<ReminderStore>((set, get) => ({
  reminders: [],
  loading: false,

  loadReminders: async () => {
    set({ loading: true });
    try {
      const reminders = await getAllReminders();
      set({ reminders, loading: false });
    } catch (error) {
      console.error('Failed to load reminders:', error);
      set({ loading: false });
    }
  },

  loadRemindersByPet: async (petId) => {
    set({ loading: true });
    try {
      const reminders = await getRemindersByPetId(petId);
      set({ reminders, loading: false });
    } catch (error) {
      console.error('Failed to load pet reminders:', error);
      set({ loading: false });
    }
  },
  
  getReminderById: async (id) => {
    try {
      return await getReminderById(id);
    } catch (error) {
      console.error('Failed to get reminder by id:', error);
      return null;
    }
  },

  addReminder: async (reminderData) => {
    try {
      const newReminder: Reminder = {
        ...reminderData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      await insertReminder(newReminder);
      
      // Schedule notification if enabled
      if (newReminder.notificationEnabled && newReminder.scheduledDate) {
        await scheduleNotification(
          newReminder.id,
          newReminder.title,
          newReminder.description || '',
          new Date(newReminder.scheduledDate),
          newReminder.recurring
        );
      }
      
      await get().loadReminders();
    } catch (error) {
      console.error('Failed to add reminder:', error);
      throw error;
    }
  },

  updateReminderData: async (id, updates) => {
    try {
      await updateReminder(id, updates);
      
      // Handle notification updates
      if (updates.notificationEnabled === false) {
        await cancelNotification(id);
      } else if (updates.scheduledDate && (updates.notificationEnabled === true || updates.notificationEnabled === undefined)) {
        // Get the current reminder to access fields not in the updates
        const currentReminder = await getReminderById(id);
        if (!currentReminder) return;
        
        await scheduleNotification(
          id,
          updates.title || currentReminder.title,
          updates.description || currentReminder.description || '',
          new Date(updates.scheduledDate),
          updates.recurring !== undefined ? updates.recurring : currentReminder.recurring
        );
      }
      
      await get().loadReminders();
    } catch (error) {
      console.error('Failed to update reminder:', error);
      throw error;
    }
  },

  removeReminder: async (id) => {
    try {
      await deleteReminder(id);
      await cancelNotification(id);
      await get().loadReminders();
    } catch (error) {
      console.error('Failed to remove reminder:', error);
      throw error;
    }
  },

  toggleReminderComplete: async (id) => {
    try {
      const reminder = get().reminders.find(r => r.id === id);
      if (reminder) {
        await get().updateReminderData(id, { 
          completed: !reminder.completed,
          completedAt: !reminder.completed ? new Date().toISOString() : undefined
        });
      }
    } catch (error) {
      console.error('Failed to toggle reminder:', error);
      throw error;
    }
  },
}));
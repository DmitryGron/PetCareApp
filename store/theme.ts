import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeStore {
  isDarkMode: boolean;
  toggleTheme: () => Promise<void>;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  isDarkMode: false,

  toggleTheme: async () => {
    const newTheme = !get().isDarkMode;
    set({ isDarkMode: newTheme });
    await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
  },

  loadTheme: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        set({ isDarkMode: savedTheme === 'dark' });
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  },
}));
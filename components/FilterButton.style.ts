import { StyleSheet } from 'react-native';

export const getFilterButtonStyles = (isDarkMode: boolean, filterValue: 'all' | 'upcoming' | 'missed' | 'completed') => {
  return StyleSheet.create({
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: isDarkMode ? "#2C2C2E" : "#F2F2F7",
    },
    filterButtonActive: {
      backgroundColor: filterValue === 'missed' ? "#FF3B30" : "#007AFF",
    },
    filterText: {
      fontSize: 14,
      color: isDarkMode ? "#CCCCCC" : "#666666",
    },
    filterTextActive: {
      color: "#FFFFFF",
      fontWeight: "500",
    },
  });
};
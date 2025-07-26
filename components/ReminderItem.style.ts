import { StyleSheet } from 'react-native';
import { useThemeStore } from '../store/theme';

export const getReminderItemStyles = () => {
  const { isDarkMode } = useThemeStore();
  return StyleSheet.create({
    reminderItem: {
      backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    reminderItemCompleted: {
      opacity: 0.6,
    },
    reminderIcon: {
      fontSize: 24,
      marginRight: 16,
    },
    reminderInfo: {
      flex: 1,
    },
    reminderTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      marginBottom: 4,
    },
    reminderTitleCompleted: {
      textDecorationLine: "line-through",
    },
    reminderDetails: {
      fontSize: 14,
      color: isDarkMode ? "#CCCCCC" : "#666666",
      marginBottom: 2,
    },
    reminderDate: {
      fontSize: 12,
      color: "#007AFF",
    },
    reminderActions: {
      flexDirection: "row",
      alignItems: "center",
    },
    actionButton: {
      padding: 8,
      marginLeft: 8,
    },
    actionText: {
      fontSize: 16,
    },
  });
};

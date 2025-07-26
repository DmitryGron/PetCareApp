import { StyleSheet } from 'react-native';
import { useThemeStore } from "../store/theme";

export const createStyles = () => {
  const { isDarkMode } = useThemeStore();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#000000" : "#F2F2F7",
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: isDarkMode ? "#FFFFFF" : "#000000",
    },
    reminderItem: {
      backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    reminderInfo: {
      flex: 1,
      marginRight: 10,
    },
    reminderTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? "#FFFFFF" : "#000000",
    },
    reminderDate: {
      fontSize: 14,
      color: isDarkMode ? "#CCCCCC" : "#666666",
      marginTop: 5,
    },
    missedReminder: {
      borderLeftWidth: 4,
      borderLeftColor: '#FF3B30',
      paddingLeft: 10,
    },
    actions: {
      flexDirection: 'row',
    },
    actionButton: {
      padding: 5,
      marginLeft: 10,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyIcon: {
      fontSize: 60,
      marginBottom: 20,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? "#FFFFFF" : "#000000",
      marginBottom: 10,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: isDarkMode ? "#CCCCCC" : "#666666",
      textAlign: 'center',
      lineHeight: 22,
    },
  });
};

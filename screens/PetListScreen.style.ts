import { StyleSheet } from 'react-native';
import { useThemeStore } from "../store/theme";

export const createStyles = () => {
  const { isDarkMode } = useThemeStore();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#F2F2F7',
    },
    header: {
      padding: 20,
      backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    },
    greeting: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 16,
      color: isDarkMode ? '#CCCCCC' : '#666666',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    addButton: {
      backgroundColor: '#007AFF',
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      marginBottom: 20,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
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
      color: isDarkMode ? '#FFFFFF' : '#000000',
      textAlign: 'center',
      marginBottom: 10,
    },
    emptyText: {
      fontSize: 16,
      color: isDarkMode ? '#CCCCCC' : '#666666',
      textAlign: 'center',
      lineHeight: 22,
    },
    quickActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 15,
      backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
      marginBottom: 20,
      borderRadius: 10,
    },
    quickAction: {
      alignItems: 'center',
      flex: 1,
    },
    quickActionIcon: {
      fontSize: 24,
      marginBottom: 5,
    },
    quickActionText: {
      fontSize: 12,
      color: isDarkMode ? '#CCCCCC' : '#666666',
    },
  });
};

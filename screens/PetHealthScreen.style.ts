import { StyleSheet } from 'react-native';
import { useThemeStore } from "../store/theme";

export const createStyles = () => {
  const { isDarkMode } = useThemeStore();

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    sectionContainer: {
      padding: 16,
      borderRadius: 8,
      marginBottom: 20,
      backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    },
    logsList: {
      marginTop: 10,
    },
    weightValue: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 4,
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    trendIcon: {
      marginLeft: 6,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333333' : '#DDDDDD',
      backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    },
    backButton: {
      marginRight: 15,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    tabBar: {
      flexDirection: 'row',
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333333' : '#DDDDDD',
      backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    activeTab: {
      borderRadius: 0,
      marginHorizontal: 5,
      marginVertical: 5,
    },
    tabText: {
      fontSize: 14,
      marginLeft: 5,
      color: isDarkMode ? '#CCCCCC' : '#666666',
    },
    activeTabText: {
      fontSize: 14,
      color: '#fff',
      marginLeft: 5,
      fontWeight: '500',
    },
    content: {
      flex: 1,
      padding: 15,
      backgroundColor: isDarkMode ? '#000000' : '#F2F2F7',
    },
    section: {
      backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
      borderRadius: 10,
      padding: 15,
      marginBottom: 20,
      shadowColor: isDarkMode ? '#000' : '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#333',
    },
    addIconButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logItem: {
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : '#eee',
      paddingVertical: 10,
    },
    logHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: isDarkMode ? '#FFFFFF' : '#333',
    },
    logDate: {
      fontSize: 14,
      color: isDarkMode ? '#CCCCCC' : '#888',
    },
    logNotes: {
      fontSize: 14,
      color: isDarkMode ? '#CCCCCC' : '#666',
      marginTop: 5,
    },
    chartContainer: {
      backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      shadowColor: isDarkMode ? '#000' : '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    emptySection: {
      backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
      borderRadius: 10,
      padding: 30,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: isDarkMode ? '#000' : '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    emptyText: {
      fontSize: 16,
      marginTop: 10,
      marginBottom: 20,
      color: isDarkMode ? '#CCCCCC' : '#666666',
    },
    addButton: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 6,
      marginTop: 10,
      backgroundColor: '#007AFF',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '500',
    },
  });
};

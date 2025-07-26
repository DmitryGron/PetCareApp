import { StyleSheet } from 'react-native';

export const getPetCardStyles = (isDarkMode: boolean) => {
  return StyleSheet.create({
    card: {
      backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    petImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 16,
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    petIcon: {
      fontSize: 24,
    },
    petInfo: {
      flex: 1,
    },
    petName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: 4,
    },
    petDetails: {
      fontSize: 14,
      color: isDarkMode ? '#CCCCCC' : '#666666',
      marginBottom: 2,
    },
    petType: {
      fontSize: 12,
      color: '#007AFF',
      fontWeight: '500',
      textTransform: 'capitalize',
    },
    arrow: {
      fontSize: 16,
      color: isDarkMode ? '#666666' : '#CCCCCC',
    },
  });
};
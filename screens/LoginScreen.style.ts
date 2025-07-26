import { StyleSheet } from 'react-native';
import { useThemeStore } from "../store/theme";

export const createStyles = () => {
  const { isDarkMode } = useThemeStore();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
      justifyContent: 'center',
      padding: 20,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 50,
    },
    logo: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    logoText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      textAlign: 'center',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: isDarkMode ? '#CCCCCC' : '#666666',
      textAlign: 'center',
      marginBottom: 40,
    },
    input: {
      borderWidth: 1,
      borderColor: isDarkMode ? '#38383A' : '#CCCCCC',
      backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      borderRadius: 10,
      padding: 15,
      fontSize: 16,
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#007AFF',
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      marginBottom: 20,
    },
    buttonDisabled: {
      backgroundColor: '#CCCCCC',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    skipButton: {
      alignItems: 'center',
    },
    skipText: {
      color: isDarkMode ? '#CCCCCC' : '#666666',
      fontSize: 14,
    },
  });
};

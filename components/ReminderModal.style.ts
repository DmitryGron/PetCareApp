import { StyleSheet } from 'react-native';
import { useThemeStore } from '../store/theme';

export const getReminderModalStyles = () => {
  const { isDarkMode } = useThemeStore();
  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      width: '100%',
      backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
      borderRadius: 12,
      padding: 20,
      maxHeight: '90%',
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 8,
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    input: {
      backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: 16,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    dateButton: {
      backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    dateButtonText: {
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    typeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
      justifyContent: 'space-between',
    },
    typeOption: {
      width: '30%',
      backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
      borderRadius: 8,
      padding: 10,
      margin: 5,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    typeOptionSelected: {
      borderColor: '#007AFF',
      backgroundColor: isDarkMode ? '#1A365D' : '#E3F2FD',
    },
    typeIcon: {
      fontSize: 20,
      marginBottom: 4,
    },
    typeLabel: {
      fontSize: 12,
      color: isDarkMode ? '#FFFFFF' : '#000000',
      textAlign: 'center',
    },
    recurrenceContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
      justifyContent: 'space-between',
    },
    recurrenceOption: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      marginRight: 8,
      marginBottom: 8,
      backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
      minWidth: 80,
      alignItems: 'center',
    },
    recurrenceOptionSelected: {
      backgroundColor: isDarkMode ? '#1A365D' : '#E3F2FD',
      borderWidth: 1,
      borderColor: '#007AFF',
    },
    recurrenceText: {
      fontSize: 14,
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    recurrenceTextSelected: {
      color: '#007AFF',
      fontWeight: '500',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    modalButton: {
      flex: 1,
      borderRadius: 8,
      padding: 14,
      alignItems: 'center',
      marginHorizontal: 5,
    },
    cancelButton: {
      backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
    },
    saveButton: {
      backgroundColor: '#007AFF',
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '500',
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    saveButtonText: {
      color: '#FFFFFF',
    },
    cancelButtonText: {
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
  });
};

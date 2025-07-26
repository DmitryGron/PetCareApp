import { StyleSheet } from 'react-native';
import { useThemeStore } from "../store/theme";

export const createStyles = () => {
  const { isDarkMode } = useThemeStore();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#000000" : "#F2F2F7",
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 20,
    },
    section: {
      backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      marginBottom: 16,
    },
    photoSection: {
      alignItems: "center",
      marginBottom: 20,
    },
    photoContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: isDarkMode ? "#2C2C2E" : "#F2F2F7",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
      overflow: "hidden",
    },
    photo: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    photoPlaceholder: {
      fontSize: 40,
    },
    photoButton: {
      backgroundColor: "#007AFF",
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
    },
    photoButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "500",
    },
    input: {
      borderWidth: 1,
      borderColor: isDarkMode ? "#38383A" : "#E5E5EA",
      backgroundColor: isDarkMode ? "#2C2C2E" : "#FFFFFF",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      marginBottom: 12,
    },
    textArea: {
      height: 80,
      textAlignVertical: "top",
    },
    label: {
      fontSize: 16,
      fontWeight: "500",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      marginBottom: 8,
    },
    typeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    typeOption: {
      width: "48%",
      backgroundColor: isDarkMode ? "#2C2C2E" : "#F2F2F7",
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      alignItems: "center",
      borderWidth: 2,
      borderColor: "transparent",
    },
    typeOptionSelected: {
      borderColor: "#007AFF",
      backgroundColor: isDarkMode ? "#1A365D" : "#E3F2FD",
    },
    typeIcon: {
      fontSize: 24,
      marginBottom: 4,
    },
    typeLabel: {
      fontSize: 12,
      color: isDarkMode ? "#FFFFFF" : "#000000",
      textAlign: "center",
    },
    saveButton: {
      backgroundColor: "#007AFF",
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      margin: 20,
    },
    saveButtonDisabled: {
      backgroundColor: "#CCCCCC",
    },
    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
};

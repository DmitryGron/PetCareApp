import { StyleSheet } from 'react-native';
import { useThemeStore } from "../store/theme";

export const createStyles = () => {
  const { isDarkMode } = useThemeStore();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#000000" : "#F2F2F7",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      marginLeft: 8,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerButton: {
      marginLeft: 16,
    },
    headerButtonText: {
      color: "#007AFF",
      fontSize: 14,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    petImageContainer: {
      alignItems: "center",
      marginVertical: 20,
    },
    petImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: isDarkMode ? "#2C2C2E" : "#E5E5EA",
      justifyContent: "center",
      alignItems: "center",
    },
    petImagePlaceholder: {
      fontSize: 60,
    },
    petName: {
      fontSize: 28,
      fontWeight: "bold",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      textAlign: "center",
      marginTop: 12,
      marginBottom: 4,
    },
    petDetailsContainer: {
      backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
      paddingVertical: 4,
    },
    detailLabel: {
      fontSize: 16,
      fontWeight: "500",
      color: isDarkMode ? "#CCCCCC" : "#666666",
    },
    detailValue: {
      fontSize: 16,
      color: isDarkMode ? "#FFFFFF" : "#000000",
      flexShrink: 1, // Allow text to wrap
      textAlign: "right",
    },
    notesSection: {
      backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    notesTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      marginBottom: 8,
    },
    notesContent: {
      fontSize: 16,
      color: isDarkMode ? "#FFFFFF" : "#000000",
      lineHeight: 22,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? "#38383A" : "#E5E5EA",
    },
    button: {
      padding: 10,
      borderRadius: 8,
    },
    buttonText: {
      color: "#007AFF",
      fontSize: 16,
      fontWeight: "500",
    },
  });
};

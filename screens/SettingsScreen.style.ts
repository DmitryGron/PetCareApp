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
    section: {
      backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
      marginBottom: 20,
      paddingTop: 20,
    },
    sectionHeader: {
      fontSize: 13,
      fontWeight: "500",
      color: isDarkMode ? "#CCCCCC" : "#666666",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      paddingHorizontal: 20,
      paddingTop: 20,
      padding: 8,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "#2C2C2E" : "#F2F2F7",
    },
    settingItemLast: {
      borderBottomWidth: 0,
    },
    settingLeft: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      color: isDarkMode ? "#FFFFFF" : "#000000",
      marginBottom: 2,
    },
    settingSubtitle: {
      fontSize: 14,
      color: isDarkMode ? "#CCCCCC" : "#666666",
    },
    settingRight: {
      alignItems: "flex-end",
    },
    settingValue: {
      fontSize: 16,
      color: "#007AFF",
    },
    input: {
      borderWidth: 1,
      borderColor: isDarkMode ? "#38383A" : "#E5E5EA",
      backgroundColor: isDarkMode ? "#2C2C2E" : "#FFFFFF",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      marginHorizontal: 20,
      marginBottom: 12,
    },
    saveButton: {
      backgroundColor: "#007AFF",
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
      marginHorizontal: 20,
      marginBottom: 20,
    },
    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "500",
    },
    dangerButton: {
      backgroundColor: "#FF3B30",
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 20,
    },
    statItem: {
      alignItems: "center",
    },
    statNumber: {
      fontSize: 24,
      fontWeight: "bold",
      color: isDarkMode ? "#FFFFFF" : "#000000",
    },
    statLabel: {
      fontSize: 12,
      color: isDarkMode ? "#CCCCCC" : "#666666",
      marginTop: 4,
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
      borderRadius: 12,
      padding: 20,
      width: "90%",
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      marginBottom: 16,
      textAlign: "center",
    },
    modalText: {
      fontSize: 14,
      color: isDarkMode ? "#CCCCCC" : "#666666",
      lineHeight: 20,
      marginBottom: 16,
    },
    modalInput: {
      borderWidth: 1,
      borderColor: isDarkMode ? "#38383A" : "#E5E5EA",
      backgroundColor: isDarkMode ? "#2C2C2E" : "#F8F8F8",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      marginBottom: 16,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    modalButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginHorizontal: 8,
    },
    cancelButton: {
      backgroundColor: isDarkMode ? "#2C2C2E" : "#F2F2F7",
    },
    confirmButton: {
      backgroundColor: "#007AFF",
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: "500",
    },
    cancelButtonText: {
      color: isDarkMode ? "#FFFFFF" : "#000000",
    },
    confirmButtonText: {
      color: "#FFFFFF",
    },
  })
};

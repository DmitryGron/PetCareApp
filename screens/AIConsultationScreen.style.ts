import { StyleSheet } from 'react-native';
import { useThemeStore } from "../store/theme";

export const createStyles = () => {
  const { isDarkMode } = useThemeStore();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#000000" : "#F2F2F7",
    },
    petSelector: {
      backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "#38383A" : "#E5E5EA",
    },
    petSelectorTitle: {
      fontSize: 14,
      fontWeight: "500",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      marginBottom: 8,
    },
    petOptions: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    petOption: {
      backgroundColor: isDarkMode ? "#2C2C2E" : "#F2F2F7",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: "transparent",
    },
    petOptionSelected: {
      backgroundColor: "#007AFF",
      borderColor: "#007AFF",
    },
    petOptionText: {
      fontSize: 12,
      color: isDarkMode ? "#FFFFFF" : "#000000",
    },
    petOptionTextSelected: {
      color: "#FFFFFF",
    },
    messagesContainer: {
      flex: 1,
      padding: 16,
    },
    messageItem: {
      marginBottom: 16,
      maxWidth: "80%",
    },
    userMessage: {
      alignSelf: "flex-end",
    },
    assistantMessage: {
      alignSelf: "flex-start",
    },
    messageBubble: {
      padding: 12,
      borderRadius: 16,
    },
    userBubble: {
      backgroundColor: "#007AFF",
    },
    assistantBubble: {
      backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
      borderWidth: 1,
      borderColor: isDarkMode ? "#38383A" : "#E5E5EA",
    },
    messageText: {
      fontSize: 16,
      lineHeight: 20,
    },
    userMessageText: {
      color: "#FFFFFF",
    },
    assistantMessageText: {
      color: isDarkMode ? "#FFFFFF" : "#000000",
    },
    messageTime: {
      fontSize: 12,
      color: isDarkMode ? "#666666" : "#999999",
      marginTop: 4,
      textAlign: "right",
    },
    quickQuestions: {
      backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? "#38383A" : "#E5E5EA",
    },
    quickQuestionsTitle: {
      fontSize: 14,
      fontWeight: "500",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      marginBottom: 8,
    },
    quickQuestionButton: {
      backgroundColor: isDarkMode ? "#2C2C2E" : "#F2F2F7",
      padding: 8,
      borderRadius: 8,
      marginBottom: 6,
    },
    quickQuestionText: {
      fontSize: 14,
      color: "#007AFF",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? "#38383A" : "#E5E5EA",
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: isDarkMode ? "#38383A" : "#E5E5EA",
      backgroundColor: isDarkMode ? "#2C2C2E" : "#F8F8F8",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: 16,
      maxHeight: 100,
    },
    sendButton: {
      backgroundColor: "#007AFF",
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      marginLeft: 8,
    },
    sendButtonDisabled: {
      backgroundColor: "#CCCCCC",
    },
    sendButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "500",
    },
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
      borderWidth: 1,
      borderColor: isDarkMode ? "#38383A" : "#E5E5EA",
      borderRadius: 16,
      padding: 12,
      marginBottom: 16,
    },
    loadingText: {
      color: isDarkMode ? "#FFFFFF" : "#000000",
      marginLeft: 8,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
    emptyIcon: {
      fontSize: 60,
      marginBottom: 20,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      marginBottom: 10,
      textAlign: "center",
    },
    emptyText: {
      fontSize: 16,
      color: isDarkMode ? "#CCCCCC" : "#666666",
      textAlign: "center",
      lineHeight: 22,
    },
  });
};

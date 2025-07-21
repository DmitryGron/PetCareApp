"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native"
import { useThemeStore } from "../store/theme"
import { usePetStore } from "../store/pets"
import { aiService, loadChatHistory, saveChatHistory, clearChatHistory } from "../lib/ai"
import type { AIConsultationScreenProps } from "../types"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  petContext?: any
}

export default function AIConsultationScreen({ navigation }: AIConsultationScreenProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)
  const flatListRef = useRef<FlatList>(null)

  const { isDarkMode } = useThemeStore()
  const { pets, loadPets } = usePetStore()

  useEffect(() => {
    initializeChat()
    loadPets()

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleClearChat} style={{ marginRight: 15 }}>
          <Text style={{ color: "#007AFF", fontSize: 14 }}>Clear</Text>
        </TouchableOpacity>
      ),
    })
  }, [])

  const initializeChat = async () => {
    try {
      await aiService.initialize()
      const history = await loadChatHistory()
      if (history.length > 0) {
        const formattedHistory = history.map((msg, index) => ({
          id: `${index}`,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
        }))
        setMessages(formattedHistory)
      } else {
        // Add welcome message
        const welcomeMessage: Message = {
          id: "0",
          role: "assistant",
          content:
            "Hello! I'm your AI pet care assistant. I can help you with questions about pet health, nutrition, behavior, and general care. What would you like to know about your pets?",
          timestamp: new Date().toISOString(),
        }
        setMessages([welcomeMessage])
      }
    } catch (error) {
      console.error("Failed to initialize chat:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputText("")
    setIsLoading(true)

    try {
      // Get pet context if a pet is selected
      const petContext = selectedPetId
        ? pets.find((p) => p.id === selectedPetId)
        : pets.length > 0
          ? { totalPets: pets.length, petTypes: pets.map((p) => p.type) }
          : null

      const response = await aiService.sendMessage(userMessage.content, petContext)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message,
        timestamp: new Date().toISOString(),
        petContext: petContext,
      }

      const finalMessages = [...newMessages, assistantMessage]
      setMessages(finalMessages)

      // Save chat history
      await saveChatHistory(
        finalMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
        })),
      )
    } catch (error) {
      console.error("AI Service Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        timestamp: new Date().toISOString(),
      }
      setMessages([...newMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    Alert.alert("Clear Chat", "Are you sure you want to clear all chat history?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await clearChatHistory()
          await initializeChat()
        },
      },
    ])
  }

  const handleQuickQuestion = (question: string) => {
    setInputText(question)
  }

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const styles = StyleSheet.create({
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
  })

  const quickQuestions = [
    "How often should I feed my dog?",
    "What are signs of illness in cats?",
    "How to train a puppy?",
    "Best diet for senior pets?",
    "When to visit the vet?",
  ]

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageItem, item.role === "user" ? styles.userMessage : styles.assistantMessage]}>
      <View style={[styles.messageBubble, item.role === "user" ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.messageText, item.role === "user" ? styles.userMessageText : styles.assistantMessageText]}>
          {item.content}
        </Text>
      </View>
      <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
    </View>
  )

  const renderLoadingIndicator = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="small" color={isDarkMode ? "#FFFFFF" : "#000000"} />
      <Text style={styles.loadingText}>Thinking...</Text>
    </View>
  )

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      {/* Pet Selector */}
      {pets.length > 0 && (
        <View style={styles.petSelector}>
          <Text style={styles.petSelectorTitle}>Ask about a specific pet:</Text>
          <View style={styles.petOptions}>
            <TouchableOpacity
              style={[styles.petOption, !selectedPetId && styles.petOptionSelected]}
              onPress={() => setSelectedPetId(null)}
            >
              <Text style={[styles.petOptionText, !selectedPetId && styles.petOptionTextSelected]}>General</Text>
            </TouchableOpacity>
            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={[styles.petOption, selectedPetId === pet.id && styles.petOptionSelected]}
                onPress={() => setSelectedPetId(pet.id)}
              >
                <Text style={[styles.petOptionText, selectedPetId === pet.id && styles.petOptionTextSelected]}>
                  {pet.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        style={styles.messagesContainer}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToBottom}
        ListFooterComponent={isLoading ? renderLoadingIndicator : null}
      />

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <View style={styles.quickQuestions}>
          <Text style={styles.quickQuestionsTitle}>Quick questions:</Text>
          {quickQuestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickQuestionButton}
              onPress={() => handleQuickQuestion(question)}
            >
              <Text style={styles.quickQuestionText}>{question}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about pet care..."
          placeholderTextColor={isDarkMode ? "#666666" : "#999999"}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  TextInput,
  Alert,
  Modal,
  Linking,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useThemeStore } from "../store/theme"
import { usePetStore } from "../store/pets"
import { useReminderStore } from "../store/reminders"
import { aiService, clearChatHistory } from "../lib/ai"
import { cancelAllNotifications, getScheduledNotifications } from "../lib/notifications"
import type { SettingsScreenProps } from "../types"

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [aiApiKey, setAiApiKey] = useState("")
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [tempApiKey, setTempApiKey] = useState("")
  const [scheduledNotifications, setScheduledNotifications] = useState(0)

  const { isDarkMode, toggleTheme } = useThemeStore()
  const { pets } = usePetStore()
  const { reminders } = useReminderStore()

  useEffect(() => {
    loadSettings()
    loadNotificationCount()
  }, [])

  const loadSettings = async () => {
    try {
      const user = await AsyncStorage.getItem("user")
      if (user) {
        const userData = JSON.parse(user)
        setUserName(userData.name || "")
        setUserEmail(userData.email || "")
      }

      const notifications = await AsyncStorage.getItem("notifications_enabled")
      setNotificationsEnabled(notifications !== "false")

      const apiKey = await AsyncStorage.getItem("ai_api_key")
      if (apiKey) {
        setAiApiKey("••••••••••••••••")
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    }
  }

  const loadNotificationCount = async () => {
    try {
      const notifications = await getScheduledNotifications()
      setScheduledNotifications(notifications.length)
    } catch (error) {
      console.error("Failed to load notification count:", error)
    }
  }

  const handleSaveProfile = async () => {
    try {
      const user = {
        id: Date.now().toString(),
        name: userName.trim(),
        email: userEmail.trim(),
        createdAt: new Date().toISOString(),
      }

      await AsyncStorage.setItem("user", JSON.stringify(user))
      Alert.alert("Success", "Profile updated successfully!")
    } catch (error) {
      Alert.alert("Error", "Failed to update profile")
      console.error("Profile update error:", error)
    }
  }

  const handleToggleNotifications = async (enabled: boolean) => {
    try {
      setNotificationsEnabled(enabled)
      await AsyncStorage.setItem("notifications_enabled", enabled.toString())

      if (!enabled) {
        await cancelAllNotifications()
        Alert.alert("Notifications Disabled", "All scheduled notifications have been cancelled.")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update notification settings")
      console.error("Notification toggle error:", error)
    }
  }

  const handleSaveApiKey = async () => {
    try {
      if (tempApiKey.trim()) {
        await aiService.setApiKey(tempApiKey.trim())
        Alert.alert("Success", "API key saved successfully!")
      } else {
        await AsyncStorage.removeItem("ai_api_key")
        setAiApiKey("")
        Alert.alert("Success", "API key removed successfully!")
      }
      setShowApiKeyModal(false)
      setTempApiKey("")
    } catch (error) {
      Alert.alert("Error", "Failed to save API key")
      console.error("API key save error:", error)
    }
  }

  const handleClearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your pets, reminders, and chat history. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All Data",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear all AsyncStorage data except theme
              const theme = await AsyncStorage.getItem("theme")
              await AsyncStorage.clear()
              if (theme) {
                await AsyncStorage.setItem("theme", theme)
              }

              // Clear chat history
              await clearChatHistory()

              // Cancel all notifications
              await cancelAllNotifications()

              Alert.alert("Success", "All data has been cleared.", [
                { text: "OK", onPress: () => navigation.navigate("Login") },
              ])
            } catch (error) {
              Alert.alert("Error", "Failed to clear data")
              console.error("Clear data error:", error)
            }
          },
        },
      ],
    )
  }

  const handleExportData = async () => {
    try {
      const exportData = {
        pets,
        reminders,
        exportDate: new Date().toISOString(),
        version: "1.0.0",
      }

      // In a real app, you'd use react-native-fs or similar to save the file
      Alert.alert(
        "Export Data",
        `Ready to export:\n• ${pets.length} pets\n• ${reminders.length} reminders\n\nThis feature will be available in a future update.`,
      )
    } catch (error) {
      Alert.alert("Error", "Failed to export data")
      console.error("Export error:", error)
    }
  }

  const handleOpenSupport = () => {
    Alert.alert("Support", "Need help with the app?", [
      { text: "Cancel", style: "cancel" },
      { text: "Email Support", onPress: () => Linking.openURL("mailto:support@petcareapp.com") },
      { text: "Visit Website", onPress: () => Linking.openURL("https://petcareapp.com/support") },
    ])
  }

  const styles = StyleSheet.create({
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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <Text style={styles.sectionHeader}>Profile</Text>
        <View style={styles.section}>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Your name"
            placeholderTextColor={isDarkMode ? "#666666" : "#999999"}
          />
          <TextInput
            style={styles.input}
            value={userEmail}
            onChangeText={setUserEmail}
            placeholder="Email (optional)"
            placeholderTextColor={isDarkMode ? "#666666" : "#999999"}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <Text style={styles.sectionHeader}>Your Stats</Text>
        <View style={styles.section}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{pets.length}</Text>
              <Text style={styles.statLabel}>Pets</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{reminders.length}</Text>
              <Text style={styles.statLabel}>Reminders</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{scheduledNotifications}</Text>
              <Text style={styles.statLabel}>Scheduled</Text>
            </View>
          </View>
        </View>

        {/* App Settings */}
        <Text style={styles.sectionHeader}>App Settings</Text>
        <View style={styles.section}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingSubtitle}>Switch between light and dark themes</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: "#E5E5EA", true: "#007AFF" }}
              thumbColor={isDarkMode ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingSubtitle}>Enable push notifications for reminders</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: "#E5E5EA", true: "#007AFF" }}
              thumbColor={notificationsEnabled ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>

          <TouchableOpacity
            style={[styles.settingItem, styles.settingItemLast]}
            onPress={() => setShowApiKeyModal(true)}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>AI Assistant</Text>
              <Text style={styles.settingSubtitle}>{aiApiKey ? "API key configured" : "Configure OpenAI API key"}</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>{aiApiKey ? "Configured" : "Setup"}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Data Management */}
        <Text style={styles.sectionHeader}>Data Management</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Export Data</Text>
              <Text style={styles.settingSubtitle}>Backup your pets and reminders</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>Export</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, styles.settingItemLast]} onPress={handleClearAllData}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingTitle, { color: "#FF3B30" }]}>Clear All Data</Text>
              <Text style={styles.settingSubtitle}>Permanently delete all app data</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Support */}
        <Text style={styles.sectionHeader}>Support</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.settingItem} onPress={handleOpenSupport}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Help & Support</Text>
              <Text style={styles.settingSubtitle}>Get help or contact support</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>Contact</Text>
            </View>
          </TouchableOpacity>

          <View style={[styles.settingItem, styles.settingItemLast]}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Version</Text>
              <Text style={styles.settingSubtitle}>PetCare App</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>1.0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* API Key Modal */}
      <Modal
        visible={showApiKeyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowApiKeyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>AI Assistant Setup</Text>
            <Text style={styles.modalText}>
              To use the AI assistant, you need an OpenAI API key. You can get one from openai.com.
              {"\n\n"}Your API key is stored securely on your device and never shared.
            </Text>

            <TextInput
              style={styles.modalInput}
              value={tempApiKey}
              onChangeText={setTempApiKey}
              placeholder="Enter your OpenAI API key"
              placeholderTextColor={isDarkMode ? "#666666" : "#999999"}
              secureTextEntry
              autoCapitalize="none"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowApiKeyModal(false)
                  setTempApiKey("")
                }}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleSaveApiKey}>
                <Text style={[styles.modalButtonText, styles.confirmButtonText]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

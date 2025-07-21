"use client"

import { useEffect, useState, useRef } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
  Platform,
} from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useReminderStore } from "../store/reminders"
import { usePetStore } from "../store/pets"
import { useThemeStore } from "../store/theme"
import PetSuggestionInput from "../components/PetSuggestionInput"
import type { RemindersScreenProps, Reminder } from "../types"
import { requestNotificationPermissions, scheduleNotification, cancelNotification } from "../lib/notifications"

const REMINDER_TYPES = [
  { value: "feeding", label: "Feeding", icon: "🍽️" },
  { value: "walking", label: "Walking", icon: "🚶" },
  { value: "watering", label: "Watering", icon: "💧" },
  { value: "vet", label: "Vet Visit", icon: "🏥" },
  { value: "grooming", label: "Grooming", icon: "✂️" },
  { value: "medication", label: "Medication", icon: "💊" },
  { value: "other", label: "Other", icon: "📝" },
]

const RECURRENCE_OPTIONS = [
  { value: undefined, label: "No Repeat" },
  { value: "daily" as "daily", label: "Daily" },
  { value: "weekly" as "weekly", label: "Weekly" },
  { value: "monthly" as "monthly", label: "Monthly" },
  { value: "yearly" as "yearly", label: "Yearly" },
]

export default function RemindersScreen({ navigation, route }: RemindersScreenProps) {
  const { reminders, loading, loadReminders, addReminder, toggleReminderComplete, removeReminder } = useReminderStore()
  const { pets, loadPets } = usePetStore()
  const { isDarkMode } = useThemeStore()

  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<"all" | "upcoming" | "completed">("upcoming")
  const [refreshing, setRefreshing] = useState(false)

  // Add reminder form state
  const [newReminder, setNewReminder] = useState({
    petId: route?.params?.petId || "",
    title: "",
    description: "",
    type: "feeding" as any,
    scheduledDate: new Date(),
    recurring: undefined as "daily" | "weekly" | "monthly" | "yearly" | undefined,
    notificationEnabled: true,
  })
  const [showDatePicker, setShowDatePicker] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      await loadReminders()
      await loadPets()
      // Request notification permissions
      await requestNotificationPermissions()
      
      // Auto-open add modal if coming from pet detail
      if (route?.params?.action === "add") {
        setShowAddModal(true)
      }
    }
    fetchData()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await loadReminders()
    setRefreshing(false)
  }

  const getFilteredReminders = () => {
    const now = new Date()
    switch (selectedFilter) {
      case "upcoming":
        return reminders.filter((r) => !r.completed && new Date(r.scheduledDate) > now)
      case "completed":
        return reminders.filter((r) => r.completed)
      default:
        return reminders
    }
  }

  const handleAddReminder = async () => {
    if (!newReminder.title.trim()) {
      Alert.alert("Error", "Please enter a title for the reminder")
      return
    }

    if (!newReminder.petId) {
      Alert.alert("Error", "Please select a pet")
      return
    }

    try {
      // Add reminder (notification scheduling is handled in the store)
      await addReminder({
        ...newReminder,
        title: newReminder.title.trim(),
        description: newReminder.description.trim() || undefined,
        scheduledDate: newReminder.scheduledDate.toISOString(),
        completed: false,
      })

      setShowAddModal(false)
      resetForm()
      Alert.alert("Success", "Reminder added successfully!")
    } catch (error) {
      console.error('Failed to add reminder:', error)
      Alert.alert("Error", "Failed to add reminder")
    }
  }

  const resetForm = () => {
    setNewReminder({
      petId: route?.params?.petId || "",
      title: "",
      description: "",
      type: "feeding",
      scheduledDate: new Date(),
      recurring: undefined,
      notificationEnabled: true,
    })
  }

  const handleToggleComplete = async (reminder: Reminder) => {
    try {
      await toggleReminderComplete(reminder.id)
    } catch (error) {
      Alert.alert("Error", "Failed to update reminder")
    }
  }

  const handleDeleteReminder = (reminder: Reminder) => {
    Alert.alert("Delete Reminder", "Are you sure you want to delete this reminder?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await removeReminder(reminder.id)
          } catch (error) {
            Alert.alert("Error", "Failed to delete reminder")
          }
        },
      },
    ])
  }

  const getPetName = (petId: string) => {
    const pet = pets.find((p) => p.id === petId)
    return pet?.name || "Unknown Pet"
  }

  const getReminderIcon = (type: string) => {
    const reminderType = REMINDER_TYPES.find((t) => t.value === type)
    return reminderType?.icon || "📝"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    if (diffDays === -1) return "Yesterday"
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`
    if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`

    return date.toLocaleDateString()
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#000000" : "#F2F2F7",
    },
    header: {
      backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
      padding: 20,
    },
    filterContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 16,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: isDarkMode ? "#2C2C2E" : "#F2F2F7",
    },
    filterButtonActive: {
      backgroundColor: "#007AFF",
    },
    filterText: {
      fontSize: 14,
      color: isDarkMode ? "#CCCCCC" : "#666666",
    },
    filterTextActive: {
      color: "#FFFFFF",
      fontWeight: "500",
    },
    addButton: {
      backgroundColor: "#007AFF",
      borderRadius: 10,
      padding: 15,
      alignItems: "center",
    },
    addButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    content: {
      flex: 1,
      padding: 20,
    },
    reminderItem: {
      backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    reminderItemCompleted: {
      opacity: 0.6,
    },
    reminderIcon: {
      fontSize: 24,
      marginRight: 16,
    },
    reminderInfo: {
      flex: 1,
    },
    reminderTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      marginBottom: 4,
    },
    reminderTitleCompleted: {
      textDecorationLine: "line-through",
    },
    reminderDetails: {
      fontSize: 14,
      color: isDarkMode ? "#CCCCCC" : "#666666",
      marginBottom: 2,
    },
    reminderDate: {
      fontSize: 12,
      color: "#007AFF",
    },
    reminderActions: {
      flexDirection: "row",
      alignItems: "center",
    },
    actionButton: {
      padding: 8,
      marginLeft: 8,
    },
    actionText: {
      fontSize: 16,
    },
    emptyContainer: {
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
      maxHeight: "80%",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      marginBottom: 20,
      textAlign: "center",
    },
    input: {
      borderWidth: 1,
      borderColor: isDarkMode ? "#38383A" : "#E5E5EA",
      backgroundColor: isDarkMode ? "#2C2C2E" : "#FFFFFF",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      marginBottom: 16,
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
    pickerContainer: {
      borderWidth: 1,
      borderColor: isDarkMode ? "#38383A" : "#E5E5EA",
      borderRadius: 8,
      marginBottom: 16,
    },
    dateButton: {
      padding: 12,
      borderWidth: 1,
      borderColor: isDarkMode ? "#38383A" : "#E5E5EA",
      borderRadius: 8,
      marginBottom: 16,
    },
    dateButtonText: {
      fontSize: 16,
      color: isDarkMode ? "#FFFFFF" : "#000000",
    },
    typeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 16,
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
      fontSize: 20,
      marginBottom: 4,
    },
    typeLabel: {
      fontSize: 12,
      color: isDarkMode ? "#FFFFFF" : "#000000",
      textAlign: "center",
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
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
    saveButton: {
      backgroundColor: "#007AFF",
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: "500",
    },
    cancelButtonText: {
      color: isDarkMode ? "#FFFFFF" : "#000000",
    },
    saveButtonText: {
      color: "#FFFFFF",
    },
    recurrenceContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 16,
      justifyContent: "space-between",
    },
    recurrenceOption: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      marginRight: 8,
      marginBottom: 8,
      backgroundColor: isDarkMode ? "#2C2C2E" : "#F2F2F7",
      minWidth: 80,
      alignItems: "center",
    },
    recurrenceOptionSelected: {
      backgroundColor: isDarkMode ? "#1A365D" : "#E3F2FD",
      borderWidth: 1,
      borderColor: "#007AFF",
    },
    recurrenceText: {
      fontSize: 14,
      color: isDarkMode ? "#FFFFFF" : "#000000",
    },
    recurrenceTextSelected: {
      color: "#007AFF",
      fontWeight: "500",
    },
  })

  const renderReminderItem = ({ item }: { item: Reminder }) => (
    <View style={[styles.reminderItem, item.completed && styles.reminderItemCompleted]}>
      <Text style={styles.reminderIcon}>{getReminderIcon(item.type)}</Text>

      <View style={styles.reminderInfo}>
        <Text style={[styles.reminderTitle, item.completed && styles.reminderTitleCompleted]}>{item.title}</Text>
        <Text style={styles.reminderDetails}>
          {getPetName(item.petId)} • {item.type}
        </Text>
        <Text style={styles.reminderDate}>
          {formatDate(item.scheduledDate)} at{" "}
          {new Date(item.scheduledDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      <View style={styles.reminderActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleToggleComplete(item)}>
          <Text style={styles.actionText}>{item.completed ? "↩️" : "✅"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteReminder(item)}>
          <Text style={styles.actionText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>⏰</Text>
      <Text style={styles.emptyTitle}>No reminders yet!</Text>
      <Text style={styles.emptyText}>
        Add reminders to keep track of feeding times, vet appointments, and other important pet care tasks.
      </Text>
    </View>
  )

  const filteredReminders = getFilteredReminders()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.filterContainer}>
          {(["upcoming", "all", "completed"] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterButton, selectedFilter === filter && styles.filterButtonActive]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addButtonText}>Add Reminder</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {filteredReminders.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={filteredReminders}
            keyExtractor={(item) => item.id}
            renderItem={renderReminderItem}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={isDarkMode ? "#FFFFFF" : "#000000"}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Add Reminder Modal */}
      <Modal visible={showAddModal} transparent animationType="slide" onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Add Reminder</Text>

              <Text style={styles.label}>Pet</Text>
              <PetSuggestionInput
                value={newReminder.petId}
                onPetSelected={(petId) => setNewReminder({ ...newReminder, petId })}
                placeholder="Select or search for a pet..."
                darkMode={isDarkMode}
                style={{ marginBottom: 16 }}
              />

              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={newReminder.title}
                onChangeText={(text) => setNewReminder({ ...newReminder, title: text })}
                placeholder="Enter reminder title"
                placeholderTextColor={isDarkMode ? "#666666" : "#999999"}
              />

              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newReminder.description}
                onChangeText={(text) => setNewReminder({ ...newReminder, description: text })}
                placeholder="Enter description..."
                placeholderTextColor={isDarkMode ? "#666666" : "#999999"}
                multiline
              />

              <Text style={styles.label}>Type</Text>
              <View style={styles.typeGrid}>
                {REMINDER_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[styles.typeOption, newReminder.type === type.value && styles.typeOptionSelected]}
                    onPress={() => setNewReminder({ ...newReminder, type: type.value as any })}
                  >
                    <Text style={styles.typeIcon}>{type.icon}</Text>
                    <Text style={styles.typeLabel}>{type.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Date & Time</Text>
              <DateTimePicker
                  value={newReminder.scheduledDate}
                  mode="datetime"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false)
                    if (selectedDate) {
                      setNewReminder({ ...newReminder, scheduledDate: selectedDate })
                    }
                  }}
                />
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateButtonText}>
                  {newReminder.scheduledDate.toLocaleDateString()} at{" "}
                  {newReminder.scheduledDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Repeat</Text>
              <View style={styles.recurrenceContainer}>
                {RECURRENCE_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value || 'none'}
                    style={[
                      styles.recurrenceOption,
                      newReminder.recurring === option.value && styles.recurrenceOptionSelected
                    ]}
                    onPress={() => setNewReminder({ ...newReminder, recurring: option.value })}
                  >
                    <Text 
                      style={[
                        styles.recurrenceText,
                        newReminder.recurring === option.value && styles.recurrenceTextSelected
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleAddReminder}>
                <Text style={[styles.modalButtonText, styles.saveButtonText]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

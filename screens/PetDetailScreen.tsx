"use client"

import React, { useEffect, useState } from "react"
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Share, Modal } from "react-native"
import DateTimePicker from '@react-native-community/datetimepicker'
import { usePetStore } from "../store/pets"
import { useReminderStore } from "../store/reminders"
import { useThemeStore } from "../store/theme"
import type { PetDetailScreenProps, Reminder } from "../types"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const REMINDER_TYPES = [
  { value: 'feeding', label: 'Feeding', icon: '🍽️' },
  { value: 'walking', label: 'Walking', icon: '🚶‍♂️' },
  { value: 'watering', label: 'Watering', icon: '💧' },
  { value: 'vet', label: 'Vet Visit', icon: '🏥' },
  { value: 'grooming', label: 'Grooming', icon: '✂️' },
  { value: 'medication', label: 'Medication', icon: '💊' },
  { value: 'other', label: 'Other', icon: '📝' },
]

const RECURRENCE_OPTIONS = [
  { value: undefined, label: 'None' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

// Define styles outside of the component for reuse
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000", // Will be dynamically set based on theme
  },
  reminderActions: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  actionButton: {
    padding: 8,
    marginHorizontal: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#1C1C1E', // Will be dynamically set based on theme
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF', // Will be dynamically set based on theme
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#FFFFFF', // Will be dynamically set based on theme
  },
  input: {
    backgroundColor: '#2C2C2E', // Will be dynamically set based on theme
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#FFFFFF', // Will be dynamically set based on theme
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: '#2C2C2E', // Will be dynamically set based on theme
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#FFFFFF', // Will be dynamically set based on theme
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  typeOption: {
    width: '30%',
    backgroundColor: '#2C2C2E', // Will be dynamically set based on theme
    borderRadius: 8,
    padding: 10,
    margin: 5,
    alignItems: 'center',
  },
  typeOptionSelected: {
    backgroundColor: '#0A84FF', // Will be dynamically set based on theme
  },
  typeIcon: {
    marginBottom: 5,
    fontSize: 20,
  },
  typeLabel: {
    fontSize: 12,
    color: '#FFFFFF', // Will be dynamically set based on theme
    textAlign: 'center',
  },
  recurrenceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  recurrenceOption: {
    backgroundColor: '#2C2C2E', // Will be dynamically set based on theme
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  recurrenceOptionSelected: {
    backgroundColor: '#0A84FF', // Will be dynamically set based on theme
  },
  recurrenceText: {
    color: '#FFFFFF', // Will be dynamically set based on theme
  },
  recurrenceTextSelected: {
    color: '#FFFFFF',
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
    margin: 5,
  },
  cancelButton: {
    backgroundColor: '#2C2C2E', // Will be dynamically set based on theme
  },
  saveButton: {
    backgroundColor: '#0A84FF', // Will be dynamically set based on theme
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButtonText: {
    color: '#FFFFFF', // Will be dynamically set based on theme
  },
  saveButtonText: {
    color: '#FFFFFF',
  },
  header: {
    backgroundColor: '#1C1C1E', // Will be dynamically set based on theme
    padding: 20,
    alignItems: "center",
  },
  petImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2C2C2E', // Will be dynamically set based on theme
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  petIcon: {
    fontSize: 40,
  },
  petName: {
    fontSize: 24,
    fontWeight: "bold",
    color: '#FFFFFF', // Will be dynamically set based on theme
    marginBottom: 8,
  },
  petType: {
    fontSize: 16,
    color: "#007AFF",
    textTransform: "capitalize",
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 14,
    color: '#CCCCCC', // Will be dynamically set based on theme
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: '#1C1C1E', // Will be dynamically set based on theme
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 16,
    color: '#CCCCCC', // Will be dynamically set based on theme
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#1C1C1E', // Will be dynamically set based on theme
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#FFFFFF', // Will be dynamically set based on theme
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E', // Will be dynamically set based on theme
  },
  infoLabel: {
    fontSize: 16,
    color: '#CCCCCC', // Will be dynamically set based on theme
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF', // Will be dynamically set based on theme
    fontWeight: "500",
  },
  notes: {
    fontSize: 14,
    color: '#CCCCCC', // Will be dynamically set based on theme
    lineHeight: 20,
    marginTop: 8,
  },
  reminderItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: '#1C1C1E', // Will be dynamically set based on theme
    borderRadius: 8,
    marginBottom: 8,
  },
  missedReminderItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: '#FFFFFF', // Will be dynamically set based on theme
  },
  reminderDate: {
    fontSize: 14,
    color: '#CCCCCC', // Will be dynamically set based on theme
    marginTop: 2,
  },
  addButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 12,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#CCCCCC', // Will be dynamically set based on theme
    textAlign: "center",
  },
});

export default function PetDetailScreen({ navigation, route }: PetDetailScreenProps) {
  const { petId } = route.params
  const { selectedPet, selectPet, removePet } = usePetStore()
  const { reminders, loadRemindersByPet, toggleReminderComplete, removeReminder, updateReminderData } = useReminderStore()
  const { isDarkMode } = useThemeStore()
  const [activeTab, setActiveTab] = useState<"info" | "reminders" | "health">("info")
  const [showModal, setShowModal] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null)
  
  // Helper component for pet selection in the modal
  const PetSuggestionInput = ({ value, placeholder, darkMode, style }: any) => {
    // In this simplified version, we're just showing the current pet
    // since we're only editing reminders from the pet detail screen
    return (
      <View style={[styles.input, style]}>
        <Text style={{ color: darkMode ? '#FFFFFF' : '#000000' }}>
          {selectedPet ? selectedPet.name : 'Current Pet'}
        </Text>
      </View>
    )
  }
  const [newReminder, setNewReminder] = useState({
    petId: petId,
    title: '',
    description: '',
    type: 'other' as 'feeding' | 'walking' | 'watering' | 'vet' | 'grooming' | 'medication' | 'other',
    scheduledDate: new Date(),
    recurring: undefined as undefined | 'daily' | 'weekly' | 'monthly' | 'yearly',
    notificationEnabled: true
  })

  useEffect(() => {
    selectPet(petId)
    loadRemindersByPet(petId)

    navigation.setOptions({
      title: selectedPet?.name || "Pet Details",
      headerRight: () => (
        <TouchableOpacity onPress={handleMoreOptions} style={{ marginRight: 15 }}>
          <Text style={{ color: "#007AFF", fontSize: 16 }}>•••</Text>
        </TouchableOpacity>
      ),
    })
  }, [petId, selectedPet?.name])

  const handleMoreOptions = () => {
    Alert.alert("Pet Options", "What would you like to do?", [
      { text: "Edit Pet", onPress: handleEditPet },
      { text: "Share Pet Info", onPress: handleSharePet },
      { text: "Delete Pet", onPress: handleDeletePet, style: "destructive" },
      { text: "Cancel", style: "cancel" },
    ])
  }

  const handleEditPet = () => {
    navigation.navigate("CreatePet", { petId, isEditing: true })
  }

  const handleSharePet = async () => {
    if (!selectedPet) return

    const shareText =
      `🐾 ${selectedPet.name}\n` +
      `Type: ${selectedPet.type}\n` +
      (selectedPet.breed ? `Breed: ${selectedPet.breed}\n` : "") +
      (selectedPet.age ? `Age: ${selectedPet.age} years old\n` : "") +
      (selectedPet.notes ? `Notes: ${selectedPet.notes}` : "")

    try {
      await Share.share({
        message: shareText,
        title: `${selectedPet.name}'s Info`,
      })
    } catch (error) {
      console.error("Share error:", error)
    }
  }

  const handleDeletePet = () => {
    Alert.alert("Delete Pet", `Are you sure you want to delete ${selectedPet?.name}? This action cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await removePet(petId)
            navigation.goBack()
          } catch (error) {
            Alert.alert("Error", "Failed to delete pet")
          }
        },
      },
    ])
  }

  const handleAddReminder = () => {
    navigation.navigate("Reminders", { petId })
  }

  const handleToggleComplete = async (reminder: any) => {
    try {
      await toggleReminderComplete(reminder.id)
      loadRemindersByPet(petId)
    } catch (error) {
      console.error('Failed to toggle reminder completion:', error)
      Alert.alert('Error', 'Failed to update reminder status')
    }
  }

  const handleDeleteReminder = (reminder: any) => {
    Alert.alert(
      'Delete Reminder',
      `Are you sure you want to delete "${reminder.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await removeReminder(reminder.id)
              loadRemindersByPet(petId)
            } catch (error) {
              console.error('Failed to delete reminder:', error)
              Alert.alert('Error', 'Failed to delete reminder')
            }
          } 
        },
      ]
    )
  }

  const handleEditReminder = (reminder: any) => {
    setSelectedReminder(reminder)
    setNewReminder({
      petId: reminder.petId,
      title: reminder.title,
      description: reminder.description || '',
      type: reminder.type,
      scheduledDate: new Date(reminder.scheduledDate),
      recurring: reminder.recurring,
      notificationEnabled: reminder.notificationEnabled,
    })
    setShowModal(true)
  }

  const handleUpdateReminder = async () => {
    if (!selectedReminder) return
    
    if (!newReminder.title.trim()) {
      Alert.alert("Error", "Please enter a title for the reminder")
      return
    }

    // Ensure recurring is the correct type
    const recurring = newReminder.recurring as undefined | 'daily' | 'weekly' | 'monthly' | 'yearly'

    try {
      await updateReminderData(selectedReminder.id, {
        petId: newReminder.petId,
        title: newReminder.title.trim(),
        description: newReminder.description?.trim(),
        type: newReminder.type,
        scheduledDate: newReminder.scheduledDate.toISOString(),
        recurring,
        notificationEnabled: newReminder.notificationEnabled,
      })

      setShowModal(false)
      setSelectedReminder(null)
      resetForm()
      loadRemindersByPet(petId)
      Alert.alert("Success", "Reminder updated successfully!")
    } catch (error) {
      console.error('Failed to update reminder:', error)
      Alert.alert("Error", "Failed to update reminder")
    }
  }

  const resetForm = () => {
    setNewReminder({
      petId: petId,
      title: '',
      description: '',
      type: 'other' as 'feeding' | 'walking' | 'watering' | 'vet' | 'grooming' | 'medication' | 'other',
      scheduledDate: new Date(),
      recurring: undefined as undefined | 'daily' | 'weekly' | 'monthly' | 'yearly',
      notificationEnabled: true
    })
  }

  const getPetIcon = (type: string): string => {
    const icons = {
      dog: 'dog',
      cat: 'cat',
      fish: 'fish',
      rodent: 'rodent',
      bird: 'bird',
      rabbit: 'rabbit',
      exotic: 'snake',
      plant: 'flower',
    };
    return icons[type as keyof typeof icons] || 'paw';
  };

  const iconColor = isDarkMode ? '#CCCCCC' : '#333333';


  const getUpcomingReminders = () => {
    return reminders.filter((r) => !r.completed && new Date(r.scheduledDate) > new Date()).slice(0, 3)
  }

  const getMissedReminders = () => {
    return reminders.filter((r) => !r.completed && new Date(r.scheduledDate) < new Date()).slice(0, 3)
  }

  const getCompletedReminders = () => {
    return reminders.filter((r) => r.completed).slice(0, 3)
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#000000" : "#F2F2F7",
    },
    reminderActions: {
      flexDirection: 'row',
      marginLeft: 'auto',
    },
    actionButton: {
      padding: 8,
      marginHorizontal: 2,
    },
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
    },
    typeOption: {
      width: '30%',
      backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
      borderRadius: 8,
      padding: 10,
      margin: 5,
      alignItems: 'center',
    },
    typeOptionSelected: {
      backgroundColor: isDarkMode ? '#0A84FF' : '#007AFF',
    },
    typeIcon: {
      fontSize: 24,
      marginBottom: 5,
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
    },
    recurrenceOption: {
      backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
      borderRadius: 8,
      padding: 10,
      marginRight: 8,
      marginBottom: 8,
    },
    recurrenceOptionSelected: {
      backgroundColor: isDarkMode ? '#0A84FF' : '#007AFF',
    },
    recurrenceText: {
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    recurrenceTextSelected: {
      color: '#FFFFFF',
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
      margin: 5,
    },
    cancelButton: {
      backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
    },
    saveButton: {
      backgroundColor: isDarkMode ? '#0A84FF' : '#007AFF',
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '500',
    },
    cancelButtonText: {
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    saveButtonText: {
      color: '#FFFFFF',
    },
    header: {
      backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
      padding: 20,
      alignItems: "center",
    },
    petImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 16,
    },
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: isDarkMode ? "#2C2C2E" : "#F2F2F7",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    petIcon: {
      fontSize: 40,
    },
    petName: {
      fontSize: 24,
      fontWeight: "bold",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      marginBottom: 8,
    },
    petType: {
      fontSize: 16,
      color: "#007AFF",
      textTransform: "capitalize",
      marginBottom: 4,
    },
    petBreed: {
      fontSize: 14,
      color: isDarkMode ? "#CCCCCC" : "#666666",
    },
    tabContainer: {
      flexDirection: "row",
      backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
      paddingHorizontal: 20,
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: "center",
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
    },
    activeTab: {
      borderBottomColor: "#007AFF",
    },
    tabText: {
      fontSize: 16,
      color: isDarkMode ? "#CCCCCC" : "#666666",
    },
    activeTabText: {
      color: "#007AFF",
      fontWeight: "500",
    },
    content: {
      flex: 1,
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
      marginBottom: 12,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "#2C2C2E" : "#F2F2F7",
    },
    infoLabel: {
      fontSize: 16,
      color: isDarkMode ? "#CCCCCC" : "#666666",
    },
    infoValue: {
      fontSize: 16,
      color: isDarkMode ? "#FFFFFF" : "#000000",
      fontWeight: "500",
    },
    notes: {
      fontSize: 14,
      color: isDarkMode ? "#CCCCCC" : "#666666",
      lineHeight: 20,
      marginTop: 8,
    },
    reminderItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
      borderRadius: 8,
      marginBottom: 8,
    },
    missedReminderItem: {
      borderLeftWidth: 4,
      borderLeftColor: '#FF3B30',
    },
    reminderInfo: {
      flex: 1,
    },
    reminderTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: isDarkMode ? "#FFFFFF" : "#000000",
    },
    reminderDate: {
      fontSize: 14,
      color: isDarkMode ? "#CCCCCC" : "#666666",
      marginTop: 2,
    },
    addButton: {
      backgroundColor: "#007AFF",
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
      marginTop: 12,
    },
    addButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "500",
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 40,
    },
    emptyIcon: {
      fontSize: 40,
      marginBottom: 12,
    },
    emptyText: {
      fontSize: 16,
      color: isDarkMode ? "#CCCCCC" : "#666666",
      textAlign: "center",
    },
  })

  if (!selectedPet) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}>Loading...</Text>
      </View>
    )
  }

  const renderInfoTab = () => (
    <View style={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Type</Text>
          <Text style={styles.infoValue}>{selectedPet.type}</Text>
        </View>

        {selectedPet.breed && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Breed</Text>
            <Text style={styles.infoValue}>{selectedPet.breed}</Text>
          </View>
        )}

        {selectedPet.age && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoValue}>{selectedPet.age} years old</Text>
          </View>
        )}

        {selectedPet.weight && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Weight</Text>
            <Text style={styles.infoValue}>{selectedPet.weight} lbs</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Added</Text>
          <Text style={styles.infoValue}>{new Date(selectedPet.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      {selectedPet.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notes}>{selectedPet.notes}</Text>
        </View>
      )}
    </View>
  )

  const renderRemindersTab = () => {
    const upcomingReminders = getUpcomingReminders()
    const missedReminders = getMissedReminders()
    const completedReminders = getCompletedReminders()

    return (
      <ScrollView style={styles.content}>
        {/* Missed Reminders Section */}
        {missedReminders.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: '#FF3B30' }]}>Missed Reminders</Text>
            {missedReminders.map((reminder) => (
              <View key={reminder.id} style={[styles.reminderItem, styles.missedReminderItem]}>
                <Icon name="alert-circle" size={24} color="#FF3B30" />
                <View style={styles.reminderInfo}>
                  <Text style={[styles.reminderTitle, { color: '#FF3B30' }]}>{reminder.title}</Text>
                  <Text style={styles.reminderDate}>
                    Due: {new Date(reminder.scheduledDate).toLocaleDateString()} at{" "}
                    {new Date(reminder.scheduledDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
                <View style={styles.reminderActions}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleToggleComplete(reminder)}>
                    <Icon name="check-circle" size={22} color="#34C759" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleEditReminder(reminder)}>
                    <Icon name="pencil" size={22} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteReminder(reminder)}>
                    <Icon name="delete" size={22} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        
        {/* Upcoming Reminders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Reminders</Text>

          {upcomingReminders.length > 0 ? (
            upcomingReminders.map((reminder) => (
              <View key={reminder.id} style={styles.reminderItem}>
                <Icon name="calendar-clock" size={24} color={isDarkMode ? "#64D2FF" : "#007AFF"} />
                <View style={styles.reminderInfo}>
                  <Text style={styles.reminderTitle}>{reminder.title}</Text>
                  <Text style={styles.reminderDate}>
                    {new Date(reminder.scheduledDate).toLocaleDateString()} at{" "}
                    {new Date(reminder.scheduledDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
                <View style={styles.reminderActions}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleToggleComplete(reminder)}>
                    <Icon name="check-circle" size={22} color="#34C759" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleEditReminder(reminder)}>
                    <Icon name="pencil" size={22} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteReminder(reminder)}>
                    <Icon name="delete" size={22} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="calendar" size={30} color={isDarkMode ? "#999999" : "#CCCCCC"} />
              <Text style={styles.emptyText}>No upcoming reminders</Text>
            </View>
          )}

          <TouchableOpacity style={styles.addButton} onPress={handleAddReminder}>
            <Text style={styles.addButtonText}>Add Reminder</Text>
          </TouchableOpacity>
        </View>
        
        {/* Completed Reminders Section */}
        {completedReminders.length > 0 && (
          <View style={[styles.section, { marginBottom: 20 }]}>
            <Text style={styles.sectionTitle}>Completed</Text>
            {completedReminders.map((reminder) => (
              <View key={reminder.id} style={styles.reminderItem}>
                <Icon name="check-circle" size={24} color={isDarkMode ? "#32D74B" : "#34C759"} />
                <View style={styles.reminderInfo}>
                  <Text style={[styles.reminderTitle, { color: isDarkMode ? "#CCCCCC" : "#8E8E93" }]}>{reminder.title}</Text>
                  <Text style={styles.reminderDate}>
                    Completed: {reminder.completedAt ? new Date(reminder.completedAt).toLocaleDateString() : "Unknown"}
                  </Text>
                </View>
                <View style={styles.reminderActions}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleToggleComplete(reminder)}>
                    <Icon name="undo" size={22} color="#FF9500" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteReminder(reminder)}>
                    <Icon name="delete" size={22} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    )
  }

  const handleNavigateToHealth = () => {
    navigation.navigate('PetHealth', { petId })
  }

  const renderHealthTab = () => (
    <View style={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Records</Text>
        
        <TouchableOpacity style={styles.addButton} onPress={handleNavigateToHealth}>
          <Text style={styles.addButtonText}>View Health Dashboard</Text>
        </TouchableOpacity>

        <View style={[styles.emptyState, { marginTop: 10 }]}>
          <Text style={styles.emptyIcon}>🏥</Text>
          <Text style={styles.emptyText}>
            Track vaccinations, medications, weight,
            and health observations
          </Text>
        </View>
      </View>
    </View>
  )
  
  // Main component return statement
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#000000" : "#F2F2F7" }]}>
      {/* Pet Header */}
      <View style={[styles.header, { backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF" }]}>
        {selectedPet.photoUri ? (
          <Image source={{ uri: selectedPet.photoUri }} style={styles.petImage} />
        ) : (
          <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? "#2C2C2E" : "#EFEFEF" }]}>
            <Icon name="paw" style={[styles.petIcon, { color: "#007AFF" }]} />
          </View>
        )}
        <Text style={[styles.petName, { color: isDarkMode ? "#FFFFFF" : "#000000" }]}>{selectedPet.name}</Text>
        <Text style={styles.petType}>{selectedPet.type}</Text>
        {selectedPet.breed && <Text style={[styles.petBreed, { color: isDarkMode ? "#CCCCCC" : "#666666" }]}>{selectedPet.breed}</Text>}
      </View>

      {/* Tabs */}
      <View style={[styles.tabContainer, { backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF" }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "info" && styles.activeTab]}
          onPress={() => setActiveTab("info")}
        >
          <Text style={[styles.tabText, activeTab === "info" && styles.activeTabText]}>Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "reminders" && styles.activeTab]}
          onPress={() => setActiveTab("reminders")}
        >
          <Text style={[styles.tabText, activeTab === "reminders" && styles.activeTabText]}>Reminders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "health" && styles.activeTab]}
          onPress={() => setActiveTab("health")}
        >
          <Text style={[styles.tabText, activeTab === "health" && styles.activeTabText]}>Health</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === "info" && renderInfoTab()}
      {activeTab === "reminders" && renderRemindersTab()}
      {activeTab === "health" && renderHealthTab()}
      
      {/* Edit Reminder Modal - Moved outside tabs for global access */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF" }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? "#FFFFFF" : "#000000" }]}>Edit Reminder</Text>

              <Text style={[styles.label, { color: isDarkMode ? "#FFFFFF" : "#000000" }]}>Pet</Text>
              <PetSuggestionInput
                value={petId}
                placeholder="Current Pet"
                darkMode={isDarkMode}
                style={{ marginBottom: 16 }}
              />

              <Text style={[styles.label, { color: isDarkMode ? "#FFFFFF" : "#000000" }]}>Title</Text>
              <TextInput
                style={[styles.input, { backgroundColor: isDarkMode ? "#2C2C2E" : "#EFEFEF", color: isDarkMode ? "#FFFFFF" : "#000000" }]}
                value={newReminder.title}
                onChangeText={(text) => setNewReminder({ ...newReminder, title: text })}
                placeholder="Enter reminder title"
                placeholderTextColor={isDarkMode ? "#666666" : "#999999"}
              />

              <Text style={[styles.label, { color: isDarkMode ? "#FFFFFF" : "#000000" }]}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: isDarkMode ? "#2C2C2E" : "#EFEFEF", color: isDarkMode ? "#FFFFFF" : "#000000" }]}
                value={newReminder.description}
                onChangeText={(text) => setNewReminder({ ...newReminder, description: text })}
                placeholder="Enter description..."
                placeholderTextColor={isDarkMode ? "#666666" : "#999999"}
                multiline
              />

              <Text style={[styles.label, { color: isDarkMode ? "#FFFFFF" : "#000000" }]}>Type</Text>
              <View style={styles.typeGrid}>
                {REMINDER_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.typeOption, 
                      { backgroundColor: isDarkMode ? "#2C2C2E" : "#EFEFEF" },
                      newReminder.type === type.value && styles.typeOptionSelected
                    ]}
                    onPress={() => setNewReminder({ ...newReminder, type: type.value as any })}
                  >
                    <Text style={styles.typeIcon}>{type.icon}</Text>
                    <Text style={[styles.typeLabel, { color: isDarkMode ? "#FFFFFF" : "#000000" }]}>{type.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: isDarkMode ? "#FFFFFF" : "#000000" }]}>Date & Time</Text>
              {showDatePicker && (
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
              )}
              <TouchableOpacity 
                style={[styles.dateButton, { backgroundColor: isDarkMode ? "#2C2C2E" : "#EFEFEF" }]} 
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[styles.dateButtonText, { color: isDarkMode ? "#FFFFFF" : "#000000" }]}>
                  {newReminder.scheduledDate.toLocaleDateString()} at{" "}
                  {newReminder.scheduledDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>

              <Text style={[styles.label, { color: isDarkMode ? "#FFFFFF" : "#000000" }]}>Repeat</Text>
              <View style={styles.recurrenceContainer}>
                {RECURRENCE_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value || 'none'}
                    style={[
                      styles.recurrenceOption,
                      { backgroundColor: isDarkMode ? "#2C2C2E" : "#EFEFEF" },
                      newReminder.recurring === option.value && styles.recurrenceOptionSelected
                    ]}
                    onPress={() => setNewReminder({ ...newReminder, recurring: option.value as undefined | 'daily' | 'weekly' | 'monthly' | 'yearly' })}
                  >
                    <Text 
                      style={[
                        styles.recurrenceText,
                        { color: isDarkMode ? "#FFFFFF" : "#000000" },
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
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: isDarkMode ? "#2C2C2E" : "#EFEFEF" }]}
                onPress={() => {
                  setShowModal(false)
                  resetForm()
                }}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText, { color: isDarkMode ? "#FFFFFF" : "#000000" }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleUpdateReminder}
              >
                <Text style={[styles.modalButtonText, styles.saveButtonText]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

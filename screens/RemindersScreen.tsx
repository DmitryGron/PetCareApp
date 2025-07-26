"use client"

import { useEffect, useState, useRef } from "react"
import {
  View,
  Text,
  FlatList,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native"
import { useReminderStore } from "../store/reminders"
import { usePetStore } from "../store/pets"
import { useThemeStore } from "../store/theme"
import ReminderModal from "../components/ReminderModal"
import ReminderItem from "../components/ReminderItem"
import FilterButton from "../components/FilterButton"
import type { RemindersScreenProps, Reminder } from "../types"
import { requestNotificationPermissions } from "../lib/notifications"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { REMINDER_TYPES, getReminderIcon } from "../utils/constants" // Import getReminderIcon from constants
import { formatDate } from "../utils/formatters"

export default function RemindersScreen({ navigation, route }: RemindersScreenProps) {
  const { reminders, loading, loadReminders, addReminder, toggleReminderComplete, removeReminder, updateReminderData } = useReminderStore()
  const { pets, loadPets } = usePetStore()
  const { isDarkMode } = useThemeStore()

  const [showModal, setShowModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<"all" | "upcoming" | "missed" | "completed">("upcoming")
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      await loadReminders()
      await loadPets()
      // Request notification permissions
      await requestNotificationPermissions()
      
      // Auto-open add modal if coming from pet detail
      if (route?.params?.action === "add") {
        setShowModal(true)
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
      case "missed":
        return reminders.filter((r) => !r.completed && new Date(r.scheduledDate) < now)
      case "completed":
        return reminders.filter((r) => r.completed)
      default:
        return reminders
    }
  }

  const closeReminderModal = () => {
    setIsEditMode(false);
    setSelectedReminder(null);
    setShowModal(false);
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
      { "text": "Delete", "style": "destructive", "onPress": async () => {
          try {
            await removeReminder(reminder.id)
          } catch (error) {
            Alert.alert("Error", "Failed to delete reminder")
          }
        }
      }
    ])
  }

  const handleSaveReminder = async (reminderData: Omit<Reminder, 'id' | 'createdAt' | 'completed' | 'completedAt'>) => {
    try {
      if (isEditMode && selectedReminder) {
        await updateReminderData(selectedReminder.id, reminderData);
        Alert.alert("Success", "Reminder updated successfully!");
      } else {
        await addReminder({...reminderData, completed: false});
        Alert.alert("Success", "Reminder added successfully!");
      }
      closeReminderModal();
    } catch (error) {
      console.error('Failed to save reminder:', error);
      Alert.alert("Error", "Failed to save reminder");
    }
  };

  const getPetName = (petId: string) => {
    const pet = pets.find((p) => p.id === petId)
    return pet?.name || "Unknown Pet"
  }

  // Removed local getReminderIcon
  // const getReminderIcon = (type: string) => {
  //   const reminderType = REMINDER_TYPES.find((t) => t.value === type);
  //   return reminderType?.icon || "📝";
  // };

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
    // Removed filter button styles
    // filterButton: {
    //   paddingHorizontal: 16,
    //   paddingVertical: 8,
    //   borderRadius: 20,
    //   backgroundColor: isDarkMode ? "#2C2C2E" : "#F2F2F7",
    // },
    // filterButtonActive: {
    //   backgroundColor: "#007AFF",
    // },
    // filterText: {
    //   fontSize: 14,
    //   color: isDarkMode ? "#CCCCCC" : "#666666",
    // },
    // filterTextActive: {
    //   color: "#FFFFFF",
    //   fontWeight: "500",
    // },
    // missedFilterButtonActive: {
    //   backgroundColor: "#FF3B30",
    // },
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
    sectionHeader: {
      backgroundColor: isDarkMode ? "#121212" : "#F2F2F7",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: isDarkMode ? "#2C2C2E" : "#E5E5EA",
    },
    sectionHeaderText: {
      fontSize: 16,
      fontWeight: "600",
      color: isDarkMode ? "#FFFFFF" : "#000000",
    },
  })

  const renderReminderItem = ({ item }: { item: Reminder }) => (
    <ReminderItem
      item={item}
      onToggleComplete={handleToggleComplete}
      onEdit={(reminder) => {
        setIsEditMode(true);
        setSelectedReminder(reminder);
        setShowModal(true);
      }}
      onDelete={handleDeleteReminder}
      getPetName={getPetName}
      formatDate={formatDate}
    />
  )

  const iconColor = isDarkMode ? '#CCCCCC' : '#333333';

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="calendar-clock" size={48} color={iconColor} />
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
          {(["upcoming", "missed", "completed", "all"] as const).map((filter) => (
            <FilterButton
              key={filter}
              label={filter.charAt(0).toUpperCase() + filter.slice(1)}
              filterValue={filter}
              onPress={setSelectedFilter}
              isActive={selectedFilter === filter}
              isDarkMode={isDarkMode}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => {
          setIsEditMode(false)
          setSelectedReminder(null)
          setShowModal(true)
        }}>
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

      {/* Reminder Modal */}
      <ReminderModal
        isVisible={showModal}
        onClose={closeReminderModal}
        onSave={handleSaveReminder}
        initialData={selectedReminder}
        petId={route?.params?.petId}
      />
    </View>
  )
}

// Removed duplicate helper function
// const getReminderIcon = (type: string) => {
//   const reminderType = REMINDER_TYPES.find((t) => t.value === type);
//   return reminderType?.icon || "📝";
// };

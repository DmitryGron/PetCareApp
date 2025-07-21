"use client"

import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Share } from "react-native"
import { usePetStore } from "../store/pets"
import { useReminderStore } from "../store/reminders"
import { useThemeStore } from "../store/theme"
import type { PetDetailScreenProps } from "../types"

export default function PetDetailScreen({ navigation, route }: PetDetailScreenProps) {
  const { petId } = route.params
  const { selectedPet, selectPet, removePet } = usePetStore()
  const { reminders, loadRemindersByPet } = useReminderStore()
  const { isDarkMode } = useThemeStore()
  const [activeTab, setActiveTab] = useState<"info" | "reminders" | "health">("info")

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
    navigation.navigate("Reminders", { petId, action: "add" })
  }

  const getPetIcon = (type: string) => {
    const icons = {
      dog: "🐕",
      cat: "🐱",
      fish: "🐠",
      rodent: "🐹",
      bird: "🐦",
      rabbit: "🐰",
      exotic: "🦎",
      plant: "🌱",
    }
    return icons[type as keyof typeof icons] || "🐾"
  }

  const getUpcomingReminders = () => {
    return reminders.filter((r) => !r.completed && new Date(r.scheduledDate) > new Date()).slice(0, 3)
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#000000" : "#F2F2F7",
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
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "#2C2C2E" : "#F2F2F7",
    },
    reminderIcon: {
      fontSize: 20,
      marginRight: 12,
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

    return (
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Reminders</Text>

          {upcomingReminders.length > 0 ? (
            upcomingReminders.map((reminder) => (
              <View key={reminder.id} style={styles.reminderItem}>
                <Text style={styles.reminderIcon}>⏰</Text>
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
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyText}>No upcoming reminders</Text>
            </View>
          )}

          <TouchableOpacity style={styles.addButton} onPress={handleAddReminder}>
            <Text style={styles.addButtonText}>Add Reminder</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderHealthTab = () => (
    <View style={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Records</Text>

        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🏥</Text>
          <Text style={styles.emptyText}>
            Health tracking coming soon!{"\n"}
            Keep track of vet visits, medications, and health metrics.
          </Text>
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {selectedPet.photoUri ? (
          <Image source={{ uri: selectedPet.photoUri }} style={styles.petImage} />
        ) : (
          <View style={styles.iconContainer}>
            <Text style={styles.petIcon}>{getPetIcon(selectedPet.type)}</Text>
          </View>
        )}

        <Text style={styles.petName}>{selectedPet.name}</Text>
        <Text style={styles.petType}>{selectedPet.type}</Text>
        {selectedPet.breed && <Text style={styles.petBreed}>{selectedPet.breed}</Text>}
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
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

      {/* Content */}
      {activeTab === "info" && renderInfoTab()}
      {activeTab === "reminders" && renderRemindersTab()}
      {activeTab === "health" && renderHealthTab()}
    </View>
  )
}

"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { usePetStore } from "../store/pets"
import { useThemeStore } from "../store/theme"
import { type CreatePetScreenProps, type PetType, PET_TYPES } from "../types" // Import PET_TYPES here

export default function CreatePetScreen({ navigation }: CreatePetScreenProps) {
  const [name, setName] = useState("")
  const [selectedType, setSelectedType] = useState<PetType>("dog")
  const [breed, setBreed] = useState("")
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  const [notes, setNotes] = useState("")
  const [photoUri, setPhotoUri] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  const { addPet } = usePetStore()
  const { isDarkMode } = useThemeStore()

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission needed", "Please grant camera roll permissions to add photos.")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri)
      }
    } catch (error) {
      console.error("Image picker error:", error)
      Alert.alert("Error", "Failed to pick image")
    }
  }

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a name for your pet")
      return
    }

    setIsLoading(true)
    try {
      await addPet({
        name: name.trim(),
        type: selectedType,
        breed: breed.trim() || undefined,
        age: age ? Number.parseInt(age) : undefined,
        weight: weight ? Number.parseFloat(weight) : undefined,
        notes: notes.trim() || undefined,
        photoUri,
      })

      Alert.alert("Success", "Pet added successfully!", [{ text: "OK", onPress: () => navigation.goBack() }])
    } catch (error) {
      console.error("Failed to add pet:", error)
      Alert.alert("Error", "Failed to add pet. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const styles = StyleSheet.create({
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
  })

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Photo Section */}
          <View style={styles.photoSection}>
            <TouchableOpacity style={styles.photoContainer} onPress={handleImagePicker}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.photo} />
              ) : (
                <Text style={styles.photoPlaceholder}>📷</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoButton} onPress={handleImagePicker}>
              <Text style={styles.photoButtonText}>{photoUri ? "Change Photo" : "Add Photo"}</Text>
            </TouchableOpacity>
          </View>

          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter pet's name"
              placeholderTextColor={isDarkMode ? "#666666" : "#999999"}
            />

            <Text style={styles.label}>Type *</Text>
            <View style={styles.typeGrid}>
              {PET_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[styles.typeOption, selectedType === type.value && styles.typeOptionSelected]}
                  onPress={() => setSelectedType(type.value)}
                >
                  <Text style={styles.typeIcon}>{type.icon}</Text>
                  <Text style={styles.typeLabel}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>

            <Text style={styles.label}>Breed</Text>
            <TextInput
              style={styles.input}
              value={breed}
              onChangeText={setBreed}
              placeholder="Enter breed (optional)"
              placeholderTextColor={isDarkMode ? "#666666" : "#999999"}
            />

            <Text style={styles.label}>Age (years)</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Enter age"
              placeholderTextColor={isDarkMode ? "#666666" : "#999999"}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Weight</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="Enter weight (optional)"
              placeholderTextColor={isDarkMode ? "#666666" : "#999999"}
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any additional notes about your pet..."
              placeholderTextColor={isDarkMode ? "#666666" : "#999999"}
              multiline
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isLoading}
      >
        <Text style={styles.saveButtonText}>{isLoading ? "Saving..." : "Save Pet"}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  )
}

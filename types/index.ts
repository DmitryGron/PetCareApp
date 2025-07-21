import type { StackScreenProps } from "@react-navigation/stack"

// Define your root stack parameter list
export type RootStackParamList = {
  Login: undefined
  PetList: undefined
  CreatePet: { petId?: string; isEditing?: boolean } | undefined // Optional params for editing existing pet
  PetDetail: { petId: string }
  Reminders: { petId?: string; action?: "add" } | undefined // Optional params for adding pet-specific reminders
  AIConsultation: undefined
  Settings: undefined
}

// Define props for each screen
export type LoginScreenProps = StackScreenProps<RootStackParamList, "Login">
export type PetListScreenProps = StackScreenProps<RootStackParamList, "PetList">
export type CreatePetScreenProps = StackScreenProps<RootStackParamList, "CreatePet">
export type PetDetailScreenProps = StackScreenProps<RootStackParamList, "PetDetail">
export type RemindersScreenProps = StackScreenProps<RootStackParamList, "Reminders">
export type AIConsultationScreenProps = StackScreenProps<RootStackParamList, "AIConsultation">
export type SettingsScreenProps = StackScreenProps<RootStackParamList, "Settings">

export type PetType = "dog" | "cat" | "fish" | "rodent" | "bird" | "rabbit" | "exotic" | "plant"

// Export PET_TYPES here
export const PET_TYPES: { value: PetType; label: string; icon: string }[] = [
  { value: "dog", label: "Dog", icon: "🐕" },
  { value: "cat", label: "Cat", icon: "🐱" },
  { value: "fish", label: "Fish", icon: "🐠" },
  { value: "bird", label: "Bird", icon: "🐦" },
  { value: "rabbit", label: "Rabbit", icon: "🐰" },
  { value: "rodent", label: "Rodent", icon: "🐹" },
  { value: "exotic", label: "Exotic Pet", icon: "🦎" },
  { value: "plant", label: "Plant", icon: "🌱" },
]

export interface Pet {
  id: string
  name: string
  type: PetType
  breed?: string
  age?: number
  weight?: number
  notes?: string
  photoUri?: string
  createdAt: string
  updatedAt: string
}

export interface Reminder {
  id: string
  petId: string
  title: string
  description?: string
  type: "feeding" | "walking" | "watering" | "vet" | "grooming" | "medication" | "other"
  scheduledDate: string
  recurring?: "daily" | "weekly" | "monthly" | "yearly"
  completed: boolean
  completedAt?: string
  notificationEnabled: boolean
  createdAt: string
}

export interface HealthLog {
  id: string
  petId: string
  date: string
  type: "weight" | "temperature" | "medication" | "vet_visit" | "symptom" | "other"
  value?: string
  notes?: string
  photoUri?: string
}

export interface User {
  id: string
  name: string
  email?: string
  createdAt: string
}

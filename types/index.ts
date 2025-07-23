import type { StackScreenProps } from "@react-navigation/stack"

// Define your root stack parameter list
export type RootStackParamList = {
  Login: undefined
  PetList: undefined
  CreatePet: { petId?: string; isEditing?: boolean } | undefined // Optional params for editing existing pet
  PetDetail: { petId: string }
  PetHealth: { petId: string } // New screen for pet health tracking
  Reminders: { petId?: string; action?: "add"; editReminder?: Reminder; isEditing?: boolean } | undefined // Optional params for adding/editing pet-specific reminders
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
  { value: "dog", label: "Dog", icon: "dog" },
  { value: "cat", label: "Cat", icon: "cat" },
  { value: "fish", label: "Fish", icon: "fish" },
  { value: "bird", label: "Bird", icon: "bird" },
  { value: "rabbit", label: "Rabbit", icon: "rabbit" },
  { value: "rodent", label: "Rodent", icon: "rodent" },
  { value: "exotic", label: "Exotic Pet", icon: "snake" },
  { value: "plant", label: "Plant", icon: "flower" },
]

export interface Pet {
  id: string
  name: string
  type: PetType
  breed?: string
  age?: number
  birthday?: string
  weight?: number
  notes?: string
  photoUri?: string
  photos?: string[]
  allergies?: string[]
  tags?: string[]
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
  type: "weight" | "temperature" | "medication" | "vet_visit" | "symptom" | "observation" | "vaccination" | "other"
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

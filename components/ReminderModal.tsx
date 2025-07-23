// components/ReminderModal.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
TextInput,
TouchableOpacity,
StyleSheet,
ScrollView,
Modal,
Platform,
Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { usePetStore } from '../store/pets';
import { useThemeStore } from '../store/theme';
import PetSuggestionInput from './PetSuggestionInput';
import type { Pet, Reminder } from '../types';
import { REMINDER_TYPES, RECURRENCE_OPTIONS } from '../utils/constants';

interface ReminderModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (reminderData: Omit<Reminder, 'id' | 'createdAt' | 'completed' | 'completedAt'>) => void;
  initialData?: Reminder | null;
  petId?: string; // Optional petId for creating reminders from pet detail screen
}

const ReminderModal: React.FC<ReminderModalProps> = ({
  isVisible,
  onClose,
  onSave,
  initialData = null,
  petId: initialPetId,
}) => {
  const { pets, loadPets } = usePetStore();
  const { isDarkMode } = useThemeStore();

  const [reminderData, setReminderData] = useState<Omit<Reminder, 'id' | 'createdAt' | 'completed' | 'completedAt'>>({
    petId: initialPetId || '',
    title: '',
    description: '',
    type: 'feeding',
    scheduledDate: new Date(),
    recurring: undefined,
    notificationEnabled: true,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadPets();
    if (initialData) {
      setReminderData({
        petId: initialData.petId,
        title: initialData.title,
        description: initialData.description || '',
        type: initialData.type,
        scheduledDate: new Date(initialData.scheduledDate),
        recurring: initialData.recurring,
        notificationEnabled: initialData.notificationEnabled,
      });
    } else {
      // Reset form when modal is opened for adding
      setReminderData({
        petId: initialPetId || '',
        title: '',
        description: '',
        type: 'feeding',
        scheduledDate: new Date(),
        recurring: undefined,
        notificationEnabled: true,
      });
    }
  }, [initialData, initialPetId]);

  const handleSave = () => {
    if (!reminderData.title.trim()) {
      Alert.alert('Error', 'Please enter a title for the reminder');
      return;
    }

    if (!reminderData.petId) {
      Alert.alert('Error', 'Please select a pet');
      return;
    }

    onSave(reminderData);
    // Form will be reset by useEffect when modal closes
  };

  const styles = StyleSheet.create({
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
      justifyContent: 'space-between',
    },
    typeOption: {
      width: '30%',
      backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
      borderRadius: 8,
      padding: 10,
      margin: 5,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    typeOptionSelected: {
      borderColor: '#007AFF',
      backgroundColor: isDarkMode ? '#1A365D' : '#E3F2FD',
    },
    typeIcon: {
      fontSize: 20,
      marginBottom: 4,
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
      justifyContent: 'space-between',
    },
    recurrenceOption: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      marginRight: 8,
      marginBottom: 8,
      backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
      minWidth: 80,
      alignItems: 'center',
    },
    recurrenceOptionSelected: {
      backgroundColor: isDarkMode ? '#1A365D' : '#E3F2FD',
      borderWidth: 1,
      borderColor: '#007AFF',
    },
    recurrenceText: {
      fontSize: 14,
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    recurrenceTextSelected: {
      color: '#007AFF',
      fontWeight: '500',
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
      marginHorizontal: 5,
    },
    cancelButton: {
      backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
    },
    saveButton: {
      backgroundColor: '#007AFF',
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '500',
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    saveButtonText: {
      color: '#FFFFFF',
    },
  });

  return (
    <Modal visible={isVisible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>{initialData ? 'Edit Reminder' : 'Add Reminder'}</Text>

            <Text style={styles.label}>Pet</Text>
            <PetSuggestionInput
              value={reminderData.petId}
              onPetSelected={(petId) => setReminderData({ ...reminderData, petId })}
              placeholder="Select or search for a pet..."
              darkMode={isDarkMode}
              style={{ marginBottom: 16 }}
            />

            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={reminderData.title}
              onChangeText={(text) => setReminderData({ ...reminderData, title: text })}
              placeholder="Enter reminder title"
              placeholderTextColor={isDarkMode ? '#666666' : '#999999'}
            />

            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={reminderData.description}
              onChangeText={(text) => setReminderData({ ...reminderData, description: text })}
              placeholder="Enter description..."
              placeholderTextColor={isDarkMode ? '#666666' : '#999999'}
              multiline
            />

            <Text style={styles.label}>Type</Text>
            <View style={styles.typeGrid}>
              {REMINDER_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeOption,
                    reminderData.type === type.value && styles.typeOptionSelected,
                  ]}
                  onPress={() => setReminderData({ ...reminderData, type: type.value as any })}
                >
                  <Text style={styles.typeIcon}>{type.icon}</Text>
                  <Text style={styles.typeLabel}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Date & Time</Text>
            {showDatePicker && (
              <DateTimePicker
                value={reminderData.scheduledDate}
                mode="datetime"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setReminderData({ ...reminderData, scheduledDate: selectedDate });
                  }
                }}
              />
            )}
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateButtonText}>
                {reminderData.scheduledDate.toLocaleDateString()} at{" "}
                {reminderData.scheduledDate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
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
                    reminderData.recurring === option.value && styles.recurrenceOptionSelected,
                  ]}
                  onPress={() => setReminderData({ ...reminderData, recurring: option.value })}
                >
                  <Text
                    style={[
                      styles.recurrenceText,
                      reminderData.recurring === option.value && styles.recurrenceTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Add notification toggle if needed */}

          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSave}>
              <Text style={[styles.modalButtonText, styles.saveButtonText]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ReminderModal;

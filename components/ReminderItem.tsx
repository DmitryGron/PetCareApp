import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { Reminder } from '../types';
import { REMINDER_TYPES } from '../utils/constants';
import { formatDate } from '../utils/formatters';

interface ReminderItemProps {
  item: Reminder;
  onToggleComplete: (reminder: Reminder) => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (reminder: Reminder) => void;
  getPetName: (petId: string) => string;
  getReminderIcon: (type: string) => string; // Now accepting as a prop
  // formatDate: (dateString: string) => string; // Using imported function
  isDarkMode: boolean;
}

const ReminderItem: React.FC<ReminderItemProps> = ({
  item,
  onToggleComplete,
  onEdit,
  onDelete,
  getPetName,
  getReminderIcon,
  // formatDate,
  isDarkMode,
}) => {

  // Removed local getReminderIcon
  // const getReminderIcon = (type: string) => {
  //   const reminderType = REMINDER_TYPES.find((t) => t.value === type);
  //   return reminderType?.icon || "📝";
  // };

  const styles = StyleSheet.create({
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
  });

  return (
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
        <TouchableOpacity style={styles.actionButton} onPress={() => onToggleComplete(item)}>
          <Icon name={item.completed ? "undo" : "check-circle"} size={22} color={item.completed ? "#FF9500" : "#34C759"} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onEdit(item)}
        >
          <Icon name="pencil" size={22} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(item)}>
          <Icon name="delete" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReminderItem;

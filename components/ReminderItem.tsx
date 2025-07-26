import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { Reminder } from '../types';
import { getReminderIcon } from '../utils/constants';
import { getReminderItemStyles } from './ReminderItem.style'; // Import styles
import { useThemeStore } from '../store/theme';

interface ReminderItemProps {
  item: Reminder;
  onToggleComplete: (reminder: Reminder) => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (reminder: Reminder) => void;
  getPetName: (petId: string) => string;
  formatDate: (dateString: string) => string;
}

const ReminderItem: React.FC<ReminderItemProps> = ({
  item,
  onToggleComplete,
  onEdit,
  onDelete,
  getPetName,
  formatDate,
}) => {
  const { isDarkMode } = useThemeStore();
  const styles = getReminderItemStyles(); // Get styles without passing isDarkMode

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

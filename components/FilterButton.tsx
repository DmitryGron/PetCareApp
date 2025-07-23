import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface FilterButtonProps {
  label: string;
  filterValue: 'all' | 'upcoming' | 'missed' | 'completed';
  onPress: (filter: 'all' | 'upcoming' | 'missed' | 'completed') => void;
  isActive: boolean;
  isDarkMode: boolean;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  filterValue,
  onPress,
  isActive,
  isDarkMode,
}) => {
  const styles = StyleSheet.create({
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: isDarkMode ? "#2C2C2E" : "#F2F2F7",
    },
    filterButtonActive: {
      backgroundColor: filterValue === 'missed' ? "#FF3B30" : "#007AFF",
    },
    filterText: {
      fontSize: 14,
      color: isDarkMode ? "#CCCCCC" : "#666666",
    },
    filterTextActive: {
      color: "#FFFFFF",
      fontWeight: "500",
    },
  });

  return (
    <TouchableOpacity
      style={[
        styles.filterButton,
        isActive && styles.filterButtonActive,
      ]}
      onPress={() => onPress(filterValue)}
    >
      <Text
        style={[
          styles.filterText,
          isActive && styles.filterTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default FilterButton;

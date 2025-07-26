import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { getFilterButtonStyles } from './FilterButton.style';

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
  const styles = getFilterButtonStyles(isDarkMode, filterValue);

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

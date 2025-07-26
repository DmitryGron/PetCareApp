import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Pet } from '../types';
import { useThemeStore } from '../store/theme';
import { getPetCardStyles } from './PetCard.style';

interface PetCardProps {
  pet: Pet;
  onPress: () => void;
}

export default function PetCard({ pet, onPress }: PetCardProps) {
  const { isDarkMode } = useThemeStore();

  const getPetIconName = (type: string): string => {
    const icons = {
      dog: 'dog',
      cat: 'cat',
      fish: 'fish',
      rodent: 'rodent',
      bird: 'bird',
      rabbit: 'rabbit',
      exotic: 'snake',
      plant: 'flower',
    };
    return icons[type as keyof typeof icons] || 'paw';
  };
  
  const iconColor = isDarkMode ? '#CCCCCC' : '#333333';

  const getAgeText = (age?: number) => {
    if (!age) return '';
    return age === 1 ? '1 year old' : `${age} years old`;
  };

  const styles = getPetCardStyles(isDarkMode);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {pet.photoUri ? (
        <Image source={{ uri: pet.photoUri }} style={styles.petImage} />
      ) : (
        <View style={styles.iconContainer}>
          <Icon name={getPetIconName(pet.type)} size={40} color={iconColor} />
        </View>
      )}
      
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{pet.name}</Text>
        {pet.breed && (
          <Text style={styles.petDetails}>{pet.breed}</Text>
        )}
        {pet.age && (
          <Text style={styles.petDetails}>{getAgeText(pet.age)}</Text>
        )}
        <Text style={styles.petType}>{pet.type}</Text>
      </View>
      
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}
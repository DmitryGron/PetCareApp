import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Pet } from '../types';
import { useThemeStore } from '../store/theme';

interface PetCardProps {
  pet: Pet;
  onPress: () => void;
}

export default function PetCard({ pet, onPress }: PetCardProps) {
  const { isDarkMode } = useThemeStore();

  const getPetIcon = (type: string) => {
    const icons = {
      dog: '🐕',
      cat: '🐱',
      fish: '🐠',
      rodent: '🐹',
      bird: '🐦',
      rabbit: '🐰',
      exotic: '🦎',
      plant: '🌱',
    };
    return icons[type as keyof typeof icons] || '🐾';
  };

  const getAgeText = (age?: number) => {
    if (!age) return '';
    return age === 1 ? '1 year old' : `${age} years old`;
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    petImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 16,
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    petIcon: {
      fontSize: 24,
    },
    petInfo: {
      flex: 1,
    },
    petName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: 4,
    },
    petDetails: {
      fontSize: 14,
      color: isDarkMode ? '#CCCCCC' : '#666666',
      marginBottom: 2,
    },
    petType: {
      fontSize: 12,
      color: '#007AFF',
      fontWeight: '500',
      textTransform: 'capitalize',
    },
    arrow: {
      fontSize: 16,
      color: isDarkMode ? '#666666' : '#CCCCCC',
    },
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {pet.photoUri ? (
        <Image source={{ uri: pet.photoUri }} style={styles.petImage} />
      ) : (
        <View style={styles.iconContainer}>
          <Text style={styles.petIcon}>{getPetIcon(pet.type)}</Text>
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
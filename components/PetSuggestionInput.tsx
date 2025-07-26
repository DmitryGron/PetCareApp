import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ViewStyle
} from 'react-native';
import { usePetStore } from '../store/pets';
import { Pet } from '../types';
import { getPetSuggestionInputStyles } from './PetSuggestionInput.style';

interface PetSuggestionInputProps {
  value: string;
  onPetSelected: (petId: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  darkMode?: boolean;
}

const PetSuggestionInput: React.FC<PetSuggestionInputProps> = ({
  value,
  onPetSelected,
  placeholder = 'Search for a pet...',
  style,
  darkMode = false
}) => {
  const { pets } = usePetStore();
  const [inputText, setInputText] = useState('');
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPetName, setSelectedPetName] = useState('');
  
  const styles = getPetSuggestionInputStyles(darkMode);

  // Initialize with selected pet name if we have a value (pet ID)
  useEffect(() => {
    if (value) {
      const selectedPet = pets.find(pet => pet.id === value);
      if (selectedPet) {
        setSelectedPetName(selectedPet.name);
      }
    } else {
      setSelectedPetName('');
    }
  }, [value, pets]);
  
  // Filter pets based on input text
  const handleTextChange = (text: string) => {
    setInputText(text);
    setShowSuggestions(true);
    
    if (text.trim() === '') {
      setFilteredPets([...pets]);
    } else {
      const filtered = pets.filter(pet => 
        pet.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPets(filtered);
    }
  };
  
  // Handle pet selection
  const handleSelectPet = (pet: Pet) => {
    setSelectedPetName(pet.name);
    setInputText('');
    setShowSuggestions(false);
    onPetSelected(pet.id);
  };
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            darkMode ? styles.inputDark : styles.inputLight,
            selectedPetName ? styles.inputWithValue : null
          ]}
          value={selectedPetName || inputText}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={darkMode ? '#666666' : '#999999'}
          onFocus={() => {
            // Don't clear selection on focus, just show suggestions
            setShowSuggestions(true);
            setFilteredPets([...pets]);
          }}
        />
        {selectedPetName && (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={() => {
              setSelectedPetName('');
              setInputText('');
              onPetSelected(''); // Clear the selected pet
            }}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {showSuggestions && (
        <View style={[
          styles.suggestionsContainer,
          darkMode ? styles.suggestionsContainerDark : styles.suggestionsContainerLight
        ]}>
          {filteredPets.length > 0 ? (
            <ScrollView 
              keyboardShouldPersistTaps="handled"
              style={styles.suggestionsList}
              nestedScrollEnabled={true}
            >
              {filteredPets.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.suggestionItem,
                    darkMode ? styles.suggestionItemDark : styles.suggestionItemLight
                  ]}
                  onPress={() => handleSelectPet(item)}
                >
                  <Text style={darkMode ? styles.suggestionTextDark : styles.suggestionTextLight}>
                    {item.name}
                  </Text>
                  <Text style={styles.petType}>
                    {item.type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={darkMode ? styles.noResultsTextDark : styles.noResultsTextLight}>
                No pets found
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default PetSuggestionInput;

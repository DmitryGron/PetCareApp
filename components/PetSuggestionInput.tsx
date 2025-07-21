import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ViewStyle
} from 'react-native';
import { usePetStore } from '../store/pets';
import { Pet } from '../types';

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

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 0,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#CCCCCC',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5EA',
    color: '#000000',
  },
  inputDark: {
    backgroundColor: '#2C2C2E',
    borderColor: '#38383A',
    color: '#FFFFFF',
  },
  inputWithValue: {
    fontWeight: '500',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 46, // height of input + border
    left: 0,
    right: 0,
    maxHeight: 200,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
    zIndex: 2,
  },
  suggestionsContainerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5EA',
  },
  suggestionsContainerDark: {
    backgroundColor: '#2C2C2E',
    borderColor: '#38383A',
  },
  suggestionsList: {
    width: '100%',
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestionItemLight: {
    borderBottomColor: '#F2F2F7',
    backgroundColor: '#FFFFFF',
  },
  suggestionItemDark: {
    borderBottomColor: '#38383A',
    backgroundColor: '#2C2C2E',
  },
  suggestionTextLight: {
    color: '#000000',
    fontSize: 16,
  },
  suggestionTextDark: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  petType: {
    fontSize: 14,
    color: '#888888',
  },
  noResultsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noResultsTextLight: {
    color: '#666666',
  },
  noResultsTextDark: {
    color: '#999999',
  },
});

export default PetSuggestionInput;

import { StyleSheet } from 'react-native';
import { ViewStyle } from 'react-native/types';

export const getPetSuggestionInputStyles = (darkMode: boolean) => {
  return StyleSheet.create({
    container: {
      position: 'relative',
      zIndex: 1,
    } as ViewStyle,
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
    } as ViewStyle,
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
    } as ViewStyle,
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
};
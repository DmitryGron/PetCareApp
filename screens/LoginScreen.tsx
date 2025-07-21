import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeStore } from '../store/theme';
import type { LoginScreenProps } from "../types"

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode, loadTheme } = useThemeStore();

  useEffect(() => {
    loadTheme();
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    try {
      const existingUser = await AsyncStorage.getItem('user');
      if (existingUser) {
        navigation.replace('PetList');
      }
    } catch (error) {
      console.error('Failed to check existing user:', error);
    }
  };

  const handleLogin = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setIsLoading(true);
    try {
      const user = {
        id: Date.now().toString(),
        name: name.trim(),
        createdAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem('user', JSON.stringify(user));
      navigation.replace('PetList');
    } catch (error) {
      Alert.alert('Error', 'Failed to save user data');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
      justifyContent: 'center',
      padding: 20,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 50,
    },
    logo: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    logoText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      textAlign: 'center',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: isDarkMode ? '#CCCCCC' : '#666666',
      textAlign: 'center',
      marginBottom: 40,
    },
    input: {
      borderWidth: 1,
      borderColor: isDarkMode ? '#38383A' : '#CCCCCC',
      backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      borderRadius: 10,
      padding: 15,
      fontSize: 16,
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#007AFF',
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      marginBottom: 20,
    },
    buttonDisabled: {
      backgroundColor: '#CCCCCC',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    skipButton: {
      alignItems: 'center',
    },
    skipText: {
      color: isDarkMode ? '#CCCCCC' : '#666666',
      fontSize: 14,
    },
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>🐾</Text>
        </View>
        <Text style={styles.title}>PetCare</Text>
        <Text style={styles.subtitle}>
          Your companion for pet care management
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor={isDarkMode ? '#666666' : '#999999'}
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Getting Started...' : 'Get Started'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={() => handleLogin()}>
        <Text style={styles.skipText}>Continue as Guest</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
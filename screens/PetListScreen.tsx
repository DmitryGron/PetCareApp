import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { usePetStore } from '../store/pets';
import { useThemeStore } from '../store/theme';
import PetCard from '../components/PetCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PetListScreenProps } from '../types';

export default function PetListScreen({ navigation }: PetListScreenProps) {
  const { pets, loadPets } = usePetStore();
  const { isDarkMode } = useThemeStore();
  const [userName, setUserName] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserData();
    loadPets();
    
    // Set up navigation header
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={{ marginRight: 15 }}
        >
          <Text style={{ color: '#007AFF', fontSize: 16 }}>Settings</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  const loadUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        setUserName(userData.name);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPets();
    setRefreshing(false);
  };

  const handlePetPress = (petId: string) => {
    navigation.navigate('PetDetail', { petId });
  };

  const handleAddPet = () => {
    navigation.navigate('CreatePet');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#F2F2F7',
    },
    header: {
      padding: 20,
      backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    },
    greeting: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 16,
      color: isDarkMode ? '#CCCCCC' : '#666666',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    addButton: {
      backgroundColor: '#007AFF',
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      marginBottom: 20,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyIcon: {
      fontSize: 60,
      marginBottom: 20,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: 10,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: isDarkMode ? '#CCCCCC' : '#666666',
      textAlign: 'center',
      lineHeight: 22,
    },
    quickActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 15,
      backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
      marginBottom: 20,
      borderRadius: 10,
    },
    quickAction: {
      alignItems: 'center',
      flex: 1,
    },
    quickActionIcon: {
      fontSize: 24,
      marginBottom: 5,
    },
    quickActionText: {
      fontSize: 12,
      color: isDarkMode ? '#CCCCCC' : '#666666',
    },
  });

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🐾</Text>
      <Text style={styles.emptyTitle}>No pets yet!</Text>
      <Text style={styles.emptyText}>
        Add your first pet to start managing their care, setting reminders, and tracking their health.
      </Text>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <TouchableOpacity 
        style={styles.quickAction}
        onPress={() => navigation.navigate('Reminders')}
      >
        <Text style={styles.quickActionIcon}>⏰</Text>
        <Text style={styles.quickActionText}>Reminders</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.quickAction}
        onPress={() => navigation.navigate('AIConsultation')}
      >
        <Text style={styles.quickActionIcon}>🤖</Text>
        <Text style={styles.quickActionText}>AI Assistant</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.quickAction}
        onPress={handleAddPet}
      >
        <Text style={styles.quickActionIcon}>➕</Text>
        <Text style={styles.quickActionText}>Add Pet</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello{userName ? `, ${userName}` : ''}! 👋
        </Text>
        <Text style={styles.subtitle}>
          {pets.length === 0 
            ? "Let's add your first pet" 
            : `You have ${pets.length} pet${pets.length !== 1 ? 's' : ''}`
          }
        </Text>
      </View>

      <View style={styles.content}>
        {renderQuickActions()}
        
        {pets.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={pets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PetCard
                pet={item}
                onPress={() => handlePetPress(item.id)}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={isDarkMode ? '#FFFFFF' : '#000000'}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
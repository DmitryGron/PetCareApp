import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator } from 'react-native';
import { useThemeStore } from './store/theme';
import { initializeDatabase } from './lib/db';
import { requestNotificationPermissions } from './lib/notifications';

// Screens
import LoginScreen from './screens/LoginScreen';
import PetListScreen from './screens/PetListScreen';
import CreatePetScreen from './screens/CreatePetScreen';
import PetDetailScreen from './screens/PetDetailScreen';
import RemindersScreen from './screens/RemindersScreen';
import AIConsultationScreen from './screens/AIConsultationScreen';
import SettingsScreen from './screens/SettingsScreen';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>()

export default function App() {
  const { isDarkMode } = useThemeStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize app
    const initApp = async () => {
      try {
        console.log('Initializing database...');
        await initializeDatabase();
        console.log('Database initialized successfully');
        await requestNotificationPermissions();
        setIsLoading(false);
      } catch (err) {
        console.error('Initialization error:', err);
        setError(`Failed to initialize app: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
      }
    };
    
    initApp();
  }, []);

  const theme = {
    dark: isDarkMode,
    colors: {
      primary: '#007AFF',
      background: isDarkMode ? '#000000' : '#FFFFFF',
      card: isDarkMode ? '#1C1C1E' : '#FFFFFF',
      text: isDarkMode ? '#FFFFFF' : '#000000',
      border: isDarkMode ? '#38383A' : '#C6C6C8',
      notification: '#FF3B30',
    },
  };

  // Show loading indicator or error message while initializing
  if (isLoading || error) {
    return (
      <View style={{ 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background
      }}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        {isLoading ? (
          <>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ marginTop: 20, color: theme.colors.text }}>Initializing database...</Text>
          </>
        ) : (
          <>
            <Text style={{ color: theme.colors.text, marginBottom: 10 }}>Error</Text>
            <Text style={{ color: 'red', textAlign: 'center', paddingHorizontal: 20 }}>{error}</Text>
          </>
        )}
      </View>
    );
  }
  
  // Only render navigation when database is initialized
  return (
    <NavigationContainer theme={theme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.card,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="PetList" 
          component={PetListScreen}
          options={{ title: 'My Pets' }}
        />
        <Stack.Screen 
          name="CreatePet" 
          component={CreatePetScreen}
          options={{ title: 'Add New Pet' }}
        />
        <Stack.Screen 
          name="PetDetail" 
          component={PetDetailScreen}
          options={{ title: 'Pet Details' }}
        />
        <Stack.Screen 
          name="Reminders" 
          component={RemindersScreen}
          options={{ title: 'Reminders' }}
        />
        <Stack.Screen 
          name="AIConsultation" 
          component={AIConsultationScreen}
          options={{ title: 'AI Pet Assistant' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
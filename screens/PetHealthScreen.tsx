import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { RootStackParamList } from '../types';
import { useHealthLogStore, HealthLogType } from '../store/healthLogs';
import { usePetStore } from '../store/pets';
import { useThemeStore } from '../store/theme';

type PetHealthScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'PetHealth'>;
  route: RouteProp<RootStackParamList, 'PetHealth'>;
};

type TabType = 'vaccinations' | 'medication' | 'weight' | 'observations';

// Theme colors based on dark/light mode
const getThemeColors = (isDark: boolean) => ({
  background: isDark ? '#000000' : '#F2F2F7',
  cardBackground: isDark ? '#1C1C1E' : '#FFFFFF',
  text: isDark ? '#FFFFFF' : '#000000',
  textSecondary: isDark ? '#CCCCCC' : '#666666',
  primary: '#007AFF',
  primaryText: '#FFFFFF',
  error: isDark ? '#FF6B6B' : '#E74C3C',
  success: isDark ? '#5EEAD4' : '#2ECC71',
  info: isDark ? '#74B9FF' : '#3498DB',
  inactive: isDark ? '#777777' : '#999999',
  border: isDark ? '#333333' : '#DDDDDD',
});

const PetHealthScreen: React.FC<PetHealthScreenProps> = ({ navigation, route }) => {
  const { petId } = route.params;
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('vaccinations');
  const { width: screenWidth } = Dimensions.get('window');

  // Store hooks
  const { isDarkMode } = useThemeStore();
  const themeColors = getThemeColors(isDarkMode);
  const { selectedPet, selectPet } = usePetStore();
  const { 
    logs, 
    loadHealthLogs, 
    getVaccinationLogs, 
    getMedicationLogs, 
    getWeightLogs, 
    getObservationLogs,
    addHealthLog,
    addVaccination,
    addMedication,
  } = useHealthLogStore();

  useEffect(() => {
    // Load pet details
    selectPet(petId);
    // Load health logs for this pet
    loadHealthLogs(petId);
  }, [petId, selectPet, loadHealthLogs]);

  const vaccinationLogs = getVaccinationLogs(petId);
  const medicationLogs = getMedicationLogs(petId);
  const weightLogs = getWeightLogs(petId);
  const observationLogs = getObservationLogs(petId);

  // Show weight chart data if available
  const renderWeightSection = () => {
    if (weightLogs.length < 1) {
      return (
        <View style={[styles.emptySection, { backgroundColor: themeColors.cardBackground }]}>
          <Icon name="scale" size={40} color={themeColors.inactive} />
          <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>No vaccinations recorded yet</Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: themeColors.primary }]}
            onPress={() => handleAddHealthLog('weight')}
          >
            <Text style={[styles.buttonText, { color: themeColors.primaryText }]}>Add Weight Record</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Calculate trend indicators
    const sortedLogs = [...weightLogs].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return (
      <View style={styles.sectionContainer}>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: themeColors.primary }]}
          onPress={() => handleAddHealthLog('weight')}
        >
          <Text style={[styles.buttonText, { color: themeColors.primaryText }]}>Add Weight Record</Text>
        </TouchableOpacity>
        
        <ScrollView style={styles.logsList}>
          {sortedLogs.map((log) => {
            // Calculate trend compared to previous entry
            const index = sortedLogs.indexOf(log);
            let trendIcon = null;
            let trendColor = themeColors.textSecondary;
            
            if (index < sortedLogs.length - 1) {
              const currentWeight = parseFloat(log.value || '0');
              const prevWeight = parseFloat(sortedLogs[index + 1].value || '0');
              
              if (currentWeight > prevWeight) {
                trendIcon = 'arrow-up';
                trendColor = themeColors.error;
              } else if (currentWeight < prevWeight) {
                trendIcon = 'arrow-down';
                trendColor = themeColors.success;
              } else {
                trendIcon = 'minus';
                trendColor = themeColors.info;
              }
            }
            
            return (
              <View key={log.id} style={styles.logItem}>
                <View style={styles.logHeader}>
                  <Text style={styles.logDate}>
                    {format(new Date(log.date), 'MMM d, yyyy')}
                  </Text>
                  {trendIcon && (
                    <Icon name={trendIcon} size={16} color={trendColor} style={styles.trendIcon} />
                  )}
                </View>
                <Text style={styles.weightValue}>{log.value} kg</Text>
                {log.notes && <Text style={styles.logNotes}>{log.notes}</Text>}
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderVaccinationSection = () => {
    if (vaccinationLogs.length < 1) {
      return (
        <View style={[styles.emptySection, { backgroundColor: themeColors.cardBackground }]}>
          <Icon name="needle" size={40} color={themeColors.inactive} />
          <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>No vaccinations recorded yet</Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: themeColors.primary }]}
            onPress={() => handleAddHealthLog('vaccination')}
          >
            <Text style={[styles.buttonText, { color: themeColors.primaryText }]}>Add Vaccination</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Vaccinations</Text>
          <TouchableOpacity 
            style={styles.addIconButton}
            onPress={() => handleAddHealthLog('vaccination')}
          >
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {vaccinationLogs.map((log, index) => (
          <View key={log.id} style={styles.logItem}>
            <View style={styles.logHeader}>
              <Text style={styles.logTitle}>{log.value}</Text>
              <Text style={styles.logDate}>
                {format(new Date(log.date), 'MMM dd, yyyy')}
              </Text>
            </View>
            {log.notes && <Text style={styles.logNotes}>{log.notes}</Text>}
          </View>
        ))}
      </View>
    );
  };

  const renderMedicationSection = () => {
    if (medicationLogs.length < 1) {
      return (
        <View style={[styles.emptySection, { backgroundColor: themeColors.cardBackground }]}>
          <Icon name="pill" size={40} color={themeColors.inactive} />
          <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>No medications recorded yet</Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: themeColors.primary }]}
            onPress={() => handleAddHealthLog('medication')}
          >
            <Text style={[styles.buttonText, { color: themeColors.primaryText }]}>Add Medication</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Medications</Text>
          <TouchableOpacity 
            style={styles.addIconButton}
            onPress={() => handleAddHealthLog('medication')}
          >
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {medicationLogs.map((log, index) => (
          <View key={log.id} style={styles.logItem}>
            <View style={styles.logHeader}>
              <Text style={styles.logTitle}>{log.value}</Text>
              <Text style={styles.logDate}>
                {format(new Date(log.date), 'MMM dd, yyyy')}
              </Text>
            </View>
            {log.notes && <Text style={styles.logNotes}>{log.notes}</Text>}
          </View>
        ))}
      </View>
    );
  };

  const renderObservationsSection = () => {
    if (observationLogs.length < 1) {
      return (
        <View style={[styles.emptySection, { backgroundColor: themeColors.cardBackground }]}>
          <Icon name="note-text" size={40} color={themeColors.inactive} />
          <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>No observations recorded yet</Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: themeColors.primary }]}
            onPress={() => handleAddHealthLog('observation')}
          >
            <Text style={[styles.buttonText, { color: themeColors.primaryText }]}>Add Observation</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Observations & Notes</Text>
          <TouchableOpacity 
            style={styles.addIconButton}
            onPress={() => handleAddHealthLog('observation')}
          >
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {observationLogs.map((log, index) => (
          <View key={log.id} style={styles.logItem}>
            <View style={styles.logHeader}>
              <Text style={styles.logTitle}>{log.value}</Text>
              <Text style={styles.logDate}>
                {format(new Date(log.date), 'MMM dd, yyyy')}
              </Text>
            </View>
            {log.notes && <Text style={styles.logNotes}>{log.notes}</Text>}
          </View>
        ))}
      </View>
    );
  };

  const handleAddHealthLog = (logType: HealthLogType) => {
    // This would typically navigate to an "Add Health Log" screen
    // For now, we'll create a simple alert to simulate adding a health log
    Alert.alert(
      `Add ${logType} Record`,
      `You'll be able to add a new ${logType} record here.`,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ]
    );
  };

  // Tabs for different health tracking sections
  const renderTabs = () => (
    <View style={[styles.tabBar, { backgroundColor: themeColors.cardBackground, borderBottomColor: themeColors.border }]}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'vaccinations' && [styles.activeTab, { backgroundColor: themeColors.primary }]]}
        onPress={() => setActiveTab('vaccinations')}
      >
        <Icon
          name="needle"
          size={22}
          color={activeTab === 'vaccinations' ? '#fff' : themeColors.textSecondary}
        />
        <Text style={[activeTab === 'vaccinations' ? styles.activeTabText : styles.tabText, { color: activeTab === 'vaccinations' ? themeColors.primaryText : themeColors.textSecondary }]}>
          Vaccines
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'medication' && [styles.activeTab, { backgroundColor: themeColors.primary }]]}
        onPress={() => setActiveTab('medication')}
      >
        <Icon
          name="pill"
          size={22}
          color={activeTab === 'medication' ? '#fff' : themeColors.textSecondary}
        />
        <Text style={[activeTab === 'medication' ? styles.activeTabText : styles.tabText, { color: activeTab === 'medication' ? themeColors.primaryText : themeColors.textSecondary }]}>
          Meds
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'weight' && [styles.activeTab, { backgroundColor: themeColors.primary }]]}
        onPress={() => setActiveTab('weight')}
      >
        <Icon
          name="scale"
          size={22}
          color={activeTab === 'weight' ? '#fff' : themeColors.textSecondary}
        />
        <Text style={[activeTab === 'weight' ? styles.activeTabText : styles.tabText, { color: activeTab === 'weight' ? themeColors.primaryText : themeColors.textSecondary }]}>
          Weight
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'observations' && [styles.activeTab, { backgroundColor: themeColors.primary }]]}
        onPress={() => setActiveTab('observations')}
      >
        <Icon
          name="note-text"
          size={22}
          color={activeTab === 'observations' ? '#fff' : themeColors.textSecondary}
        />
        <Text style={[activeTab === 'observations' ? styles.activeTabText : styles.tabText, { color: activeTab === 'observations' ? themeColors.primaryText : themeColors.textSecondary }]}>
          Notes
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Main render
  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: themeColors.cardBackground, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={themeColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>
          {selectedPet?.name}'s Health
        </Text>
      </View>

      {renderTabs()}

      <ScrollView style={[styles.content, { backgroundColor: themeColors.background }]}>
        {activeTab === 'vaccinations' && renderVaccinationSection()}
        {activeTab === 'medication' && renderMedicationSection()}
        {activeTab === 'weight' && renderWeightSection()}
        {activeTab === 'observations' && renderObservationsSection()}
      </ScrollView>
    </View>
  );
};

// ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  logsList: {
    marginTop: 10,
  },
  weightValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  trendIcon: {
    marginLeft: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderRadius: 0,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  tabText: {
    fontSize: 14,
    marginLeft: 5,
  },
  activeTabText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 5,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4a80f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  logDate: {
    fontSize: 14,
    color: '#888',
  },
  logNotes: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptySection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PetHealthScreen;

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

export default function SettingsScreen({ navigation }) {
  const { isDarkMode, setIsDarkMode, notificationsEnabled, setNotificationsEnabled } = useAppContext();

  const handleNotificationToggle = (value) => {
    setNotificationsEnabled(value);
    if (value) {
      Alert.alert('Notifications Enabled', 'You will now receive notifications from PlantGuard.');
    }
  };

  const themeStyles = {
    backgroundColor: isDarkMode ? '#121212' : '#F7F9F7',
    textColor: isDarkMode ? '#FFFFFF' : '#333333',
    cardBackground: isDarkMode ? '#1E1E1E' : '#ffffff',
    borderColor: isDarkMode ? '#333333' : '#F5F5F5',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={themeStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeStyles.textColor }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={[styles.content, { backgroundColor: themeStyles.cardBackground }]}>
        <View style={[styles.settingRow, { borderBottomColor: themeStyles.borderColor }]}>
          <Text style={[styles.settingLabel, { color: themeStyles.textColor }]}>Notifications</Text>
          <Switch value={notificationsEnabled} onValueChange={handleNotificationToggle} trackColor={{ true: '#4CAF50', false: '#ccc' }} />
        </View>
        <View style={[styles.settingRow, { borderBottomColor: themeStyles.borderColor }]}>
          <Text style={[styles.settingLabel, { color: themeStyles.textColor }]}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={setIsDarkMode} trackColor={{ true: '#4CAF50', false: '#ccc' }} />
        </View>
        <View style={[styles.settingRow, { borderBottomColor: themeStyles.borderColor }]}>
          <Text style={[styles.settingLabel, { color: themeStyles.textColor }]}>About App</Text>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#555' : '#ccc'} />
        </View>
        <View style={[styles.settingRow, { borderBottomColor: themeStyles.borderColor, borderBottomWidth: 0 }]}>
          <Text style={[styles.settingLabel, { color: themeStyles.textColor }]}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#555' : '#ccc'} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9F7' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  content: { padding: 20, backgroundColor: '#fff', borderRadius: 20, margin: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  settingLabel: { fontSize: 16, color: '#333' }
});
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

export default function ProfileScreen({ navigation }) {
  const { userProfile, isDarkMode } = useAppContext();
  
  const themeStyles = {
    backgroundColor: isDarkMode ? '#121212' : '#F7F9F7',
    textColor: isDarkMode ? '#FFFFFF' : '#333333',
    cardBackground: isDarkMode ? '#1E1E1E' : '#ffffff',
    subTextColor: isDarkMode ? '#AAAAAA' : '#888888',
    borderColor: isDarkMode ? '#333333' : '#F5F5F5',
  };

  const menuItems = [
    { id: '1', title: 'Edit Profile', icon: 'person-outline', route: 'EditProfile' },
    { id: '2', title: 'My Plants', icon: 'leaf-outline', route: 'MyPlants' },
    { id: '3', title: 'Settings', icon: 'settings-outline', route: 'Settings' },
    { id: '4', title: 'Help & Support', icon: 'help-circle-outline', route: 'HelpSupport' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { borderColor: themeStyles.cardBackground }]}>
              <Ionicons name="person" size={50} color="#fff" />
            </View>
            <TouchableOpacity style={[styles.editAvatarButton, { borderColor: themeStyles.cardBackground }]}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.name, { color: themeStyles.textColor }]}>{userProfile.name}</Text>
          <Text style={[styles.email, { color: themeStyles.subTextColor }]}>{userProfile.email}</Text>
        </View>

        {/* Stats */}
        <View style={[styles.statsContainer, { backgroundColor: themeStyles.cardBackground }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, isDarkMode && { color: '#66BB6A' }]}>12</Text>
            <Text style={[styles.statLabel, { color: themeStyles.subTextColor }]}>Plants</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: themeStyles.borderColor }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, isDarkMode && { color: '#66BB6A' }]}>34</Text>
            <Text style={[styles.statLabel, { color: themeStyles.subTextColor }]}>Scans</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: themeStyles.borderColor }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, isDarkMode && { color: '#66BB6A' }]}>3</Text>
            <Text style={[styles.statLabel, { color: themeStyles.subTextColor }]}>Saved</Text>
          </View>
        </View>

        {/* Menu Options */}
        <View style={[styles.menuContainer, { backgroundColor: themeStyles.cardBackground }]}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.menuItem, { borderBottomColor: themeStyles.borderColor }]}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, isDarkMode && { backgroundColor: '#334D35' }]}>
                  <Ionicons name={item.icon} size={22} color="#4CAF50" />
                </View>
                <Text style={[styles.menuItemText, { color: themeStyles.textColor }]}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#555' : '#ccc'} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => navigation.replace('Login')}
        >
          <Ionicons name="log-out-outline" size={22} color="#F44336" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0,
  },
  scrollContent: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 20 : 10,
    paddingBottom: 100, // accommodate bottom tab
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#A5D6A7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#888',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#EEEEEE',
    height: '100%',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { isDarkMode } = useAppContext();

  const themeStyles = {
    tabBarBackground: isDarkMode ? '#1E1E1E' : '#ffffff',
    uploadButtonBorder: isDarkMode ? '#121212' : '#F7F9F7',
    inactiveTintColor: isDarkMode ? '#666666' : '#BDBDBD',
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [styles.tabBar, { backgroundColor: themeStyles.tabBarBackground }],
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Upload') {
            iconName = focused ? 'scan-circle' : 'scan-circle-outline';
            // Custom styling for the center upload button
            return (
              <View style={[styles.uploadButton, { borderColor: themeStyles.uploadButtonBorder }, focused && styles.uploadButtonFocused]}>
                <Ionicons name={iconName} size={36} color={focused ? '#fff' : '#fff'} />
              </View>
            );
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: themeStyles.inactiveTintColor,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Upload" component={UploadScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    elevation: 4,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    height: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderTopWidth: 0,
    ...Platform.select({
      ios: {
        paddingBottom: 0,
      },
    }),
  },
  uploadButton: {
    top: -20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#81C784',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 4,
    borderColor: '#F7F9F7',
  },
  uploadButtonFocused: {
    backgroundColor: '#4CAF50',
  }
});

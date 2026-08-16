import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

export default function EditProfileScreen({ navigation }) {
  const { userProfile, setUserProfile, isDarkMode } = useAppContext();
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);

  const handleSave = () => {
    setUserProfile({ name, email });
    Alert.alert('Profile Updated', 'Your profile details have been successfully updated.');
    navigation.goBack();
  };

  const themeStyles = {
    backgroundColor: isDarkMode ? '#121212' : '#F7F9F7',
    textColor: isDarkMode ? '#FFFFFF' : '#333333',
    inputBackground: isDarkMode ? '#1E1E1E' : '#ffffff',
    subTextColor: isDarkMode ? '#AAAAAA' : '#666666',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={themeStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeStyles.textColor }]}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color="#fff" />
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: themeStyles.subTextColor }]}>Name</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]} 
            value={name} 
            onChangeText={setName}
            placeholder="Enter your name" 
            placeholderTextColor={themeStyles.subTextColor}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: themeStyles.subTextColor }]}>Email Address</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]} 
            value={email} 
            onChangeText={setEmail}
            placeholder="Enter your email" 
            keyboardType="email-address" 
            placeholderTextColor={themeStyles.subTextColor}
          />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9F7' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  content: { padding: 20 },
  avatarContainer: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#A5D6A7', justifyContent: 'center', alignItems: 'center' },
  editAvatarButton: { position: 'absolute', bottom: 0, right: '35%', backgroundColor: '#4CAF50', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 15, fontSize: 16, color: '#333', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  saveButton: { backgroundColor: '#4CAF50', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
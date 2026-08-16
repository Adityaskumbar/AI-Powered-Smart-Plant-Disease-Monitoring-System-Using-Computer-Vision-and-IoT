import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

export default function HelpSupportScreen({ navigation }) {
  const { isDarkMode } = useAppContext();
  
  const themeStyles = {
    backgroundColor: isDarkMode ? '#121212' : '#F7F9F7',
    textColor: isDarkMode ? '#FFFFFF' : '#333333',
    cardBackground: isDarkMode ? '#1E1E1E' : '#ffffff',
    subTextColor: isDarkMode ? '#AAAAAA' : '#666666',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={themeStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeStyles.textColor }]}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: themeStyles.cardBackground }]}>
          <Ionicons name="mail-outline" size={32} color="#4CAF50" style={{ marginBottom: 10 }} />
          <Text style={[styles.cardTitle, { color: themeStyles.textColor }]}>Contact Us</Text>
          <Text style={[styles.cardDesc, { color: themeStyles.subTextColor }]}>Reach out to our support team for assistance.</Text>
          <TouchableOpacity style={styles.cardButton}>
            <Text style={styles.cardButtonText}>Email Support</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.card, { backgroundColor: themeStyles.cardBackground }]}>
          <Ionicons name="document-text-outline" size={32} color="#4CAF50" style={{ marginBottom: 10 }} />
          <Text style={[styles.cardTitle, { color: themeStyles.textColor }]}>FAQs</Text>
          <Text style={[styles.cardDesc, { color: themeStyles.subTextColor }]}>Find answers to the most common questions here.</Text>
          <TouchableOpacity style={styles.cardButton}>
            <Text style={styles.cardButtonText}>Read FAQs</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9F7' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  content: { padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  cardDesc: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 16 },
  cardButton: { backgroundColor: '#4CAF50', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  cardButtonText: { color: '#fff', fontWeight: 'bold' }
});
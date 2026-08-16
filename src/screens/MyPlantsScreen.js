import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

export default function MyPlantsScreen({ navigation }) {
  const { isDarkMode } = useAppContext();
  
  const themeStyles = {
    backgroundColor: isDarkMode ? '#121212' : '#F7F9F7',
    textColor: isDarkMode ? '#FFFFFF' : '#333333',
    cardBackground: isDarkMode ? '#1E1E1E' : '#ffffff',
    subTextColor: isDarkMode ? '#AAAAAA' : '#666666',
  };

  const plants = [
    { id: '1', name: 'Monstera Deliciosa', status: 'Healthy' },
    { id: '2', name: 'Fiddle Leaf Fig', status: 'Needs Water' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={themeStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeStyles.textColor }]}>My Plants</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={themeStyles.textColor} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={plants}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={[styles.plantCard, { backgroundColor: themeStyles.cardBackground }]}>
            <View style={[styles.plantIcon, isDarkMode && { backgroundColor: '#334D35' }]}>
              <Ionicons name="leaf" size={24} color="#4CAF50" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.plantName, { color: themeStyles.textColor }]}>{item.name}</Text>
              <Text style={[styles.plantStatus, { color: themeStyles.subTextColor }]}>{item.status}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#555' : '#ccc'} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9F7' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  addButton: { padding: 5 },
  plantCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  plantIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  plantName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  plantStatus: { fontSize: 14, color: '#666' }
});
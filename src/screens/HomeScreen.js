import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, PixelRatio, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

// Responsive scaling utility
const guidelineBaseWidth = 375; // standard modern mobile width (iPhone X/11)
const scale = width / guidelineBaseWidth;
const normalize = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

export default function HomeScreen({ navigation }) {
  const { userProfile, isDarkMode } = useAppContext();
  
  const themeStyles = {
    backgroundColor: isDarkMode ? '#121212' : '#F7F9F7',
    textColor: isDarkMode ? '#FFFFFF' : '#333333',
    cardBackground: isDarkMode ? '#1E1E1E' : '#ffffff',
    subTextColor: isDarkMode ? '#AAAAAA' : '#666666',
    borderColor: isDarkMode ? '#333333' : '#F5F5F5',
    greetingColor: isDarkMode ? '#81C784' : '#1B5E20',
  };

  // Mock data for recent scans
  const recentScans = [
    { id: '1', plant: 'Monstera Deliciosa', status: 'Healthy', date: 'Today, 10:00 AM' },
    { id: '2', plant: 'Tomato Plant', status: 'Early Blight', date: 'Yesterday, 2:30 PM' },
    { id: '3', plant: 'Ficus', status: 'Healthy', date: 'Mar 15, 9:00 AM' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: themeStyles.greetingColor }]}>Hello, {userProfile.name}! 👋</Text>
            <Text style={[styles.subtitle, { color: themeStyles.subTextColor }]}>Let's check your plants today</Text>
          </View>
          <TouchableOpacity 
            style={styles.profilePicContainer}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={styles.profilePic}>
              <Ionicons name="person" size={normalize(24)} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Action Card */}
        <TouchableOpacity 
          style={styles.actionCard} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Upload')}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Scan New Plant</Text>
            <Text style={styles.actionSubtitle}>Detect diseases instantly with AI</Text>
            <View style={styles.actionButton}>
              <Ionicons name="camera" size={normalize(20)} color="#fff" />
              <Text style={styles.actionButtonText}>Open Camera</Text>
            </View>
          </View>
          <Ionicons name="leaf" size={normalize(80)} color="rgba(255,255,255,0.2)" style={styles.actionIcon} />
        </TouchableOpacity>

        {/* ESP32 Farm Monitor Card */}
        <TouchableOpacity 
          style={[styles.farmCard, { backgroundColor: isDarkMode ? '#1A332B' : '#E8F5E9' }]} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('FarmMonitor')}
        >
          <View style={styles.actionContent}>
            <Text style={[styles.farmTitle, { color: isDarkMode ? '#81C784' : '#1B5E20' }]}>Live Farm Monitor</Text>
            <Text style={[styles.farmSubtitle, { color: isDarkMode ? '#A5D6A7' : '#2E7D32' }]}>Connect to ESP32-CAM stream</Text>
            <View style={[styles.farmButton, { backgroundColor: isDarkMode ? '#2E7D32' : '#4CAF50' }]}>
              <Ionicons name="hardware-chip-outline" size={normalize(20)} color="#fff" />
              <Text style={styles.actionButtonText}>Connect ESP32</Text>
            </View>
          </View>
          <Ionicons name="videocam" size={normalize(65)} color={isDarkMode ? 'rgba(129, 199, 132, 0.2)' : 'rgba(76, 175, 80, 0.2)'} style={styles.actionIcon} />
        </TouchableOpacity>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: themeStyles.cardBackground }]}>
            <Ionicons name="analytics" size={normalize(24)} color="#4CAF50" />
            <Text style={[styles.statNumber, { color: themeStyles.textColor }]}>12</Text>
            <Text style={[styles.statLabel, { color: themeStyles.subTextColor }]}>Total Scans</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: themeStyles.cardBackground }]}>
            <Ionicons name="medkit" size={normalize(24)} color="#FF9800" />
            <Text style={[styles.statNumber, { color: themeStyles.textColor }]}>3</Text>
            <Text style={[styles.statLabel, { color: themeStyles.subTextColor }]}>Diseases Found</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>Recent Scans</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentScans.map((scan) => (
          <View key={scan.id} style={[styles.historyCard, { backgroundColor: themeStyles.cardBackground }]}>
            <View style={[styles.statusIndicator, { backgroundColor: scan.status === 'Healthy' ? '#4CAF50' : '#F44336' }]} />
            <View style={styles.historyInfo}>
              <Text style={[styles.historyPlant, { color: themeStyles.textColor }]}>{scan.plant}</Text>
              <Text style={[styles.historyDate, { color: themeStyles.subTextColor }]}>{scan.date}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: scan.status === 'Healthy' ? (isDarkMode ? '#334D35' : '#E8F5E9') : (isDarkMode ? '#4D3335' : '#FFEBEE') }]}>
              <Text style={[styles.statusText, { color: scan.status === 'Healthy' ? '#4CAF50' : '#F44336' }]}>
                {scan.status}
              </Text>
            </View>
          </View>
        ))}

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
    paddingHorizontal: '6%',
    paddingTop: height * 0.01,
    paddingBottom: height * 0.12, // Extra padding for bottom tabs
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(30),
  },
  greeting: {
    fontSize: normalize(26),
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  subtitle: {
    fontSize: normalize(16),
    color: '#666',
    marginTop: normalize(4),
  },
  profilePicContainer: {
    padding: normalize(2),
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: normalize(24),
  },
  profilePic: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(22),
    backgroundColor: '#A5D6A7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCard: {
    backgroundColor: '#4CAF50',
    borderRadius: normalize(24),
    padding: normalize(24),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    marginBottom: normalize(24),
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: normalize(8) },
    shadowOpacity: 0.3,
    shadowRadius: normalize(10),
    elevation: 8,
  },
  actionContent: {
    flex: 1,
    zIndex: 2,
  },
  actionTitle: {
    fontSize: normalize(22),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: normalize(8),
  },
  actionSubtitle: {
    fontSize: normalize(14),
    color: '#E8F5E9',
    marginBottom: normalize(16),
    opacity: 0.9,
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(16),
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: normalize(8),
    fontSize: normalize(14),
  },
  actionIcon: {
    position: 'absolute',
    right: -normalize(10),
    bottom: -normalize(15),
    zIndex: 1,
    transform: [{ rotate: '-20deg' }],
  },
  farmCard: {
    borderRadius: normalize(24),
    padding: normalize(24),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    marginBottom: normalize(24),
  },
  farmTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    marginBottom: normalize(6),
  },
  farmSubtitle: {
    fontSize: normalize(13),
    marginBottom: normalize(16),
  },
  farmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(16),
    alignSelf: 'flex-start',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(32),
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: normalize(20),
    borderRadius: normalize(20),
    marginHorizontal: '1.5%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: normalize(4) },
    shadowOpacity: 0.05,
    shadowRadius: normalize(8),
    elevation: 2,
  },
  statNumber: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: '#333',
    marginTop: normalize(8),
  },
  statLabel: {
    fontSize: normalize(13),
    color: '#888',
    marginTop: normalize(4),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  sectionTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: normalize(14),
  },
  historyCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: normalize(16),
    borderRadius: normalize(16),
    alignItems: 'center',
    marginBottom: normalize(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  statusIndicator: {
    width: normalize(12),
    height: normalize(12),
    borderRadius: normalize(6),
    marginRight: normalize(16),
  },
  historyInfo: {
    flex: 1,
  },
  historyPlant: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: normalize(4),
  },
  historyDate: {
    fontSize: normalize(13),
    color: '#888',
  },
  statusBadge: {
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    borderRadius: normalize(12),
  },
  statusText: {
    fontSize: normalize(12),
    fontWeight: 'bold',
  },
});

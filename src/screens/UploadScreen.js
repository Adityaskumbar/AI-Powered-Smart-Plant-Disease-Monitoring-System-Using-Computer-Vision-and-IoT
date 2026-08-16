import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Alert, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAppContext } from '../context/AppContext';
import { uploadImageAndDetect } from '../services/firebaseConfig';

export default function UploadScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { isDarkMode } = useAppContext();

  const themeStyles = {
    backgroundColor: isDarkMode ? '#121212' : '#F7F9F7',
    textColor: isDarkMode ? '#FFFFFF' : '#1B5E20',
    titleColor: isDarkMode ? '#81C784' : '#1B5E20',
    subTextColor: isDarkMode ? '#AAAAAA' : '#666666',
    cardBackground: isDarkMode ? '#1E1E1E' : '#ffffff',
    borderColor: isDarkMode ? '#333333' : '#A5D6A7',
    iconCircleBg: isDarkMode ? '#2E4A2E' : '#E8F5E9',
    secondaryButtonBg: isDarkMode ? '#2E4A2E' : '#E8F5E9',
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // BACKEND INTEGRATION STARTS HERE:
    try {
      const res = await uploadImageAndDetect(imageUri);
      setIsAnalyzing(false);

      if (res.success) {
        let message = `Plant: ${res.aiResult.plant_name}\nDisease: ${res.aiResult.disease} \nConfidence: ${res.aiResult.confidence}%\n\n`;
        if (res.aiResult.description) {
            message += `Description: ${res.aiResult.description}\n\n`;
        }
        if (res.aiResult.solution) {
            message += `Solutions & Treatments:\n${res.aiResult.solution}`;
        }
        Alert.alert('Analysis Complete', message);
      } else {
        Alert.alert('Failed', res.error.toString());
      }
    } catch (e) {
      setIsAnalyzing(false);
      Alert.alert('Error', 'Unable to reach backend servers.');
    }
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
      return false;
    }
    return true;
  };

  const requestLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePickImage = async () => {
    const hasPermission = await requestLibraryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Ensures only images are picked
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeStyles.titleColor }]}>Scan Plant</Text>
        <Text style={[styles.subtitle, { color: themeStyles.subTextColor }]}>Upload or take a photo of the affected plant leaf</Text>
      </View>

      <View style={styles.content}>
        {!imageUri ? (
          <>
            <View style={[styles.uploadBox, { backgroundColor: themeStyles.cardBackground, borderColor: themeStyles.borderColor }]}>
              <View style={[styles.iconCircle, { backgroundColor: themeStyles.iconCircleBg }]}>
                <Ionicons name="scan" size={48} color="#4CAF50" />
              </View>
              <Text style={[styles.uploadTitle, { color: themeStyles.textColor }]}>Tap to Upload</Text>
              <Text style={[styles.uploadSubtitle, { color: themeStyles.subTextColor }]}>Supported formats: JPEG, PNG, JPG</Text>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleTakePhoto}>
                <Ionicons name="camera" size={24} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.primaryButtonText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: themeStyles.secondaryButtonBg }]} onPress={handlePickImage}>
                <Ionicons name="image" size={24} color="#4CAF50" style={styles.buttonIcon} />
                <Text style={styles.secondaryButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.previewContainer}>
            <View style={[styles.imageWrapper, { backgroundColor: themeStyles.cardBackground }]}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setImageUri(null)}
              >
                <Ionicons name="close-circle" size={36} color="#F44336" />
              </TouchableOpacity>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="analytics" size={24} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.primaryButtonText}>Analyze Disease</Text>
                  </>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: themeStyles.secondaryButtonBg }]} onPress={() => {
                if (!isAnalyzing) setImageUri(null);
              }}>
                <Ionicons name="refresh" size={24} color="#4CAF50" style={styles.buttonIcon} />
                <Text style={styles.secondaryButtonText}>Retake Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0,
  },
  header: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 20 : 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  uploadBox: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#A5D6A7',
    borderStyle: 'dashed',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  actionContainer: {
    width: '100%',
  },
  previewContainer: {
    alignItems: 'center',
    width: '100%',
  },
  imageWrapper: {
    width: '100%',
    height: 350,
    borderRadius: 24,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    backgroundColor: '#fff',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    resizeMode: 'cover',
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#E8F5E9',
    flexDirection: 'row',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 10,
  }
});

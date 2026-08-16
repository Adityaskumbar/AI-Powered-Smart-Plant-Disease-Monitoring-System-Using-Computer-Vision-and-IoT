import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Alert, Vibration, Switch } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { Audio } from 'expo-av';
import { API_URL } from '../services/firebaseConfig';

export default function FarmMonitorScreen({ navigation }) {
  const { isDarkMode } = useAppContext();
  
  const [espIp, setEspIp] = useState('10.77.244.97'); // Updated to user's IP
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diseaseResult, setDiseaseResult] = useState(null);
  
  const [isAutoScan, setIsAutoScan] = useState(true); // Automatically enabled
  const lastAlertTime = useRef(0);
  const soundRef = useRef(null);

  const themeStyles = {
    backgroundColor: isDarkMode ? '#121212' : '#F7F9F7',
    textColor: isDarkMode ? '#FFFFFF' : '#333333',
    cardBackground: isDarkMode ? '#1E1E1E' : '#ffffff',
    subTextColor: isDarkMode ? '#AAAAAA' : '#666666',
    inputBackground: isDarkMode ? '#2C2C2C' : '#F0F0F0',
    borderColor: isDarkMode ? '#333333' : '#E0E0E0',
  };

  const handleStartStream = () => {
    if (!espIp) return;
    setIsStreaming(true);
    setDiseaseResult(null);
  };

  useEffect(() => {
    let interval;
    if (isStreaming && isAutoScan) {
      interval = setInterval(() => {
        if (!isAnalyzing) {
          captureAndAnalyzeESP32(true);
        }
      }, 4000); // Auto scan every 4 seconds
    }
    return () => clearInterval(interval);
  }, [isStreaming, isAutoScan, isAnalyzing]);

  const playAlertSound = async () => {
    try {
      if (soundRef.current) await soundRef.current.unloadAsync();
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' },
        { shouldPlay: true }
      );
      soundRef.current = sound;
    } catch (e) {
      console.log('Failed to play sound', e);
    }
  };

  // Connect to ESP32 stream and trigger Flask CNN validation
  const captureAndAnalyzeESP32 = async (isAuto = false) => {
    setIsAnalyzing(true);
    try {
      // Send the ESP32 IP to our Flask backend so IT can download the image directly.
      // This is much faster and completely bypasses React Native network/blob crashes!
      const cnnResponse = await fetch(`${API_URL}/predict_esp32`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ esp_ip: espIp }),
      });
      
      const result = await cnnResponse.json();
      
      if (result.error) {
        console.log("Analyze Error:", result.error);
        if (!isAuto) Alert.alert("Analysis Error", result.error);
      } else {
        const isHealthy = result.disease.toLowerCase().includes('healthy');
        const isNoLeaf = result.disease.toLowerCase().includes('no clear plant');
        const confidenceVal = parseFloat(result.confidence);

        // If it's Auto Scan and there is no clear leaf, just ignore it and don't update UI!
        if (isAuto && isNoLeaf) {
           return; 
        }

        setDiseaseResult({
          name: result.disease,
          plant_name: result.plant_name,
          confidence: `${result.confidence}%`,
          description: result.description || 'AI model successfully evaluated this frame.',
          solution: result.solution || 'Monitor the plant.'
        });
        
        const now = Date.now();
        // Trigger ALARM ONLY if it is a true Disease Leaf && high confidence!
        if (!isHealthy && !isNoLeaf && confidenceVal >= 75.0) {
          // Avoid spamming notifications: only alert once every 15 seconds
          if (!isAuto || now - lastAlertTime.current > 15000) {
            playAlertSound();
            Vibration.vibrate([0, 500, 200, 500]); // Vibrate twice
            Alert.alert("⚠️ Disease Detected!", 
              `Plant: ${result.plant_name}\nDisease: ${result.disease}\nConfidence: ${result.confidence}%\n\nSolution: ${result.solution}`
            );
            lastAlertTime.current = now;
          }
        } else if (!isAuto && !isNoLeaf) {
          Alert.alert("ESP32 Analysis Complete", `Healthy Plant Detected: ${result.plant_name} - Confidence: ${result.confidence}%`);
        }
      }
    } catch(err) {
      console.log('Fetch error:', err);
      if (!isAuto) Alert.alert("Camera/Network Error", "Ensure ESP32 is powered and the API is running: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={themeStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeStyles.textColor }]}>Farm Monitor</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={[styles.card, { backgroundColor: themeStyles.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>ESP32-CAM Connection</Text>
            <View style={styles.ipContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
                value={espIp}
                onChangeText={setEspIp}
                placeholder="Enter ESP32 IP Address"
                placeholderTextColor={themeStyles.subTextColor}
                keyboardType="numeric"
              />
              <TouchableOpacity 
                style={[styles.connectBtn, isStreaming && styles.connectBtnActive]} 
                onPress={() => isStreaming ? setIsStreaming(false) : handleStartStream()}
              >
                <Text style={styles.connectBtnText}>{isStreaming ? 'Stop' : 'Connect'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.streamContainer, { backgroundColor: themeStyles.cardBackground }]}>
            {isStreaming ? (
              <View style={styles.videoWrapper}>
                {/* Live MJPEG Stream from ESP32 via WebView */}
                <WebView 
                  source={{ 
                    html: `
                      <html>
                        <body style="margin:0;padding:0;background-color:#000;display:flex;justify-content:center;align-items:center;height:100vh;overflow:hidden;">
                          <img src="http://${espIp}:81/stream" style="width:100%;height:100%;object-fit:cover;" />
                        </body>
                      </html>
                    ` 
                  }}
                  style={styles.webView}
                  scrollEnabled={false}
                  scalesPageToFit={true}
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                />
                <View style={[styles.liveIndicator, { zIndex: 10 }]}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
            ) : (
              <View style={styles.noStreamWrapper}>
                <Ionicons name="videocam-off-outline" size={48} color={themeStyles.subTextColor} />
                <Text style={[styles.noStreamText, { color: themeStyles.subTextColor }]}>Camera Stream Offline</Text>
                <Text style={[styles.noStreamSubtext, { color: themeStyles.subTextColor }]}>Connect to your farm's ESP32 module.</Text>
              </View>
            )}
          </View>

          {isStreaming && (
            <View style={styles.scanControls}>
              <View style={[styles.autoScanRow, { backgroundColor: themeStyles.cardBackground }]}>
                <View>
                  <Text style={[styles.autoScanTitle, { color: themeStyles.textColor }]}>Auto-Detect Mode</Text>
                  <Text style={[styles.autoScanSubtext, { color: themeStyles.subTextColor }]}>Analyze frames every 5 seconds</Text>
                </View>
                <Switch
                  trackColor={{ false: '#767577', true: '#4CAF50' }}
                  thumbColor={isAutoScan ? '#f4f3f4' : '#f4f3f4'}
                  onValueChange={() => setIsAutoScan(!isAutoScan)}
                  value={isAutoScan}
                />
              </View>

              {!isAutoScan && (
                <TouchableOpacity style={styles.analyzeBtn} onPress={() => captureAndAnalyzeESP32(false)} disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons name="scan-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                      <Text style={styles.analyzeBtnText}>Force AI Detection</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}

          {diseaseResult && (
            <View style={[styles.resultCard, { backgroundColor: themeStyles.cardBackground }]}>
              <View style={styles.resultHeader}>
                <Ionicons name="warning" size={24} color="#F44336" />
                <Text style={styles.resultTitle}>Disease Detected</Text>
              </View>
              <Text style={[styles.diseaseName, { color: themeStyles.textColor }]}>{diseaseResult.name}</Text>
              <Text style={styles.confidence}>AI Confidence: {diseaseResult.confidence}</Text>
              <Text style={[styles.description, { color: themeStyles.subTextColor }]}>{diseaseResult.description}</Text>
              
              <Text style={[styles.suggestionsTitle, { color: themeStyles.textColor }]}>Recovery Suggestions:</Text>
              {diseaseResult.suggestions.map((sugg, index) => (
                <View key={index} style={styles.suggestionRow}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={{ marginTop: 2 }} />
                  <Text style={[styles.suggestionText, { color: themeStyles.textColor }]}>{sugg}</Text>
                </View>
              ))}
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  keyboardView: { flex: 1 },
  scrollContent: { padding: 20 },
  card: { borderRadius: 16, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  ipContainer: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, height: 48, borderRadius: 8, paddingHorizontal: 16, marginRight: 12 },
  connectBtn: { backgroundColor: '#4CAF50', height: 48, paddingHorizontal: 20, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  connectBtnActive: { backgroundColor: '#F44336' },
  connectBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  streamContainer: { borderRadius: 16, overflow: 'hidden', height: 250, marginBottom: 20, justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 },
  videoWrapper: { width: '100%', height: '100%', position: 'relative' },
  webView: { width: '100%', height: '100%', backgroundColor: 'transparent' },
  liveIndicator: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F44336', marginRight: 6 },
  liveText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  noStreamWrapper: { alignItems: 'center', justifyContent: 'center', height: '100%' },
  noStreamText: { fontSize: 16, fontWeight: 'bold', marginTop: 12 },
  noStreamSubtext: { fontSize: 14, marginTop: 8 },
  scanControls: { marginBottom: 20 },
  autoScanRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  autoScanTitle: { fontSize: 16, fontWeight: '600' },
  autoScanSubtext: { fontSize: 12, marginTop: 4 },
  analyzeBtn: { backgroundColor: '#2196F3', height: 50, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  analyzeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resultCard: { borderRadius: 16, padding: 16, marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', color: '#F44336', marginLeft: 8 },
  diseaseName: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  confidence: { fontSize: 14, color: '#4CAF50', fontWeight: 'bold', marginBottom: 12 },
  description: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  suggestionsTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  suggestionRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  suggestionText: { fontSize: 14, marginLeft: 8, flex: 1, lineHeight: 20 }
});
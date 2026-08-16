import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // Navigate to Onboarding after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>PlantGuard</Text>
        <Text style={styles.subtitle}>Protect Your Plants</Text>
      </View>
    </SafeAreaView>
  );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#e8f5e9',
  },
});

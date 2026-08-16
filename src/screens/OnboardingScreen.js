import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Scan Plant Leaves',
    description: 'Use your camera to scan leaves and detect diseases instantly.',
    color: '#81C784',
  },
  {
    id: '2',
    title: 'Get Expert Advice',
    description: 'Receive care instructions and treatments for your sick plants.',
    color: '#66BB6A',
  },
  {
    id: '3',
    title: 'Track Health Recovery',
    description: 'Keep a history of your plants to ensure they stay healthy.',
    color: '#4CAF50',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const currentItem = ONBOARDING_DATA[currentIndex];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentItem.color }]}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.title}>{currentItem.title}</Text>
        <Text style={styles.description}>{currentItem.description}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentIndex === index ? styles.activeIndicator : null,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: 20,
    marginTop: 10,
  },
  skipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  footer: {
    padding: 30,
    paddingBottom: 50,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#fff',
    width: 25,
  },
  nextButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

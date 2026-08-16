import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { loginUser, registerUser } from '../services/firebaseConfig'; // Real backend

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { isDarkMode, setUserProfile } = useAppContext();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const cleanEmail = email.trim(); // Trim spaces that mobile keyboards add
      const nameFromEmail = cleanEmail.split('@')[0];
      const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      
      if (isRegistering) {
        console.log("Registering...", cleanEmail);
        await registerUser(cleanEmail, password, nameFromEmail);
      } else {
        console.log("Logging in...", cleanEmail);
        await loginUser(cleanEmail, password);
      }
      
      setUserProfile({
        name: formattedName,
        email: cleanEmail
      });

      setLoading(false);
      navigation.replace('MainTabs');
    } catch (error) {
      console.log("Auth Error!", error);
      setLoading(false);
      Alert.alert('Authentication Failed', error.message || 'Verification failed. Try again.');
    }
  };

  const themeStyles = {
    backgroundColor: isDarkMode ? '#121212' : '#ffffff',
    textColor: isDarkMode ? '#FFFFFF' : '#333333',
    subtitleColor: isDarkMode ? '#AAAAAA' : '#666666',
    inputBackground: isDarkMode ? '#1E1E1E' : '#F5F5F5',
    inputBorder: isDarkMode ? '#333333' : '#E0E0E0',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={[styles.subtitle, { color: themeStyles.subtitleColor }]}>Sign in to protect your plants</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: themeStyles.textColor }]}>Email Address</Text>
            <TextInput
              style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor, borderColor: themeStyles.inputBorder }]}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={themeStyles.subtitleColor}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: themeStyles.textColor }]}>Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor, borderColor: themeStyles.inputBorder }]}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={themeStyles.subtitleColor}
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleAuth} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>{isRegistering ? 'Sign Up' : 'Sign In'}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={[styles.noAccountText, { color: themeStyles.subtitleColor }]}>{isRegistering ? 'Already have an account?' : "Don't have an account?"}</Text>
            <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
              <Text style={styles.signupText}>{isRegistering ? ' Sign In' : ' Sign Up'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  noAccountText: {
    color: '#666',
    fontSize: 15,
  },
  signupText: {
    color: '#4CAF50',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
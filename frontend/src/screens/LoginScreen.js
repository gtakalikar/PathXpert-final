import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ToastAndroid,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const loadSavedCredentials = async () => {
      const savedEmail = await AsyncStorage.getItem('savedEmail');
      const savedPassword = await AsyncStorage.getItem('savedPassword');
      const savedRememberMe = await AsyncStorage.getItem('rememberMe');

      if (savedRememberMe === 'true') {
        setEmail(savedEmail || '');
        setPassword(savedPassword || '');
        setRememberMe(true);
      }
    };
    loadSavedCredentials();
  }, []);

  const showToast = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Info', msg);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Info', 'Please fill out both fields!');
      return;
    }

    try {
      const response = await fetch('http://192.168.31.167:8003/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login Response:', data);

      if (response.ok && data.token) {
        const { token, refreshToken, userData } = data;

        await AsyncStorage.setItem('accessToken', token);
        if (refreshToken) await AsyncStorage.setItem('refreshToken', refreshToken);
        if (userData) {
          await AsyncStorage.setItem('userDetails', JSON.stringify(userData));
          if (userData.id) await AsyncStorage.setItem('userId', userData.id);
        }

        if (rememberMe) {
          await AsyncStorage.setItem('savedEmail', email);
          await AsyncStorage.setItem('savedPassword', password);
          await AsyncStorage.setItem('rememberMe', 'true');
        } else {
          await AsyncStorage.removeItem('savedEmail');
          await AsyncStorage.removeItem('savedPassword');
          await AsyncStorage.setItem('rememberMe', 'false');
        }

        showToast('Login successful 💙');
        navigation.replace('MainTabs');
      } else {
        Alert.alert('Login Failed ❌', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login Error:', error.message);
      Alert.alert('Error', 'Something went wrong. Try again later.');
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      Alert.alert('Missing Email', 'Please enter your email first!');
      return;
    }

    navigation.navigate('Authentication', {
      email,
      purpose: 'reset-password',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.logo}>PathXpert</Text>
      <Text style={styles.title}>Login to your account</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
        <Text style={styles.rememberMeText}>
          {rememberMe ? '☑' : '☐'} Remember Me
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.redirectText}>
          Don’t have an account? <Text style={styles.linkText}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FE',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3A7AFE',
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  forgotText: {
    textAlign: 'right',
    color: '#3A7AFE',
    fontWeight: '500',
    marginBottom: 20,
  },
  rememberMeText: {
    color: '#333',
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#3A7AFE',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  redirectText: {
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#3A7AFE',
    fontWeight: 'bold',
  },
});

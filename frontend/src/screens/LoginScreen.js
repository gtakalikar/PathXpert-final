import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Please fill out both fields!');
      return;
    }

    console.log('Sending:', { email, password });

    try {
      const response = await fetch('http://192.168.31.167:8003/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      console.log(' Raw Login Response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error(' Could not parse JSON:', e);
        Alert.alert('Unexpected Response', text);
        return;
      }

      if (response.ok && data.success) {
        // Store token and maybe user ID
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));

        console.log('Token saved:', data.token);
        Alert.alert('Login Success ', `Welcome, ${data.user.name || 'User'}!`);
        navigation.replace('MainTabs');
      } else {
        Alert.alert('Login Failed ', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', 'Something went wrong. Try again later.');
    }
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

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
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

// 🔮 Styles remain unchanged
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

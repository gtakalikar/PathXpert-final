import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!firstName || !lastName || !username || !email || !password) {
      Alert.alert('Missing Info', 'Please fill out all fields!');
      return;
    }

    try {
      const response = await fetch('http://192.168.31.167:8003/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, username, email, password }),
      });

      const text = await response.text();
      console.log('🧾 Raw Register Response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error(' JSON Parse Error:', e);
        Alert.alert('Oops!', 'Invalid response format');
        return;
      }

      console.log('✅ Parsed data:', data);
      console.log('🛡️ Token:', data.token);

      if (response.ok) {
        if (data.token) {
          await AsyncStorage.setItem('token', data.token);
          Alert.alert(' Registered', `Welcome ${data.user.username || 'User'}!`);
          navigation.replace('MainTabs');
        } else {
          console.warn('Token is missing in response');
          Alert.alert('Warning', 'No token received. Try logging in instead.');
        }
      } else {
        Alert.alert('Register Failed', data.message || 'Try again');
      }
    } catch (error) {
      console.error('Register Error:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>PathXpert</Text>

      <TextInput
        placeholder="First Name"
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        placeholder="Last Name"
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
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

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.redirectText}>
          Already have an account? <Text style={styles.linkText}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3A7AFE',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3A7AFE',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  redirectText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#555',
  },
  linkText: {
    color: '#3A7AFE',
    fontWeight: 'bold',
  },
});

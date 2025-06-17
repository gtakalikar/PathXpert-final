import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleSendOtp = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !phone.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all the fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!phoneRegex.test(phone)) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      const response = await fetch('http://192.168.31.167:8003/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'registration' }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert('OTP Sent', 'Check your email for the OTP.');
        navigation.navigate('OtpVerification', {
          email,
          purpose: 'registration',
          name,
          password,
          phone,
        });
      } else {
        Alert.alert('Failed', data.message || 'Could not send OTP.');
      }
    } catch (err) {
      console.error('OTP Error:', err);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <View style={styles.inner}>
        <Text style={styles.logo}>PathXpert</Text>
        <Text style={styles.title}>Create your account</Text>

        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={20} color="#3A7AFE" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} color="#3A7AFE" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#888"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#3A7AFE" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="call-outline" size={20} color="#3A7AFE" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={10}
          />
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleSendOtp}>
          <Text style={styles.registerText}>Send OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.redirectText}>
            Already have an account? <Text style={{ color: '#3A7AFE' }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FE',
    justifyContent: 'center',
  },
  inner: {
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 16,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  registerButton: {
    backgroundColor: '#3A7AFE',
    height: 54,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  registerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  redirectText: {
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default RegisterScreen;

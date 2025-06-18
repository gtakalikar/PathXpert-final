import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
  ToastAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const showToast = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Info', msg);
    }
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSendResetLink = async () => {
    if (!email.trim()) {
      Alert.alert('Missing Email', 'Please enter your email.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://192.168.31.167:8003/api/auth/send-otp', {
        email,
        purpose: 'reset',
      });

      console.log('[Send OTP]', response.data);

      if (response.data.status === 'success') {
        showToast('OTP sent to email ');
        navigation.navigate('OtpVerify', {
          email,
          purpose: 'reset',
        });
      } else {
        Alert.alert('Error', response.data.message || 'Could not send OTP');
      }
    } catch (err) {
      console.error('[ForgotPassword]', err?.response?.data || err.message);
      Alert.alert('Failed', err?.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            We'll send an OTP to your email. Verify it to reset your password.
          </Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleSendResetLink}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FE' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 },
  headerContainer: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#3A7AFE' },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    color: 'black',
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#3A7AFE',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  backLink: { marginTop: 30, alignItems: 'center' },
  backText: { color: '#3A7AFE', textDecorationLine: 'underline', fontSize: 15 },
});

export default ForgotPasswordScreen;

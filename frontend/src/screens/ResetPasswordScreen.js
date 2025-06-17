import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

export default function ResetPasswordScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const newPasswordRef = useRef(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  const email = route?.params?.email;

  useEffect(() => {
    if (!email) {
      Alert.alert('Missing Info', 'Email not found. Please start from Forgot Password.');
      navigation.navigate('ForgotPassword');
    } else {
      newPasswordRef.current?.focus();
    }
  }, [email]);

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      return Alert.alert('Error', 'All fields are required.');
    }

    if (newPassword.length < 8) {
      return Alert.alert('Error', 'Password must be at least 8 characters.');
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert('Error', 'Passwords don’t match.');
    }

    try {
      setLoading(true);
      const response = await axios.post(`http://192.168.31.167:8003/api/auth/reset-password`, {
        email,
        password: newPassword,
      });

      if (response.data.status === 'success') {
        Alert.alert('Success', 'Password reset successful!', [
          { text: 'Login now', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error('[Reset Error]', err?.response?.data || err.message);
      Alert.alert('Reset Failed', err?.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <TextInput
        ref={newPasswordRef}
        secureTextEntry={secureNew}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
      />

      <TextInput
        secureTextEntry={secureConfirm}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

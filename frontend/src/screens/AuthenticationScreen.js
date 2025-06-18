

// screens/OtpScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const OtpScreen = ({ route, navigation }) => {
  const { email, purpose } = route.params;
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    sendOtp();
    startResendTimer();
  }, []);

  const startResendTimer = () => {
    let seconds = 60;
    setResendTimer(seconds);
    const interval = setInterval(() => {
      seconds--;
      setResendTimer(seconds);
      if (seconds <= 0) clearInterval(interval);
    }, 1000);
  };

  const sendOtp = async () => {
    try {
      const response = await fetch('http://192.168.31.167:8003/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose }), // ✅ include purpose
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      Alert.alert('OTP Sent', `An OTP has been sent to ${email}`);
    } catch (error) {
      console.error('Send OTP Error:', error);
      Alert.alert('Error', error.message || 'Could not send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.trim().length === 0) {
      Alert.alert('Missing OTP', 'Please enter the OTP sent to your email.');
      return;
    }

    setIsLoading(true);

    try {
       console.log('[Verify OTP] Email:', email, 'OTP:', otp); // 🔍 Debug line
      const verifyResponse = await fetch('http://192.168.31.167:8003/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok || !verifyData.success) {
        throw new Error(verifyData.message || 'OTP verification failed');
      }

      // ✅ Only for reset purpose
      Alert.alert('Verified', 'OTP verified. Set new password.');
      navigation.replace('ResetPassword', { email });

    } catch (error) {
      console.error('Verify Error:', error.message);
      Alert.alert('Error ❌', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.logo}>PathXpert</Text>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Sent to: {email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="default" // ✅ allows alphanumeric
        maxLength={6}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#3A7AFE" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
          <Text style={styles.buttonText}>Verify & Continue</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        disabled={resendTimer > 0}
        onPress={() => {
          sendOtp();
          startResendTimer();
        }}
      >
        <Text style={styles.resendText}>
          {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OtpScreen;

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
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
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
  button: {
    backgroundColor: '#3A7AFE',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendText: {
    color: '#3A7AFE',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 10,
  },
});

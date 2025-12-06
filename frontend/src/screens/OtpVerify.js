
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const OtpVerify = ({ route, navigation }) => {
  const { email, purpose } = route.params || {};

  useEffect(() => {
    navigation.navigate('Authentication', { email, purpose: 'reset' });
  }, []); // 👈 only run once, when the component mounts

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🔐 Verifying OTP</Text>
      <Text style={styles.text}>Email: {email}</Text>
      <Text style={styles.text}>Purpose: {purpose}</Text>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});

export default OtpVerify;

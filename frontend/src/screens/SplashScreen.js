import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect } from 'react';


const SplashScreen = ({ navigation }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); // 💫 Auto move to Login after 3s
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleNext = () => {
    navigation.replace('Login'); // Replace SplashScreen with LoginScreen
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.logoContainer}>
        <View style={styles.logoBackground}>
          <View style={styles.logoRing1} />
          <View style={styles.logoRing2} />
          <Ionicons name="location-outline" size={60} color="#3A7AFE" />
        </View>
        <Text style={styles.logoText}>PathXpert</Text>
        <Text style={styles.tagline}>Analyzing Routes...</Text>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f6ff', // light background
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBackground: {
    width: 150,
    height: 150,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoRing1: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: '#3A7AFE',
    transform: [{ rotateX: '45deg' }],
  },
  logoRing2: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: '#00C9A7',
    transform: [{ rotateY: '45deg' }],
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3A7AFE',
    marginVertical: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#3A7AFE',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SplashScreen;


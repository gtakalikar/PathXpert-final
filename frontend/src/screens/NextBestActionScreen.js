import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function NextBestActionScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Next Best Action</Text>
      <Text style={styles.subtitle}>Recommending optimal traffic detours or adjustments</Text>

      <View style={styles.detourBox}>
        <Text style={styles.icon}>🧭</Text>
        <View>
          <Text style={styles.detourTitle}>Detour</Text>
          <Text style={styles.detourDesc}>Heavy congestion ahead, take an alternate route</Text>
        </View>
      </View>

      {/* Using an online placeholder image to avoid bundling issues */}
      <Image
        source={{ uri: 'https://via.placeholder.com/400x250.png?text=Map+Route' }}
        style={styles.mapImage}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Take Action</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f2f7',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  detourBox: {
    backgroundColor: '#d9eaf2',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 32,
    marginRight: 15,
  },
  detourTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
  },
  detourDesc: {
    fontSize: 14,
    color: '#333',
  },
  mapImage: {
    width: '100%',
    height: 250,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#3ec6a5',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

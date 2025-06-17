import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Image, ScrollView } from 'react-native';

export default function TrafficPredictionScreen() {
  const [weatherCondition, setWeatherCondition] = useState(true);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Traffic Prediction</Text>
        <Text style={styles.subtitle}>
          Real-time prediction of traffic congestion, estimated delays, and the best routes.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🚦 Current Prediction</Text>
          <Text style={styles.cardDetail}>⏱ Estimated Delay: <Text style={styles.bold}>5 mins</Text></Text>
          <Text style={styles.cardDetail}>📍 Congestion Level: <Text style={styles.bold}>High</Text></Text>
        </View>

        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Traffic_density_map.png' }}
          style={styles.map}
        />

        <TouchableOpacity style={styles.selectTimeBtn}>
          <Text style={styles.selectTimeText}>🕒 Select Prediction Time</Text>
        </TouchableOpacity>

        <View style={styles.switchWrapper}>
          <Text style={styles.switchLabel}>Include Weather Conditions</Text>
          <Switch
            value={weatherCondition}
            onValueChange={setWeatherCondition}
            thumbColor={weatherCondition ? "#ffffff" : "#f4f3f4"}
            trackColor={{ false: "#d3d3d3", true: "#4cd964" }}
          />
        </View>

        <TouchableOpacity style={styles.predictBtn}>
          <Text style={styles.predictText}>🔍 Get New Prediction</Text>
        </TouchableOpacity>

        <Text style={styles.timestamp}>🕘 Last updated: 5 minutes ago</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  cardDetail: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
    color: '#000',
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  selectTimeBtn: {
    backgroundColor: '#eef2ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  selectTimeText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  predictBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 14,
    marginBottom: 12,
  },
  predictText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
});

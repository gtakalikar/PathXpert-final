import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

export default function AIFeaturesScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.heading}>AI-Powered Features</Text>

      <ScrollView contentContainerStyle={styles.featureList}>
        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => navigation.navigate('IncidentMap')}
        >
          <Text style={styles.featureText}>Accident Detection</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => navigation.navigate('TrafficPrediction')}
        >
          <Text style={styles.featureText}>Traffic Prediction</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => navigation.navigate('NextBestAction')}
        >
          <Text style={styles.featureText}>Next Best Action</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => navigation.navigate('TrafficHeatmap')}
        >
          <Text style={styles.featureText}>Traffic Heatmap</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => navigation.navigate('TrafficMap')}
        >
          <Text style={styles.featureText}>Live Traffic Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => navigation.navigate('Feedback')}
        >
          <Text style={styles.featureText}>User Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => navigation.navigate('AdminAnalytics')}
        >
          <Text style={styles.featureText}>Admin Analytics AI</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafe',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007acc',
    marginTop: 60,
    marginBottom: 20,
    textAlign: 'center',
  },
  featureList: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dde1e7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  featureText: {
    fontSize: 18,
    color: '#1a1a1a',
    fontWeight: '600',
    textAlign: 'center',
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ActivityIndicator } from 'react-native';
import MapView, { Heatmap } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrafficHeatmapScreen() {
  const [region, setRegion] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [loading, setLoading] = useState(true);

  const heatmapPoints = [
    { latitude: 37.773972, longitude: -122.431297, weight: 1 },
    { latitude: 37.7749, longitude: -122.4194, weight: 2 },
    { latitude: 37.775, longitude: -122.418, weight: 3 },
    { latitude: 37.776, longitude: -122.417, weight: 4 },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied.');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text>Loading map...</Text>
      </View>
    );
  }

  if (locationError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: 'red', fontWeight: 'bold' }}>{locationError}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView style={styles.map} region={region} provider="google">
        {showHeatmap && (
          <Heatmap
            points={heatmapPoints}
            radius={50}
            opacity={0.7}
            gradient={{
              colors: ['green', 'yellow', 'red'],
              startPoints: [0.1, 0.5, 1],
              colorMapSize: 256,
            }}
          />
        )}
      </MapView>

      {/* Heatmap Toggle */}
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>Traffic Heatmap</Text>
        <Switch
          value={showHeatmap}
          onValueChange={(val) => setShowHeatmap(val)}
          thumbColor={showHeatmap ? '#fff' : '#888'}
          trackColor={{ true: '#007aff', false: '#ccc' }}
        />
      </View>

      {/* Heat Level Legend */}
      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: 'green' }]}>● Low</Text>
        <Text style={[styles.legendText, { color: 'orange' }]}>● Medium</Text>
        <Text style={[styles.legendText, { color: 'red' }]}>● High</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  legend: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendText: {
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

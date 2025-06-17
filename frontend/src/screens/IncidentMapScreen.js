import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const incidents = [
  {
    id: '1',
    type: 'Crash',
    description: 'Fairmount Ave - 5 min ago',
    location: { latitude: 19.8762, longitude: 75.3433 },
    color: '#EF4444',
    icon: '🚗',
  },
  {
    id: '2',
    type: 'Flooding',
    description: 'Girard Ave - 7 min ago',
    location: { latitude: 19.8872, longitude: 75.3533 },
    color: '#F59E0B',
    icon: '🌊',
  },
];

export default function IncidentMapScreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Location denied', 'Allow location to view incidents nearby.');
          setLoading(false);
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
      } catch (error) {
        console.error('Location error:', error);
        Alert.alert('Error', 'Failed to get your location.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading map...</Text>
      </View>
    );
  }

  const region = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : {
        latitude: 19.8762,
        longitude: 75.3433,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  const handleReport = () => {
    Alert.alert('Report Feature Coming Soon', 'This button will open the report form.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Accident & Incident Detection</Text>

      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={!!location}
      >
        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            coordinate={incident.location}
            title={incident.type}
            description={incident.description}
            pinColor={incident.color}
          />
        ))}
      </MapView>

      <View style={styles.incidentList}>
        <FlatList
          data={incidents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.incidentItem}>
              <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
                <Text style={styles.iconText}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.incidentTitle}>{item.type}</Text>
                <Text style={styles.incidentSubtitle}>{item.description}</Text>
              </View>
              <Text style={styles.reportedText}>Reported</Text>
            </View>
          )}
        />

        <TouchableOpacity style={styles.button} onPress={handleReport}>
          <Text style={styles.buttonText}>Report Incident</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  map: { flex: 1 },
  incidentList: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
    elevation: 8,
  },
  incidentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 18 },
  incidentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  incidentSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  reportedText: {
    fontSize: 13,
    color: '#6b7280',
  },
  button: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

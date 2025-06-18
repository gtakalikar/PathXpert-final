import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [trafficInfo, setTrafficInfo] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      const currentRegion = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(currentRegion);

      try {
        const response = await fetch('http://192.168.31.167:8003/api/traffic', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          }),
        });

        const data = await response.json();
        console.log('Traffic Data:', data);

        if (data.status === 'fail' || !data.trafficLevel) {
          console.warn('Invalid traffic data:', data);
          setTrafficInfo(null); // Don't try to render
        } else {
          setTrafficInfo(data);
        }
      } catch (error) {
        console.error('Backend error :', error);
        setTrafficInfo(null);
      }
    })();
  }, []);

  const handleRecenter = () => {
    if (location) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerText}>CURRENT TRAFFIC</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {region ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton={false}
          customMapStyle={customMapStyle}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You are here"
            pinColor="#1e90ff"
          />

          <Circle
            center={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            radius={1000}
            strokeWidth={2}
            strokeColor="#1e90ff"
            fillColor="rgba(30, 144, 255, 0.1)"
          />
        </MapView>
      ) : (
        <View style={styles.loading}>
          <Text style={{ color: '#999' }}>Loading Map...</Text>
        </View>
      )}

      {/* Traffic Info (Safe & Conditional) */}
      {trafficInfo && typeof trafficInfo.radiusMeters === 'number' && (
        <View style={styles.trafficBox}>
          <Text style={styles.trafficText}>
            🚦 Traffic Level: {trafficInfo.trafficLevel}
          </Text>
          <Text style={[styles.trafficText, { fontSize: 14 }]}>
            📍 Radius: {(trafficInfo.radiusMeters / 1000).toFixed(1)} km
          </Text>
          <Text style={[styles.trafficText, { fontSize: 14 }]}>
            🚗 Vehicles Nearby: {trafficInfo.nearbyCount}
          </Text>
        </View>
      )}

      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.zoomButton} onPress={handleRecenter}>
          <Ionicons name="navigate" size={28} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const customMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#f0f0f0' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f0f0f0' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#1e90ff' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#1e90ff' }] },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e90ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mapControls: {
    position: 'absolute',
    right: 16,
    bottom: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    padding: 8,
  },
  zoomButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  trafficBox: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderColor: '#1e90ff',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  trafficText: {
    color: '#1e90ff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;

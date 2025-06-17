import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const TrafficMapScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#00ff99" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Traffic Map</Text>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications" size={24} color="#00ff99" />
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        {/* Simulated traffic map */}
        <View style={styles.trafficMap}>
          <View style={styles.greenRoute} />
          <View style={styles.redRoute1} />
          <View style={styles.redRoute2} />
          <View style={styles.yellowRoute1} />
          <View style={styles.yellowRoute2} />
          <View style={styles.currentLocation}>
            <Ionicons name="location" size={28} color="#00ff99" />
          </View>
        </View>

        {/* Map controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.zoomButton}>
            <Ionicons name="add" size={24} color="#00ff99" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton}>
            <Ionicons name="remove" size={24} color="#00ff99" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.recenterButton}>
            <Ionicons name="navigate" size={24} color="#00ff99" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => navigation.navigate('ReportForm')}
        >
          <Ionicons name="warning" size={24} color="#FFD700" />
          <Text style={styles.reportButtonText}>Report Issue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1115',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff99',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  trafficMap: {
    flex: 1,
    backgroundColor: '#151820',
    position: 'relative',
  },
  greenRoute: {
    position: 'absolute',
    width: 8,
    height: '70%',
    backgroundColor: '#00ff99',
    bottom: 50,
    left: '50%',
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
  },
  redRoute1: {
    position: 'absolute',
    width: 8,
    height: '80%',
    backgroundColor: '#ff4d4d',
    top: 30,
    left: '30%',
    borderRadius: 4,
    transform: [{ rotate: '35deg' }],
  },
  redRoute2: {
    position: 'absolute',
    width: 8,
    height: '60%',
    backgroundColor: '#ff4d4d',
    top: 50,
    right: '20%',
    borderRadius: 4,
    transform: [{ rotate: '-30deg' }],
  },
  yellowRoute1: {
    position: 'absolute',
    width: 8,
    height: '90%',
    backgroundColor: '#FFD700',
    top: 20,
    left: '40%',
    borderRadius: 4,
    transform: [{ rotate: '25deg' }],
  },
  yellowRoute2: {
    position: 'absolute',
    width: 8,
    height: '70%',
    backgroundColor: '#FFD700',
    bottom: 30,
    right: '30%',
    borderRadius: 4,
    transform: [{ rotate: '-20deg' }],
  },
  currentLocation: {
    position: 'absolute',
    bottom: '30%',
    left: '45%',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -70 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    padding: 8,
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  recenterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff4d4d',
  },
  actionContainer: {
    padding: 16,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 10,
    padding: 12,
  },
  reportButtonText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default TrafficMapScreen; 
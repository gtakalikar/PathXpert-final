import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReportScreen = ({ navigation }) => {
  const [reportOptions, setReportOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch('http://192.168.31.167:8003/api/reports/report-options');
        const data = await res.json();

        console.log('🔥 Report Options API Response:', data);

        if (Array.isArray(data)) {
          setReportOptions(data);
        } else if (Array.isArray(data.options)) {
          setReportOptions(data.options);
        } else {
          throw new Error('Invalid API structure');
        }
      } catch (err) {
        console.error('❌ Error fetching report options:', err);

        // fallback data if API fails
        setReportOptions([
          {
            type: 'accident',
            label: 'Accident',
            icon: 'car-sport',
            color: '#FF5F5F',
            bgColor: 'rgba(255, 95, 95, 0.15)',
          },
          {
            type: 'traffic',
            label: 'Traffic Jam',
            icon: 'trail-sign',
            color: '#FFD700',
            bgColor: 'rgba(255, 215, 0, 0.15)',
          },
          {
            type: 'closure',
            label: 'Road Closure',
            icon: 'close-circle',
            color: '#00B2FF',
            bgColor: 'rgba(0, 178, 255, 0.15)',
          },
          {
            type: 'other',
            label: 'Other',
            icon: 'ellipsis-horizontal-circle',
            color: '#00FFCC',
            bgColor: 'rgba(0, 255, 204, 0.15)',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const sendReport = async (reportData) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Authentication Error', 'You must be logged in to send a report.');
        return;
      }

      const response = await fetch('http://192.168.31.167:8003/api/reports', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (response.ok) {
        Alert.alert('Report Sent', 'Thank you for your report!');
      } else {
        Alert.alert('Error', data?.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Send Report Error:', error);
      Alert.alert('Network Error', 'Unable to send report. Please try again later.');
    }
  };

  // 👇 Updated function name to match correct screen name in navigation
  const handleReportPress = (type) => {
    navigation.navigate('ReportForm', { type }); // 💡 Your screen name should be 'ReportForm' in App.js
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Report an Issue</Text>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#007acc" />
        ) : (
          <View style={styles.reportGrid}>
            {Array.isArray(reportOptions) &&
              reportOptions.map((item) => (
                <TouchableOpacity
                  key={item.type}
                  style={styles.reportBox}
                  onPress={() => handleReportPress(item.type)}
                >
                  <View style={[styles.iconCircle, { backgroundColor: item.bgColor }]}>
                    <Ionicons name={item.icon} size={28} color={item.color} />
                  </View>
                  <Text style={styles.boxText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('ReportHistory')}
        >
          <Ionicons name="time-outline" size={20} color="#fff" />
          <Text style={styles.historyButtonText}>View Report History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('IncidentMap')}
        >
          <Ionicons name="map" size={20} color="#fff" />
          <Text style={styles.historyButtonText}>Go to Incident Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('AIFeatures')}
        >
          <Ionicons name="sparkles-outline" size={20} color="#fff" />
          <Text style={styles.historyButtonText}>Explore AI Features</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007acc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  reportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  reportBox: {
    width: '47%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  boxText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  historyButton: {
    flexDirection: 'row',
    backgroundColor: '#007acc',
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ReportScreen;

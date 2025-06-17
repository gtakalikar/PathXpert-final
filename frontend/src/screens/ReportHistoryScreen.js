import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReportHistoryScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Login Required', 'Please log in to view your report history.');
        setLoading(false);
        return;
      }

      const response = await fetch('http://192.168.31.167:8003/api/reports', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setReports(data.reports || []);
      } else {
        Alert.alert('❌ Failed', data.message || 'Could not fetch reports');
      }
    } catch (error) {
      console.error('🔥 Fetch Error:', error);
      Alert.alert('Network Error', 'Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const renderReport = ({ item }) => (
    <View style={styles.reportItem}>
      <View style={[styles.reportIconContainer, { backgroundColor: '#f0f0f0' }]}>
        <Ionicons
          name={getIconName(item?.type)}
          size={20}
          color={getIconColor(item?.status)}
        />
      </View>
      <View style={styles.reportContent}>
        <Text style={styles.reportDate}>{formatDate(item?.date)}</Text>
        <Text style={styles.reportLocation}>{item?.location || 'Unknown Location'}</Text>
      </View>
      <View style={[
        styles.statusBadge,
        { backgroundColor: item?.status === 'resolved' ? '#e6fff5' : '#fff8dc' }
      ]}>
        <Text style={[
          styles.statusText,
          { color: item?.status === 'resolved' ? '#00cc99' : '#f5a623' }
        ]}>
          {item?.status === 'resolved' ? 'Resolved' : 'Pending'}
        </Text>
      </View>
    </View>
  );

  const getIconName = (type) => {
    switch (type?.toLowerCase()) {
      case 'hazard': return 'warning';
      case 'roadwork': return 'construct';
      case 'closure': return 'car';
      case 'accident': return 'car';
      case 'traffic': return 'ellipsis-vertical-circle';
      case 'other': return 'megaphone';
      default: return 'alert-circle-outline';
    }
  };

  const getIconColor = (status) => {
    return status === 'resolved' ? '#00cc99' : '#FFD700';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown Date';
    const date = new Date(dateStr);
    return date.toDateString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#00cc99" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report History</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00cc99" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={reports}
          renderItem={renderReport}
          keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20 }}>No reports found.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00cc99',
  },
  listContent: { padding: 16 },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  reportIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportContent: { flex: 1 },
  reportDate: { fontSize: 12, color: '#007bff', marginBottom: 2 },
  reportLocation: { fontSize: 15, color: '#333', fontWeight: '600' },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default ReportHistoryScreen;

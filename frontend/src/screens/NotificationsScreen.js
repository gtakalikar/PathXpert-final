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

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://192.168.31.167:8003/api/traffic');

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setNotifications(data.notifications); // assuming this is the field
      } else {
        throw new Error(data.message || 'Failed to fetch');
      }
    } catch (error) {
      console.error('🚨 Error fetching notifications:', error.message);
      Alert.alert('Oops!', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={[styles.notificationIconContainer, { borderColor: item.color || '#FFD700' }]}>
        <Ionicons name={item.icon || 'notifications'} size={24} color={item.color || '#FFD700'} />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationTime}>
          {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#00ff99" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item._id || item.id}
          contentContainerStyle={styles.notificationsList}
          ListEmptyComponent={
            <Text style={{ color: '#aaa', textAlign: 'center', marginTop: 32 }}>
              No notifications yet!
            </Text>
          }
        />
      )}

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Swipe to dismiss</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.clearButton]}>
          <Text style={[styles.actionButtonText, styles.clearButtonText]}>Clear all</Text>
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
    color: '#FFD700',
  },
  notificationsList: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#aaa',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  actionButtonText: {
    color: '#aaa',
    fontSize: 14,
  },
  clearButton: {
    backgroundColor: 'rgba(255, 77, 77, 0.1)',
    borderColor: '#ff4d4d',
  },
  clearButtonText: {
    color: '#ff4d4d',
  },
});

export default NotificationsScreen;

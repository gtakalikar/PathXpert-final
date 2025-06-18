import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Get actual token
        console.log('🔥 Token:', token);

        const res = await fetch('http://192.168.31.167:8003/api/profile/me', {
          headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          console.warn('Failed to fetch profile:', data.message);
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3A7AFE" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user?.photoUrl ? (
              <Image source={{ uri: user.photoUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color="#fff" />
              </View>
            )}
          </View>
          <Text style={styles.userName}>
    {user?.firstName
      ? `${user.firstName} ${user.lastName || ''}`
      : user?.username || user?.displayName || 'Unknown User'}
  </Text>
          
          <Text style={styles.userEmail}>{user?.email || 'N/A'}</Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('ReportHistory')}
          >
            <Ionicons name="document-text-outline" size={24} color="#3A7AFE" style={styles.optionIcon} />
            <Text style={styles.optionText}>My Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color="#3A7AFE" style={styles.optionIcon} />
            <Text style={styles.optionText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.replace('Login')}
          >
            <Ionicons name="power-outline" size={24} color="#FF7F50" style={styles.optionIcon} />
            <Text style={styles.optionText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FE',
  },
  scrollContent: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#3A7AFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    padding: 4,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: '#3A7AFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#888',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3A7AFE',
    elevation: 2,
  },
  optionIcon: {
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ProfileScreen;

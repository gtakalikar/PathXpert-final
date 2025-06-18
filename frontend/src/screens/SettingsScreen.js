import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'; 



const SettingsScreen = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [mapType, setMapType] = useState('standard'); // ✅ This is now in the correct place
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch user settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
         const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found ');
       
    const response = await fetch('http://192.168.31.167:8003/api/users/settings', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Server response not OK');
    const data = await response.json();
        setDarkMode(data.darkMode);
        setNotifications(data.notifications);
        setMapType(data.mapType || 'standard');
        
      } catch (err) {
         console.error('Settings fetch error:', err);
        Alert.alert('Error', 'Failed to load settings ');
      }finally {
        setLoading(false);
         }
    };

    fetchSettings();
  }, []);

  // 🔄 Save settings on change
  useEffect(() => {
    if (!loading) {
      const updateSettings = async () => {
        try {
          await fetch(`http://192.168.31.167:8003/api/settings/${USER_ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ darkMode, notifications, mapType }),
          });
        } catch (err) {
          console.log(' Error updating settings', err);
        }
      };

      updateSettings();
    }
  }, [darkMode, notifications, mapType]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#00B2FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
       

        {/* Preferences */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>PREFERENCES</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="notifications" size={24} color="#FFD700" />
            </View>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#ccc', true: '#FFD70080' }}
              thumbColor={notifications ? '#FFD700' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              const newType = mapType === 'standard' ? 'satellite' : 'standard';
              setMapType(newType);
              Alert.alert('Map Type Changed', `Now using: ${newType} view 🗺`);
            }}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="map" size={24} color="#00B2FF" />
            </View>
            <Text style={styles.settingLabel}>Map Type: {mapType}</Text>
            <Ionicons name="chevron-forward" size={20} color="#777" />
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>ABOUT</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() =>
              Alert.alert(
                'About PathXpert',
                'PathXpert is your smart traffic companion 🚦💙\n\nHelps you navigate traffic, get updates & more!'
              )
            }
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="information-circle" size={24} color="#00B2FF" />
            </View>
            <Text style={styles.settingLabel}>About PathXpert</Text>
            <Ionicons name="chevron-forward" size={20} color="#777" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() =>
              Alert.alert(
                'Privacy Policy',
                'We respect your privacy 🌿\nNo unnecessary data collected. Your info is safe with us.'
              )
            }
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="shield-checkmark" size={24} color="#00C897" />
            </View>
            <Text style={styles.settingLabel}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#777" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00B2FF',
  },
  scrollContent: { padding: 16 },
  settingsSection: { marginBottom: 24 },
  settingsSectionTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5F6FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
});

export default SettingsScreen;

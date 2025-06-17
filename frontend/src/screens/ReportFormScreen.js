import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';

const ReportFormScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { type = 'General' } = route.params || {}; // Fallback if no type passed

  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [injured, setInjured] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!location.trim() || !description.trim()) {
      Alert.alert('Missing Fields', 'Please fill out all required fields.');
      return;
    }

    


    const reportData = {
      type,
      location,
      description,
      anonymous,
      injured,
    };

    console.log('Submitting report:', reportData);
    
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Unauthorized', 'Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetch('http://192.168.31.167:8003/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reportData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('✅ Report Sent', 'Your report has been submitted.');
        // Reset form
        setLocation('');
        setDescription('');
        setAnonymous(false);
        setInjured(false);
        navigation.goBack();
      } else {
        Alert.alert('❌ Error', result.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('🚫 Network Error', 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Report Type: {type}</Text>

      <Text style={styles.label}>Location *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., W 15th St"
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Describe what happened..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <View style={styles.switchRow}>
        <Text>Anonymous</Text>
        <Switch value={anonymous} onValueChange={setAnonymous} />
      </View>

      <View style={styles.switchRow}>
        <Text>Injured Involved?</Text>
        <Switch value={injured} onValueChange={setInjured} />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitText}>
          {loading ? 'Submitting...' : 'Submit Report'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  label: { fontSize: 16, marginBottom: 6, fontWeight: '600', color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#007acc',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReportFormScreen;

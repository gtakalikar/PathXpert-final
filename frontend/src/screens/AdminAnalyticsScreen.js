import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const AdminAnalyticsScreen = () => {
  const data = [50, 45, 55, 70];
  const days = ['Mon', 'Wed', 'Fri', 'Sun'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Admin Analytics AI</Text>

        <Text style={styles.sectionTitle}>Traffic Trends</Text>
        <View style={styles.chartContainer}>
          <LineChart
            data={{
              labels: days,
              datasets: [{ data }],
            }}
            width={width - 40}
            height={200}
            chartConfig={{
              backgroundGradientFrom: '#f5f5f5',
              backgroundGradientTo: '#f5f5f5',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0,122,204, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#007acc',
              },
            }}
            bezier
            style={styles.chartStyle}
          />
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Top Congested Areas</Text>
            <Text style={styles.infoText}>• Main St</Text>
            <Text style={styles.infoText}>• 2nd Ave</Text>
            <Text style={styles.infoText}>• Broadway</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Peak Hours</Text>
            <Text style={styles.infoText}>5 PM – 7 PM</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Heatmap</Text>
        <Text style={styles.infoText}>[Heatmap visualization placeholder]</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#007acc',
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  chartContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },
  chartStyle: {
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 14,
    borderRadius: 12,
    marginRight: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#000',
  },
  infoText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
});

export default AdminAnalyticsScreen; 
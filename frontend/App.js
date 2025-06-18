import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import ReportScreen from './src/screens/ReportScreen';
import ReportFormScreen from './src/screens/ReportFormScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SplashScreen from './src/screens/SplashScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import AuthenticationScreen from './src/screens/AuthenticationScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TrafficMapScreen from './src/screens/TrafficMapScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ReportHistoryScreen from './src/screens/ReportHistoryScreen';
import IncidentMapScreen from './src/screens/IncidentMapScreen';
import AIFeaturesScreen from './src/screens/AIFeatures';
import NextBestActionScreen from './src/screens/NextBestActionScreen';
import TrafficHeatmapScreen from './src/screens/TrafficHeatmapScreen';
import TrafficPredictionScreen from './src/screens/TrafficPredictionScreen';
import FeedbackScreen from './src/screens/FeedbackScreen';
import OtpVerify from './src/screens/OtpVerify'; // update the path if needed
import AdminAnalyticsScreen from './src/screens/AdminAnalyticsScreen';

// 💡 Deep Linking config
const linking = {
  prefixes: ['pathxpert://'],
  config: {
    screens: {
      ResetPassword: 'reset-password',
      // Add more screens if needed
    },
  },
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = 'home-outline';
        if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Report') iconName = focused ? 'analytics' : 'analytics-outline';
        else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#00ff99',
      tabBarInactiveTintColor: '#ccc',
      tabBarStyle: {
        backgroundColor: '#111',
        borderTopWidth: 0,
        paddingTop: 5,
        height: 60,
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Report" component={ReportScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer linking={linking}>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0f1115' },
          }}
        >
          {/* Auth */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="Authentication" component={AuthenticationScreen} />
          <Stack.Screen name="OtpVerify" component={OtpVerify} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

          {/* Main Tabs */}
          <Stack.Screen name="MainTabs" component={MainTabs} />

          {/* Extra Features */}
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="TrafficMap" component={TrafficMapScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="ReportHistory" component={ReportHistoryScreen} />
          <Stack.Screen name="ReportForm" component={ReportFormScreen} />
          <Stack.Screen name="IncidentMap" component={IncidentMapScreen} />
          <Stack.Screen name="AIFeatures" component={AIFeaturesScreen} />
          <Stack.Screen name="NextBestAction" component={NextBestActionScreen} />
          <Stack.Screen name="TrafficHeatmap" component={TrafficHeatmapScreen} />
          <Stack.Screen name="TrafficPrediction" component={TrafficPredictionScreen} />
          <Stack.Screen name="Feedback" component={FeedbackScreen} />
          <Stack.Screen name="AdminAnalytics" component={AdminAnalyticsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

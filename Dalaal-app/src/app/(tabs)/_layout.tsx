import React from 'react';
import { Tabs } from 'expo-router';
import Colors from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useAppTheme } from '../../context/theme-context';
import CustomTabBar from '../../components/CustomTabBar';

export default function TabsLayout() {
  const { scheme } = useAppTheme();
  const C = Colors[scheme];

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ 
              marginTop: 6,
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: focused ? (scheme === 'dark' ? 'rgba(47, 124, 246, 0.15)' : 'rgba(47, 124, 246, 0.1)') : 'transparent',
              width: 44,
              height: 44,
              borderRadius: 14
            }}>
              <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ 
              marginTop: 6,
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: focused ? (scheme === 'dark' ? 'rgba(47, 124, 246, 0.15)' : 'rgba(47, 124, 246, 0.1)') : 'transparent',
              width: 44,
              height: 44,
              borderRadius: 14
            }}>
              <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ 
              marginTop: 6,
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: focused ? (scheme === 'dark' ? 'rgba(47, 124, 246, 0.15)' : 'rgba(47, 124, 246, 0.1)') : 'transparent',
              width: 44,
              height: 44,
              borderRadius: 14
            }}>
              <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ 
              marginTop: 6,
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: focused ? (scheme === 'dark' ? 'rgba(47, 124, 246, 0.15)' : 'rgba(47, 124, 246, 0.1)') : 'transparent',
              width: 44,
              height: 44,
              borderRadius: 14
            }}>
              <Ionicons name={focused ? 'compass' : 'compass-outline'} size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ 
              marginTop: 6,
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: focused ? (scheme === 'dark' ? 'rgba(47, 124, 246, 0.15)' : 'rgba(47, 124, 246, 0.1)') : 'transparent',
              width: 44,
              height: 44,
              borderRadius: 14
            }}>
              <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View } from 'react-native';
import Colors from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../context/theme-context';
export default function TabsLayout() {
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2F7CF6',
        tabBarInactiveTintColor: scheme === 'dark' ? '#999' : '#666',
        tabBarStyle: {
          backgroundColor: scheme === 'dark' ? '#121212' : '#FFFFFF',
          borderTopColor: scheme === 'dark' ? '#333' : '#EEE',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            router.push('/agent/create-listing');
          },
        })}
        options={{
          title: '',
          tabBarLabel: '',
          tabBarShowLabel: false,
          tabBarIcon: () => (
            <View style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: C.brandBlue,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: -10, // lift it above the tab bar slightly
            }}>
              <Ionicons name="add" size={32} color="#fff" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

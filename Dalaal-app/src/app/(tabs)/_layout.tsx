import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View } from 'react-native';
import Colors from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../context/theme-context';
import { useAuthStore } from '../../store/authStore';

const CREATOR_ROLES = new Set(['PROPERTY_OWNER', 'VEHICLE_OWNER', 'REGULAR_DALAAL', 'VERIFIED_DALAAL', 'SUPER_ADMIN']);

export default function TabsLayout() {
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const canCreate = CREATOR_ROLES.has(user?.role);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2F7CF6',
        tabBarInactiveTintColor: scheme === 'dark' ? '#f8f6f6' : '#1a1919',
        tabBarStyle: {
          backgroundColor: scheme === 'dark' ? '#020114f5' : '#FFFFFF',
          borderTopColor: scheme === 'dark' ? '#8b8888' : '#EEE',
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
            router.push('/pages/broker/create-listing');
          },
        })}
        options={{
          title: '',
          tabBarLabel: '',
          tabBarShowLabel: false,
          href: canCreate ? undefined : null,
          tabBarIcon: () => (
            <View style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: C.brandBlue,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: -10,
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

import React from 'react';
import { useRouter } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import Colors from '../../constants/theme';
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
    <NativeTabs
      tintColor="#2F7CF6"
      backgroundColor={scheme === 'dark' ? '#020114f5' : '#FFFFFF'}
      labelStyle={{
        color: scheme === 'dark' ? '#f8f6f6' : '#1a1919',
      }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          md={{ default: 'home', selected: 'home' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search">
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'magnifyingglass', selected: 'magnifyingglass' }}
          md={{ default: 'search', selected: 'search' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger
        name="create"
        hidden={!canCreate}
        listeners={{
          tabPress: (e: any) => {
            e.preventDefault();
            router.push('/pages/broker/create-listing');
          },
        }}
      >
        <NativeTabs.Trigger.Label hidden />
        <NativeTabs.Trigger.Icon sf="plus.circle.fill" md="add_circle" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="chat">
        <NativeTabs.Trigger.Label>Chat</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'bubble.left', selected: 'bubble.left.fill' }}
          md={{ default: 'chat_bubble', selected: 'chat_bubble' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person', selected: 'person.fill' }}
          md={{ default: 'person', selected: 'person' }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

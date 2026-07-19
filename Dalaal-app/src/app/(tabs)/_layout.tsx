import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import { useAuthStore } from '../../store/authStore';
import PremiumTabBar from '../../components/ui/PremiumTabBar';

const CREATOR_ROLES = new Set(['PROPERTY_OWNER', 'VEHICLE_OWNER', 'REGULAR_DALAAL', 'VERIFIED_DALAAL', 'SUPER_ADMIN']);

export default function TabsLayout() {
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const canCreate = CREATOR_ROLES.has(user?.role);

  return (
    <Tabs
      tabBar={(props) => <PremiumTabBar {...props} colors={C} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen
        name="create"
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            router.push('/pages/broker/create-listing');
          },
        })}
        options={{
          title: 'Create',
          href: canCreate ? undefined : null,
        }}
      />
      <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

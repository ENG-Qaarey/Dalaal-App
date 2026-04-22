import React from 'react';
import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'splash',
};

export default function AuthLayout() {
  // Use a Stack here and hide the native header for auth screens
  return <Stack initialRouteName="splash" screenOptions={{ headerShown: false }} />;
}


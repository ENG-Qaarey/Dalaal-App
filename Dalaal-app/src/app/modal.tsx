import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/theme';
import OnboardingBackground from '../components/OnboardingBackground';
import { useAppTheme } from '../context/theme-context';

export default function ModalScreen() {
  const router = useRouter();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];

  return (
    <View style={[styles.container, { backgroundColor: C.surface }]}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
      <Text style={[styles.title, { color: C.textMain }]}>Modal</Text>
      <Button title="Close" onPress={() => router.back()} color={C.brandBlue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 12 },
});

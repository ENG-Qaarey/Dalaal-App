import { Redirect } from 'expo-router';

export const options = { headerShown: false };

export default function Onboarding() {
  return <Redirect href="/splash" />;
}

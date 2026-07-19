import { Platform } from 'react-native';

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS !== 'web' || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function showBrowserNotification(title: string, body: string, url?: string) {
  if (Platform.OS !== 'web' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const notification = new Notification(title, {
    body,
    icon: url || undefined,
    badge: url || undefined,
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  setTimeout(() => notification.close(), 8000);
}

export function isNotificationSupported(): boolean {
  return Platform.OS === 'web' && 'Notification' in window;
}

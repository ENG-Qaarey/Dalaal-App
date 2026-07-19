import Constants from 'expo-constants';
import { Platform } from 'react-native';

const BACKEND_PORT = 3005;

const BLOCKED_PREFIXES = ['172.25.', '172.17.', '172.18.', '172.19.', '169.254.'];

function normalizeHost(raw?: string | null): string | null {
  if (!raw) return null;
  let value = raw.trim().replace(/^exp:\/\//, '').replace(/^https?:\/\//, '');
  value = value.split('/')[0] ?? value;
  const host = value.split(':')[0]?.trim();
  if (!host || host === 'localhost' || host === '127.0.0.1') return null;
  if (host.includes('exp.direct') || host.includes('ngrok') || host.includes('tunnel')) return null;
  if (BLOCKED_PREFIXES.some((p) => host.startsWith(p))) return null;
  return host;
}

function parseHostFromCandidate(raw?: string | null): string | null {
  if (!raw) return null;
  let value = raw.trim().replace(/^exp:\/\//, '');
  value = value.split('/')[0] ?? value;
  return normalizeHost(value.split(':')[0]);
}

function getDevServerCandidates(): string[] {
  return [
    Constants.expoConfig?.hostUri,
    (Constants.expoGoConfig as { debuggerHost?: string } | null)?.debuggerHost,
    (Constants.manifest2 as { extra?: { expoClient?: { hostUri?: string } } } | null)?.extra?.expoClient
      ?.hostUri,
    (Constants.manifest as { debuggerHost?: string } | null)?.debuggerHost,
  ].filter((v): v is string => Boolean(v));
}

function scoreHost(host: string): number {
  if (BLOCKED_PREFIXES.some((p) => host.startsWith(p))) return 0;
  if (host.startsWith('192.168.')) return 100;
  if (host.startsWith('172.20.10.')) return 95;
  if (host.startsWith('10.')) return 90;
  if (host.startsWith('172.')) return 15;
  return 40;
}

function getLanHostFromExpo(): string | null {
  const hosts = getDevServerCandidates()
    .map(parseHostFromCandidate)
    .filter((h): h is string => Boolean(h));

  if (hosts.length === 0) return null;

  const unique = [...new Set(hosts)];
  unique.sort((a, b) => scoreHost(b) - scoreHost(a));
  return unique.find((h) => scoreHost(h) >= 15) ?? null;
}

function getEnvApiUrl(): string | null {
  const raw = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, '');
}

function getEnvSocketUrl(): string | null {
  const raw = process.env.EXPO_PUBLIC_SOCKET_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, '');
}

export function getApiBaseUrl(): string {
  const isWeb = (Platform as any).OS === "web";

  // On web, always use localhost — the browser runs on the same machine as the backend
  if (isWeb) {
    const envUrl = getEnvApiUrl();
    if (envUrl) {
      const localUrl = envUrl.replace(/\/\/[^:\/]+(:\d+)?/, '//localhost$1');
      console.log('[Config] Web → localhost:', localUrl);
      return localUrl;
    }
    return `http://localhost:${BACKEND_PORT}/api`;
  }

  const envUrl = getEnvApiUrl();
  if (envUrl) {
    console.log('[Config] Using EXPO_PUBLIC_API_URL:', envUrl);
    return envUrl;
  }

  const lanHost = getLanHostFromExpo();
  if (__DEV__ && lanHost) {
    const url = `http://${lanHost}:${BACKEND_PORT}/api`;
    console.log('[Config] API (device → backend):', url);
    return url;
  }

  // Last resort: emulator defaults.
  if (Platform.OS === 'android' && !Constants.isDevice) {
    const url = `http://10.0.2.2:${BACKEND_PORT}/api`;
    console.log('[Config] API (Android emulator fallback):', url);
    return url;
  }

  if (Platform.OS === 'ios' && !Constants.isDevice) {
    const url = `http://localhost:${BACKEND_PORT}/api`;
    console.log('[Config] API (iOS simulator fallback):', url);
    return url;
  }

  return `http://localhost:${BACKEND_PORT}/api`;
}

export function getSocketBaseUrl(): string {
  const isWeb = (Platform as any).OS === "web";

  const envSocket = getEnvSocketUrl();
  if (envSocket) {
    // On web, always use localhost
    if (isWeb) {
      const localUrl = envSocket.replace(/\/\/[^:\/]+(:\d+)?/, '//localhost$1');
      console.log('[Config] Web socket → localhost:', localUrl);
      return localUrl;
    }
    console.log('[Config] Using EXPO_PUBLIC_SOCKET_URL:', envSocket);
    return envSocket;
  }

  const api = getApiBaseUrl();
  return api.replace(/\/api$/, '/chat');
}

export function getNetworkHelpMessage(resolvedApiUrl?: string): string {
  const resolved = resolvedApiUrl ?? '(not resolved)';
  return [
    'Cannot reach the backend.',
    `Resolved API URL: ${resolved}`,
    '1. cd backend && npm run start:dev',
    '2. Turn OFF mobile data — use same Wi‑Fi as PC',
    '3. cd Dalaal-app && npm start',
    '4. Windows Firewall: allow TCP port 3005',
    '5. Android USB: npm run start:usb',
  ].join('\n');
}

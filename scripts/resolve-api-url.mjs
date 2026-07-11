#!/usr/bin/env node
/**
 * Finds PC LAN IP where backend :3002 responds, writes Dalaal-app/.env
 * Run automatically before npm start
 */
import { networkInterfaces } from 'node:os';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = join(__dirname, '..', 'Dalaal-app', '.env');
const BACKEND_PORT = 3005;

const BLOCKED = ['172.25.', '172.17.', '172.18.', '172.19.', '169.254.'];

function score(ip) {
  if (BLOCKED.some((p) => ip.startsWith(p))) return 0;
  if (ip.startsWith('192.168.')) return 100;
  if (ip.startsWith('172.20.10.')) return 95;
  if (ip.startsWith('10.')) return 90;
  if (ip.startsWith('172.')) return 15;
  return 40;
}

function collectHosts() {
  const hosts = [];
  for (const iface of Object.values(networkInterfaces())) {
    for (const cfg of iface || []) {
      if (cfg?.family === 'IPv4' && !cfg.internal) {
        hosts.push(cfg.address);
      }
    }
  }
  return [...new Set(hosts)].sort((a, b) => score(b) - score(a));
}

async function probe(host) {
  const url = `http://${host}:${BACKEND_PORT}/api/health`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) return false;
    const json = await res.json();
    const data = json?.data ?? json;
    return data?.database === 'connected' || data?.ok === true;
  } catch {
    return false;
  }
}

function updateEnv(apiUrl, socketUrl) {
  let content = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, 'utf8') : '';
  const lines = content.split('\n').filter((line) => {
    const t = line.trim();
    return (
      t &&
      !t.startsWith('EXPO_PUBLIC_API_URL=') &&
      !t.startsWith('EXPO_PUBLIC_SOCKET_URL=')
    );
  });

  lines.push(`EXPO_PUBLIC_API_URL=${apiUrl}`);
  lines.push(`EXPO_PUBLIC_SOCKET_URL=${socketUrl}`);
  lines.push('');

  writeFileSync(ENV_PATH, lines.join('\n'), 'utf8');
}

async function main() {
  const hosts = collectHosts();
  console.log('\n[resolve-api-url] Checking backend on port', BACKEND_PORT, '...\n');

  for (const host of hosts) {
    if (score(host) < 10) {
      console.log(`  skip ${host} (virtual adapter)`);
      continue;
    }
    process.stdout.write(`  try ${host} ... `);
    if (await probe(host)) {
      const apiUrl = `http://${host}:${BACKEND_PORT}/api`;
      const socketUrl = `http://${host}:${BACKEND_PORT}/chat`;
      console.log('OK');
      updateEnv(apiUrl, socketUrl);
      console.log(`\n  Phone API URL: ${apiUrl}`);
      console.log('  Written to Dalaal-app/.env');
      console.log('  Use same Wi‑Fi as this PC (turn off mobile data on phone).\n');
      return;
    }
    console.log('no');
  }

  console.warn('\n  Could not reach backend on any LAN IP.');
  console.warn('  Run: cd backend && npm run start:dev  (or npm run start:prod if already built)');
  console.warn('  Then run this script again or set EXPO_PUBLIC_API_URL in Dalaal-app/.env\n');
}

main();

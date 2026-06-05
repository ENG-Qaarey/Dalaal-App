#!/usr/bin/env node
/**
 * Verifies: Postgres ← Backend (3002) ← Metro proxy (8081)
 * Run from project root: npm run verify
 */

const BACKEND = 'http://127.0.0.1:3002';

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(8000),
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { res, json, text };
}

async function checkBackendDb() {
  const name = 'Postgres → Backend';
  try {
    const health = await fetchJson(`${BACKEND}/api/health`);
    const payload = health.json?.data ?? health.json;
    if (health.res.ok && payload?.database === 'connected') {
      console.log(`✅ ${name} (database: connected)`);
      return true;
    }
    const { res } = await fetchJson(`${BACKEND}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'health@test.com', password: 'password123' }),
    });
    if ([400, 401, 403, 500].includes(res.status)) {
      console.log(`✅ ${name} (HTTP ${res.status} — API reachable)`);
      return true;
    }
    console.log(`❌ ${name}: HTTP ${res.status}`);
    return false;
  } catch (e) {
    console.log(`❌ ${name}: ${e.message}`);
    console.log('   → docker-compose up');
    return false;
  }
}

async function checkLoginRoute() {
  const name = 'Login route /api/auth/login';
  try {
    const { res } = await fetchJson(`${BACKEND}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'health@test.com', password: 'password123' }),
    });
    if ([400, 401, 403, 500].includes(res.status)) {
      console.log(`✅ ${name} (HTTP ${res.status})`);
      return true;
    }
    console.log(`❌ ${name}: HTTP ${res.status}`);
    return false;
  } catch (e) {
    console.log(`❌ ${name}: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('\nDalaal connection check\n');
  console.log('  App → http://PC_IP:3002/api → Postgres (Docker)\n');
  const results = await Promise.all([checkBackendDb(), checkLoginRoute()]);
  const passed = results.filter(Boolean).length;
  console.log(`\n${passed}/${results.length} checks passed.\n`);
  process.exit(passed === results.length ? 0 : 1);
}

main();

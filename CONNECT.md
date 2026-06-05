# Dalaal — Connection guide

## Chain (physical phone)

```
Dalaal-app → http://YOUR_PC_IP:3002/api → Backend (Docker) → Postgres
```

Expo Metro (port **8081**) only serves the app bundle — **not** the API.

## Start

**Terminal 1** (project root):

```bash
docker-compose up
```

**Terminal 2**:

```bash
cd Dalaal-app
npm install
npm start
```

Reload Expo Go after starting.

## Phone must use Wi‑Fi (not mobile data)

Turn **off LTE/mobile data** on the phone. Use the **same network** as the PC (same Wi‑Fi or PC connected to phone hotspot).

## Windows Firewall (required for phone login)

Run **PowerShell as Administrator**:

```powershell
cd D:/LocalD/All-MyTest/ICT-Project/Dalaal
./scripts/allow-firewall.ps1
```

## Auto API URL

`npm start` runs `resolve-api-url.mjs` and writes `EXPO_PUBLIC_API_URL` to `Dalaal-app/.env` (e.g. `http://172.20.10.5:3002/api`).

**Android USB:** `npm run start:usb` (USB cable + `adb reverse`).

## Verify backend

```bash
curl http://127.0.0.1:3002/api/health
```

Expect `"database":"connected"`.

## pgAdmin

| Field | Value |
|-------|--------|
| Port | **5433** |
| Database | Dalaal-App |
| User / Password | postgres / 1234 |

## Troubleshooting

| Error | Fix |
|-------|-----|
| HTTP 404 | App was hitting :8081 — reload after `npm start`; URL must be `:3002/api` |
| Timeout | Allow firewall port 3002; same Wi‑Fi |
| Invalid credentials | Register first (fresh DB) or use correct email/password |

In Expo logs, look for: `[Config] API (device → backend): http://192.168.x.x:3002/api`

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## 📱 Mobile Connectivity (API Setup)

If you are testing on a **real device** (physical phone), follow these steps to ensure the app can connect to your backend:

### 1. Update your IP Address
The app needs to know where your backend is running. 
1. Open a terminal and run `ipconfig`.
2. Find your **IPv4 Address** (e.g., `172.20.10.2` or `192.168.1.X`).
3. Open `src/services/api.ts` and update the `DEV_IP` constant:
   ```typescript
   const DEV_IP = 'YOUR_IP_HERE';
   ```

### 2. Common Issues (Timeouts)
If you get an **Axios Timeout** or `Network Error`:
- **Same Wi-Fi**: Ensure both your phone and computer are on the **exact same Wi-Fi network**.
- **Windows Firewall**: Windows might block the connection. Run this in PowerShell (Admin) to allow port 3001:
  ```powershell
  New-NetFirewallRule -DisplayName "Dalaal Backend" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
  ```
- **Backend Running**: Make sure the backend is actually running (`npm run start:dev` in the `/backend` folder).

---

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

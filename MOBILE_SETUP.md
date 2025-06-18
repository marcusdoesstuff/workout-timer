# Mobile Setup Guide - Android App with Capacitor

This guide will help you set up your Workout Timer as a standalone Android app using Capacitor.js.

## ✅ Prerequisites Completed

- ✅ Android Studio and SDK installed
- ✅ Capacitor.js installed and configured
- ✅ Android platform added to the project
- ✅ Mobile-optimized features integrated:
  - Haptic feedback for button presses and activity changes
  - Keep screen awake during workouts
  - Status bar styling
  - Portrait orientation lock

## 📱 Mobile Features Added

Your app now includes these mobile-specific enhancements:

- **Haptic Feedback**: Vibration feedback when switching activities and pressing buttons
- **Screen Wake Lock**: Prevents screen from turning off during active workouts
- **Status Bar Control**: Consistent status bar styling
- **Portrait Lock**: App locked to portrait orientation for better workout experience

## 🚀 Building and Running

### Option 1: Open in Android Studio (Recommended)
```bash
npm run cap:android
```
This will build the web app, sync with Capacitor, and open Android Studio where you can:
- Build and run on connected device/emulator
- Generate signed APK for distribution
- Debug and test the app

### Option 2: Direct Run (if device is connected)
```bash
npm run cap:run:android
```
This will build and directly run on a connected Android device or emulator.

### Option 3: Manual Build Process
```bash
# 1. Build the web app
npm run build

# 2. Copy web assets to Android project
npx cap copy

# 3. Sync Capacitor plugins
npx cap sync

# 4. Open Android Studio
npx cap open android
```

## 📋 Android Studio Setup

Once Android Studio opens:

1. **Wait for Gradle sync** to complete
2. **Connect your Android device** or start an emulator
3. **Click the "Run" button** (green play icon) or press `Shift + F10`

## 🔧 App Configuration

The app is configured with:
- **App ID**: `com.marcusdoesstuff.workouttimer`
- **App Name**: "Workout Timer"
- **Permissions**:
  - `INTERNET` - For web content loading
  - `WAKE_LOCK` - To keep screen awake during workouts
  - `VIBRATE` - For haptic feedback
  - `ACCESS_NETWORK_STATE` - For network status

## 📦 Building APK for Distribution

In Android Studio:

1. Go to **Build** → **Generate Signed Bundle / APK**
2. Choose **APK**
3. Create a new keystore or use existing one
4. Choose **release** build variant
5. Click **Finish**

The APK will be generated in `android/app/release/` directory.

## 🔄 Making Changes

When you update your React code:

```bash
# Rebuild and sync
npm run cap:build

# Then in Android Studio, click "Sync Project with Gradle Files"
# Or just run the app again
```

## 🐛 Troubleshooting

### Common Issues:

1. **Gradle sync fails**
   - Ensure Android SDK is properly installed
   - Check `android/gradle.properties` for correct SDK paths

2. **App doesn't update**
   - Run `npm run cap:build` to rebuild
   - In Android Studio: Build → Clean Project, then rebuild

3. **Plugins not working**
   - Ensure all Capacitor plugins are installed: `npm install`
   - Run `npx cap sync` to sync plugins

4. **Permission issues**
   - Check `android/app/src/main/AndroidManifest.xml` for required permissions

## 📱 Testing on Device

1. **Enable Developer Options** on your Android device
2. **Enable USB Debugging**
3. **Connect via USB**
4. **Allow USB Debugging** when prompted
5. **Run from Android Studio**

Your Workout Timer app is now ready to use as a standalone Android application! 🎉

## 🔧 Advanced Configuration

You can further customize the app by modifying:
- `capacitor.config.ts` - Capacitor configuration
- `android/app/src/main/AndroidManifest.xml` - Android permissions and settings
- `android/app/src/main/res/` - App icons and resources 
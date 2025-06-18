import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.marcusdoesstuff.workouttimer',
  appName: 'Workout Timer',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    StatusBar: {
      style: 'DEFAULT',
      backgroundColor: '#ffffff'
    },
    KeepAwake: {
      // Plugin will be used programmatically
    }
  }
};

export default config;

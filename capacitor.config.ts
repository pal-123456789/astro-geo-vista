import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.2311cd2f77604d04aa2d6f88c63b98e8',
  appName: 'TerraPulse',
  webDir: 'dist',
  server: {
    url: 'https://2311cd2f-7760-4d04-aa2d-6f88c63b98e8.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav"
    }
  }
};

export default config;
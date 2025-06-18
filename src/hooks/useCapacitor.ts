import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { KeepAwake } from '@capacitor-community/keep-awake';

export const useCapacitor = () => {
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    if (isNative) {
      // Set status bar style on app load
      StatusBar.setStyle({ style: Style.Default });
      StatusBar.setBackgroundColor({ color: '#ffffff' });
    }
  }, [isNative]);

  const triggerHapticFeedback = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (isNative) {
      try {
        await Haptics.impact({ style });
      } catch (error) {
        console.warn('Haptic feedback not available:', error);
      }
    }
  };

  const keepScreenAwake = async () => {
    if (isNative) {
      try {
        await KeepAwake.keepAwake();
      } catch (error) {
        console.warn('Keep awake not available:', error);
      }
    }
  };

  const allowScreenSleep = async () => {
    if (isNative) {
      try {
        await KeepAwake.allowSleep();
      } catch (error) {
        console.warn('Allow sleep not available:', error);
      }
    }
  };

  const setStatusBarStyle = async (style: Style) => {
    if (isNative) {
      try {
        await StatusBar.setStyle({ style });
      } catch (error) {
        console.warn('Status bar style not available:', error);
      }
    }
  };

  return {
    isNative,
    triggerHapticFeedback,
    keepScreenAwake,
    allowScreenSleep,
    setStatusBarStyle,
    ImpactStyle,
    StatusBarStyle: Style
  };
}; 
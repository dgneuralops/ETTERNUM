// Native shell (Capacitor) setup. No-op on the web.
import { Capacitor } from '@capacitor/core';

export async function setupNative() {
  if (!Capacitor.isNativePlatform()) return;
  document.documentElement.classList.add('native');
  const [{ StatusBar, Style }, { SplashScreen }] = await Promise.all([import('@capacitor/status-bar'), import('@capacitor/splash-screen')]);
  try {
    await StatusBar.setStyle({ style: Style.Dark });
    if (Capacitor.getPlatform() === 'android') await StatusBar.setOverlaysWebView({ overlay: true });
  } catch { /* plugin unavailable */ }
  SplashScreen.hide().catch(() => {});
}

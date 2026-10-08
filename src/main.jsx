import { createRoot } from 'react-dom/client';
import Etternum from './screens/Etternum.jsx';
import { setupNative } from './lib/native.js';
import './styles/global.css';
import './styles/pseudo.css';

createRoot(document.getElementById('root')).render(
  // No StrictMode: the screens' mount effects seed demo conversations and timers once.
  <Etternum />,
);

setupNative();

// Installable app (PWA): offline shell + cached images. Skipped inside the native shell (Capacitor
// serves files itself) and in dev.
if (import.meta.env.PROD && 'serviceWorker' in navigator && !window.Capacitor?.isNativePlatform?.()) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase with user's zeroinertia-myself project credentials
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize analytics safely if supported in browser environment
export const analyticsPromise = (async () => {
  if (typeof window === 'undefined') return null;
  try {
    // Prevent IndexedDB security exceptions in sandboxed or cross-origin iframes
    if (!window.indexedDB) return null;
    const supported = await isSupported().catch(() => false);
    if (supported) {
      return getAnalytics(app);
    }
  } catch {
    // Analytics fallback for restricted iframe contexts
  }
  return null;
})();

// Connection test as required by Firebase integration guidelines (fail-safe non-blocking)
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    // Graceful offline or sandbox fallback
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client operates with local persistent cache.');
    }
  }
}

// Run connection test non-blockingly
testConnection().catch(() => {});

export default app;

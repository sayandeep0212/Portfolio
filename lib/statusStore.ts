import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface LaptopStatus {
  online: boolean;
  lastSeen: number;
}

let memoryStatus: LaptopStatus = {
  online: false,
  lastSeen: 0,
};

// Threshold for considering laptop online: 60 seconds (laptop sends pulse every 20 seconds)
const ONLINE_THRESHOLD_MS = 60 * 1000;

export async function getLaptopStatus(): Promise<LaptopStatus> {
  const now = Date.now();

  try {
    const docRef = doc(db, 'analytics', 'device');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const lastSeen =
        typeof data.lastSeen === 'number'
          ? data.lastSeen
          : memoryStatus.lastSeen;

      const isOnline = lastSeen > 0 && now - lastSeen < ONLINE_THRESHOLD_MS;

      memoryStatus = {
        online: isOnline,
        lastSeen,
      };

      return memoryStatus;
    }
  } catch {}

  const isOnline = memoryStatus.lastSeen > 0 && now - memoryStatus.lastSeen < ONLINE_THRESHOLD_MS;
  return {
    online: isOnline,
    lastSeen: memoryStatus.lastSeen,
  };
}

export async function setLaptopHeartbeat(): Promise<LaptopStatus> {
  const now = Date.now();
  memoryStatus = {
    online: true,
    lastSeen: now,
  };

  try {
    const docRef = doc(db, 'analytics', 'device');
    await setDoc(
      docRef,
      {
        lastSeen: now,
        device: 'Windows Laptop',
        platform: 'win32',
      },
      { merge: true }
    );
  } catch {}

  return memoryStatus;
}

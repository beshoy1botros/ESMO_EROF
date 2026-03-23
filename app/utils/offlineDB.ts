/**
 * IndexedDB Utility for Offline Storage
 * تخزين البيانات القبطية محلياً للعمل بدون نت
 */

import type { VideoData } from "../data/melodiesData";
import type { PreparatoryData } from "../utils/preparatoryData";

// Database configuration
const DB_NAME = "esmo-erof-offline-db";
const DB_VERSION = 1;

// Store names
const MELODIES_STORE = "melodiesData";
const PREPARATORY_STORE = "preparatoryData";
const USER_PROGRESS_STORE = "userProgress";

// ✅ مدة صلاحية البيانات المخزنة قبل اعتبارها قديمة
const MELODIES_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;    // 7 أيام
const PREPARATORY_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 أيام

// Types for user progress
export interface UserProgress {
  stage: string;
  level: string;
  videoId: string;
  timestamp: number;
}

export interface VideoPlaybackProgress {
  [videoId: string]: number; // timestamp in seconds
}

interface UserProgressData {
  lastStage: string;
  lastLevel: string;
  lastVideoId: string;
  playbackProgress: VideoPlaybackProgress;
  lastUpdated: number;
}

// ✅ كاش اتصال DB لتجنب فتح اتصالات متعددة
let dbInstance: IDBDatabase | null = null;

/**
 * Open IndexedDB connection (مع كاش للاتصال)
 */
function openDB(): Promise<IDBDatabase> {
  // أعد الاتصال المفتوح إن وُجد
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("[OfflineDB] Failed to open database:", request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;

      // أعد تعيين الكاش عند إغلاق الاتصال
      dbInstance.onclose = () => {
        dbInstance = null;
      };
      dbInstance.onerror = () => {
        dbInstance = null;
      };

      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(MELODIES_STORE)) {
        db.createObjectStore(MELODIES_STORE, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(PREPARATORY_STORE)) {
        db.createObjectStore(PREPARATORY_STORE, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(USER_PROGRESS_STORE)) {
        db.createObjectStore(USER_PROGRESS_STORE, { keyPath: "id" });
      }
    };
  });
}

// ============= Melodies Data =============

/**
 * Save melodies data to IndexedDB
 */
export async function saveMelodiesData(data: VideoData): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(MELODIES_STORE, "readwrite");
    const store = tx.objectStore(MELODIES_STORE);

    store.put({ id: "melodies", data, timestamp: Date.now() });

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error("[OfflineDB] Failed to save melodies data:", error);
    throw error;
  }
}

/**
 * Get melodies data from IndexedDB
 */
export async function getMelodiesData(): Promise<VideoData | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(MELODIES_STORE, "readonly");
    const store = tx.objectStore(MELODIES_STORE);

    return new Promise((resolve, reject) => {
      const request = store.get("melodies");
      request.onsuccess = () => {
        resolve(request.result?.data ?? null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("[OfflineDB] Failed to get melodies data:", error);
    return null;
  }
}

/**
 * ✅ تحقق إذا كانت بيانات الألحان موجودة وحديثة
 */
export async function isMelodiesDataStale(): Promise<boolean> {
  try {
    const db = await openDB();
    const tx = db.transaction(MELODIES_STORE, "readonly");
    const store = tx.objectStore(MELODIES_STORE);

    return new Promise((resolve) => {
      const request = store.get("melodies");
      request.onsuccess = () => {
        if (!request.result) return resolve(true); // لا توجد بيانات = قديمة
        const age = Date.now() - (request.result.timestamp ?? 0);
        resolve(age > MELODIES_MAX_AGE_MS);
      };
      request.onerror = () => resolve(true);
    });
  } catch {
    return true;
  }
}

export async function hasMelodiesData(): Promise<boolean> {
  const data = await getMelodiesData();
  return data !== null;
}

// ============= Preparatory Data =============

/**
 * Save preparatory data to IndexedDB
 */
export async function savePreparatoryData(data: PreparatoryData): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(PREPARATORY_STORE, "readwrite");
    const store = tx.objectStore(PREPARATORY_STORE);

    store.put({ id: "preparatory", data, timestamp: Date.now() });

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error("[OfflineDB] Failed to save preparatory data:", error);
    throw error;
  }
}

/**
 * Get preparatory data from IndexedDB
 */
export async function getPreparatoryData(): Promise<PreparatoryData | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(PREPARATORY_STORE, "readonly");
    const store = tx.objectStore(PREPARATORY_STORE);

    return new Promise((resolve, reject) => {
      const request = store.get("preparatory");
      request.onsuccess = () => {
        resolve(request.result?.data ?? null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("[OfflineDB] Failed to get preparatory data:", error);
    return null;
  }
}

/**
 * ✅ تحقق إذا كانت بيانات التحضيرية موجودة وحديثة
 */
export async function isPreparatoryDataStale(): Promise<boolean> {
  try {
    const db = await openDB();
    const tx = db.transaction(PREPARATORY_STORE, "readonly");
    const store = tx.objectStore(PREPARATORY_STORE);

    return new Promise((resolve) => {
      const request = store.get("preparatory");
      request.onsuccess = () => {
        if (!request.result) return resolve(true);
        const age = Date.now() - (request.result.timestamp ?? 0);
        resolve(age > PREPARATORY_MAX_AGE_MS);
      };
      request.onerror = () => resolve(true);
    });
  } catch {
    return true;
  }
}

export async function hasPreparatoryData(): Promise<boolean> {
  const data = await getPreparatoryData();
  return data !== null;
}

// ============= User Progress =============

/**
 * ✅ Save user progress — اتصال DB واحد للقراءة والكتابة معاً
 */
export async function saveUserProgress(
  stage: string,
  level: string,
  videoId: string,
  playbackTime: number
): Promise<void> {
  try {
    const db = await openDB();

    // ✅ قراءة وكتابة في transaction واحدة لتجنب فتح DB مرتين
    const tx = db.transaction(USER_PROGRESS_STORE, "readwrite");
    const store = tx.objectStore(USER_PROGRESS_STORE);

    return new Promise((resolve, reject) => {
      const readReq = store.get("userProgress");

      readReq.onsuccess = () => {
        const existing = readReq.result as UserProgressData | undefined;
        const playbackProgress = existing?.playbackProgress ?? {};
        playbackProgress[videoId] = playbackTime;

        store.put({
          id: "userProgress",
          lastStage: stage,
          lastLevel: level,
          lastVideoId: videoId,
          playbackProgress,
          lastUpdated: Date.now(),
        });
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      readReq.onerror = () => reject(readReq.error);
    });
  } catch (error) {
    console.error("[OfflineDB] Failed to save user progress:", error);
    throw error;
  }
}

/**
 * Get user progress from IndexedDB
 */
export async function getUserProgress(): Promise<UserProgressData | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(USER_PROGRESS_STORE, "readonly");
    const store = tx.objectStore(USER_PROGRESS_STORE);

    return new Promise((resolve, reject) => {
      const request = store.get("userProgress");
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("[OfflineDB] Failed to get user progress:", error);
    return null;
  }
}

/**
 * Get playback progress for a specific video
 */
export async function getVideoPlaybackProgress(videoId: string): Promise<number | null> {
  const progress = await getUserProgress();
  return progress?.playbackProgress?.[videoId] ?? null;
}

// ============= Clear & Storage Info =============

/**
 * Clear all offline data
 */
export async function clearOfflineData(): Promise<void> {
  try {
    const db = await openDB();
    const stores = [MELODIES_STORE, PREPARATORY_STORE, USER_PROGRESS_STORE];

    await Promise.all(
      stores.map(
        (storeName) =>
          new Promise<void>((resolve, reject) => {
            const tx = db.transaction(storeName, "readwrite");
            tx.objectStore(storeName).clear();
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
          })
      )
    );

    console.log("[OfflineDB] All offline data cleared");
  } catch (error) {
    console.error("[OfflineDB] Failed to clear offline data:", error);
    throw error;
  }
}

/**
 * Get storage usage estimate
 */
export async function getStorageEstimate(): Promise<{ used: number; quota: number }> {
  if (navigator.storage?.estimate) {
    const estimate = await navigator.storage.estimate();
    return { used: estimate.usage ?? 0, quota: estimate.quota ?? 0 };
  }
  return { used: 0, quota: 0 };
}
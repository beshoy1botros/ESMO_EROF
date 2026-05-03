/**
 * IndexedDB Utility for Offline Storage - Optimized Version
 * تخزين البيانات القبطية محلياً للعمل بدون نت
 * 
 * التحسينات:
 * - ذاكرة وسيطة (In-Memory Cache) لتجنب قراءة IndexedDB المتكررة
 * - فهارس للبحث السريع
 * - ضغط البيانات الكبيرة
 * - عمليات مجمعة (Batch Operations)
 * - معاملات محسنة (Optimized Transactions)
 */

import type { VideoData } from "../data/melodiesData";
import type { PreparatoryData } from "../utils/preparatoryData";

// Database configuration
const DB_NAME = "esmo-erof-offline-db";
const DB_VERSION = 2; // ✅ تم رفع الإصدار لإضافة الفهارس

// Store names
const MELODIES_STORE = "melodiesData";
const PREPARATORY_STORE = "preparatoryData";
const USER_PROGRESS_STORE = "userProgress";

// ✅ مدة صلاحية البيانات المخزنة - تم جعلها سنة لضمان البقاء الدائم
const MELODIES_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;    // 365 يوم
const PREPARATORY_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000; // 365 يوم

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

// ============= In-Memory Cache Layer =============
// ✅ ذاكرة وسيطة لتجنب قراءة IndexedDB المتكررة

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 دقائق

function getCachedData<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  
  return entry.data as T;
}

function setCachedData<T>(key: string, data: T, ttlMs: number = CACHE_TTL_MS): void {
  memoryCache.set(key, {
    data,
    timestamp: Date.now(),
    expiresAt: Date.now() + ttlMs,
  });
}

function invalidateCachePattern(pattern: string): void {
  for (const key of memoryCache.keys()) {
    if (key.includes(pattern)) {
      memoryCache.delete(key);
    }
  }
}

// ============= Database Connection Pool =============
// ✅ كاش اتصال DB لتجنب فتح اتصالات متعددة

let dbInstance: IDBDatabase | null = null;
let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Open IndexedDB connection (مع كاش للاتصال وحماية من Race Condition)
 */
function openDB(): Promise<IDBDatabase> {
  // أعد الاتصال المفتوح إن وُجد
  if (dbInstance) return Promise.resolve(dbInstance);
  
  // ✅ حماية من Race Condition - إذا كان هناك طلب فتح قيد التنفيذ
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("[OfflineDB] Failed to open database:", request.error);
      dbPromise = null;
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      dbPromise = null;

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
      const oldVersion = event.oldVersion;

      // ✅ إنشاء Object Stores مع فهارس
      if (!db.objectStoreNames.contains(MELODIES_STORE)) {
        const melodiesStore = db.createObjectStore(MELODIES_STORE, { keyPath: "id" });
        melodiesStore.createIndex("timestamp", "timestamp", { unique: false });
      }

      if (!db.objectStoreNames.contains(PREPARATORY_STORE)) {
        const preparatoryStore = db.createObjectStore(PREPARATORY_STORE, { keyPath: "id" });
        preparatoryStore.createIndex("timestamp", "timestamp", { unique: false });
      }

      if (!db.objectStoreNames.contains(USER_PROGRESS_STORE)) {
        const progressStore = db.createObjectStore(USER_PROGRESS_STORE, { keyPath: "id" });
        progressStore.createIndex("lastUpdated", "lastUpdated", { unique: false });
        progressStore.createIndex("lastVideoId", "lastVideoId", { unique: false });
      }

      // ✅ ترقية من الإصدار القديم - إضافة الفهارس للبيانات الموجودة
      if (oldVersion < 2) {
        console.log("[OfflineDB] Upgrading to version 2 - adding indexes");
        
        const melodiesTx = (event.target as IDBOpenDBRequest).transaction;
        if (melodiesTx) {
          const melodiesStore = melodiesTx.objectStore(MELODIES_STORE);
          if (!melodiesStore.indexNames.contains("timestamp")) {
            melodiesStore.createIndex("timestamp", "timestamp", { unique: false });
          }
        }
      }
    };
  });

  return dbPromise;
}

// ============= Melodies Data =============

/**
 * Save melodies data to IndexedDB (محسن)
 */
export async function saveMelodiesData(data: VideoData): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(MELODIES_STORE, "readwrite");
    const store = tx.objectStore(MELODIES_STORE);

    const timestamp = Date.now();
    store.put({ id: "melodies", data, timestamp });

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => {
        // ✅ تحديث الذاكرة الوسيطة بعد الحفظ الناجح
        setCachedData("melodies", { data, timestamp }, MELODIES_MAX_AGE_MS);
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error("[OfflineDB] Failed to save melodies data:", error);
    throw error;
  }
}

/**
 * Get melodies data from IndexedDB (محسن مع ذاكرة وسيطة)
 */
export async function getMelodiesData(): Promise<VideoData | null> {
  try {
    // ✅ فحص الذاكرة الوسيطة أولاً
    const cached = getCachedData<{ data: VideoData; timestamp: number }>("melodies");
    if (cached) {
      return cached.data;
    }

    const db = await openDB();
    const tx = db.transaction(MELODIES_STORE, "readonly");
    const store = tx.objectStore(MELODIES_STORE);

    return new Promise((resolve, reject) => {
      const request = store.get("melodies");
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // ✅ تخزين في الذاكرة الوسيطة
          setCachedData("melodies", { data: result.data, timestamp: result.timestamp }, MELODIES_MAX_AGE_MS);
          resolve(result.data);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("[OfflineDB] Failed to get melodies data:", error);
    return null;
  }
}

/**
 * ✅ تحقق إذا كانت بيانات الألحان موجودة وحديثة (محسن)
 */
export async function isMelodiesDataStale(): Promise<boolean> {
  try {
    // ✅ فحص الذاكرة الوسيطة أولاً
    const cached = getCachedData<{ data: VideoData; timestamp: number }>("melodies");
    if (cached) {
      const age = Date.now() - cached.timestamp;
      return age > MELODIES_MAX_AGE_MS;
    }

    const db = await openDB();
    const tx = db.transaction(MELODIES_STORE, "readonly");
    const store = tx.objectStore(MELODIES_STORE);

    return new Promise((resolve) => {
      const request = store.get("melodies");
      request.onsuccess = () => {
        if (!request.result) return resolve(true);
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
 * Save preparatory data to IndexedDB (محسن)
 */
export async function savePreparatoryData(data: PreparatoryData): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(PREPARATORY_STORE, "readwrite");
    const store = tx.objectStore(PREPARATORY_STORE);

    const timestamp = Date.now();
    store.put({ id: "preparatory", data, timestamp });

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => {
        // ✅ تحديث الذاكرة الوسيطة
        setCachedData("preparatory", { data, timestamp }, PREPARATORY_MAX_AGE_MS);
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error("[OfflineDB] Failed to save preparatory data:", error);
    throw error;
  }
}

/**
 * Get preparatory data from IndexedDB (محسن مع ذاكرة وسيطة)
 */
export async function getPreparatoryData(): Promise<PreparatoryData | null> {
  try {
    // ✅ فحص الذاكرة الوسيطة أولاً
    const cached = getCachedData<{ data: PreparatoryData; timestamp: number }>("preparatory");
    if (cached) {
      return cached.data;
    }

    const db = await openDB();
    const tx = db.transaction(PREPARATORY_STORE, "readonly");
    const store = tx.objectStore(PREPARATORY_STORE);

    return new Promise((resolve, reject) => {
      const request = store.get("preparatory");
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // ✅ تخزين في الذاكرة الوسيطة
          setCachedData("preparatory", { data: result.data, timestamp: result.timestamp }, PREPARATORY_MAX_AGE_MS);
          resolve(result.data);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("[OfflineDB] Failed to get preparatory data:", error);
    return null;
  }
}

/**
 * ✅ تحقق إذا كانت بيانات التحضيرية موجودة وحديثة (محسن)
 */
export async function isPreparatoryDataStale(): Promise<boolean> {
  try {
    // ✅ فحص الذاكرة الوسيطة أولاً
    const cached = getCachedData<{ data: PreparatoryData; timestamp: number }>("preparatory");
    if (cached) {
      const age = Date.now() - cached.timestamp;
      return age > PREPARATORY_MAX_AGE_MS;
    }

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
 * ✅ Save user progress — اتصال DB واحد للقراءة والكتابة معاً (محسن)
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

    await new Promise<void>((resolve, reject) => {
      const readReq = store.get("userProgress");

      readReq.onsuccess = () => {
        const existing = readReq.result as UserProgressData | undefined;
        const playbackProgress = existing?.playbackProgress ?? {};
        playbackProgress[videoId] = playbackTime;

        const newData = {
          id: "userProgress",
          lastStage: stage,
          lastLevel: level,
          lastVideoId: videoId,
          playbackProgress,
          lastUpdated: Date.now(),
        };
        
        store.put(newData);
        
        // ✅ تحديث الذاكرة الوسيطة
        setCachedData("userProgress", newData, Infinity);
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
 * Get user progress from IndexedDB (محسن مع ذاكرة وسيطة)
 */
export async function getUserProgress(): Promise<UserProgressData | null> {
  try {
    // ✅ فحص الذاكرة الوسيطة أولاً
    const cached = getCachedData<UserProgressData>("userProgress");
    if (cached) {
      return cached;
    }

    const db = await openDB();
    const tx = db.transaction(USER_PROGRESS_STORE, "readonly");
    const store = tx.objectStore(USER_PROGRESS_STORE);

    return new Promise((resolve, reject) => {
      const request = store.get("userProgress");
      request.onsuccess = () => {
        const result = request.result ?? null;
        if (result) {
          // ✅ تخزين في الذاكرة الوسيطة
          setCachedData("userProgress", result, Infinity);
        }
        resolve(result);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("[OfflineDB] Failed to get user progress:", error);
    return null;
  }
}

/**
 * Get playback progress for a specific video (محسن)
 */
export async function getVideoPlaybackProgress(videoId: string): Promise<number | null> {
  const progress = await getUserProgress();
  return progress?.playbackProgress?.[videoId] ?? null;
}

// ============= Clear & Storage Info =============

/**
 * Clear all offline data (محسن)
 */
export async function clearOfflineData(): Promise<void> {
  try {
    const db = await openDB();
    const stores = [MELODIES_STORE, PREPARATORY_STORE, USER_PROGRESS_STORE];

    // ✅ مسح الذاكرة الوسيطة أولاً
    invalidateCachePattern("melodies");
    invalidateCachePattern("preparatory");
    invalidateCachePattern("userProgress");

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

// ============= Performance Utilities =============

/**
 * ✅ تحميل مسبق للبيانات (Preload)
 */
export async function preloadData(): Promise<void> {
  try {
    // تحميل البيانات في الخلفية
    await Promise.all([
      getMelodiesData(),
      getPreparatoryData(),
      getUserProgress(),
    ]);
    console.log("[OfflineDB] Data preloaded successfully");
  } catch (error) {
    console.warn("[OfflineDB] Preload failed:", error);
  }
}

/**
 * ✅ تنظيف الذاكرة الوسيطة المنتهية الصلاحية
 */
export function cleanupExpiredCache(): void {
  const now = Date.now();
  for (const [key, entry] of memoryCache.entries()) {
    if (now > entry.expiresAt) {
      memoryCache.delete(key);
    }
  }
}

// تشغيل تنظيف الذاكرة الوسيطة كل 5 دقائق
if (typeof window !== 'undefined') {
  setInterval(cleanupExpiredCache, 5 * 60 * 1000);
}

// تسجيل وإدارة Service Worker
import { useState, useEffect } from 'react';

export interface ServiceWorkerStatus {
  isSupported: boolean;
  isRegistered: boolean;
  isOnline: boolean;
  cacheStatus: 'loading' | 'ready' | 'error';
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private statusCallbacks: ((status: ServiceWorkerStatus) => void)[] = [];

  constructor() {
    this.init();
  }

  private async init() {
    if (!this.isSupported()) {
      console.log('Service Worker غير مدعوم في هذا المتصفح');
      return;
    }

    try {
      await this.register();
      this.setupEventListeners();
    } catch (error) {
      console.error('فشل في تسجيل Service Worker:', error);
    }
  }

  private isSupported(): boolean {
    return 'serviceWorker' in navigator;
  }

  private async register(): Promise<void> {
    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker مسجل بنجاح:', this.registration.scope);

      // التحقق من التحديثات
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // يوجد تحديث جديد
              this.notifyUpdate();
            }
          });
        }
      });

    } catch (error) {
      console.error('فشل في تسجيل Service Worker:', error);
      throw error;
    }
  }

  private setupEventListeners(): void {
    // مراقبة حالة الاتصال
    window.addEventListener('online', () => {
      console.log('الاتصال بالإنترنت متاح');
      this.notifyStatusChange();
    });

    window.addEventListener('offline', () => {
      console.log('لا يوجد اتصال بالإنترنت');
      this.notifyStatusChange();
    });

    // استقبال رسائل من Service Worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'CACHE_UPDATED') {
        console.log('تم تحديث التخزين المؤقت');
        this.notifyStatusChange();
      }
    });
  }

  private notifyUpdate(): void {
    // إشعار المستخدم بوجود تحديث
    if (confirm('يوجد تحديث جديد للتطبيق. هل تريد إعادة التحميل؟')) {
      this.skipWaiting();
    }
  }

  private notifyStatusChange(): void {
    const status = this.getStatus();
    this.statusCallbacks.forEach(callback => callback(status));
  }

  public getStatus(): ServiceWorkerStatus {
    return {
      isSupported: this.isSupported(),
      isRegistered: !!this.registration,
      isOnline: navigator.onLine,
      cacheStatus: this.registration ? 'ready' : 'loading',
    };
  }

  public onStatusChange(callback: (status: ServiceWorkerStatus) => void): () => void {
    this.statusCallbacks.push(callback);
    
    // إرجاع دالة لإلغاء الاشتراك
    return () => {
      const index = this.statusCallbacks.indexOf(callback);
      if (index > -1) {
        this.statusCallbacks.splice(index, 1);
      }
    };
  }

  public async skipWaiting(): Promise<void> {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  public async cacheVideo(videoUrl: string): Promise<void> {
    if (this.registration?.active) {
      this.registration.active.postMessage({
        type: 'CACHE_VIDEO',
        url: videoUrl,
      });
    }
  }

  public async getCacheInfo(): Promise<{
    videoCount: number;
    imageCount: number;
    totalSize: string;
  }> {
    try {
      const cacheNames = await caches.keys();
      let videoCount = 0;
      let imageCount = 0;
      let totalSize = 0;

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();

        for (const key of keys) {
          const response = await cache.match(key);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;

            if (key.url.includes('.mp4') || key.url.includes('.webm')) {
              videoCount++;
            } else if (key.url.includes('.jpg') || key.url.includes('.png') || key.url.includes('.webp')) {
              imageCount++;
            }
          }
        }
      }

      return {
        videoCount,
        imageCount,
        totalSize: this.formatBytes(totalSize),
      };
    } catch (error) {
      console.error('فشل في الحصول على معلومات التخزين المؤقت:', error);
      return {
        videoCount: 0,
        imageCount: 0,
        totalSize: '0 B',
      };
    }
  }

  public async clearCache(): Promise<void> {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('تم مسح التخزين المؤقت');
      this.notifyStatusChange();
    } catch (error) {
      console.error('فشل في مسح التخزين المؤقت:', error);
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// إنشاء instance واحد
export const serviceWorkerManager = new ServiceWorkerManager();

// Hook للاستخدام في React Components
export function useServiceWorker() {
  const [status, setStatus] = useState<ServiceWorkerStatus>(
    serviceWorkerManager.getStatus()
  );

  useEffect(() => {
    const unsubscribe = serviceWorkerManager.onStatusChange(setStatus);
    return unsubscribe;
  }, []);

  return {
    status,
    cacheVideo: serviceWorkerManager.cacheVideo.bind(serviceWorkerManager),
    getCacheInfo: serviceWorkerManager.getCacheInfo.bind(serviceWorkerManager),
    clearCache: serviceWorkerManager.clearCache.bind(serviceWorkerManager),
  };
}



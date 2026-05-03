import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const isTest = !!process.env.VITEST;

export default defineConfig({
  // نستبعد reactRouter أثناء الاختبارات لأن Vitest لا يحتاج حقن الـ preamble
  plugins: [
    tailwindcss(), 
    !isTest && reactRouter(), 
    tsconfigPaths()
  ].filter(Boolean) as any,
  
  // تحسينات البناء
  build: {
    // ضغط إضافي
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // إزالة console.log في الإنتاج
        drop_debugger: true,
        passes: 2, // ضغط إضافي
      },
      mangle: {
        safari10: true,
      },
    },
    
    // حجمchunk صغير نسبياً للتحميل السريع
    chunkSizeWarningLimit: 500,
    
    // تحسين تقسيم الحزم
    rollupOptions: {
      output: {
        // تقسيم الحزم حسب المسار
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            // تقسيم الـ vendors
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'motion';
            }
            if (id.includes('react-icons')) {
              return 'icons';
            }
          }
          return undefined;
        },
        // تحسين أسماء الملفات
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    
    // تمكين sourcemap للتصحيح (اختياري - يمكن تعطيله في الإنتاج)
    sourcemap: false,
    
    // تحميل متوازي للحزم
    target: 'esnext',
    modulePreload: {
      polyfill: true,
    },
  },
  
  // تحسينات الخادم المحلي
  server: {
    // سرعة الاستجابة
    hmr: {
      overlay: true,
    },
  },
  
  // تحسينات التحميل
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router', 'framer-motion'],
  },
  
  // إعدادات CSS
  css: {
    devSourcemap: true,
  },
});

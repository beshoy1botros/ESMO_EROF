import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/app',
    },
  },
  // تحسينات إضافية للبناء
  build: {
    // تقسيم الكود لتحسين التحميل
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router'],
          icons: ['react-icons'],
        },
      },
    },
    // ضغط إضافي
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // إزالة console.log في الإنتاج
        drop_debugger: true,
      },
    },
  },
});

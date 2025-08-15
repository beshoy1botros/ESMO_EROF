import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
  // تحسينات إضافية للبناء
  build: {
    // تقسيم الكود لتحسين التحميل
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-icons')) {
              return 'icons';
            }
            if (id.includes('react-router') && !id.includes('react-router-dom')) {
              return 'router';
            }
            if (!id.includes('react') && !id.includes('react-dom')) {
              return 'vendor';
            }
          }
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

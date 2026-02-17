import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const isTest = !!process.env.VITEST;

export default defineConfig({
  // نستبعد reactRouter أثناء الاختبارات لأن Vitest لا يحتاج حقن الـ preamble
  plugins: [tailwindcss(), !isTest && reactRouter(), tsconfigPaths()].filter(Boolean) as any,
  // تحسينات إضافية للبناء
  build: {
    // ضغط إضافي
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // إزالة console.log في الإنتاج
        drop_debugger: true,
      },
    },
  },
  // إعدادات Vitest
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./app/test/setupTests.ts"],
    include: ["app/**/*.test.{ts,tsx}"],
    exclude: ["app/__tests__/root.errorboundary.test.tsx"]
  },
});

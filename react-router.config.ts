import { vercelPreset } from '@vercel/react-router/vite';
import type { Config } from '@react-router/dev/config';
 
export default {
  // Config options...
  ssr: true,
  presets: [vercelPreset()],
  // Add client-side navigation support
  clientSideNavigation: true,
} satisfies Config;
# Coptic Hymns

> An interactive web application for learning Coptic Orthodox hymns and liturgical chants.

[![React](https://img.shields.io/badge/React-19.1-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.3-blue)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

<div align="center">

![Coptic Hymns](public/photos/icon-512.png)

**Learn and explore Coptic Orthodox hymns with ease**

[🌐 Live Demo](https://esmo-erof.vercel.app) • [📖 Documentation](#getting-started) • [🐛 Report Bug](issues)

</div>

---

## ✨ Features

### Core Functionality
- 📚 **Comprehensive Hymn Collection** — Extensive library of Coptic hymns organized by educational stages
- 🎓 **Preparatory Program** — Special educational content for preliminary learning stages
- 📖 **Liturgical Guide** — Detailed explanations of Coptic Orthodox liturgical rituals
- 🎵 **Video Tutorials** — Watch and learn hymns with video demonstrations
- 🔍 **Search & Browse** — Easy navigation through hymn categories

### Technical Features
- ⚡ **High Performance** — Built on React Router v7 with TypeScript
- 📱 **Progressive Web App (PWA)** — Installable on mobile devices, works offline
- 🎨 **Modern UI/UX** — Beautiful, responsive interface with smooth animations
- 🌍 **RTL Support** — Full Arabic language support with right-to-left layout
- 🌙 **Dark Mode** — Automatic theme switching based on system preferences

### Performance Optimizations
- Lazy loading for videos and heavy content
- Intelligent code splitting
- Service Worker caching for offline access
- Image optimization
- Production minification with Terser

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18+ |
| npm | 9+ |

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/esmo-erof.git

# Navigate to project directory
cd esmo-erof

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Run tests with UI |

---

## 📁 Project Structure

```
esmo-erof/
├── app/
│   ├── components/          # React components
│   │   ├── AppInstaller.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── LazyVideo.tsx
│   ├── routes/             # Route components
│   │   ├── home.tsx
│   │   ├── melodies.tsx
│   │   ├── about.tsx
│   │   └── preparatory.tsx
│   ├── styles/             # CSS stylesheets
│   ├── utils/             # Utility functions
│   ├── data/              # Static data
│   ├── root.tsx           # Root component
│   └── routes.ts          # Route definitions
├── public/
│   ├── photos/            # Images and icons
│   ├── videos/            # Video files
│   ├── fonts/             # Custom fonts
│   ├── scripts/          # Client-side scripts
│   ├── sw.js              # Service Worker
│   └── manifest.json      # PWA manifest
├── scripts/               # Build scripts
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| Framework | [React](https://react.dev) 19.1 |
| Routing | [React Router](https://reactrouter.com) v7 |
| Language | [TypeScript](https://www.typescriptlang.org) 5.9 |
| Build Tool | [Vite](https://vitejs.dev) 6.3 |
| Styling | [Tailwind CSS](https://tailwindcss.com) 4.1 |
| Animation | [Framer Motion](https://www.framer.com/motion/) 12 |
| Testing | [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com) |
| Analytics | [Supabase](https://supabase.com) |
| Deployment | [Vercel](https://vercel.com) |

---

## 📱 PWA Configuration

The application supports installation as a standalone app on mobile devices.

### Installation

**iOS (Safari):**
1. Open the website in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

**Android (Chrome):**
1. Open the website in Chrome
2. Tap the menu (⋮)
3. Select "Add to Home Screen"

### Offline Support

The Service Worker (`public/sw.js`) provides:
- Static asset caching
- Video caching for offline playback
- Background sync capabilities

---

## 🔧 Environment Variables

For production deployment with analytics:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
MGMT_SECRET=your_management_secret
```

### Supabase Setup

Run the following SQL in the Supabase SQL Editor:

```sql
-- Create events table
create table if not exists public.events (
  id uuid primary key,
  timestamp bigint not null,
  path text,
  action text not null,
  sessionId text,
  deviceId text,
  userAgent text,
  deviceType text,
  deviceVendor text,
  stage text,
  level text,
  videoId text,
  videoTitle text,
  currentTime numeric,
  watchedSeconds numeric
);

-- Create indexes
create index if not exists idx_events_timestamp on public.events (timestamp desc);
create index if not exists idx_events_device on public.events (deviceId);
create index if not exists idx_events_session on public.events (sessionId);

-- Enable RLS
alter table public.events enable row level security;

-- Allow anonymous inserts
create policy if not exists events_insert_anon on public.events
for insert to anon using (true) with check (true);
```

---

## 🐳 Deployment

### Docker

```bash
# Build the Docker image
docker build -t esmo-erof .

# Run the container
docker run -p 3000:3000 esmo-erof
```

### Manual Build

```bash
# Build for production
npm run build

# The output will be in the build/ directory
# - build/client/    # Static assets
# - build/server/   # Server-side code

# Start the production server
npm run start
```

### Supported Platforms

- ✅ Vercel
- ✅ Docker
- ✅ AWS ECS
- ✅ Google Cloud Run
- ✅ Azure Container Apps
- ✅ Digital Ocean App Platform
- ✅ Fly.io
- ✅ Railway

---

## 🧪 Testing

The project uses Vitest with React Testing Library for testing.

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Coptic Orthodox Church** — For preserving this rich heritage
- **Karaz (Crisis) Festival** — For the inspiration and educational content
- **Eparchy of Eastern & 10th of Ramadan** — For supporting this project

---

<div align="center">

Made with ❤️ for the Coptic Orthodox Community

*"Tell it out among the nations: The Lord reigns!"* — Psalm 96:10

</div>

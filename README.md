# Coptic Hymns — ⲥⲙⲟⲩ ⲉⲣⲟϥ

> An interactive educational application for learning Coptic Orthodox hymns and liturgical chants

<div align="center">

[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![React Router](https://img.shields.io/badge/React_Router-7.5-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-22C55E)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?logo=vercel&logoColor=white)](https://esmo-erof.vercel.app)

![Coptic Hymns Logo](public/photos/icon-512.png)

**Learn Coptic Orthodox hymns with ease and beauty**

[🌐 Live Demo](https://esmo-erof.vercel.app)

</div>

---

## ✨ Features

### 🎵 Educational Content
- **Comprehensive Hymn Library** — Extensive collection of Coptic hymns organized by educational stages
- **Preparatory Program** — Dedicated educational content for preliminary learning stages
- **Liturgical Guide** — In-depth explanations of Coptic Orthodox liturgical rituals
- **Video Tutorials** — Watch and learn hymns through step-by-step video demonstrations

### 🛠️ Technical Highlights
- **Progressive Web App (PWA)** — Installable on any device, fully functional offline
- **High Performance** — Built with React Router v7, TypeScript, and intelligent code splitting
- **Cloudflare R2 Media Delivery** — Fast and reliable video streaming via Cloudflare CDN
- **Responsive UI/UX** — Beautiful, animated interface that adapts to all screen sizes
- **Full Arabic & RTL Support** — Native right-to-left layout with optimized Arabic fonts
- **Automatic Dark Mode** — Seamless theme switching based on system preferences

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | ≥ 18.0 |
| npm | ≥ 9.0 |

### Installation

```bash
# Clone the repository
git clone https://github.com/beshoy1botros/ESMO_EROF.git
cd ESMO_EROF

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run the test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Run tests with interactive UI |

---

## 📁 Project Structure

```
ESMO_EROF/
├── app/                          # Main application source
│   ├── components/               # Reusable React components
│   │   ├── AppInstaller.tsx      # PWA install prompt
│   │   ├── Footer.tsx            # Page footer
│   │   ├── Header.tsx            # Page header
│   │   ├── LazyVideo.tsx         # Lazy-loaded video player
│   │   └── OfflineManager.tsx    # Offline state manager
│   ├── routes/                   # Page-level route components
│   │   ├── home.tsx              # Home page
│   │   ├── melodies.tsx          # Hymns library
│   │   ├── about.tsx             # Liturgical rituals guide
│   │   ├── preparatory.tsx       # Preparatory program
│   │   └── help.tsx              # User help & guide
│   ├── styles/                   # Global CSS stylesheets
│   ├── utils/                    # Shared utility functions
│   ├── data/                     # Static application data
│   ├── root.tsx                  # Root layout component
│   └── routes.ts                 # Route configuration
├── public/                       # Static public assets
│   ├── photos/                   # Images and app icons
│   ├── fonts/                    # Custom Arabic & Coptic fonts
│   ├── scripts/                  # Client-side scripts
│   ├── sw.js                     # Service Worker
│   └── manifest.json             # PWA manifest
├── scripts/                      # Build & utility scripts
├── package.json
├── vite.config.ts
├── tsconfig.json
└── vitest.config.ts
```

---

## 🛠️ Technology Stack

### Core

| Category | Technology | Version |
|----------|------------|---------|
| UI Framework | [React](https://react.dev) | 19.1 |
| Routing | [React Router](https://reactrouter.com) | 7.5 |
| Language | [TypeScript](https://www.typescriptlang.org) | 5.9 |
| Build Tool | [Vite](https://vitejs.dev) | 6.3 |
| Styling | [Tailwind CSS](https://tailwindcss.com) | 4.1 |
| Animation | [Framer Motion](https://www.framer.com/motion) | 12.3 |
| Icons | [React Icons](https://react-icons.github.io/react-icons) | 5.5 |
| Zoom / Pan | [React Zoom Pan Pinch](https://github.com/prc5/react-zoom-pan-pinch) | 4.0 |

### Tooling & Testing

| Tool | Purpose |
|------|---------|
| [Vitest](https://vitest.dev) | Unit & integration testing |
| [React Testing Library](https://testing-library.com) | Component testing |
| [Sharp](https://sharp.pixelplumbing.com) | Image optimization |
| [Terser](https://terser.org) | Production code minification |

### Infrastructure

| Service | Role |
|---------|------|
| [Vercel](https://vercel.com) | Primary hosting & CI/CD |
| [Cloudflare R2](https://developers.cloudflare.com/r2) | Video asset delivery |
| [Docker](https://www.docker.com) | Containerized deployments |
| Service Worker | Offline caching & background sync |

---

## 📱 PWA Installation

The app can be installed as a standalone application on any device.

| Platform | Steps |
|----------|-------|
| **iOS (Safari)** | Share → Add to Home Screen |
| **Android (Chrome)** | Menu (⋮) → Add to Home Screen |
| **Edge / Firefox** | Click the install icon in the address bar |
| **Samsung Internet** | Menu → Add to Home Screen |

---

## 🌍 Offline Support

The Service Worker provides full offline functionality:

- **Static Asset Caching** — CSS, JavaScript, fonts, and images are cached on first visit
- **Video Caching** — Previously watched videos play without an internet connection
- **Background Sync** — Content updates automatically when the connection is restored
- **Update Notifications** — Users are alerted when a new version is available

---

## 🔧 Environment Configuration

This project requires no backend credentials for local development.

- Cloudflare video URLs are configured in `app/utils/cloudflare.ts` via the `CLOUDFLARE_VIDEO_BASE_URL` constant.
- No Supabase or external database setup is needed.

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
npm run build
# Output:
#   build/client/   → Static assets (served by CDN)
#   build/server/   → Node.js server code

npm run start
```

### Supported Platforms

| Platform | Status |
|----------|--------|
| Vercel | ✅ Primary |
| Docker / AWS ECS | ✅ Supported |
| Google Cloud Run | ✅ Supported |
| Azure Container Apps | ✅ Supported |
| DigitalOcean App Platform | ✅ Supported |
| Fly.io / Railway | ✅ Supported |

---

## 🧪 Testing

```bash
npm run test          # Run full test suite
npm run test:watch    # Watch mode for active development
npm run test:ui       # Interactive test UI (Vitest UI)
```

---

## 🔒 Security

- **Content Security Policy (CSP)** — Restricts resource loading to trusted origins
- **HTTPS Only** — All traffic is served over secure connections
- **Secure HTTP Headers** — Hardened response headers on all routes
- **XSS Protection** — Input sanitization and output escaping throughout
- **GDPR Compliant** — Minimal data collection with explicit user consent

---

## 🌐 Localization

| Language | Role |
|----------|------|
| Arabic (`ar`) | Primary UI language with full RTL support |
| Coptic | Liturgical text rendering |
| English | Developer documentation & API interface |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m 'feat: add your feature'`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

Please ensure all existing tests pass and new features are covered by tests before submitting.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **Coptic Orthodox Church** — For preserving this rich and ancient heritage
- **Karaz (Crisis) Festival** — For the inspiration and educational content
- **Eastern & 10th of Ramadan Diocese** — For their support of this project

---

## 📞 Contact

- **Live App**: [https://esmo-erof.vercel.app](https://esmo-erof.vercel.app)
- **Repository**: [https://github.com/beshoy1botros/ESMO_EROF](https://github.com/beshoy1botros/ESMO_EROF)

---

<div align="center">

**Made with ❤️ for the Coptic Orthodox Community**

*"Tell it out among the nations: The Lord reigns!"* — Psalm 96:10

</div>
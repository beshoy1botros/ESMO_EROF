# Coptic Hymns - ⲥⲙⲟⲩ ⲉⲣⲟϥ

> An interactive educational application for learning Coptic Orthodox hymns and liturgical chants

[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.3-blue.svg)](https://vitejs.dev)
[![React Router](https://img.shields.io/badge/React_Router-7.5-blue.svg)](https://reactrouter.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-blue.svg)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

<div align="center">

![Coptic Hymns Logo](public/photos/icon-512.png)

**Learn Coptic Orthodox hymns with ease and beauty**

[🌐 Live Demo](https://esmo-erof.vercel.app) • [📖 Documentation](#getting-started) • [🐛 Report Bug](issues) • [📱 Install App](#pwa-installation)

</div>

---

## ✨ Key Features

### 🎵 Educational Content
- **Comprehensive Hymn Library** — Extensive collection of Coptic hymns organized by educational stages
- **Preparatory Program** — Special educational content for preliminary learning stages
- **Liturgical Guide** — Detailed explanations of Coptic Orthodox liturgical rituals
- **Video Tutorials** — Watch and learn hymns with video demonstrations

### 🛠️ Technical Features
- **High Performance** — Built on React Router v7 with TypeScript
- **Progressive Web App (PWA)** — Installable on mobile devices, works offline
- **Cloudflare R2 Media Delivery** — Video hosting is served from Cloudflare for fast streaming
- **Modern UI/UX** — Beautiful, responsive interface with smooth animations
- **Full Arabic Support** — Complete Arabic language support with right-to-left layout
- **Automatic Dark Mode** — Automatic theme switching based on system preferences

### ⚡ Performance Optimizations
- Lazy loading for videos and heavy content
- Intelligent code splitting
- Service Worker caching for offline access
- Image optimization
- Production minification with Terser

---

## 🚀 Quick Start

### System Requirements

| Requirement | Version Required |
|-------------|------------------|
| Node.js | 18.0 or higher |
| npm | 9.0 or higher |

### Installation & Running

```bash
# Clone the repository
git clone https://github.com/beshoy1botros/ESMO_EROF.git

# Navigate to project directory
cd ESMO_EROF

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

### Available npm Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Run tests with UI |

---

## 📁 Project Structure

```
ESMO_EROF/
├── app/                          # Main application code
│   ├── components/               # React components
│   │   ├── AppInstaller.tsx      # App installer
│   │   ├── Footer.tsx            # Page footer
│   │   ├── Header.tsx            # Page header
│   │   ├── LazyVideo.tsx         # Smart video with lazy loading
│   │   └── OfflineManager.tsx    # Offline mode manager
│   ├── routes/                   # Application pages
│   │   ├── home.tsx              # Home page
│   │   ├── melodies.tsx          # Hymns page
│   │   ├── about.tsx             # Rituals explanation
│   │   ├── preparatory.tsx       # Preparatory content
│   │   └── help.tsx              # User guide
│   ├── styles/                   # CSS stylesheets
│   ├── utils/                    # Utility functions
│   ├── data/                     # Static data
│   ├── root.tsx                  # Root component
│   └── routes.ts                 # Route definitions
├── public/                       # Public files
│   ├── photos/                   # Images and icons
│   ├── fonts/                    # Custom fonts
│   ├── scripts/                  # Client scripts
│   ├── sw.js                     # Service Worker
│   └── manifest.json             # PWA manifest
├── scripts/                      # Build scripts
├── package.json                  # Project dependencies
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript configuration
└── vitest.config.ts              # Test configuration
```

---

## 🛠️ Technology Stack

### Framework & Languages
| Category | Technology | Version |
|----------|------------|---------|
| Framework | [React](https://react.dev) | 19.1 |
| Routing | [React Router](https://reactrouter.com) | 7.5 |
| Language | [TypeScript](https://www.typescriptlang.org) | 5.9 |
| Build Tool | [Vite](https://vitejs.dev) | 6.3 |
| Styling | [Tailwind CSS](https://tailwindcss.com) | 4.1 |
| Animation | [Framer Motion](https://www.framer.com/motion) | 12.3 |
| Icons | [React Icons](https://react-icons.github.io/react-icons) | 5.5 |
| Zoom/Pan | [React Zoom Pan Pinch](https://github.com/prc5/react-zoom-pan-pinch) | 4.0 |

### Development & Testing Tools
- **Vitest**: Testing framework
- **React Testing Library**: React component testing
- **Vite TSConfig Paths**: TypeScript path support
- **Sharp**: Image processing
- **Terser**: Code minification

### Deployment & Hosting
- **Vercel**: Primary deployment platform
- **Docker**: Containerization
- **Service Worker**: Offline support

---

## 📱 PWA Installation

The application supports installation as a standalone app on mobile devices.

### iOS (Safari)
1. Open the website in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

### Android (Chrome)
1. Open the website in Chrome
2. Tap the menu (⋮)
3. Select "Add to Home Screen"

### Other Browsers
- **Edge**: Click the install button in the address bar
- **Firefox**: Click the install button in the address bar
- **Samsung Internet**: Tap menu → "Add to Home Screen"

---

## 🌍 Offline Support

Service Worker provides:
- **Static Asset Caching**: Cache CSS, JS, and images
- **Video Caching**: Play videos offline
- **Background Sync**: Update content when connection returns
- **Update Notifications**: Notify users of new updates

---

## 🔧 Environment Variables

This project does not require backend database credentials for local setup.

- No Supabase configuration is needed.
- Cloudflare video URLs are stored in the application code via `app/utils/cloudflare.ts`.
- If you need to change the Cloudflare bucket or public URL, update `CLOUDFLARE_VIDEO_BASE_URL` in `app/utils/cloudflare.ts`.

---

## 🐳 Deployment

### Docker

```bash
# Build Docker image
docker build -t esmo-erof

# Run container
docker run -p 3000:3000 esmo-erof
```

### Manual Build

```bash
# Build for production
npm run build

# Production files will be in build/ directory
# - build/client/    # Static assets
# - build/server/   # Server code

# Start production server
npm run start
```

### Supported Platforms

- ✅ **Vercel** - Primary deployment
- ✅ **Docker** - Container applications
- ✅ **AWS ECS** - Elastic Container Service
- ✅ **Google Cloud Run** - Container execution
- ✅ **Azure Container Apps** - Container applications
- ✅ **Digital Ocean App Platform** - Application platform
- ✅ **Fly.io** - Application deployment
- ✅ **Railway** - Development platform

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

## 📊 Performance Monitoring

### Performance Metrics
- **Core Web Vitals**: Google's core user experience metrics
- **Lighthouse Score**: Comprehensive performance and accessibility assessment
- **Bundle Size**: Compressed bundle size
- **Cache Hit Rate**: Cache hit rate

### Monitoring Tools
- **Service Worker Logs**: Monitor cache status
- **Error Boundaries**: Capture and log errors

---

## 🔒 Security

### Applied Security Practices
- **Content Security Policy (CSP)**: Content security policy
- **HTTPS Only**: Secure connections only
- **Secure Headers**: Secure HTTP headers
- **Input Validation**: Input validation
- **XSS Protection**: XSS attack protection

### Data Privacy
- **GDPR Compliant**: Compliant with General Data Protection Regulation
- **Data Minimization**: Minimize collected data
- **User Consent**: User consent for data collection
- **Data Retention**: Data retention policy

---

## 🌐 Languages & Localization

### Supported Languages
- **Arabic (ar)**: Primary language
- **Coptic**: Liturgical texts
- **English**: API interface

### Localization Features
- **RTL Support**: Full right-to-left layout support
- **Font Optimization**: Optimized fonts for Arabic and Coptic texts
- **Cultural Adaptation**: Cultural adaptation for the interface

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the project
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Guidelines
- Follow established code style standards
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Coptic Orthodox Church** — For preserving this rich heritage
- **Karaz (Crisis) Festival** — For the inspiration and educational content
- **Eastern & 10th of Ramadan Diocese** — For supporting this project

---

## 📞 Contact

- **Official Website**: [https://esmo-erof.vercel.app](https://esmo-erof.vercel.app)
- **Email**: [contact@esmo-erof.com](mailto:contact@esmo-erof.com)
- **GitHub Issues**: [Report Issues](issues)

---

<div align="center">

**Made with ❤️ for the Coptic Orthodox Community**

*"Tell it out among the nations: The Lord reigns!"* — Psalm 96:10

</div>
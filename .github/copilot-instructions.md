# AI Agent Instructions for ⲥⲙⲟⲩ ⲉⲣⲟϥ Project

## Project Overview
This is a React application for teaching Coptic hymns (alhan) for various educational levels. The app uses React Router v7, TypeScript, and has a strong focus on performance optimization with features like lazy loading and offline support.

## Key Architecture Patterns

### 1. Routing Structure
- Root layout in `app/root.tsx` with shared meta tags and PWA setup
- Route configuration in `app/routes.ts` following React Router v7 patterns
- Each route in `app/routes/` handles a specific feature area:
  - `home.tsx`: Landing page 
  - `melodies.tsx`: Main hymns/songs interface with stage/level filtering
  - `about.tsx`: Hymn ritual explanations
  - `preparatory.tsx`: Introductory content

### 2. Component Patterns
- Shared components in `app/components/`:
  - `LazyVideo.tsx`: Smart video loading with intersection observer and caching
  - `OptimizedImage.tsx`: Image optimization with WebP support and loading states
  - `Header.tsx`/`Footer.tsx`: Common layout elements

### 3. Performance Optimization
- ServiceWorker implementation for offline support and caching
- Lazy loading of videos only when in viewport
- Image optimization with modern formats and progressive loading
- Code splitting via Vite build configuration

## Key Files & Directories
```
app/
  ├── root.tsx                # App root layout & PWA setup
  ├── routes/                 # Route components & logic  
  ├── components/            # Shared UI components
  ├── styles/               # CSS modules & global styles
  ├── utils/               # Helper functions & hooks
  └── types/              # TypeScript definitions
```

## Development Workflows

### Running the App
```bash
npm install
npm run dev     # Development
npm run build   # Production build
```

### Adding New Content
1. Add video files to `public/` directory
2. Update video data in relevant route files (e.g. `melodies.tsx`)
3. Add metadata like title, stage, level, etc.
4. Test lazy loading behavior and caching

### Performance Considerations
- Use `LazyVideo` component for all video content
- Enable `autoCache` prop for important/frequent videos
- Follow image optimization patterns with `OptimizedImage`
- Monitor ServiceWorker status for offline capabilities

## Common Development Tasks

### Adding a New Stage/Level
1. Update stage/level enums in `melodies.tsx`
2. Add video data to `videoData` object
3. Update UI selections in dropdown menus
4. Add content descriptions in `about.tsx` if needed

### Modifying Navigation
1. Update `navLinks` array in `Header.tsx`
2. Add corresponding route in `routes.ts`
3. Create route component in `app/routes/`

### Style Customization  
- Global styles in `app.css`
- Component-specific modules in `.module.css` files
- Follow Tailwind CSS patterns for responsive design

## Working with Media

### Video Files
- Place video files in `public/` directory
- Use `.mp4` format for widest compatibility
- Consider file size & loading performance
- Implement lazy loading via `LazyVideo` component

### Images
- Use `OptimizedImage` component for automatic optimization
- Provide WebP format when possible
- Set appropriate width/height to prevent layout shift
- Enable `priority` prop for above-the-fold images

## Best Practices

### Performance
- Always use lazy loading for media content
- Implement appropriate caching strategies
- Monitor bundle sizes and code splitting
- Test offline functionality

### Accessibility
- Maintain RTL text direction support
- Provide appropriate ARIA labels
- Ensure keyboard navigation works
- Support reduced motion preferences

### Code Style
- Follow TypeScript patterns and type definitions
- Maintain component file structure
- Use React hooks effectively
- Document complex logic

## Troubleshooting

### Common Issues
1. Videos not loading:
   - Check file paths in `videoData`
   - Verify ServiceWorker registration
   - Monitor browser console for errors

2. Caching problems:
   - Check ServiceWorker status
   - Clear cache if needed
   - Verify storage quotas

3. Performance issues:
   - Enable lazy loading
   - Optimize media files
   - Monitor bundle sizes
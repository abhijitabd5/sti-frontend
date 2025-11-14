# Tech Stack

## Core Technologies

- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **React Router 7** - Client-side routing
- **Axios** - HTTP client for API requests

## State Management

- **Context API** - Theme, Auth, Language contexts
- **Redux Toolkit** - Global state (auth, courses, UI slices)
- **React Hook Form + Zod** - Form validation

## Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS + Autoprefixer** - CSS processing
- **Custom CSS architecture** - Component-level styles in `src/styles/components/`
- **Radix UI** - Accessible headless UI components
- **Framer Motion** - Animations

## UI Libraries

- **Radix UI** - Dialog, Select, Dropdown, Tabs, Toast, Tooltip, etc.
- **Heroicons** - Icon library
- **Lucide React** - Additional icons
- **Chart.js** - Data visualization
- **TinyMCE / Quill** - Rich text editors

## Utilities

- **date-fns** - Date manipulation
- **clsx / tailwind-merge** - Class name utilities
- **class-variance-authority** - Component variant management
- **html2canvas + jsPDF** - PDF generation
- **react-qr-code** - QR code generation

## Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting (80 char width, prose wrap)

## Build Configuration

- **Path alias**: `@/` maps to `src/`
- **Dev server**: Port 3000, auto-opens browser
- **Build output**: `dist/` with sourcemaps
- **Code splitting**: Vendor, router, UI, and utils chunks

## Common Commands

```bash
# Development
npm run dev          # Start dev server on port 3000

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## Important Notes

- **Do not run commands** - User will execute them manually
- **Do not install packages** - User handles installations
- **Use absolute imports** - Always use `@/` prefix for src imports

# Project Structure

## Root Configuration

- `vite.config.js` - Vite configuration with path aliases and build optimization
- `tailwind.config.js` - Tailwind theme, colors, animations, plugins
- `postcss.config.js` - PostCSS with Tailwind and Autoprefixer
- `jsconfig.json` - Path alias configuration (`@/` → `src/`)
- `.prettierrc` - 80 char width, prose wrap enabled

## Source Organization (`src/`)

### Entry Points

- `main.jsx` - Application entry, mounts App with providers
- `App.jsx` - Main component with routing setup
- `routes.jsx` - Centralized route configuration (currently unused)

### Components (`src/components/`)

- `common/` - Shared components (Header, Footer, Modal, Loader)
  - `Layout/` - WebsiteLayout, StudentLayout, AdminLayout
- `ui/Internal/` - Reusable UI for admin/student dashboards (Button, Card, Input, Modal, etc.)
- `ui/Website/` - Reusable UI for public website
- `forms/` - Form components (LoginForm, ContactUsForm, etc.)
- `charts/` - Chart components with config

### Pages (`src/pages/`)

Organized by application area:

- `website/` - Public pages (Home, About, Courses, Gallery, Contact, Legal)
- `student/` - Student portal (Dashboard, Profile, Payments, Certificates)
- `internal/` - Admin portal (Dashboard, Courses, Students, Transactions, Gallery, Reviews, Enquiries, Profile, Promotion)
- `auth/` - Login, Logout

Each page may have sub-components and hooks for modularity.

### State Management

- `contexts/` - React Context providers
  - `AuthContext.jsx` - Authentication state
  - `ThemeContext.jsx` - Light/dark theme (toggles `dark` class on `<html>`)
  - `LanguageContext.jsx` - Multi-language support
- `store/` - Redux Toolkit slices (authSlice, coursesSlice, uiSlice)

### Services (`src/services/`)

- `api/` - API request functions, one file per module:
  - `authApi.js`, `courseApi.js`, `studentApi.js`, `transactionApi.js`
  - `galleryApi.js`, `reviewApi.js`, `enquiryApi.js`
  - `promotionPartnerApi.js`, `promotionPostApi.js`, `promotionAnalyticsApi.js`, `promotionPublicApi.js`
  - `publicCourseApi.js`, `websiteApi.js`, `internalApi.js`
- `utils/` - HTTP client and API endpoint constants

### Utilities & Helpers

- `hooks/` - Custom hooks (useAuth, useApi, useLocalStorage, useLanguage, usePagination)
- `utils/` - Helper functions (formatters, validators, date utils, file utils)
- `lib/` - Utility libraries (Axios config, validation schemas, form helpers, uiUtils)
- `guards/` - Route protection HOCs (AuthGuard, RoleGuard, ProtectedRoute)
- `config/` - Global configuration (routes, constants, environment variables)

### Styling (`src/styles/`)

- `globals.css` - Entry point, imports Tailwind and component styles, defines theme tokens
- `components/` - Component-level CSS
  - `typography.css` - Heading utilities (.h1, .h2, etc.)
  - `buttons.css` - Button utilities (.btn, .btn-lg, etc.)
  - `forms.css` - Form element styles (.form-input, etc.)
  - `utilities.css` - Small utilities (.no-scrollbar, etc.)

### Assets & Data

- `assets/` - Static files (images, logos, icons, fonts, videos)
- `locales/` - i18n JSON files for multi-language support
- `mockData/` - Mock data for development

## Key Conventions

### Import Paths

Always use absolute imports with `@/` prefix:

```javascript
import Button from '@/components/ui/Internal/Button';
import { useAuth } from '@/hooks/useAuth';
import { courseApi } from '@/services/api/courseApi';
```

### API Services

Create separate files for each module in `src/services/api/`:

```javascript
// src/services/api/moduleNameApi.js
export const getItems = () => { /* ... */ };
export const createItem = (data) => { /* ... */ };
```

### Component Organization

- Common components in `components/common/`
- UI primitives split by context: `ui/Internal/` vs `ui/Website/`
- Page-specific components can live within page folders

### Styling Approach

- Prefer Tailwind utilities with `dark:` variants
- Use component classes from `src/styles/components/` (`.btn`, `.h2`, `.form-input`)
- Theme switching via `ThemeContext` toggles `dark` class on `<html>`
- Read CSS variables from `globals.css` when JS needs runtime values

### Authentication Pattern

**CRITICAL:** Always use the `useAuth()` hook for authentication operations, never call API services directly.

**Correct Pattern:**
```javascript
import { useAuth } from '@/hooks/useAuth';

const MyComponent = () => {
  const { login, logout, user } = useAuth();
  
  const handleLogin = async (credentials) => {
    await login(credentials); // ✅ Updates AuthContext state
  };
};
```

**Incorrect Pattern:**
```javascript
import { authApi } from '@/services/api/authApi';

const MyComponent = () => {
  const handleLogin = async (credentials) => {
    await authApi.login(credentials); // ❌ Does NOT update AuthContext state
    // User data won't be available in components until page refresh
  };
};
```

**Why this matters:**
- Calling `authApi` directly only updates localStorage
- The AuthContext state remains unchanged
- Components using `useAuth()` won't see the user data
- This causes "User" to display instead of actual user name
- Only works after page refresh when AuthContext loads from localStorage

**Available Auth Methods:**
- `login(credentials)` - Authenticate user and update context
- `logout()` - Clear auth data and update context
- `updateUser(userData)` - Update user profile in context
- `user` - Current user object
- `isAuthenticated` - Boolean auth status
- `hasRole(role)` - Check user role
- `hasPermission(permission)` - Check user permission

### Route Protection

Use guards from `src/guards/`:

```javascript
<Route path="/admin" element={<AdminRoute />}>
  <Route path="dashboard" element={<Dashboard />} />
</Route>
```

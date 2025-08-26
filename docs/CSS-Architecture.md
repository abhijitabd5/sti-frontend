# Earth Movers Frontend – CSS Architecture Guide

This document provides a complete overview of the **CSS architecture** in the Earth Movers Training Academy frontend project.  
It explains how styles are structured, how theme management works, and how components make use of shared CSS utilities.

---

##  Tech Stack Overview

The frontend is built using the following technologies:

- **React (v19)** – UI library for building components.  
- **Vite (v7)** – Development server and build tool.  
- **Tailwind CSS (v4)** – Utility-first CSS framework for styling.  
- **PostCSS + Autoprefixer** – For transforming and optimizing CSS.  
- **Radix UI** – Accessible UI primitives.  
- **Framer Motion** – Animations.  
- **React Hook Form + Zod** – Form validation and handling.  

---

##  CSS & Styling Structure

The `src/styles` folder is the core place for managing CSS.

### Folder Layout
styles/
    ├── global.css
    └── components/
        ├── typography.css
        ├── buttons.css
        ├── forms.css
        └── utilities.css

### 1. global.css

Acts as the central entry point for all CSS in the project.

Imports Google Fonts and TailwindCSS.

Pulls in component-level styles from /components using the @import ... layer(components) directive.

Registers plugins (like @tailwindcss/forms).

Defines custom variants (dark, sidebar-expanded) for conditional styling.

Declares theme tokens (--color-*, --font-*, --text-*, --breakpoint-*) used throughout the app.

Includes base compatibility styles to align Tailwind v4 defaults with v3 expectations.

 Example snippet:

```css
@import "tailwindcss";
@import '@/styles/components/buttons.css' layer(components);

@custom-variant dark (&:is(.dark *));
@theme {
  --color-gray-900: #111827;
  --font-inter: "Inter", "sans-serif";
}
```


### 2. `tailwind.css`
Acts as the **entry point** for Tailwind.

- Includes Tailwind’s `@tailwind base`, `@tailwind components`, `@tailwind utilities`.  
- Pulls in **component-specific styles** from `/components`.  

 Example:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import "./components/typography.css";
@import "./components/buttons.css";
@import "./components/forms.css";
@import "./components/utilities.css";
```

---

### 3. `components/typography.css`
Defines **utility classes for headings and text**.

- `.h1`, `.h2`, `.h3`, `.h4` classes map to responsive typography.  
- Uses `@apply` to reuse Tailwind utilities.  

 Example:
```css
.h1 {
  @apply text-4xl font-extrabold tracking-tighter;
}
@media (width >= theme(--breakpoint-md)) {
  .h1 {
    @apply text-5xl;
  }
}
```

Usage in React:
```jsx
<h1 className="h1">Welcome to Earth Movers</h1>
```

---

### 4. `components/buttons.css`
Defines **button utility classes**.

- `.btn`, `.btn-lg`, `.btn-sm`, `.btn-xs`.  
- Handles padding, size, shadows, and hover states.  

 Example:
```css
.btn {
  @apply font-medium text-sm px-3 py-2 rounded-lg shadow-xs;
}
```

Usage in React:
```jsx
<button className="btn btn-lg">Register</button>
```

---

### 5. `components/forms.css`
Contains **form element styling**.

- Input fields (`.form-input`, `.form-textarea`).  
- Select dropdowns, checkboxes, radios.  
- Switch/toggle styles with transitions.  
- Handles **light/dark mode variations**.  

 Example:
```css
.form-input {
  @apply text-sm border-gray-200 dark:border-gray-700/60 rounded-lg;
}
```

Usage in React:
```jsx
<input type="text" className="form-input" placeholder="Enter name" />
```

---

### 6. `components/utilities.css`
Defines **small reusable utilities**.

- `.no-scrollbar` – removes scrollbars across browsers.  

 Example:
```css
<div className="no-scrollbar overflow-y-scroll"> </div>
```

---

## Theme Context & CSS Flow

1. **Base Theme** is defined in `src/styles/globals.css` (not `base.css`).  
   - `globals.css` imports Tailwind and your component CSS files and declares design tokens using `@theme` (CSS custom properties like `--color-gray-100`, `--font-inter`, and text-size tokens).  
   - These tokens are used by CSS and also read by JavaScript (e.g., charts via `getCSSVariable()`).

2. **ThemeContext (React)** controls whether the app is in **light** or **dark** mode.  
   - The context persists the theme to `localStorage` and exposes `{ currentTheme, changeCurrentTheme }`.  
   - The provider **adds or removes the `dark` class on the root `<html>` element** (`document.documentElement.classList.add('dark')` / `.remove('dark')`) and sets `document.documentElement.style.colorScheme = 'light' | 'dark'`.  
   - It also temporarily disables transitions during the switch (to avoid flicker).  
   - **It does not** set `data-theme` or apply a `class="light"` on `<html>` by default — only the `dark` class is toggled.

3. **Tailwind + Custom CSS** automatically react to the presence/absence of the `dark` class:
   - Tailwind `dark:` variants become active when `<html class="dark">` is present.
   - Component-level CSS (imported in `globals.css`) can use `dark:` variants or custom `@custom-variant` definitions to style for dark mode.
   - Use CSS custom properties from `globals.css` when JS needs runtime color values (e.g., for Canvas).

### Accurate Theme usage snippet

```jsx
// ThemeToggle.jsx (usage example)
import React from 'react';
import { useThemeProvider } from '@/context/ThemeContext';

export default function ThemeToggleButton() {
  const { currentTheme, changeCurrentTheme } = useThemeProvider();

  return (
    <button
      onClick={() =>
        changeCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')
      }
      className="btn"
    >
      Switch to {currentTheme === 'light' ? 'Dark' : 'Light'}
    </button>
  );
}
```

**What `ThemeContext` does internally (simplified):**
```js
useEffect(() => {
  // temporarily disable transitions to avoid flicker
  document.documentElement.classList.add('**:transition-none!');

  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  } else {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  }

  setTimeout(() => {
    document.documentElement.classList.remove('**:transition-none!');
  }, 1);
}, [theme]);
```

---

## Example: CSS in Action

Prefer Tailwind utilities with `dark:` variants and shared component classes:

```jsx
function InfoCard() {
  return (
    <div className="p-4 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <h2 className="h2">Our Courses</h2>
      <p className="text-sm">We provide certified excavator training.</p>
      <button className="btn btn-sm bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800">
        Learn More
      </button>
    </div>
  );
}
```

**Notes**
- Use `bg-white dark:bg-gray-800` and `text-gray-900 dark:text-gray-100` for consistent cross-theme behavior.
- Use component classes (`.h2`, `.btn`, `.form-input`) to centralize style and reduce repetition.
- Read CSS variables from `globals.css` in JS only when you need runtime values:
```js
import { getCSSVariable } from '@/utils/domUtils';
const color = getCSSVariable('--color-gray-700'); // returns e.g. "#374151"
```

---

## Key Takeaways for New Developers

- **Start point:** `src/styles/globals.css` is the entry — it imports Tailwind and component CSS files.  
- Use Tailwind utilities and `dark:` variants for theme-aware styling; component classes (`.btn`, `.h2`, `.form-input`) provide consistent primitives.  
- **Theme switching** is implemented by toggling the `dark` class on `<html>` via `ThemeContext` — not by setting a `data-theme` attribute or adding a `light` class.  
- Use CSS variables (`--color-*`) from `globals.css` when JS needs runtime color tokens (charts, canvas).  
- Prefer `bg-white dark:bg-gray-800` style patterns for predictable results across themes.

---

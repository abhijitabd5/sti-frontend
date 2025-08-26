# Earth Movers Frontend – CSS Architecture Guide

This document provides a complete overview of the **CSS architecture** in the Earth Movers Training Academy frontend project.  
It explains how styles are structured, how theme management works, and how components make use of shared CSS utilities.

---

## 📌 Tech Stack Overview

The frontend is built using the following technologies:

- **React (v19)** – UI library for building components.  
- **Vite (v7)** – Development server and build tool.  
- **Tailwind CSS (v4)** – Utility-first CSS framework for styling.  
- **PostCSS + Autoprefixer** – For transforming and optimizing CSS.  
- **Radix UI** – Accessible UI primitives.  
- **Framer Motion** – Animations.  
- **React Hook Form + Zod** – Form validation and handling.  

---

## 🎨 CSS & Styling Structure

The `src/styles` folder is the core place for managing CSS.

### Folder Layout

```
src/
└── styles/
    ├── base.css
    ├── tailwind.css
    └── components/
        ├── typography.css
        ├── buttons.css
        ├── forms.css
        └── utilities.css
```

### 1. `base.css`
Defines **global resets and theme context**.

- Resets browser defaults (`box-sizing`, margins, etc.).  
- Applies base font styles (using Tailwind typography utilities).  
- Defines **light and dark theme variables** using CSS custom properties.  
- Handles **theme switching** through `[data-theme="dark"]` attribute.  

✅ Example:
```css
:root {
  --color-bg: #ffffff;
  --color-text: #111827;
}

[data-theme="dark"] {
  --color-bg: #111827;
  --color-text: #f9fafb;
}
```

---

### 2. `tailwind.css`
Acts as the **entry point** for Tailwind.

- Includes Tailwind’s `@tailwind base`, `@tailwind components`, `@tailwind utilities`.  
- Pulls in **component-specific styles** from `/components`.  

✅ Example:
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

✅ Example:
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

✅ Example:
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

✅ Example:
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

✅ Example:
```css
<div className="no-scrollbar overflow-y-scroll">...</div>
```

---

## 🌗 Theme Context & CSS Flow

1. **Base Theme** is defined in `base.css` using CSS variables (`--color-bg`, `--color-text`).  
2. **ThemeContext (React)** controls whether the app is in **light** or **dark** mode.  
   - Stores the current theme in React state.  
   - Applies `data-theme="dark"` on `<html>` or `<body>`.  
3. **Tailwind + Custom CSS** read these variables and apply consistent colors across components.  

✅ Example flow:

```jsx
// ThemeContext.js
const { theme, toggleTheme } = useTheme();

return (
  <div data-theme={theme}>
    <button onClick={toggleTheme} className="btn">Toggle Theme</button>
  </div>
);
```

When `theme = "dark"`, CSS variables update automatically, applying dark styles.

---

## 🧩 Example: CSS in Action

### Example Component – Card

```jsx
function InfoCard() {
  return (
    <div className="p-4 rounded-lg shadow-sm bg-[var(--color-bg)] text-[var(--color-text)]">
      <h2 className="h2">Our Courses</h2>
      <p className="text-sm">We provide certified excavator training.</p>
      <button className="btn btn-sm">Learn More</button>
    </div>
  );
}
```

**How styles are applied:**

1. `bg-[var(--color-bg)]` and `text-[var(--color-text)]` → adapt to light/dark theme.  
2. `h2` → comes from `typography.css`.  
3. `btn btn-sm` → comes from `buttons.css`.  

This shows how **global variables + Tailwind + component CSS** work together.

---

## ✅ Key Takeaways for New Developers

- Always start styling from `tailwind.css` (it pulls in everything).  
- Use **utility classes** (`btn`, `form-input`, `h1`, etc.) instead of redefining styles.  
- Respect **theme context** by using CSS variables (`--color-*`).  
- For one-off styling, you can still use inline Tailwind classes.  
- Keep all shared CSS in `src/styles/components` for consistency.  

---

## 📂 Future Improvements

- Introduce **design tokens** for spacing, typography, colors.  
- Add **component-specific variants** (e.g., primary/secondary buttons).  
- Document **theme extensions** in Tailwind config for better onboarding.  

---

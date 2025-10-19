# Project Overview

## Introduction

This project is a **React-based web application** built with a modular
and scalable architecture.\
It follows modern frontend development practices and leverages powerful
tools to ensure performance, maintainability, and flexibility.

### Tech Stack

-   **React** (frontend library)
-   **React Router** (routing and navigation)
-   **Context API** (state management for theme, auth, language)
-   **Redux Toolkit** (for global state and slices like auth, courses,
    UI)
-   **Axios** (HTTP client for API integration)
-   **TailwindCSS + Custom CSS** (styling)
-   **i18n JSON-based locales** (multi-language support)
-   **Component-driven architecture** (reusable UI and form components)

------------------------------------------------------------------------
### Instructions
- Use absolute paths for imports
- Do not run commands (like starting server or installing something), If you want to install something just skip it, user will install it later
- Do not create documentation (md files) of each task, user have already created good documentation
- For API integration tasks create separate file for each module inside src/services/api

------------------------------------------------------------------------

## Project Structure

### `src/assets/`

-   Static files such as **images, logos, icons, fonts, videos** used
    throughout the application.

### `src/components/`

-   **common/** → Shared app-wide components like `Header`, `Footer`,
    `Modal`, `Loader`, `Layout`.
-   **common/Layout/** -> Further divided into :
    -   `WebsiteLayout`, `StudentLayout`, `AdminLayout`.
-   **ui/** → Further divided into : `Internal`, `Website`
-   **ui/Internal/**  (For Internal Dashboards) Small reusable UI components like `Button`,
      `Calender`,`Card`, `DatePicker`, `Dropdown`, `Input`, `Modal`,`Popover`,`ThemeToggle`,`Toast`, `Tooltip`.
-   **ui/Website/** (For Website) Small reusable UI components like `Button`, `Calender`, 
      `Card`, `DatePicker`, `Dropdown`, `Input`, `Modal`,`Popover`,`ThemeToggle`,`Toast`, `Tooltip`.
-   **forms/** → Form-specific components such as `LoginForm`,
    `ContactUsForm`.

### `src/pages/`

-   Organized into different **application areas**:
    -   **website/** → Public-facing pages (Home, About Us, Login, Register/Enroll, Courses,
        Gallery, Contact Us, etc.)
    -   **student/** → Student portal (Student Dashboard, Profile, Payments,
        Certificates, Course Progress).
    -   **internal/** → Admin/internal portal (Admin Dashboard,
        Courses, Certificates, Payments, Expenses, Enquiries, CMS,
        Gallery).

Each page may have **sub-components** and **hooks** to keep code
modular.

### `src/hooks/`

-   Custom reusable hooks such as:
    -   `useAuth` → Authentication handling.
    -   `useApi` → API requests abstraction.
    -   `useLocalStorage` → Manage local storage with React state.
    -   `useLanguage` → Language selection logic.
    -   `usePagination` → Reusable pagination logic.

### `src/contexts/`

-   **AuthContext** → Provides authentication state.
-   **ThemeContext** → Manages light/dark theme across the app.

### `src/services/`

-   **api/** → API request functions (auth, students, courses, payments,
    etc.).
-   **utils/** → HTTP client (`httpClient.js`) and API endpoint
    constants.

### `src/utils/`

-   Helper functions (e.g., formatters, validators, date utils, file
    utils, etc.).

### `src/store/`

-   Redux Toolkit slices for managing global state:
    -   `authSlice` → Authentication state.
    -   `coursesSlice` → Course data.
    -   `uiSlice` → UI states (notifications, modals, loaders).

### `src/styles/`

-   `globals.css` → Global base styles.
-   `components.css` → Component-specific utilities.
-   `utilities.css` → Extra helper classes.

### `src/config/`

-   Global configuration like routes, constants, and environment
    variables.

### `src/guards/`

-   Higher-order components for route protection:
    -   `AuthGuard`, `RoleGuard`, `ProtectedRoute`.
### `src/lib/`

-   Utility libraries for **Axios**, **validation schemas**, **uiUtils.js**, and **form helpers**.

### Root Files

-   **App.jsx** → Main application component.
-   **main.jsx** → Application entry point.
-   **routes.jsx** → Centralized route configuration.

------------------------------------------------------------------------

## Application Flow

1.  **Entry Point (`main.jsx`)** → Mounts `<App />` with providers
    (contexts, store).
2.  **App.jsx** → Initializes routing (`routes.jsx`).
3.  **Layouts** → Wrap page components with headers, sidebars, or
    footers.
4.  **Pages** → Render specific modules (public website, student portal,
    admin dashboard).
5.  **Contexts & Redux** → Provide global state (auth, theme, language,
    UI).
6.  **Hooks** → Add modular logic (auth, API, pagination).
7.  **Services** → Handle API calls consistently with Axios and endpoint
    utils.
8.  **Styles** → Tailwind + custom CSS architecture ensures flexible
    theming and design consistency.

------------------------------------------------------------------------

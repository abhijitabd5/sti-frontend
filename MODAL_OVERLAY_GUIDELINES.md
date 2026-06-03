# Modal Overlay Guidelines

## Overview
Standard pattern for modal overlays used throughout the application to ensure consistency, accessibility, and proper z-index management.

## Standard Modal Pattern

### Structure
```jsx
<div className="fixed inset-0 z-50 overflow-y-auto">
  <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    {/* Background overlay */}
    <div
      className="fixed inset-0 transition-opacity bg-gray-500/60 dark:bg-gray-900/70"
      aria-hidden="true"
      onClick={onClose}
    />

    {/* Center modal */}
    <span
      className="hidden sm:inline-block sm:align-middle sm:h-screen"
      aria-hidden="true"
    >
      &#8203;
    </span>

    {/* Modal panel */}
    <div className="relative z-[10000] inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      {/* Modal content */}
    </div>
  </div>
</div>
```

## Key Components

### 1. Container
```jsx
<div className="fixed inset-0 z-50 overflow-y-auto">
```
- **fixed inset-0** - Covers entire viewport
- **z-50** - High z-index for overlay layer
- **overflow-y-auto** - Allows scrolling for tall content

### 2. Flex Container
```jsx
<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
```
- **flex items-end justify-center** - Mobile: bottom alignment
- **min-h-screen** - Full viewport height
- **sm:block** - Desktop: block layout for centering trick
- **Padding** - Spacing around modal

### 3. Background Overlay
```jsx
<div
  className="fixed inset-0 transition-opacity bg-gray-500/60 dark:bg-gray-900/70"
  aria-hidden="true"
  onClick={onClose}
/>
```
- **fixed inset-0** - Covers entire viewport
- **transition-opacity** - Smooth fade in/out
- **bg-gray-500/60** - Light mode: 60% opacity gray
- **dark:bg-gray-900/70** - Dark mode: 70% opacity dark gray
- **aria-hidden="true"** - Hidden from screen readers
- **onClick={onClose}** - Click outside to close

### 4. Centering Trick
```jsx
<span
  className="hidden sm:inline-block sm:align-middle sm:h-screen"
  aria-hidden="true"
>
  &#8203;
</span>
```
- **hidden sm:inline-block** - Desktop only
- **sm:align-middle** - Vertical centering
- **sm:h-screen** - Full height for alignment
- **&#8203;** - Zero-width space character

### 5. Modal Panel
```jsx
<div className="relative z-[10000] inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
```
- **relative** - Positioning context
- **z-[10000]** - Above overlay
- **inline-block** - Inline layout
- **align-bottom** - Mobile: bottom alignment
- **sm:align-middle** - Desktop: center alignment
- **bg-white dark:bg-gray-800** - Background colors
- **rounded-lg** - Rounded corners
- **shadow-xl** - Large shadow
- **transform transition-all** - Smooth animations
- **sm:max-w-lg** - Max width on desktop
- **sm:w-full** - Full width within max

## Close Button Pattern

### Standard Close Button
```jsx
<button
  type="button"
  onClick={onClose}
  disabled={loading}
  className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
>
  <span className="sr-only">Close</span>
  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
</button>
```

**Features:**
- **type="button"** - Prevents form submission
- **disabled={loading}** - Disabled during operations
- **sr-only** - Screen reader text
- **aria-hidden="true"** - Icon hidden from screen readers
- **Focus ring** - Keyboard navigation support

## Z-Index Hierarchy

```
z-[10000] - Modal panel (highest)
z-50      - Modal container
z-40      - Dropdowns/tooltips
z-30      - Fixed headers
z-20      - Sticky elements
z-10      - Elevated content
```

## Opacity Guidelines

### Background Overlay
- **Light mode:** `bg-gray-500/60` (60% opacity)
- **Dark mode:** `dark:bg-gray-900/70` (70% opacity)

**Rationale:**
- Provides clear visual separation
- Maintains readability of background
- Consistent with design system

## Accessibility Features

### ARIA Attributes
```jsx
aria-hidden="true"  // For decorative elements
<span className="sr-only">Close</span>  // Screen reader text
```

### Keyboard Support
- **ESC key** - Should close modal (implement in component)
- **Tab navigation** - Focus trap within modal
- **Focus management** - Return focus on close

### Focus Ring
```jsx
focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500
```

## Responsive Behavior

### Mobile (< 640px)
- Modal slides up from bottom
- Full width with padding
- Bottom alignment

### Desktop (≥ 640px)
- Modal centered in viewport
- Max width constraint
- Middle alignment
- Margin around modal

## Animation Classes

```jsx
transition-opacity  // Overlay fade
transform transition-all  // Modal slide/fade
```

**Transitions:**
- Smooth entrance/exit
- Hardware accelerated
- Consistent timing

## Common Modal Sizes

```jsx
sm:max-w-sm   // Small (384px)
sm:max-w-md   // Medium (448px)
sm:max-w-lg   // Large (512px) - Default
sm:max-w-xl   // Extra Large (576px)
sm:max-w-2xl  // 2X Large (672px)
```

## Implementation Checklist

### Required Elements
- [ ] Fixed container with z-50
- [ ] Flex container for layout
- [ ] Background overlay with opacity
- [ ] Centering span (desktop)
- [ ] Modal panel with z-[10000]
- [ ] Close button with accessibility
- [ ] Click outside to close
- [ ] Proper dark mode support

### Accessibility
- [ ] aria-hidden on decorative elements
- [ ] Screen reader text for actions
- [ ] Focus ring on interactive elements
- [ ] Keyboard navigation support
- [ ] Focus management

### Responsive
- [ ] Mobile bottom alignment
- [ ] Desktop center alignment
- [ ] Proper padding/margins
- [ ] Max width constraints

## Examples

### PaymentModal (Updated)
```jsx
<div className="fixed inset-0 z-50 overflow-y-auto">
  <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div
      className="fixed inset-0 transition-opacity bg-gray-500/60 dark:bg-gray-900/70"
      aria-hidden="true"
      onClick={onClose}
    />
    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
      &#8203;
    </span>
    <div className="relative z-[10000] inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      {/* Content */}
    </div>
  </div>
</div>
```

### AadhaarCheckModal (Correct)
```jsx
<div className="fixed inset-0 z-50 overflow-y-auto">
  <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div
      className="fixed inset-0 transition-opacity bg-gray-500/60 dark:bg-gray-900/70"
      aria-hidden="true"
      onClick={handleClose}
    />
    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
      &#8203;
    </span>
    <div className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
      {/* Content */}
    </div>
  </div>
</div>
```

### EnrollModal (Correct)
```jsx
<div className="fixed inset-0 z-50 overflow-y-auto">
  <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div
      className="fixed inset-0 transition-opacity bg-gray-500/60 dark:bg-gray-900/70"
      aria-hidden="true"
      onClick={onClose}
    />
    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
      &#8203;
    </span>
    <div className="relative z-[10000] inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
      {/* Content */}
    </div>
  </div>
</div>
```

## Common Mistakes to Avoid

### ❌ Wrong Opacity Syntax
```jsx
// Wrong
bg-opacity-75
dark:bg-opacity-75

// Correct
bg-gray-500/60
dark:bg-gray-900/70
```

### ❌ Missing Z-Index
```jsx
// Wrong - Modal might appear behind overlay
<div className="inline-block ...">

// Correct
<div className="relative z-[10000] inline-block ...">
```

### ❌ Missing Centering Span
```jsx
// Wrong - Modal won't center properly on desktop
<div className="flex items-end justify-center ...">
  <div className="fixed inset-0 ..." />
  <div className="inline-block ...">
</div>

// Correct
<div className="flex items-end justify-center ...">
  <div className="fixed inset-0 ..." />
  <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
    &#8203;
  </span>
  <div className="inline-block ...">
</div>
```

### ❌ Missing aria-hidden
```jsx
// Wrong - Screen readers will read decorative elements
<div className="fixed inset-0 ..." onClick={onClose} />

// Correct
<div className="fixed inset-0 ..." aria-hidden="true" onClick={onClose} />
```

## Testing Checklist

### Visual
- [ ] Modal centers properly on desktop
- [ ] Modal slides from bottom on mobile
- [ ] Overlay has correct opacity
- [ ] Dark mode works correctly
- [ ] Animations are smooth
- [ ] Close button visible and styled

### Functional
- [ ] Click outside closes modal
- [ ] Close button works
- [ ] ESC key closes modal (if implemented)
- [ ] Focus trapped in modal
- [ ] Focus returns on close
- [ ] Scrolling works for tall content

### Accessibility
- [ ] Screen reader announces modal
- [ ] Close button has accessible label
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG

## Files Updated

1. `src/pages/internal/Students/components/PaymentModal.jsx`
   - Updated overlay structure
   - Fixed opacity syntax
   - Added z-index to modal panel
   - Added centering span
   - Updated close button styling

## Reference Modals

✅ **Correct Implementation:**
- `src/components/common/Modal/EnrollModal.jsx`
- `src/pages/internal/Students/components/AadhaarCheckModal.jsx`
- `src/pages/internal/Students/components/PaymentModal.jsx` (Updated)

## Resources

- [Tailwind CSS Modal Examples](https://tailwindui.com/components/application-ui/overlays/modals)
- [ARIA Modal Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Focus Management](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)

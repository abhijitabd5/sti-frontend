# Profile Management Implementation

## Overview
Complete user profile management system with view and edit functionality integrated with the admin dashboard.

## Files Created

### 1. API Service
**Path:** `src/services/api/profileApi.js`
- `getProfile()` - Fetches authenticated user's profile
- `updateProfile(profileData)` - Updates profile with FormData support for file uploads

### 2. Main Page Component
**Path:** `src/pages/internal/Profile/Profile.jsx`
- Entry point for the profile module
- Manages view/edit mode toggle
- Handles API calls and loading states
- Integrated with AdminLayout
- Toast notifications for success/error messages
- Matches admin dashboard styling patterns

### 3. View Component
**Path:** `src/pages/internal/Profile/ProfileView.jsx`
- Displays profile in read-only mode
- Shows profile image with avatar fallback (initials)
- Displays all profile information in organized grid
- Role formatting (super_admin → Super Admin, account → Account)
- Shows member since and last updated dates
- Edit button to switch to edit mode
- Gradient header with profile info

### 4. Form Component
**Path:** `src/pages/internal/Profile/ProfileForm.jsx`
- Full edit form with all profile fields
- Current and new photo preview side-by-side
- File validation (JPG, JPEG, PNG; max 10MB)
- Client-side field validation (required, email format, mobile format)
- FormData handling for file uploads
- Loading states with spinner
- Cancel and Save buttons with gradient styling

## Features

✅ **Dual Mode Interface**
- Seamless toggle between view and edit modes
- Current profile displayed in organized card layout
- Edit form with real-time validation

✅ **Image Management**
- Current photo preview
- New photo preview before saving
- Automatic file validation
- Support for JPG, JPEG, PNG formats
- Max 10MB file size limit

✅ **Form Validation**
- First name & Last name (required)
- Email (required, valid format)
- Mobile number (required, valid format with digits only)
- Real-time error clearing on input
- Backend error handling

✅ **Admin Dashboard Integration**
- Uses AdminLayout wrapper
- Matches color scheme (violet primary, green success, gradient buttons)
- Admin styling patterns (borders, spacing, dark mode support)
- Table-like card layout with sections

✅ **Dark Mode Support**
- Full dark theme compatibility
- Gradient backgrounds work in both themes
- Text contrast maintained across themes

✅ **User Feedback**
- Toast notifications for success/error messages
- Loading spinners during data fetch/save
- Error messages from backend displayed to user
- Clear success/error states

✅ **Accessibility**
- Proper form labels
- Semantic HTML
- ARIA attributes where needed
- Keyboard navigation support

## Styling Classes Used

- **Buttons:** `btn`, gradient backgrounds with hover states
- **Borders:** `border-gray-200 dark:border-gray-700/60`
- **Backgrounds:** `bg-white dark:bg-gray-800`, gradient sections
- **Text:** Size and color consistent with admin dashboard
- **Spacing:** Padding with section dividers
- **Form Inputs:** `form-input` class for consistency

## Color Scheme

- **Primary:** Violet (`from-violet-500 to-violet-600`)
- **Success:** Green (used in gradients)
- **Backgrounds:** Gray-50/100 headers, white/800 content
- **Borders:** Gray-200/700 with opacity variants
- **Text:** Gray-800/100 for content, Gray-500/400 for labels

## API Integration

### Get Profile
```javascript
import { getProfile } from '@/services/api/profileApi';
const response = await getProfile();
// Returns: { success: true, data: {...}, message: "..." }
```

### Update Profile
```javascript
import { updateProfile } from '@/services/api/profileApi';
const formData = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  mobile: '1234567890',
  file: File // optional
};
const response = await updateProfile(formData);
// Returns: { success: true, data: {...}, message: "..." }
```

## Route Setup

Add to your routes configuration:

```javascript
import Profile from '@/pages/internal/Profile/Profile';

// In your admin routes:
{
  path: '/admin/profile',
  element: <Profile />
}
```

## Component Props

### ProfileView
- `profile` - Profile data object
- `onEdit` - Callback for edit button click

### ProfileForm
- `profile` - Current profile data for prefilling
- `onSubmit` - Callback with form data on save
- `onCancel` - Callback for cancel button click
- `isLoading` - Boolean for disabled state during save

## Error Handling

- Network errors caught and displayed
- Backend validation errors shown to user
- File validation errors with specific messages
- Form field validation with inline error messages
- Graceful fallback UI when profile fails to load

## Future Enhancements

- Password change functionality
- Two-factor authentication settings
- Account deletion with confirmation
- Activity log / login history
- Export profile data
- Notification preferences

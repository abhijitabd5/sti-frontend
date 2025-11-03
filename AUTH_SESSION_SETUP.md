# Authentication Session & Credentials Setup

## Overview
Updated authentication system to maintain session for 7 days and enable credential-based requests with cookies.

## Changes Made

### 1. AuthContext.jsx (`src/contexts/AuthContext.jsx`)

#### Token Expiration (7 Days)
- **Location:** Login function
- Added automatic expiration timestamp calculation:
  ```javascript
  const expirationTime = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
  localStorage.setItem('tokenExpiration', expirationTime.toString());
  ```
- Stores expiration time in localStorage with key `tokenExpiration`

#### Token Expiration Check on App Load
- **Location:** `checkAuthStatus` useEffect
- Checks if token has expired before verifying:
  ```javascript
  if (expirationTime && new Date().getTime() > parseInt(expirationTime)) {
    clearAuthData();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    return;
  }
  ```
- Automatically logs out if token has expired (after 7 days)
- Prevents stale token usage

### 2. httpClient.js (`src/services/utils/httpClient.js`)

#### withCredentials Configuration
- **Global Setting:** Added to axios instance:
  ```javascript
  const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    withCredentials: true,  // Enable credentials for all requests
    headers: { 'Content-Type': 'application/json' }
  });
  ```
- **Per-Request:** Ensured in request interceptor:
  ```javascript
  config.withCredentials = true;
  ```

#### Token Expiration Check
- **New Helper Function:**
  ```javascript
  const isTokenExpired = () => {
    const expirationTime = localStorage.getItem('tokenExpiration');
    if (!expirationTime) return false;
    return new Date().getTime() > parseInt(expirationTime);
  };
  ```
- Checks expiration before every API request
- Prevents expired tokens from being sent to backend

#### Request Interceptor Updates
- Validates token expiration before making request
- Clears all auth data if expired
- Redirects to login page
- Sets `withCredentials: true` on each request configuration
- Maintains Authorization header with Bearer token

#### Response Interceptor Updates
- Clears `tokenExpiration` from localStorage on 401 errors
- Ensures complete cleanup of session data

## Benefits

✅ **7-Day Session Duration**
- Users stay logged in for 7 days automatically
- Reduced friction for returning users
- Security balanced with user experience

✅ **Credential-Based Requests**
- `withCredentials: true` enables cookie sending
- Supports HttpOnly cookies from backend
- Enhances security with CSRF tokens

✅ **Automatic Expiration Handling**
- Checked on app load
- Checked before every API request
- Prevents using expired tokens
- Automatic redirect to login

✅ **Complete Session Cleanup**
- Removes all auth-related localStorage items:
  - `token`
  - `access_token`
  - `refresh_token`
  - `user`
  - `tokenExpiration`

## Implementation Details

### Expiration Time Calculation
```
7 days = 7 * 24 * 60 * 60 * 1000 milliseconds
       = 604,800,000 milliseconds
       = Stored as timestamp in milliseconds
```

### Storage Keys
| Key | Purpose |
|-----|---------|
| `token` | Backward compatible access token |
| `access_token` | Current access token |
| `refresh_token` | Refresh token for renewal |
| `user` | User profile data |
| `tokenExpiration` | Token expiration timestamp |

### Flow Diagram

```
User Login
    ↓
Set tokenExpiration = now + 7 days
    ↓
Store tokens in localStorage
    ↓
User makes API request
    ↓
Check: Is token expired?
    ├─ YES → Clear data, redirect to /login
    └─ NO → Continue with request (withCredentials: true)
    ↓
Send request with Authorization header + cookies
    ↓
Server receives request with credentials
```

## Backend Requirements

Ensure your backend is configured to:

1. **Accept Credentials**
   ```
   CORS header: Access-Control-Allow-Credentials: true
   ```

2. **Set Cookies**
   - HttpOnly cookies (security best practice)
   - SameSite policy configured
   - Secure flag if using HTTPS

3. **Refresh Token Endpoint**
   - POST `/api/auth/refresh-token`
   - Expects `refresh_token` in request body
   - Returns new tokens in response

## Testing

### Test 7-Day Expiration
```javascript
// Check expiration was set
const exp = localStorage.getItem('tokenExpiration');
console.log('Expiration:', new Date(parseInt(exp)).toISOString());

// Simulate expiration (for testing only)
localStorage.setItem('tokenExpiration', Date.now() - 1000);
// Next API request should redirect to /login
```

### Test withCredentials
```javascript
// Check request headers in browser DevTools
// Network tab → API request → Headers
// Should see: Cookie header if server sent Set-Cookie
```

## Troubleshooting

### Users Getting Logged Out Frequently

**Issue:** If users still get logged out too quickly:
1. Check if backend is sending 401 responses
2. Verify `tokenExpiration` is being set correctly
3. Check if refresh token endpoint is working
4. Ensure `withCredentials: true` is being sent

**Debug:**
```javascript
// In console
localStorage.getItem('tokenExpiration');
// Should be a future timestamp
```

### Cookies Not Being Sent

**Issue:** Backend not receiving cookies
1. Verify `withCredentials: true` is set ✓ (now fixed)
2. Check CORS configuration on backend
3. Ensure `Access-Control-Allow-Credentials: true` header
4. Check cookie domain/path matches

### Token Refresh Not Working

**Issue:** Refresh token endpoint failing
1. Verify refresh token is stored in localStorage
2. Check backend endpoint: POST `/api/auth/refresh-token`
3. Ensure request includes `refresh_token` in body
4. Verify response includes new tokens

## Maintenance

### Monitor Session Health
- Watch for frequent 401 errors
- Monitor token refresh failures
- Track logout requests

### Update Expiration Time
If you want to change from 7 days to another duration:

**In AuthContext.jsx (line 157):**
```javascript
// Change this line:
const expirationTime = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);

// To (example: 30 days):
const expirationTime = new Date().getTime() + (30 * 24 * 60 * 60 * 1000);
```

## Security Considerations

✅ **Current Security Measures**
- Credentials sent only with `withCredentials: true`
- HttpOnly cookies recommended on backend
- Refresh token stored in localStorage
- Automatic expiration after 7 days
- Clear session data on logout

⚠️ **Recommendations**
- Use HTTPS in production
- Implement CSRF protection
- Set `Secure` flag on cookies
- Set `SameSite=Strict` on cookies
- Implement rate limiting on refresh endpoint
- Monitor for suspicious refresh patterns

## Support

If users are still experiencing frequent logouts:

1. Verify backend is not invalidating sessions
2. Check for any middleware clearing cookies
3. Ensure proper CORS headers
4. Test refresh token flow manually
5. Check browser console for errors

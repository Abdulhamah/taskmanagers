# Password Reset Code System

## Overview
The password reset system has been updated to use a 6-digit code verification instead of token-based email links. This provides a more secure and user-friendly experience.

## Flow

### User Requests Password Reset
1. User enters their email on the "Forgot Password" page
2. Backend generates a random 6-digit code
3. Code is stored in the database with a 15-minute expiration
4. Email is sent containing the 6-digit code

### User Resets Password
1. User enters the 6-digit code they received
2. User enters their new password (min 6 characters)
3. User confirms the password
4. System validates the code and password
5. Password is updated in the database
6. Code is deleted from the database (one-time use)

## Backend Changes

### New Endpoints

#### POST `/api/auth/forgot-password`
- **Request**: `{ email: string }`
- **Response**: `{ message: "Reset code sent successfully", previewUrl?: string }`
- **Generates**: 6-digit code, stores with 15-minute expiration
- **Sends**: Email with reset code

#### POST `/api/auth/verify-reset-code`
- **Request**: `{ email: string, code: string }`
- **Response**: `{ message: "Code verified successfully", userId: string }`
- **Purpose**: Verify code is valid before allowing password reset

#### POST `/api/auth/reset-password`
- **Request**: `{ email: string, code: string, newPassword: string }`
- **Response**: `{ message: "Password reset successfully" }`
- **Updates**: User password in database
- **Deletes**: Used reset code

## Frontend Changes

### ForgotPassword Component (`frontend/src/pages/ForgotPassword.tsx`)
- **Step 1 (Email)**: User enters email to receive reset code
- **Step 2 (Code)**: User enters 6-digit code and new password
- **Step 3 (Success)**: Confirmation and redirect to login
- **Features**:
  - Code input accepts only digits (auto-formats)
  - Password visibility toggle
  - Password match validation
  - Development email preview link

### ResetPassword Component (`frontend/src/pages/ResetPassword.tsx`)
- Redirects users to the Forgot Password page
- Explains the new code-based system
- No longer handles URL token parameters

## Security Features

✅ **6-digit codes** - Short, memorable for users  
✅ **15-minute expiration** - Prevents brute force attacks  
✅ **One-time use** - Code deleted after successful reset  
✅ **Email verification** - Code sent to registered email  
✅ **No URL tokens** - Codes never exposed in URLs  
✅ **Server-side validation** - All verification happens on backend  

## Database
- Uses existing `passwordResetTokens` table
- Stores: `id`, `userId`, `token` (the code), `expiresAt`, `createdAt`

## Testing

1. Click "Forgot Password" on login page
2. Enter your email
3. Check email for 6-digit code (or click preview link in dev)
4. Enter code and new password
5. Click "Reset Password"
6. You'll be redirected to login with your new password

## Email Template
The email includes:
- Clear instruction to enter the code on the website
- Large, readable 6-digit code
- 15-minute expiration notice
- No clickable links required

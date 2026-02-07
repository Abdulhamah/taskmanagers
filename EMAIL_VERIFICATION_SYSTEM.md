# Email Verification System for Registration

## Overview
New users must verify their email address during account creation. They receive a 6-digit code via email and must enter it on the website to activate their account.

## Flow

### User Registration
1. User clicks "Create Account" on login page
2. Fills in: Name, Email, Password, Confirm Password
3. Backend creates user with `emailVerified = 0` (pending)
4. 6-digit verification code generated (30-min expiration)
5. Email sent with verification code

### Email Verification
1. User receives email with 6-digit code
2. Navigates to code entry form
3. Enters the code
4. Backend validates code against user ID
5. User marked as verified (`emailVerified = 1`)
6. Code is deleted (one-time use)
7. Success confirmation and redirect to login

### Login Protection
- Users with `emailVerified = 0` cannot log in
- Error message: "Please verify your email first"

## Database Changes

### New Column
```sql
ALTER TABLE users ADD COLUMN emailVerified INTEGER NOT NULL DEFAULT 0;
```

### New Table
```sql
CREATE TABLE emailVerificationTokens (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expiresAt TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

## Backend Endpoints

### POST `/api/auth/register`
- **Request**: `{ name, email, password, company?, role? }`
- **Response**: `{ message, userId, name, email, company, role, previewUrl? }`
- **Behavior**: 
  - Creates user with `emailVerified = 0`
  - Generates verification code
  - Sends email with code
  - Returns user ID for verification step

### POST `/api/auth/verify-email`
- **Request**: `{ userId, code }`
- **Response**: `{ message: "Email verified successfully" }`
- **Behavior**:
  - Validates code for given user ID
  - Checks 30-minute expiration
  - Updates user `emailVerified = 1`
  - Deletes verification code

### POST `/api/auth/login` (Updated)
- **Request**: `{ email, password }`
- **Response**: `{ id, name, email, company, role }`
- **Behavior**: Now checks `emailVerified` status
  - Returns 403 if `emailVerified = 0`
  - Error: "Please verify your email first"

## Frontend Components

### Register Component (`frontend/src/pages/Register.tsx`)
Three-step process:
1. **Register**: Collect name, email, password
2. **Verify**: Enter 6-digit code from email
3. **Success**: Confirmation and redirect to login

Features:
- Code input accepts only digits
- Password match validation
- Development email preview link
- Back buttons for navigation

### Login Component (Updated)
- Removed inline registration
- "Create Account" button navigates to Register page
- Links to forgot password and new registration

## Security Features

✅ **Email Verification**: Confirms user owns the email  
✅ **Time-Limited Codes**: 30-minute expiration  
✅ **One-Time Use**: Code deleted after verification  
✅ **Verified-Only Login**: Unverified users blocked  
✅ **Server-Side Validation**: All checks on backend  
✅ **No URL Tokens**: Codes never in URLs, direct input only  

## User Experience

1. **Registration Page**: Clean form with clear instructions
2. **Email**: Simple, readable code display
3. **Verification**: Easy code entry (auto-formatted, focused)
4. **Success**: Quick redirect to login
5. **Development**: Email preview link for testing

## Testing

1. Go to login page → Click "Create Account"
2. Fill in registration form
3. Check email (or click preview link in dev)
4. Copy 6-digit code
5. Paste code in verification form
6. See success message
7. Click "Sign In" to log in (code was needed)

## Configuration

- **Code Format**: 6 random digits (100000-999999)
- **Expiration**: 30 minutes
- **Email Provider**: Gmail (or Ethereal for dev)
- **Verified Default**: False (emailVerified = 0)

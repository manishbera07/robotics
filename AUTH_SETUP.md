# Authentication System Setup Guide

## 🎯 Overview
This project now includes a complete authentication system with:
- ✅ Email-based signup with verification
- ✅ Login/Logout functionality
- ✅ Forgot password flow
- ✅ User profile page
- ✅ Event registration tracking

## 📋 Database Setup

### Step 1: Run the SQL Migration
1. Go to your **Supabase Dashboard** → https://app.supabase.com
2. Select your project
3. Go to **SQL Editor**
4. Copy the contents of `scripts/010_auth_system.sql`
5. Paste and click **Run**

This will create:
- `profiles` table (user data)
- `event_registrations` table (event sign-ups)
- Auth trigger to auto-create profiles
- RLS policies for security

### Step 2: Configure Email Settings
1. In Supabase Dashboard, go to **Authentication** → **Email Templates**
2. Enable **"Confirm signup"** template
3. Customize the email template if desired
4. Go to **Authentication** → **URL Configuration**
5. Add these URLs:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**:
     - `http://localhost:3000/profile`
     - `http://localhost:3000/auth/reset-password`

### Step 3: Enable Email Provider
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Toggle **"Confirm email"** to ON
4. Save changes

## 🚀 Features

### Authentication Pages
- **`/auth/signup`** - Create new account
- **`/auth/login`** - Sign in
- **`/auth/forgot-password`** - Reset password request
- **`/auth/reset-password`** - Set new password (from email link)

### User Features
- **`/profile`** - View profile and registered events
  - Shows user's full name and email
  - Displays upcoming event registrations
  - Lists events until their start date
  - Logout button

### Navigation
- **Navbar** automatically shows:
  - **LOGIN** button (when not signed in)
  - **PROFILE** button (when signed in)

## 🔒 Security

### Row Level Security (RLS)
All tables have RLS enabled:
- Users can only view/edit their own profile
- Users can only see their own event registrations
- Events and other public data are readable by all

### Email Verification
- New users must verify their email before logging in
- Verification email sent automatically on signup
- Password reset requires email confirmation

## 📝 Usage Flow

### Sign Up Process
1. User visits `/auth/signup`
2. Fills in name, email, password
3. System sends verification email
4. User clicks link in email to verify
5. User can now login at `/auth/login`

### Event Registration (Future)
When you add event registration functionality:
```typescript
const { error } = await supabase
  .from('event_registrations')
  .insert({
    user_id: user.id,
    event_id: eventId,
    status: 'confirmed'
  })
```

### Viewing Registrations
- Logged-in users see their registrations on `/profile`
- Only upcoming events are displayed
- Past events are automatically filtered out

## 🛠️ Development

### Environment Variables
Your `.env.local` is already configured with:
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

### Testing Locally
1. Run `pnpm dev`
2. Visit `http://localhost:3000`
3. Click **LOGIN** → **Sign up**
4. Create a test account
5. Check your email for verification link
6. Verify and login
7. Visit `/profile` to see your profile

## 🎨 Customization

### Profile Page
Edit `app/profile/page.tsx` to customize:
- User information display
- Event card layout
- Additional user features

### Auth Pages
All auth pages use the same theme system:
- `accentColor` for primary elements
- `secondaryColor` for accents
- Consistent animations and styling

## 📧 Email Configuration (Production)

For production deployment:
1. Configure custom SMTP in Supabase
2. Update redirect URLs to your domain
3. Customize email templates with branding
4. Set up email rate limiting

## ✅ Checklist

- [x] Run `010_auth_system.sql` in Supabase
- [ ] Enable email verification in Supabase
- [ ] Add redirect URLs in Supabase
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test forgot password
- [ ] Test profile page
- [ ] Add event registration functionality (optional)

## 🎯 Next Steps

1. **Run the SQL migration** (Step 1 above)
2. **Configure Supabase email settings** (Step 2 & 3)
3. **Restart your dev server**: `pnpm dev`
4. **Test the auth flow** by creating an account
5. **Add event registration buttons** to your events page (optional)

Your authentication system is ready to use! 🎉

# Cuervo — Project Context for AI Assistants

## Overview

**Cuervo** (also referred to internally as *MiCuervo*) is a QR-based emergency profile manager. Users create one or more medical/emergency profiles containing personal data (blood type, ID, health insurance) and emergency contact info. A single profile can be marked as "chosen" (active) and is publicly accessible via a scannable QR code at `/public/<user_id>`, requiring no authentication.

The target use case is personal emergency identification: someone scans the user's QR code (e.g., on a physical card or sticker) and immediately sees the relevant medical and emergency contact information.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript + Vite 7 |
| Styling | TailwindCSS v4 (via `@tailwindcss/vite` plugin — **no config file**) |
| Backend / DB | Supabase (auth + database + storage) |
| Routing | react-router-dom v7 |
| Toasts | react-hot-toast |
| Package Manager | Yarn |

> **TailwindCSS v4 note:** There is no `tailwind.config.*` file. All Tailwind configuration is done through CSS using `@theme` and native CSS variables in `src/index.css`. Do not generate a config file.

---

## Environment Variables

Stored in `.env` at the project root. Required keys:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

The Supabase client is initialized in `src/lib/supabase.ts` and imported throughout the app.

---

## Project Structure

```
src/
├── App.tsx                  # Root: routes, AuthProvider, Toaster
├── main.tsx                 # Entry point
├── index.css                # Global styles + Tailwind v4 theme
├── components/
│   ├── Login.tsx            # Auth: email/password login
│   ├── SignUp.tsx           # Auth: new user registration (calls user-upsert edge function)
│   ├── Dashboard.tsx        # Protected main dashboard; profile CRUD
│   ├── Public.tsx           # Public profile view (no auth required)
│   └── ui/
│       ├── ProfileForm.tsx  # Reusable form for profile data (useReducer-based)
│       ├── CreateProfile.tsx # Wrapper: new profile via ProfileForm
│       ├── UpdateProfile.tsx # Wrapper: edit existing profile via ProfileForm
│       ├── FormInput.tsx    # Styled <input> component
│       ├── FormSelect.tsx   # Styled <select> component
│       ├── Modal.tsx        # Generic modal overlay
│       ├── SideDrawer.tsx   # Slide-in side panel
│       ├── FloatingButton.tsx # Fixed FAB button
│       ├── QR.tsx           # Displays QR code image
│       └── QRCard.tsx       # Card-style QR display
├── contexts/
│   └── AuthContext.tsx      # Supabase session; exposes session, user, loading
├── hooks/
│   ├── useProfiles.ts       # useReducer hook for profile list (SET/REMOVE/CHOOSE)
│   └── useQR.ts             # Generates QR URL via api.qrserver.com
├── objects/
│   └── profile.ts           # TypeScript interfaces: Profile, ProfileData
├── constants/
│   ├── profile.constant.ts  # RH blood types, ID_TYPE enum, INITIAL_PROFILE_DATA
│   └── server.ts            # API endpoint constants (ENDPOINTS.V1.CREATE_USER)
└── lib/
    └── supabase.ts          # Supabase client singleton
```

---

## Routing

| Path | Component | Auth Required |
|---|---|---|
| `/` | `<Login />` | No |
| `/login` | `<Login />` | No |
| `/signup` | `<SignUp />` | No |
| `/dashboard` | `<Dashboard />` | Yes (via `ProtectedRoute`) |
| `/public/:token` | `<Public />` | No |

`ProtectedRoute` checks `session` from `useAuth()`. If no session, it renders `<Login />` in place.

---

## Supabase Schema

### Table: `PublicUser`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK → auth.users.id |
| `profile_title` | text | Display name for the profile |
| `profile_description` | text | Short description |
| `data` | jsonb | Serialized `ProfileData` object |
| `chosen` | boolean | Active/default profile flag |

**RLS:** Reads on `PublicUser` are open (for the public profile route). Writes are scoped to `user_id = auth.uid()`.

### Storage

Used for image uploads (referenced in past work). Files must be placed in a `public/` folder prefix to satisfy RLS policies.

### Edge Functions

- `user-upsert` (`/functions/v1/user-upsert`) — Called during sign-up to create the user record.

---

## Data Model

```typescript
// src/objects/profile.ts
interface ProfileData {
  fullName?: string
  rh?: string           // Blood type (O+, A-, etc.)
  idType?: string       // CC | TI | CE | PAS
  idNumber?: string
  healthInsurance?: string
  healthInsuranceNumber?: string
  extraInfo?: string
  emergencyName?: string
  emergencyContact?: string
  emergencyRelationship?: string
}

interface Profile {
  id: string
  profile_title?: string
  profile_description?: string
  data?: ProfileData
  isExpanded?: boolean
  chosen?: boolean
}
```

---

## Key Patterns & Conventions

### State Management
- No Redux or Zustand. State is managed locally with `useState` and `useReducer`.
- `useProfiles` hook manages the list of profiles in `Dashboard` using a `useReducer` with `SET_PROFILES`, `REMOVE_PROFILE`, and `CHOOSE_PROFILE` actions.
- `ProfileForm` uses its own internal `useReducer` to manage form state and calls `onUpdate(state)` in a `useEffect` on every change.

### Authentication
- `AuthContext` wraps the entire app and exposes `{ session, user, loading }`.
- Uses `supabase.auth.onAuthStateChange` for reactive session updates.
- `useAuth()` is the standard hook to access auth state.

### UI Style
- Dark-first design: black backgrounds (`bg-black`, `bg-[#0a0a0a]`) with white text.
- Design tokens: `border-white/10`, `border-white/20`, `text-gray-400`, `text-white`.
- Toaster configured with dark style: `background: #0a0a0a`, `color: #fff`.
- Responsive: mobile uses floating action buttons (`FloatingButton`) for actions that appear as inline buttons on desktop.
- Spanish UI copy (e.g., "Salir", "Crear Perfil", "Visitar perfil publico").

### Supabase Queries
- Always scope writes with `.eq('user_id', user?.id)` for RLS compliance.
- The public profile is fetched with `.eq('user_id', token).eq('chosen', true).single()`.

### Notifications
- Use `toast.success(...)` and `toast.error(...)` from `react-hot-toast` for all user feedback.

---

## Dev Commands

```bash
yarn dev       # Start development server (Vite HMR)
yarn build     # TypeScript check + Vite production build
yarn lint      # ESLint
yarn preview   # Preview production build
```

---

## Past Work / Notable History

- **Supabase RLS fix:** Upload paths must include a `public/` prefix (e.g., `public/filename.jpg`) to satisfy storage RLS policies.
- **Profile refactor:** `ProfileForm` was extracted as a shared component used by both `CreateProfile` and `UpdateProfile`.
- **Array sort fix:** When sorting arrays from Supabase, spread into a new array first (`[...arr].sort(...)`) to avoid mutating read-only properties.

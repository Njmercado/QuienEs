# AGENTS.md - Development Guidelines for Cuervo

This document provides guidelines for agentic coding agents working in the Cuervo (QuienEs) repository.

## Build, Lint & Test Commands

```bash
# Development
yarn dev              # Start Vite dev server with HMR

# Production
yarn build            # Type check (tsc) + Vite production build
yarn preview          # Preview production build locally

# Linting
yarn lint             # Run ESLint on all TS/TSX files

# Testing
yarn test             # Run all tests (Vitest, exit after completion)
yarn test:ui          # Run tests with Vitest UI dashboard

# Running a single test
yarn test -- src/components/ui/__tests__/ConditionCard.test.tsx
yarn test -- --grep "renders title"  # Filter by test name

# Run tests in watch mode
yarn test -- --watch
```

## Code Style Guidelines

### Imports & Dependencies

- Use ES6 module syntax with named imports
- Type imports use `type` keyword: `import type { Profile } from '../../objects/profile'`
- Group imports: external packages first, then relative imports
- Always use relative paths starting with `./` or `../`

```typescript
// Correct
import { useState } from 'react'
import { useTheme } from '@mui/material'
import type { ProfileData } from '../../objects/profile'
import { FormInput } from './FormInput'
```

### TypeScript & Types

- `"strict": true` mode enforced - all types must be explicit
- No unused locals/parameters allowed
- Data models use dual interfaces: `XyzData` (mutable fields) + `Xyz extends XyzData` (with immutable metadata)

```typescript
// Correct pattern for interfaces
export interface ConditionData {
  title: string
  medicines: string[]
  is_allergy?: boolean
}

export interface Condition extends ConditionData {
  id: string
  user_id?: string
  created_at?: string
}
```

### Naming Conventions

- **Components**: PascalCase (e.g., `ProfileForm`, `ConditionCard`, `SOSContactForm`)
- **Component files**: PascalCase matching export name
- **Hooks**: camelCase with `use` prefix (e.g., `useQR`, `useTheme`)
- **Utils/services**: camelCase (e.g., `audioTTS.ts`, `protectedRoute.tsx`)
- **Database fields**: snake_case (e.g., `profile_title`, `medical_conditions`, `sos_contacts`)
- **Event handlers**: `on{Action}` pattern (e.g., `onEdit`, `onDelete`, `onUpdate`, `onChange`)
- **Interfaces**: `{Name}Props` for component props, `{Name}Data` for mutable data

### Component Architecture

- Functional components only (no class components)
- Props defined as interface ending in `Props`
- Use destructuring in function signature when props have 2+ properties
- Export named functions, not default exports

```typescript
interface ConditionCardProps {
  condition: Condition
  onEdit: (condition: Condition) => void
  onDelete: (id: string) => void
}

export function ConditionCard({ condition, onEdit, onDelete }: ConditionCardProps) {
  // component body
}
```

### Error Handling

- RTK Query endpoints use `queryFn` pattern with Supabase client
- Always check auth: `const { data: { user } } = await supabase.auth.getUser()`
- Return normalized error objects: `{ error: { status: number, data: string } }`
- Unauthorized should return 401 status

```typescript
// Correct error handling in RTK Query
const { data: { user } } = await supabase.auth.getUser()
if (!user) return { error: { status: 401, data: 'Unauthorized' } }

const { error } = await supabase.from('Profile').select('*')
if (error) return { error: { status: 500, data: error.message } }
return { data: result }
```

### Formatting

- Use 2 spaces for indentation (ESLint enforces)
- Line length: no strict limit but keep readability in mind
- Semicolons required at end of statements
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks

## Testing Guidelines

- Test file location: `src/{feature}/__tests__/{Component}.test.tsx`
- Tests use React Testing Library + Vitest
- Mock MUI theme for component tests (see `ConditionCard.test.tsx` for pattern)
- Use `vi.fn()` for mocks, `vi.mock()` for modules
- Test names should describe behavior: "renders title and medicine chips", "calls onEdit when Edit clicked"

```typescript
describe('ComponentName', () => {
  it('renders without crashing', () => {
    render(<Component {...props} />)
    expect(screen.getByText('expected')).toBeInTheDocument()
  })

  it('calls callback on user action', () => {
    const onAction = vi.fn()
    render(<Component onAction={onAction} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onAction).toHaveBeenCalled()
  })
})
```

## Common Patterns

### Adding a New Page/Component

1. Create component file in `src/components/` or `src/components/ui/`
2. Define `{Name}Props` interface
3. Export named function component
4. Add route in `src/constants/routes.ts` if it's a page
5. Wire up in `src/App.tsx` routing if needed

### Adding a RTK Query Endpoint

1. Create file: `src/store/endpoints/{entityName}Api.ts`
2. Use `apiSlice.injectEndpoints()` pattern
3. Export hooks: `useGetXQuery`, `useCreateXMutation`, etc.
4. Provide/invalidate cache tags for consistency

### Component Props Callbacks

- Use `on{Action}` naming: `onEdit`, `onDelete`, `onChange`, `onSubmit`
- Include parameter type in callback: `onEdit: (item: Item) => void`

### State Management

- Use Redux Toolkit + RTK Query for server state
- Use React `useState` for local UI state only
- Auth context provided via `AuthContext` in `src/contexts/AuthContext.tsx`

## Project Structure Reference

```
src/
  components/        # Page and layout components
  components/ui/     # Reusable UI components (26 components)
  store/
    endpoints/       # RTK Query API definitions
    index.ts         # Redux store configuration
  objects/           # TypeScript interfaces/types
  constants/         # Constants, routes, server endpoints
  hooks/             # Custom React hooks
  contexts/          # React Context providers
  utils/             # Utility functions
  lib/               # External library initialization (Supabase)
```

## Important Notes

- **Database naming**: All database columns use snake_case (auto-converted from UI camelCase)
- **Type safety**: Always use `type` imports for TypeScript-only imports
- **Supabase integration**: Client initialized in `src/lib/supabase.ts`, never hardcode URLs
- **Environment vars**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` required in `.env`
- **No unused code**: Both ESLint and TypeScript strict mode enforce no unused variables/parameters
- **Modified files**: Check `src/hooks/useQR.ts` - contains hardcoded test URL (should use dynamic `window.location.origin`)

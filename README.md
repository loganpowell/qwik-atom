# Qwik + @thi.ng/paths State Management POC

A proof-of-concept demonstrating integration of [@thi.ng/paths](https://github.com/thi-ng/umbrella/tree/develop/packages/paths) with [Qwik](https://qwik.dev) using a cursor-based API.

## Key Features

### Three-Tier State Architecture

- **Committed** (JSON file) - The source of truth on disk
- **Staged** (localStorage) - Temporary changes, persists across page reloads
- **Diff** - Calculated difference between committed and staged

### State Management Pattern

- ✅ Immutable updates using `@thi.ng/paths`
- ✅ Automatic localStorage persistence via `useContextCursor` hook
- ✅ Real-time diff calculation
- ✅ Qwik reactivity via `useContext`
- ✅ Cursor-based API with serializable QRL functions

### Developer Experience

- DevBar component showing uncommitted changes
- Commit to file workflow
- Rollback to last committed state
- Type-safe state updates

## Architecture

```
┌─────────────────┐
│  features.json  │ ← Committed state (source of truth)
└────────┬────────┘
         │ Load on init
         ↓
┌─────────────────┐
│  localStorage   │ ← Staged state (persists across reloads)
└────────┬────────┘
         │ Updated on each change
         ↓
┌─────────────────┐
│  Qwik Contexts  │ ← Reactive state stores
│ (APP_STATE_CTX, │
│ COMMITTED_CTX)  │
└────────┬────────┘
         │ useContextCursor hook
         ↓
┌─────────────────┐
│ Cursor Interface│ ← Serializable swap/reset operations
│ (QRL functions) │
└─────────────────┘
```

## Update Pattern

All state updates use the `useContextCursor()` hook, which follows React's convention by returning `[value, cursor]`:

```tsx
import { useContextCursor } from "~/hooks/useContextCursor";

// Get the value and cursor for a specific path (like React's useState)
const [features, featuresCursor] = useContextCursor(APP_STATE_CTX, [
  "features",
]);

// Update with swap (immutable update function)
featuresCursor.swap((features) => [...features, newFeature]);

// Or reset to a new value
featuresCursor.reset([]);

// If you only need the cursor for updates (not the value)
const [, cursor] = useContextCursor(APP_STATE_CTX);
```

Under the hood, this:

1. Creates immutable update with `@thi.ng/paths` `updateIn`
2. Updates Qwik context (triggers UI reactivity)
3. Saves to localStorage (for APP_STATE_CTX)
4. Recalculates diff against committed state

## Project Structure

```
src/
├── components/
│   ├── DevBar.tsx           # Developer toolbar
│   └── FeatureCard.tsx      # Editable feature component
├── hooks/
│   └── useContextCursor.ts  # Cursor hook for state updates
├── routes/
│   ├── index.tsx            # Home page (counter demo)
│   ├── features/index.tsx   # Features list
│   └── api/features/index.ts # Commit endpoint
├── store/
│   ├── appStore.ts          # Context definitions
│   └── diff.ts              # Diff calculation
└── types/
    └── data.ts              # TypeScript types
```

## Key Learnings

### Qwik Reactivity Gotchas

1. **`useContext` required in each component** - Can't share hooks that return context values
2. **Qwik proxies must be stripped** before passing to atoms - Use `JSON.parse(JSON.stringify())`
3. **State updates must go through Qwik context first** - Direct atom updates won't trigger reactivity
4. **Watchers receive old state** - Watchers run asynchronously after Qwik updates, so they see previous state
5. **Avoid direct object mutation** - Always create new objects for updates to ensure reactivity
6. **Deep equality checks** - Use `@thi.ng/equiv` for accurate diffing of nested structures
7. **Serialization limits** - Only JSON-serializable data should be stored in atoms/localStorage

### State Synchronization

- Update Qwik state first (for immediate UI updates)
- Then sync to atom (triggers persistence and diff)
- Watchers run asynchronously but synchronously enough for this use case

## Running the Project

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Dependencies

- **Qwik** - Resumable framework with fine-grained reactivity
- **@thi.ng/atom** - Immutable state containers with watches
- **@thi.ng/paths** - Path-based immutable updates
- **@thi.ng/equiv** - Deep equality checking for diff calculation

## License

MIT

## Credits

Built to validate state management patterns for the ET ML Evals project.

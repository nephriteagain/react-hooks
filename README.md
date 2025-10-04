# @nephriteagain/react-hooks

A collection of useful React hooks for handling async operations.

## Installation

```bash
npm install @nephriteagain/react-hooks
```

## Hooks

### `useAsyncAction`

A comprehensive hook for handling async actions with loading, error, and data states. Perfect for API calls that need full state management.

#### Usage

```jsx
import { useAsyncAction } from '@nephriteagain/react-hooks';

function UserProfile() {
  const fetchUser = async (userId) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  };

  const [runFetch, state] = useAsyncAction(fetchUser, {
    onComplete: () => console.log('User fetched!'),
    onError: (err) => console.error('Failed to fetch user:', err)
  });

  return (
    <div>
      <button onClick={() => runFetch(123)} disabled={state.isLoading}>
        {state.isLoading ? 'Loading...' : 'Fetch User'}
      </button>
      {state.isError && <p>Error: {state.error.message}</p>}
      {state.data && <p>User: {state.data.name}</p>}
    </div>
  );
}
```

#### API

```typescript
useAsyncAction(fn, options?)
```

**Parameters:**
- `fn`: The async function to wrap
- `options` (optional):
  - `onComplete`: Callback executed when the async action completes successfully
  - `onError`: Callback executed when the async action fails

**Returns:** `[run, state]`
- `run`: Function to execute the async action
- `state`: Object containing:
  - `data`: The result data (null if not yet fetched or error occurred)
  - `error`: Error object (null if no error)
  - `isLoading`: Boolean indicating if the action is in progress
  - `isError`: Boolean indicating if an error occurred

---

### `useAsyncStatus`

A simplified hook for tracking loading state of async functions. No error catching - only tracks loading state. Ideal for simple operations where you handle errors separately.

#### Usage

```jsx
import { useAsyncStatus } from '@nephriteagain/react-hooks';

function SaveForm() {
  const saveData = async (formData) => {
    const response = await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    return response.json();
  };

  const [runSave, isLoading] = useAsyncStatus(saveData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await runSave({ name: 'John' });
      alert('Saved!');
    } catch (error) {
      alert('Error saving');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

#### API

```typescript
useAsyncStatus(fn)
```

**Parameters:**
- `fn`: The async function to wrap

**Returns:** `[run, isLoading]`
- `run`: Function to execute the async action
- `isLoading`: Boolean indicating if the action is in progress

---

### `useAsyncStateEffect`

A hook for handling async operations that run automatically on mount and when dependencies change. Perfect for fetching data on component mount or when props/state values change.

#### Usage

```jsx
import { useAsyncStateEffect } from '@nephriteagain/react-hooks';

function ProfilePage() {
  const fetchUserProfile = async () => {
    const response = await fetch('/api/profile');
    return response.json();
  };

  const [profile, { isLoading, isError, error, refresh, isRefreshing }] =
    useAsyncStateEffect(fetchUserProfile, [], {
      initialValue: null,
      loadingTrueAtStart: true
    });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{profile?.name}</h1>
      <button onClick={refresh} disabled={isRefreshing}>
        {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  );
}

// With dependencies - refetch when userId changes
function UserProfile({ userId }) {
  const [user, { isLoading, error }] = useAsyncStateEffect(
    async () => {
      const res = await fetch(`/api/users/${userId}`);
      return res.json();
    },
    [userId] // Refetch when userId changes
  );

  return <div>{user?.name}</div>;
}
```

#### API

```typescript
useAsyncStateEffect(func, deps?, options?)
```

**Parameters:**
- `func`: The async function to execute (should return a Promise)
- `deps` (optional): Dependency array that triggers re-fetch when values change (default: `[]`)
- `options` (optional):
  - `initialValue`: Initial value before the first fetch completes
  - `loadingTrueAtStart`: Whether to set loading to true initially (default: `true`)

**Returns:** `[value, state]`
- `value`: The fetched data
- `state`: Object containing:
  - `isLoading`: Boolean indicating if the initial or dependency-triggered fetch is in progress
  - `isError`: Boolean indicating if an error occurred
  - `error`: Error object (null if no error)
  - `refresh`: Function to manually re-fetch the data
  - `isRefreshing`: Boolean indicating if a manual refresh is in progress

## TypeScript Support

This package includes TypeScript type definitions. All hooks are fully typed with generics for type-safe usage.

```typescript
import { useAsyncAction } from '@nephriteagain/react-hooks';

interface User {
  id: number;
  name: string;
}

const [fetchUser, state] = useAsyncAction<[number], User>(
  async (userId) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  }
);

// state.data is typed as User | null
```

## License

ISC

import { useState } from "react";

/**
 * Hook for handling async actions with loading, error, and data states
 *
 * @param {Function} fn - The async function to wrap
 * @param {Object} [options] - Optional configuration
 * @param {Function} [options.onComplete] - Callback executed when the async action completes successfully
 * @param {Function} [options.onError] - Callback executed when the async action fails
 * @returns {[Function, Object]} A tuple containing the run function and state object
 *
 * @example
 * const fetchUser = async (userId) => {
 *   const response = await fetch(`/api/users/${userId}`);
 *   return response.json();
 * };
 *
 * const [runFetch, state] = useAsyncAction(fetchUser, {
 *   onComplete: () => console.log('User fetched!'),
 *   onError: (err) => console.error('Failed to fetch user:', err)
 * });
 *
 * // Usage in component
 * <button onClick={() => runFetch(123)} disabled={state.isLoading}>
 *   {state.isLoading ? 'Loading...' : 'Fetch User'}
 * </button>
 * {state.isError && <p>Error: {state.error.message}</p>}
 * {state.data && <p>User: {state.data.name}</p>}
 */
export function useAsyncAction(fn, options) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isError = !!error;

  const run = async (...args) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fn(...args);
      setData(result);
      options?.onComplete?.();
      return { data: result, error: null };
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Unknown error occurred."));
      }
      options?.onError?.(error);
      return { data: null, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return [run, { data, error, isLoading, isError }];
}

import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Hook for handling async operations that run on mount and when dependencies change
 * Automatically fetches data and provides loading, error states, and manual refresh capability
 *
 * @param {Function} func - The async function to execute (should return a Promise)
 * @param {Array} [deps=[]] - Dependency array that triggers re-fetch when values change
 * @param {Object} [options] - Optional configuration
 * @param {*} [options.initialValue] - Initial value before the first fetch completes
 * @param {boolean} [options.loadingTrueAtStart=true] - Whether to set loading to true initially
 * @returns {Array} A tuple containing the fetched value and state object
 *
 *
 * @example
 * // With dependencies - refetch when userId changes
 * function UserProfile({ userId }) {
 *   const [user, { isLoading, error }] = useAsyncStateEffect(
 *     async () => {
 *       const res = await fetch(`/api/users/${userId}`);
 *       return res.json();
 *     },
 *     [userId] // Refetch when userId changes
 *   );
 *
 *   return <div>{user?.name}</div>;
 * }
 */
export function useAsyncStateEffect(
  func,
  deps = [],
  options = {
    initialValue: undefined,
    loadingTrueAtStart: true,
  }
) {
  const { initialValue, loadingTrueAtStart = true } = useMemo(() => {
    if (!options) return {};
    return options;
  }, [options]);
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(loadingTrueAtStart);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    console.log("refreshing...");
    setIsRefreshing(true);
    setIsLoading(true);
    await func()
      .then((result) => {
        setValue(result ?? initialValue);
        setIsError(false);
        setError(null);
      })
      .catch((err) => {
        setIsError(true);
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error(String(err)));
        }
      })
      .finally(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
  }, [...deps, func, options]);

  useEffect(() => {
    setIsLoading(true);
    func()
      .then((result) => {
        setValue(result ?? initialValue);
        setIsError(false);
        setError(null);
      })
      .catch((err) => {
        setIsError(true);
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error(String(err)));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, deps);

  const result = useMemo(() => {
    return [value, { isLoading, isError, error, refresh, isRefreshing }];
  }, [value, isLoading, isError, error, refresh, isRefreshing]);

  return result;
}

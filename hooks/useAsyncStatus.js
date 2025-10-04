import { useCallback, useState } from "react";

/**
 * A simplified hook for tracking loading state of async functions
 * Note: No error catching - only tracks loading state
 *
 * @param {Function} fn - The async function to wrap
 * @returns {[Function, boolean]} A tuple containing the wrapped function and loading state
 *
 * @example
 * const saveData = async (formData) => {
 *   const response = await fetch('/api/save', {
 *     method: 'POST',
 *     body: JSON.stringify(formData)
 *   });
 *   return response.json();
 * };
 *
 * const [runSave, isLoading] = useAsyncStatus(saveData);
 *
 * // Usage in component
 * <button onClick={() => runSave({ name: 'John' })} disabled={isLoading}>
 *   {isLoading ? 'Saving...' : 'Save'}
 * </button>
 */
export function useAsyncStatus(fn) {
  const [isLoading, setIsLoading] = useState(false);

  const run = useCallback(
    async (...args) => {
      setIsLoading(true);
      try {
        const result = await fn(...args);
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    [fn]
  );

  return [run, isLoading];
}

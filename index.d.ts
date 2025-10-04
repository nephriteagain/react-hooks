declare module "@nephriteagain/react-hooks" {
  type AsyncFunction<TArgs extends any[], TResult> = (
    ...args: TArgs
  ) => Promise<TResult>;

  type ActionState<T> = {
    data: T | null;
    error: Error | null;
    isLoading: boolean;
    isError: boolean;
  };

  export function useAsyncStatus<TArgs extends any[], TResult>(
    fn: AsyncFunction<TArgs, TResult>
  ): [AsyncFunction<TArgs, TResult>, boolean];

  export function useAsyncAction<TArgs extends any[], TResult>(
    fn: AsyncFunction<TArgs, TResult>,
    options?: {
      /** Callback function executed when the async action completes successfully */
      onComplete?: () => void;
      onError?: (error: unknown) => void;
    }
  ): [
    (...args: TArgs) => Promise<{
      data: Awaited<TResult> | null;
      error: Error | null;
    }>,
    ActionState<TResult>
  ];

  type AsyncStateEffectState<T> = {
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
    isRefreshing: boolean;
  };

  export function useAsyncStateEffect<T>(
    func: () => Promise<T>,
    deps?: unknown[],
    options?: {
      initialValue?: T;
      loadingTrueAtStart?: boolean;
    }
  ): readonly [T | undefined, AsyncStateEffectState<T>];
}

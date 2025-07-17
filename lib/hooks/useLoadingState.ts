'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// Basic loading state hook
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setError] = useState<Error | null>(null);
  
  const execute = useCallback(async (asyncFunction: () => Promise<any>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);
  
  return { isLoading, error, execute, reset };
}

// Progressive loading state with stages
export function useProgressiveLoading<T = any>(
  stages: Array<{ label: string; duration?: number }>,
  initialData?: T
) {
  const [currentStage, setCurrentStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageStates, setStageStates] = useState(
    stages.map((stage, index) => ({
      ...stage,
      completed: false,
      active: index === 0,
      error: false
    }))
  );
  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const nextStage = useCallback(() => {
    if (currentStage < stages.length - 1) {
      const newStage = currentStage + 1;
      setCurrentStage(newStage);
      setProgress((newStage / stages.length) * 100);
      
      setStageStates(prev => prev.map((stage, index) => ({
        ...stage,
        completed: index < newStage,
        active: index === newStage,
        error: false
      })));
    } else {
      // All stages complete
      setProgress(100);
      setIsComplete(true);
      setStageStates(prev => prev.map(stage => ({
        ...stage,
        completed: true,
        active: false,
        error: false
      })));
    }
  }, [currentStage, stages.length]);
  
  const markStageError = useCallback((stageIndex?: number) => {
    const errorStage = stageIndex ?? currentStage;
    setStageStates(prev => prev.map((stage, index) => ({
      ...stage,
      error: index === errorStage,
      active: index === errorStage
    })));
  }, [currentStage]);
  
  const startLoading = useCallback(async (
    stageProcessors?: Array<() => Promise<any>>
  ) => {
    setCurrentStage(0);
    setIsComplete(false);
    setProgress(0);
    setError(null);
    setStageStates(stages.map((stage, index) => ({
      ...stage,
      completed: false,
      active: index === 0,
      error: false
    })));
    
    if (stageProcessors) {
      // Process each stage with its processor
      for (let i = 0; i < stageProcessors.length; i++) {
        try {
          const stageDuration = stages[i]?.duration || 1000;
          
          // Start processing
          const processingPromise = stageProcessors[i]?.() || Promise.resolve();
          
          // Wait for minimum duration or processing completion
          const [result] = await Promise.all([
            processingPromise,
            new Promise(resolve => {
              timeoutRef.current = setTimeout(resolve, stageDuration) as NodeJS.Timeout;
            })
          ]);
          
          // Update data if result is provided
          if (result !== undefined) {
            setData(result);
          }
          
          nextStage();
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Stage processing failed'));
          markStageError(i);
          break;
        }
      }
    } else {
      // Simple time-based progression
      for (let i = 0; i < stages.length; i++) {
        const duration = stages[i]?.duration || 1000;
        await new Promise(resolve => {
          timeoutRef.current = setTimeout(resolve, duration) as NodeJS.Timeout;
        });
        nextStage();
      }
    }
  }, [stages, nextStage, markStageError]);
  
  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setCurrentStage(0);
    setIsComplete(false);
    setProgress(0);
    setError(null);
    setData(initialData);
    setStageStates(stages.map((stage, index) => ({
      ...stage,
      completed: false,
      active: index === 0,
      error: false
    })));
  }, [stages, initialData]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return {
    currentStage,
    isComplete,
    progress,
    stageStates,
    data,
    error,
    startLoading,
    nextStage,
    markStageError,
    reset
  };
}

// Debounced loading state for search/filter operations
export function useDebouncedLoading(delay = 300) {
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedLoading, setDebouncedLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (loading) {
      // Show loading immediately when starting
      setDebouncedLoading(true);
    } else {
      // Debounce hiding the loading state
      timeoutRef.current = setTimeout(() => {
        setDebouncedLoading(false);
      }, delay) as NodeJS.Timeout;
    }
  }, [delay]);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return {
    isLoading,
    debouncedLoading,
    setLoading
  };
}

// Async operation with retry capability
export function useAsyncOperation<T = any>() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  
  const execute = useCallback(async (
    asyncFunction: () => Promise<T>,
    options?: {
      retries?: number;
      retryDelay?: number;
      onRetry?: (attempt: number, error: Error) => void;
    }
  ): Promise<T> => {
    const { retries = maxRetries, retryDelay = 1000, onRetry } = options || {};
    
    setIsLoading(true);
    setError(null);
    setRetryCount(0);
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await asyncFunction();
        setData(result);
        setIsLoading(false);
        setRetryCount(attempt);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Operation failed');
        
        if (attempt < retries) {
          setRetryCount(attempt + 1);
          onRetry?.(attempt + 1, error);
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        } else {
          setError(error);
          setIsLoading(false);
          throw error;
        }
      }
    }
    
    // This line should never be reached, but TypeScript requires it
    throw new Error('Unexpected end of retry loop');
  }, [maxRetries]);
  
  const reset = useCallback(() => {
    setIsLoading(false);
    setData(null);
    setError(null);
    setRetryCount(0);
  }, []);
  
  return {
    isLoading,
    data,
    error,
    retryCount,
    execute,
    reset
  };
}

// Loading state for multiple parallel operations
export function useParallelLoading<T extends Record<string, any>>() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, Error | null>>({});
  const [data, setData] = useState<Partial<T>>({});
  
  const isAnyLoading = Object.values(loadingStates).some(Boolean);
  const allCompleted = Object.keys(loadingStates).length > 0 && 
                      Object.values(loadingStates).every(state => !state);
  
  const execute = useCallback(async <K extends keyof T>(
    key: K,
    asyncFunction: () => Promise<T[K]>
  ) => {
    setLoadingStates(prev => ({ ...prev, [key as string]: true }));
    setErrors(prev => ({ ...prev, [key as string]: null }));
    
    try {
      const result = await asyncFunction();
      setData(prev => ({ ...prev, [key]: result }));
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Operation failed');
      setErrors(prev => ({ ...prev, [key as string]: error }));
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, [key as string]: false }));
    }
  }, []);
  
  const reset = useCallback((key?: keyof T) => {
    if (key) {
      setLoadingStates(prev => ({ ...prev, [key as string]: false }));
      setErrors(prev => ({ ...prev, [key as string]: null }));
      setData(prev => {
        const newData = { ...prev };
        delete newData[key];
        return newData;
      });
    } else {
      setLoadingStates({});
      setErrors({});
      setData({});
    }
  }, []);
  
  return {
    loadingStates,
    errors,
    data,
    isAnyLoading,
    allCompleted,
    execute,
    reset
  };
}

// Optimistic loading for immediate UI updates
export function useOptimisticLoading<T>() {
  const [optimisticData, setOptimisticData] = useState<T | null>(null);
  const [actualData, setActualData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const execute = useCallback(async (
    optimisticValue: T,
    asyncFunction: () => Promise<T>
  ) => {
    // Immediately show optimistic value
    setOptimisticData(optimisticValue);
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      setActualData(result);
      setOptimisticData(null); // Clear optimistic data
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Operation failed');
      setError(error);
      setOptimisticData(null); // Revert optimistic data
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const currentData = optimisticData || actualData;
  
  const reset = useCallback(() => {
    setOptimisticData(null);
    setActualData(null);
    setIsLoading(false);
    setError(null);
  }, []);
  
  return {
    data: currentData,
    isLoading,
    error,
    isOptimistic: optimisticData !== null,
    execute,
    reset
  };
}

export default {
  useLoadingState,
  useProgressiveLoading,
  useDebouncedLoading,
  useAsyncOperation,
  useParallelLoading,
  useOptimisticLoading
};
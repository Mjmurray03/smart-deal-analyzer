import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

interface NavigationGuardConfig {
  debounceMs?: number;
  maxRetries?: number;
  onNavigationError?: (error: Error) => void;
}

interface NavigationState {
  isNavigating: boolean;
  lastNavigation: string | null;
  retryCount: number;
}

/**
 * Navigation guard hook to prevent useEffect infinite loops and manage navigation state
 * Provides debouncing, retry logic, and proper cleanup mechanisms
 */
export function useNavigationGuard(config: NavigationGuardConfig = {}) {
  const {
    debounceMs = 300,
    maxRetries = 3,
    onNavigationError
  } = config;

  const router = useRouter();
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigationAttemptRef = useRef<string | null>(null);
  const isMountedRef = useRef(true);
  
  const [navigationState, setNavigationState] = useState<NavigationState>({
    isNavigating: false,
    lastNavigation: null,
    retryCount: 0
  });

  // Cleanup function for component unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Safe state update function that checks if component is still mounted
  const safeSetState = useCallback((update: Partial<NavigationState>) => {
    if (isMountedRef.current) {
      setNavigationState(prev => ({ ...prev, ...update }));
    }
  }, []);

  // Debounced navigation function
  const navigate = useCallback((path: string, replace = false) => {
    // Prevent duplicate navigation attempts
    if (navigationAttemptRef.current === path) {
      return;
    }

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set navigation attempt
    navigationAttemptRef.current = path;
    safeSetState({ isNavigating: true });

    // Debounced navigation execution
    debounceTimeoutRef.current = setTimeout(async () => {
      if (!isMountedRef.current) return;

      try {
        // Attempt navigation with retry logic
        let attempt = 0;
        let success = false;

        while (attempt < maxRetries && !success && isMountedRef.current) {
          try {
            if (replace) {
              router.replace(path);
            } else {
              router.push(path);
            }
            success = true;
            
            safeSetState({
              isNavigating: false,
              lastNavigation: path,
              retryCount: 0
            });
          } catch (error) {
            attempt++;
            safeSetState({ retryCount: attempt });
            
            if (attempt >= maxRetries) {
              const navigationError = new Error(`Navigation failed after ${maxRetries} attempts: ${path}`);
              if (onNavigationError) {
                onNavigationError(navigationError);
              }
              throw navigationError;
            }
            
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 100 * attempt));
          }
        }
      } catch (error) {
        if (isMountedRef.current) {
          safeSetState({ isNavigating: false });
          console.error('Navigation guard error:', error);
        }
      } finally {
        navigationAttemptRef.current = null;
      }
    }, debounceMs);
  }, [router, debounceMs, maxRetries, onNavigationError, safeSetState]);

  // Cancel navigation function
  const cancelNavigation = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    navigationAttemptRef.current = null;
    safeSetState({ isNavigating: false });
  }, [safeSetState]);

  // Check if navigation is in progress
  const isNavigationInProgress = useCallback((path?: string) => {
    if (path) {
      return navigationAttemptRef.current === path;
    }
    return navigationState.isNavigating;
  }, [navigationState.isNavigating]);

  // Get navigation state
  const getNavigationState = useCallback(() => ({
    ...navigationState,
    currentAttempt: navigationAttemptRef.current
  }), [navigationState]);

  return {
    navigate,
    cancelNavigation,
    isNavigationInProgress,
    getNavigationState,
    isNavigating: navigationState.isNavigating,
    lastNavigation: navigationState.lastNavigation,
    retryCount: navigationState.retryCount
  };
}

/**
 * Hook for preventing useEffect infinite loops during navigation
 * Provides a stable navigation function that won't trigger useEffect dependencies
 */
export function useStableNavigation() {
  const navigationGuard = useNavigationGuard();
  
  // Return a stable reference to the navigate function
  const stableNavigate = useCallback((path: string, replace = false) => {
    navigationGuard.navigate(path, replace);
  }, []); // Intentionally empty dependency array for stability

  return {
    navigate: stableNavigate,
    isNavigating: navigationGuard.isNavigating,
    cancelNavigation: navigationGuard.cancelNavigation
  };
}

export default useNavigationGuard;
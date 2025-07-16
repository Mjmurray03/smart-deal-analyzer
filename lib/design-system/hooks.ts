/**
 * Design System Hooks
 * 
 * React hooks for managing design system state and mode switching
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Mode, MetricStatus } from './tokens';
import { utils } from './tokens';

// ==================== MODE MANAGEMENT ====================

/**
 * Hook for managing Quick Start vs Professional mode
 */
export function useDesignMode() {
  const [mode, setMode] = useState<Mode>('quickStart');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('design-mode') as Mode;
    if (savedMode && (savedMode === 'quickStart' || savedMode === 'professional')) {
      setMode(savedMode);
    }
  }, []);

  // Save mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('design-mode', mode);
  }, [mode]);

  const switchMode = useCallback((newMode: Mode) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setMode(newMode);
      setIsTransitioning(false);
    }, 150); // Brief transition delay
  }, []);

  const toggleMode = useCallback(() => {
    switchMode(mode === 'quickStart' ? 'professional' : 'quickStart');
  }, [mode, switchMode]);

  const modeTokens = useMemo(() => utils.getMode(mode), [mode]);

  return {
    mode,
    isTransitioning,
    switchMode,
    toggleMode,
    tokens: modeTokens,
    isQuickStart: mode === 'quickStart',
    isProfessional: mode === 'professional',
  };
}

// ==================== METRIC STATUS MANAGEMENT ====================

/**
 * Hook for managing metric status and colors
 */
export function useMetricStatus(value: number | null, thresholds: {
  excellent: number;
  good: number;
  fair: number;
}) {
  const status = useMemo((): MetricStatus => {
    if (value === null || value === undefined) return 'poor';
    
    if (value >= thresholds.excellent) return 'excellent';
    if (value >= thresholds.good) return 'good';
    if (value >= thresholds.fair) return 'fair';
    return 'poor';
  }, [value, thresholds]);

  const color = useMemo(() => utils.getMetricColor(status), [status]);

  return {
    status,
    color,
    isExcellent: status === 'excellent',
    isGood: status === 'good',
    isFair: status === 'fair',
    isPoor: status === 'poor',
  };
}

// ==================== RESPONSIVE DESIGN ====================

/**
 * Hook for responsive design based on screen size
 */
export function useResponsiveMode() {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const isMobile = screenSize === 'mobile';
  const isTablet = screenSize === 'tablet';
  const isDesktop = screenSize === 'desktop';

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
  };
}

// ==================== THEME PREFERENCES ====================

/**
 * Hook for managing user theme preferences
 */
export function useThemePreference() {
  const [preferences, setPreferences] = useState({
    reducedMotion: false,
    highContrast: false,
    compactMode: false,
  });

  useEffect(() => {
    // Check system preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');

    const updatePreferences = () => {
      setPreferences(prev => ({
        ...prev,
        reducedMotion: mediaQuery.matches,
        highContrast: highContrastQuery.matches,
      }));
    };

    updatePreferences();
    
    mediaQuery.addEventListener('change', updatePreferences);
    highContrastQuery.addEventListener('change', updatePreferences);

    return () => {
      mediaQuery.removeEventListener('change', updatePreferences);
      highContrastQuery.removeEventListener('change', updatePreferences);
    };
  }, []);

  const toggleCompactMode = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      compactMode: !prev.compactMode,
    }));
  }, []);

  return {
    preferences,
    toggleCompactMode,
  };
}

// ==================== ANIMATION CONTROLS ====================

/**
 * Hook for managing animations based on user preferences
 */
export function useAnimationControls() {
  const { preferences } = useThemePreference();
  const { mode } = useDesignMode();

  const shouldAnimate = useMemo(() => {
    return !preferences.reducedMotion;
  }, [preferences.reducedMotion]);

  const getTransition = useCallback((duration: 'fast' | 'normal' | 'slow' = 'normal') => {
    if (!shouldAnimate) return 'transition-none';
    
    const durations = {
      fast: 'transition-all duration-150 ease-out',
      normal: 'transition-all duration-300 ease-in-out',
      slow: 'transition-all duration-500 ease-in-out',
    };

    return durations[duration];
  }, [shouldAnimate]);

  const getHoverScale = useCallback(() => {
    if (!shouldAnimate) return '';
    return mode === 'quickStart' ? 'hover:scale-105' : 'hover:scale-102';
  }, [shouldAnimate, mode]);

  return {
    shouldAnimate,
    getTransition,
    getHoverScale,
  };
}

// ==================== PROGRESSIVE DISCLOSURE ====================

/**
 * Hook for managing progressive disclosure of features
 */
export function useProgressiveDisclosure() {
  const [disclosureLevel, setDisclosureLevel] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [hasSeenLevel, setHasSeenLevel] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const advanceLevel = useCallback(() => {
    setDisclosureLevel(prev => {
      const newLevel = Math.min(prev + 1, 5) as 1 | 2 | 3 | 4 | 5;
      setHasSeenLevel(prevSeen => ({
        ...prevSeen,
        [newLevel]: true,
      }));
      return newLevel;
    });
  }, []);

  const setLevel = useCallback((level: 1 | 2 | 3 | 4 | 5) => {
    setDisclosureLevel(level);
    setHasSeenLevel(prevSeen => ({
      ...prevSeen,
      [level]: true,
    }));
  }, []);

  const isLevelVisible = useCallback((level: number) => {
    return disclosureLevel >= level;
  }, [disclosureLevel]);

  const hasSeenBefore = useCallback((level: number) => {
    return hasSeenLevel[level];
  }, [hasSeenLevel]);

  return {
    disclosureLevel,
    advanceLevel,
    setLevel,
    isLevelVisible,
    hasSeenBefore,
    isBasic: disclosureLevel === 1,
    isStandard: disclosureLevel === 2,
    isAdvanced: disclosureLevel >= 3,
    isInstitutional: disclosureLevel >= 4,
    isExpert: disclosureLevel === 5,
  };
}

// ==================== FORM COMPLEXITY ====================

/**
 * Hook for managing form complexity based on user progression
 */
export function useFormComplexity() {
  const [complexity, setComplexity] = useState<'basic' | 'standard' | 'advanced'>('basic');
  const [fieldCount, setFieldCount] = useState(2); // Start with Cap Rate (2 fields)

  const increaseComplexity = useCallback(() => {
    setComplexity(prev => {
      if (prev === 'basic') {
        setFieldCount(4); // Cash-on-Cash
        return 'standard';
      }
      if (prev === 'standard') {
        setFieldCount(7); // Full analysis
        return 'advanced';
      }
      return 'advanced';
    });
  }, []);

  const decreaseComplexity = useCallback(() => {
    setComplexity(prev => {
      if (prev === 'advanced') {
        setFieldCount(4);
        return 'standard';
      }
      if (prev === 'standard') {
        setFieldCount(2);
        return 'basic';
      }
      return 'basic';
    });
  }, []);

  const resetComplexity = useCallback(() => {
    setComplexity('basic');
    setFieldCount(2);
  }, []);

  return {
    complexity,
    fieldCount,
    increaseComplexity,
    decreaseComplexity,
    resetComplexity,
    isBasic: complexity === 'basic',
    isStandard: complexity === 'standard',
    isAdvanced: complexity === 'advanced',
  };
}

// ==================== ACCESSIBILITY HELPERS ====================

/**
 * Hook for managing accessibility features
 */
export function useAccessibility() {
  const [announcements, setAnnouncements] = useState<string[]>([]);

  const announce = useCallback((message: string) => {
    setAnnouncements(prev => [...prev, message]);
    // Clear announcement after a delay
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 3000);
  }, []);

  const getFocusProps = useCallback((label: string) => ({
    'aria-label': label,
    'aria-describedby': `${label.replace(/\s+/g, '-').toLowerCase()}-desc`,
  }), []);

  return {
    announcements,
    announce,
    getFocusProps,
  };
}

// ==================== PERFORMANCE OPTIMIZATION ====================

/**
 * Hook for managing performance-related settings
 */
export function usePerformanceMode() {
  const [isHighPerformance, setIsHighPerformance] = useState(false);

  useEffect(() => {
    // Check if user is on a slower device
    const connection = (navigator as { connection?: { effectiveType?: string } }).connection;
    const isSlowConnection = connection && 
      (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    
    setIsHighPerformance(!isSlowConnection);
  }, []);

  const togglePerformanceMode = useCallback(() => {
    setIsHighPerformance(prev => !prev);
  }, []);

  return {
    isHighPerformance,
    togglePerformanceMode,
    shouldUseAnimations: isHighPerformance,
    shouldUseShadows: isHighPerformance,
    shouldUseGradients: isHighPerformance,
  };
}
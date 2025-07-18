import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

interface FormValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
}


interface FormStateConfig<T> {
  initialData: T;
  validationRules?: Record<keyof T, FormValidationRule>;
  debounceMs?: number;
  autoSave?: {
    key: string;
    interval?: number;
  };
}

interface FormStateReturn<T> {
  data: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  updateField: (field: keyof T, value: unknown) => void;
  updateData: (data: Partial<T>) => void;
  validateField: (field: keyof T) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  setSubmitting: (submitting: boolean) => void;
  clearErrors: () => void;
  getFieldError: (field: keyof T) => string | undefined;
  isFieldTouched: (field: keyof T) => boolean;
}

/**
 * Optimized form state management hook with debounced validation and auto-save
 */
export function useFormState<T extends Record<string, unknown>>(
  config: FormStateConfig<T>
): FormStateReturn<T> {
  const {
    initialData,
    validationRules = {} as Record<keyof T, FormValidationRule>,
    debounceMs = 300,
    autoSave
  } = config;

  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationTimeoutRef = useRef<Record<keyof T, NodeJS.Timeout>>({} as Record<keyof T, NodeJS.Timeout>);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialDataRef = useRef(initialData);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(validationTimeoutRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (!autoSave) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(autoSave.key, JSON.stringify(data));
      } catch (error) {
        console.warn('Failed to auto-save form data:', error);
      }
    }, autoSave.interval || 2000);
  }, [data, autoSave]);

  // Validation function
  const validateFieldValue = useCallback((field: keyof T, value: unknown): string | null => {
    const rules = validationRules[field];
    if (!rules) return null;

    // Required validation
    if (rules.required) {
      if (value === undefined || value === null || value === '') {
        return `${String(field)} is required`;
      }
      if (Array.isArray(value) && value.length === 0) {
        return `${String(field)} is required`;
      }
    }

    // Skip other validations if empty and not required
    if (!rules.required && (value === undefined || value === null || value === '')) {
      return null;
    }

    // Number validations
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        return `${String(field)} must be at least ${rules.min}`;
      }
      if (rules.max !== undefined && value > rules.max) {
        return `${String(field)} must be no more than ${rules.max}`;
      }
    }

    // String validations
    if (typeof value === 'string') {
      if (rules.pattern && !rules.pattern.test(value)) {
        return `${String(field)} format is invalid`;
      }
      if (rules.min !== undefined && value.length < rules.min) {
        return `${String(field)} must be at least ${rules.min} characters`;
      }
      if (rules.max !== undefined && value.length > rules.max) {
        return `${String(field)} must be no more than ${rules.max} characters`;
      }
    }

    // Custom validation
    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  }, [validationRules]);

  // Debounced field validation
  const validateField = useCallback((field: keyof T) => {
    if (validationTimeoutRef.current[field]) {
      clearTimeout(validationTimeoutRef.current[field]);
    }

    validationTimeoutRef.current[field] = setTimeout(() => {
      const error = validateFieldValue(field, data[field]);
      setErrors(prev => ({
        ...prev,
        [field]: error || ''
      }));
    }, debounceMs);
  }, [data, validateFieldValue, debounceMs]);

  // Update single field
  const updateField = useCallback((field: keyof T, value: unknown) => {
    setData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  }, [validateField]);

  // Update multiple fields
  const updateData = useCallback((newData: Partial<T>) => {
    setData(prev => ({ ...prev, ...newData }));
    
    // Mark updated fields as touched
    const updatedFields = Object.keys(newData) as (keyof T)[];
    setTouched(prev => {
      const newTouched = { ...prev };
      updatedFields.forEach(field => {
        newTouched[field] = true;
      });
      return newTouched;
    });

    // Validate updated fields
    updatedFields.forEach(field => validateField(field));
  }, [validateField]);

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<keyof T, string> = {} as Record<keyof T, string>;
    let isValid = true;

    Object.keys(validationRules).forEach(fieldKey => {
      const field = fieldKey as keyof T;
      const error = validateFieldValue(field, data[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [data, validationRules, validateFieldValue]);

  // Reset form
  const resetForm = useCallback(() => {
    setData(initialDataRef.current);
    setErrors({} as Record<keyof T, string>);
    setTouched({} as Record<keyof T, boolean>);
    setIsSubmitting(false);
  }, []);

  // Clear errors
  const clearErrors = useCallback(() => {
    setErrors({} as Record<keyof T, string>);
  }, []);

  // Helper functions
  const getFieldError = useCallback((field: keyof T): string | undefined => {
    return errors[field] || undefined;
  }, [errors]);

  const isFieldTouched = useCallback((field: keyof T): boolean => {
    return Boolean(touched[field]);
  }, [touched]);

  // Memoized computed values
  const isValid = useMemo(() => {
    return Object.values(errors).every(error => !error);
  }, [errors]);

  const isDirty = useMemo(() => {
    return JSON.stringify(data) !== JSON.stringify(initialDataRef.current);
  }, [data]);

  return {
    data,
    errors,
    touched,
    isValid,
    isDirty,
    isSubmitting,
    updateField,
    updateData,
    validateField,
    validateForm,
    resetForm,
    setSubmitting: setIsSubmitting,
    clearErrors,
    getFieldError,
    isFieldTouched
  };
}

/**
 * Hook for managing array fields with optimized performance
 */
export function useArrayField<T>(
  initialItems: T[] = [],
  createItem: () => T
) {
  const [items, setItems] = useState<T[]>(initialItems);

  const addItem = useCallback(() => {
    setItems(prev => [...prev, createItem()]);
  }, [createItem]);

  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateItem = useCallback((index: number, item: T) => {
    setItems(prev => {
      const newItems = [...prev];
      newItems[index] = item;
      return newItems;
    });
  }, []);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    setItems(prev => {
      const newItems = [...prev];
      const [movedItem] = newItems.splice(fromIndex, 1);
      if (movedItem) {
        newItems.splice(toIndex, 0, movedItem);
      }
      return newItems;
    });
  }, []);

  const resetItems = useCallback(() => {
    setItems(initialItems);
  }, [initialItems]);

  return {
    items,
    addItem,
    removeItem,
    updateItem,
    moveItem,
    resetItems,
    setItems
  };
}

export default useFormState;
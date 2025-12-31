import { useState, useCallback, useMemo, useRef } from 'react';
import type { FormValues, ValidationFunction, FormItemProps } from '../components/form/constants';

// ============================================================================
// Types
// ============================================================================

/**
 * Options for useForm hook
 */
export interface UseFormOptions<T extends FormValues> {
    /** Handler called when form is submitted and validation passes */
    onSubmit: (values: T) => void | boolean | Promise<void | boolean>;
    /** Initial form values */
    initialValues?: Partial<T>;
    /** Validation functions for each field */
    validation?: {
        [K in keyof T]?: ValidationFunction<T[K]>;
    };
}

/**
 * Return type for useForm hook
 */
export interface UseFormReturn<T extends FormValues> {
    /** Submit handler to pass to Form or Action.SubmitForm */
    handleSubmit: () => void | Promise<void>;
    /** Props to spread onto form fields */
    itemProps: {
        [K in keyof T]: FormItemProps<T[K]>;
    };
    /** Current form values */
    values: T;
    /** Programmatically set a field value */
    setValue: <K extends keyof T>(id: K, value: T[K]) => void;
    /** Programmatically set a validation error */
    setValidationError: (id: keyof T, error: string | undefined) => void;
    /** Programmatically focus a field */
    focus: (id: keyof T) => void;
    /** Reset form to initial values */
    reset: (newInitialValues?: Partial<T>) => void;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Form state management hook inspired by Raycast's useForm
 *
 * @example
 * ```tsx
 * const { handleSubmit, itemProps, values } = useForm({
 *   onSubmit: (values) => console.log(values),
 *   initialValues: { url: '' },
 *   validation: {
 *     url: (value) => !value ? 'URL is required' : undefined,
 *   },
 * });
 *
 * <Form>
 *   <Form.TextField title="URL" {...itemProps.url} />
 * </Form>
 * ```
 */
export function useForm<T extends FormValues>(options: UseFormOptions<T>): UseFormReturn<T> {
    const { onSubmit, initialValues = {}, validation = {} } = options;

    // Form values state
    const [values, setValues] = useState<T>(() => ({ ...initialValues }) as T);

    // Validation errors state
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

    // Ref for focus handling
    const focusedFieldRef = useRef<keyof T | null>(null);

    /**
     * Set a single field value
     */
    const setValue = useCallback(<K extends keyof T>(id: K, value: T[K]) => {
        setValues(prev => ({ ...prev, [id]: value }));
        // Clear error when value changes
        setErrors(prev => {
            if (prev[id]) {
                const next = { ...prev };
                delete next[id];
                return next;
            }
            return prev;
        });
    }, []);

    /**
     * Set a validation error for a field
     */
    const setValidationError = useCallback((id: keyof T, error: string | undefined) => {
        setErrors(prev => {
            if (error) {
                return { ...prev, [id]: error };
            }
            const next = { ...prev };
            delete next[id];
            return next;
        });
    }, []);

    /**
     * Focus a specific field
     */
    const focus = useCallback((id: keyof T) => {
        focusedFieldRef.current = id;
        // In a real implementation, this would trigger focus on the field
        // For now, we just track which field should be focused
    }, []);

    /**
     * Reset form to initial or new values
     */
    const reset = useCallback(
        (newInitialValues?: Partial<T>) => {
            const resetValues = newInitialValues ?? initialValues;
            setValues({ ...resetValues } as T);
            setErrors({});
            focusedFieldRef.current = null;
        },
        [initialValues]
    );

    /**
     * Validate all fields
     */
    const validateAll = useCallback((): boolean => {
        const newErrors: Partial<Record<keyof T, string>> = {};
        let hasErrors = false;

        for (const key of Object.keys(values) as Array<keyof T>) {
            const validator = validation[key];
            if (validator) {
                const error = validator(values[key]);
                if (error) {
                    newErrors[key] = error;
                    hasErrors = true;
                }
            }
        }

        setErrors(newErrors);
        return !hasErrors;
    }, [values, validation]);

    /**
     * Handle form submission
     */
    const handleSubmit = useCallback(async () => {
        const isValid = validateAll();
        if (!isValid) {
            return;
        }

        try {
            await onSubmit(values);
        } catch (error) {
            console.error('Form submission error:', error);
        }
    }, [validateAll, onSubmit, values]);

    /**
     * Generate itemProps for all fields
     */
    const itemProps = useMemo(() => {
        const props = {} as UseFormReturn<T>['itemProps'];

        // Create props for each field in values
        for (const key of Object.keys(values) as Array<keyof T>) {
            props[key] = {
                id: String(key),
                value: values[key],
                onChange: (value: T[typeof key]) => setValue(key, value),
                error: errors[key],
            } as FormItemProps<T[typeof key]>;
        }

        // Also create props for fields in initialValues that aren't in values yet
        for (const key of Object.keys(initialValues) as Array<keyof T>) {
            if (!(key in props)) {
                props[key] = {
                    id: String(key),
                    value: values[key] ?? initialValues[key],
                    onChange: (value: T[typeof key]) => setValue(key, value),
                    error: errors[key],
                } as FormItemProps<T[typeof key]>;
            }
        }

        return props;
    }, [values, errors, setValue, initialValues]);

    return {
        handleSubmit,
        itemProps,
        values,
        setValue,
        setValidationError,
        focus,
        reset,
    };
}

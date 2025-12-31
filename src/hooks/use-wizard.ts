import { useState, useCallback, useRef } from 'react';
import type { WizardStepState, WizardStepDefinition } from '../components/wizard/types';

export interface UseWizardOptions<TValues extends object> {
    /** Step definitions */
    steps: WizardStepDefinition<TValues>[];
    /** Initial form values */
    initialValues: TValues;
}

export interface UseWizardReturn<TValues extends object> {
    /** Current form values */
    values: TValues;
    /** Update a single value */
    setValue: <K extends keyof TValues>(key: K, value: TValues[K]) => void;
    /** Index of the currently active step (furthest step reached) */
    activeStepIndex: number;
    /** Index of the currently focused step */
    focusedStepIndex: number;
    /** Set the focused step index */
    setFocusedStepIndex: (index: number) => void;
    /** Number of visible steps (0..activeStepIndex) */
    visibleStepCount: number;
    /** Get state for a specific step */
    getStepState: (index: number) => WizardStepState;
    /** Check if a step is locked (previous step not successful) */
    isStepLocked: (index: number) => boolean;
    /** Submit the currently focused step */
    submitFocusedStep: () => Promise<void>;
    /** Navigate to next visible step */
    navigateNext: () => void;
    /** Navigate to previous step */
    navigatePrev: () => void;
    /** Reset the wizard to initial state */
    reset: () => void;
}

/**
 * Hook for managing wizard state with async step submission
 *
 * @example
 * ```tsx
 * const wizard = useWizard({
 *   steps: [
 *     { id: 'csv', title: 'CSV Path', render: (ctx) => <input />, onSubmit: parseCSV },
 *     { id: 'lang', title: 'Languages', render: (ctx) => <dropdown /> },
 *   ],
 *   initialValues: { csvPath: '', languages: [] },
 * })
 * ```
 */
export function useWizard<TValues extends object>({
    steps,
    initialValues,
}: UseWizardOptions<TValues>): UseWizardReturn<TValues> {
    const [values, setValues] = useState<TValues>(initialValues);
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [focusedStepIndex, setFocusedStepIndex] = useState(0);
    const [stepStates, setStepStates] = useState<Map<number, WizardStepState>>(() => new Map());

    const isSubmittingRef = useRef(false);

    const setValue = useCallback(<K extends keyof TValues>(key: K, value: TValues[K]) => {
        setValues(prev => ({ ...prev, [key]: value }));
    }, []);

    const getStepState = useCallback(
        (index: number): WizardStepState => {
            return stepStates.get(index) ?? { status: 'idle' };
        },
        [stepStates]
    );

    const setStepState = useCallback((index: number, state: Partial<WizardStepState>) => {
        setStepStates(prev => {
            const next = new Map(prev);
            const current = next.get(index) ?? { status: 'idle' };
            next.set(index, { ...current, ...state });
            return next;
        });
    }, []);

    const isStepLocked = useCallback(
        (index: number): boolean => {
            if (index === 0) return false;
            const prevState = getStepState(index - 1);
            return prevState.status !== 'success';
        },
        [getStepState]
    );

    const visibleStepCount = activeStepIndex + 1;

    const submitFocusedStep = useCallback(async () => {
        if (isSubmittingRef.current) return;

        const step = steps[focusedStepIndex];
        if (!step) return;

        if (isStepLocked(focusedStepIndex)) return;

        isSubmittingRef.current = true;
        const submittingStepIndex = focusedStepIndex;

        setStepState(submittingStepIndex, { status: 'running', error: undefined });

        const nextStepIndex = submittingStepIndex + 1;
        const hasNextStep = nextStepIndex < steps.length;

        if (hasNextStep) {
            setActiveStepIndex(nextStepIndex);
            setFocusedStepIndex(nextStepIndex);
        }

        try {
            const result = await step.onSubmit?.(values);
            setStepState(submittingStepIndex, {
                status: 'success',
                data: result,
                error: undefined,
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setStepState(submittingStepIndex, {
                status: 'error',
                error: errorMessage,
            });
        } finally {
            isSubmittingRef.current = false;
        }
    }, [focusedStepIndex, steps, values, isStepLocked, setStepState]);

    const navigateNext = useCallback(() => {
        setFocusedStepIndex(i => {
            const next = i + 1;
            if (next > activeStepIndex) return i;
            if (isStepLocked(next)) return i;
            return next;
        });
    }, [activeStepIndex, isStepLocked]);

    const navigatePrev = useCallback(() => {
        setFocusedStepIndex(i => Math.max(0, i - 1));
    }, []);

    const reset = useCallback(() => {
        setValues(initialValues);
        setActiveStepIndex(0);
        setFocusedStepIndex(0);
        setStepStates(new Map());
    }, [initialValues]);

    return {
        values,
        setValue,
        activeStepIndex,
        focusedStepIndex,
        setFocusedStepIndex,
        visibleStepCount,
        getStepState,
        isStepLocked,
        submitFocusedStep,
        navigateNext,
        navigatePrev,
        reset,
    };
}

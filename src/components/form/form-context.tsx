import { createContext, useContext, type ReactNode } from 'react';

/**
 * Context value for form state management
 */
export interface FormContextValue {
    /** Currently focused step index */
    focusedStepIndex: number;
    /** Set the focused step index */
    setFocusedStepIndex: (index: number) => void;
    /** Total number of steps in the form */
    stepCount: number;
    /** Register a step and get its index */
    registerStep: () => number;
    /** Whether the action panel is currently open */
    isActionPanelOpen: boolean;
    /** Open the action panel */
    openActionPanel: () => void;
    /** Close the action panel */
    closeActionPanel: () => void;
    /** Submit the form */
    submitForm: () => void;
}

const FormContext = createContext<FormContextValue | null>(null);

/**
 * Hook to access form context
 * @throws Error if used outside of Form component
 */
export function useFormContext(): FormContextValue {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error('useFormContext must be used within a Form component');
    }
    return context;
}

/**
 * Hook to safely access form context without throwing
 * @returns FormContextValue or null if not in a Form
 */
export function useFormContextSafe(): FormContextValue | null {
    return useContext(FormContext);
}

/**
 * Provider component for form context
 */
export function FormContextProvider({
    children,
    value,
}: {
    children: ReactNode;
    value: FormContextValue;
}) {
    return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export { FormContext };

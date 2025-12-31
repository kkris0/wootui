import { createContext, useContext, type ReactNode } from 'react';
import type { WizardStepState } from './types';

/**
 * Context value for wizard state management
 */
export interface WizardContextValue {
    /** Index of the currently active step (furthest step reached) */
    activeStepIndex: number;
    /** Index of the currently focused step (for keyboard navigation) */
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
    submitFocusedStep: () => void;
    /** Whether the action panel is currently open */
    isActionPanelOpen: boolean;
    /** Open the action panel */
    openActionPanel: () => void;
    /** Close the action panel */
    closeActionPanel: () => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

/**
 * Hook to access wizard context
 * @throws Error if used outside of Wizard component
 */
export function useWizardContext(): WizardContextValue {
    const context = useContext(WizardContext);
    if (!context) {
        throw new Error('useWizardContext must be used within a Wizard component');
    }
    return context;
}

/**
 * Provider component for wizard context
 */
export function WizardContextProvider({
    children,
    value,
}: {
    children: ReactNode;
    value: WizardContextValue;
}) {
    return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

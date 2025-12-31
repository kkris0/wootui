import {
    type ReactNode,
    type ReactElement,
    useState,
    Children,
    isValidElement,
    cloneElement,
    useCallback,
    useMemo,
    useRef,
} from 'react';
import { useKeyboard } from '@opentui/react';
import { FormContextProvider, type FormContextValue } from './form-context';
import { FormDescription, type FormDescriptionProps } from './form-description';
import { FormTextField, type FormTextFieldProps } from './form-text-field';
import { FormDropdown, type FormDropdownProps } from './form-dropdown';
import { ActionPanelOverlay } from '../action-panel';

// ============================================================================
// Form Component
// ============================================================================

export interface FormProps {
    /** Form content (Form.Description, Form.TextField, Form.Dropdown) */
    children?: ReactNode;
    /** ActionPanel for form actions */
    actions?: ReactNode;
    /** Whether the form is in a loading state */
    isLoading?: boolean;
    /** Submit handler */
    onSubmit?: () => void | boolean;
    /** Push navigation handler (for Action.Push) */
    onPush?: (target: ReactNode) => void;
    /** Escape key handler (for navigation back) */
    onEscape?: () => void;
    /** Enable ctrl+return submit shortcut (default: true) */
    enableSubmitShortcut?: boolean;
    /** Enable ctrl+k command panel shortcut (default: true) */
    enableCommandPanelShortcut?: boolean;
}

/** Step component types we recognize */
const STEP_TYPES = [FormDescription, FormTextField, FormDropdown] as const;

/**
 * Check if an element is a form step component
 */
function isStepComponent(element: ReactElement): boolean {
    return STEP_TYPES.some(type => element.type === type);
}

/**
 * Main Form container component
 */
export function Form({
    children,
    actions,
    isLoading,
    onSubmit,
    onPush,
    onEscape,
    enableSubmitShortcut = true,
    enableCommandPanelShortcut = true,
}: FormProps) {
    const [focusedStepIndex, setFocusedStepIndex] = useState(0);
    const [isActionPanelOpen, setIsActionPanelOpen] = useState(false);
    const stepCountRef = useRef(0);

    // Count and process step children
    const processedChildren = useMemo(() => {
        const steps: ReactElement[] = [];
        let stepIndex = 0;

        Children.forEach(children, child => {
            if (!isValidElement(child)) return;

            if (isStepComponent(child)) {
                const isFirst = stepIndex === 0;
                steps.push(child);
                stepIndex++;
            }
        });

        stepCountRef.current = steps.length;

        // Clone with step props
        return steps.map((step, idx) =>
            cloneElement(step, {
                _index: idx,
                _isFirst: idx === 0,
                _isLast: idx === steps.length - 1,
            } as Partial<FormDescriptionProps | FormTextFieldProps | FormDropdownProps>)
        );
    }, [children]);

    const stepCount = stepCountRef.current;

    // Navigation handlers
    const navigateNext = useCallback(() => {
        setFocusedStepIndex(i => (i + 1) % stepCount);
    }, [stepCount]);

    const navigatePrev = useCallback(() => {
        setFocusedStepIndex(i => (i - 1 + stepCount) % stepCount);
    }, [stepCount]);

    const openActionPanel = useCallback(() => {
        setIsActionPanelOpen(true);
    }, []);

    const closeActionPanel = useCallback(() => {
        setIsActionPanelOpen(false);
    }, []);

    const submitForm = useCallback(() => {
        const result = onSubmit?.();
        if (result === true) {
            navigateNext();
        }
    }, [onSubmit, navigateNext]);

    // Keyboard handling
    useKeyboard(key => {
        // Don't handle keys when action panel is open
        if (isActionPanelOpen) {
            if (key.name === 'escape') {
                closeActionPanel();
            }
            return;
        }

        // Escape key handler
        if (key.name === 'escape') {
            onEscape?.();
            return;
        }

        // Tab navigation (always enabled)
        if (key.name === 'tab') {
            if (key.shift) {
                navigatePrev();
            } else {
                navigateNext();
            }
            return;
        }

        // Command panel shortcut (ctrl+k)
        if (enableCommandPanelShortcut && key.ctrl && key.name === 'k') {
            openActionPanel();
            return;
        }

        // Submit shortcut (ctrl+return)
        if (enableSubmitShortcut && key.ctrl && key.name === 'return') {
            submitForm();
        }
    });

    // Context value
    const contextValue: FormContextValue = useMemo(
        () => ({
            focusedStepIndex,
            setFocusedStepIndex,
            stepCount,
            registerStep: () => stepCountRef.current++,
            isActionPanelOpen,
            openActionPanel,
            closeActionPanel,
            submitForm,
        }),
        [
            focusedStepIndex,
            stepCount,
            isActionPanelOpen,
            openActionPanel,
            closeActionPanel,
            submitForm,
        ]
    );

    return (
        <box flexDirection="column" justifyContent="center" width="100%" flexGrow={1}>
            <FormContextProvider value={contextValue}>
                {/* Form steps */}
                <box flexDirection="column">{processedChildren}</box>

                {/* Action Panel Overlay */}
                {isActionPanelOpen && actions && (
                    <ActionPanelOverlay
                        onClose={closeActionPanel}
                        onSubmit={submitForm}
                        onPush={onPush}
                    >
                        {actions}
                    </ActionPanelOverlay>
                )}
            </FormContextProvider>

            {/* Loading indicator could go here */}
            {isLoading && (
                <box marginTop={1}>
                    <text>Loading...</text>
                </box>
            )}
        </box>
    );
}

// ============================================================================
// Compound Component Exports
// ============================================================================

Form.Description = FormDescription;
Form.TextField = FormTextField;
Form.Dropdown = FormDropdown;

// Re-export types
export type { FormDescriptionProps } from './form-description';
export type { FormTextFieldProps } from './form-text-field';
export type {
    FormDropdownProps,
    FormDropdownItemProps,
    FormDropdownSectionProps,
} from './form-dropdown';
export { FormDropdownSection, FormDropdownItem } from './form-dropdown';

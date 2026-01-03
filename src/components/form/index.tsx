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

const STEP_TYPES = [FormDescription, FormTextField, FormDropdown] as const;

function isStepComponent(element: ReactElement): boolean {
    return STEP_TYPES.some(type => element.type === type);
}

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

        return steps.map((step, idx) =>
            cloneElement(step, {
                _index: idx,
                _isFirst: idx === 0,
                _isLast: idx === steps.length - 1,
            } as Partial<FormDescriptionProps | FormTextFieldProps | FormDropdownProps>)
        );
    }, [children]);

    const stepCount = stepCountRef.current;

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

    useKeyboard(key => {
        if (isActionPanelOpen) {
            if (key.name === 'escape') {
                closeActionPanel();
            }
            return;
        }

        if (key.name === 'escape') {
            onEscape?.();
            return;
        }

        if (key.name === 'tab') {
            if (key.shift) {
                navigatePrev();
            } else {
                navigateNext();
            }
            return;
        }

        if (enableCommandPanelShortcut && key.ctrl && key.name === 'k') {
            openActionPanel();
            return;
        }

        // Windows Terminal maps Ctrl+Return to Ctrl+J, so check both
        if (enableSubmitShortcut && key.ctrl && (key.name === 'return' || key.name === 'j')) {
            submitForm();
        }
    });

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

            {isLoading && (
                <box marginTop={1}>
                    <text>Loading...</text>
                </box>
            )}
        </box>
    );
}

Form.Description = FormDescription;
Form.TextField = FormTextField;
Form.Dropdown = FormDropdown;

export type { FormDescriptionProps } from './form-description';
export type { FormTextFieldProps } from './form-text-field';
export type {
    FormDropdownProps,
    FormDropdownItemProps,
    FormDropdownSectionProps,
} from './form-dropdown';
export { FormDropdownSection, FormDropdownItem } from './form-dropdown';

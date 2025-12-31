// Form components
export { Form } from './form';
export type {
    FormProps,
    FormDescriptionProps,
    FormTextFieldProps,
    FormDropdownProps,
    FormDropdownItemProps,
    FormDropdownSectionProps,
} from './form';

// Command Panel components (aliases for action-panel for naming consistency)
export {
    ActionPanel,
    ActionPanelSection,
    ActionPanelOverlay,
    Action,
    ActionItem,
    // Aliases
    ActionPanel as CommandPanel,
    ActionPanelSection as CommandPanelSection,
    ActionPanelOverlay as CommandPanelOverlay,
    Action as Command,
    ActionItem as CommandItem,
} from './action-panel';
export type {
    ActionPanelProps,
    ActionPanelSectionProps,
    ActionPanelOverlayProps,
    ActionProps,
    ActionSubmitFormProps,
    ActionPushProps,
    ActionItemProps,
    // Type aliases
    ActionPanelProps as CommandPanelProps,
    ActionPanelSectionProps as CommandPanelSectionProps,
    ActionPanelOverlayProps as CommandPanelOverlayProps,
    ActionProps as CommandProps,
    ActionSubmitFormProps as CommandSubmitFormProps,
    ActionPushProps as CommandPushProps,
    ActionItemProps as CommandItemProps,
} from './action-panel';

// Confirm Exit Panel
export { ConfirmExitPanel } from './confirm-exit-panel';
export type { ConfirmExitPanelProps, ConfirmAction } from './confirm-exit-panel';

// Form context (for advanced usage)
export { useFormContext, useFormContextSafe } from './form/form-context';
export type { FormContextValue } from './form/form-context';

// Wizard components
export { Wizard, WizardStep, useWizardContext, WizardContextProvider } from './wizard';
export type {
    WizardProps,
    WizardStepDefinition,
    WizardStepState,
    WizardStepStatus,
    WizardStepContext,
} from './wizard';

// Toggle component
export { Toggle } from './toggle';
export type { ToggleProps } from './toggle';

// Translation Matrix component
export { TranslationMatrix } from './translation-matrix';
export type { TranslationMatrixProps } from './translation-matrix';

// Constants and utilities
export { ICONS, COLORS, getStepIcon, formatShortcut } from './form/constants';
export type {
    KeyboardShortcut,
    FormValues,
    ValidationFunction,
    FormItemProps,
    DropdownOption,
    DropdownSection,
    ActionDefinition,
} from './form/constants';

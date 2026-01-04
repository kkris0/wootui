/**
 * ASCII icons used for form step indicators
 */
export const ICONS = {
    /** First step icon when unfocused - small filled square */
    firstUnfocused: '▪',
    /** First step icon when focused - large filled square */
    firstFocused: '■',
    /** Regular step icon when unfocused - empty diamond */
    stepUnfocused: '◇',
    /** Regular step icon when focused - filled diamond */
    stepFocused: '◆',
    /** Vertical line connecting steps */
    lineVertical: '│',
    /** Corner line for last step */
    lineCorner: '└',
    /** Empty circle for unselected option */
    optionEmpty: '○',
    /** Filled circle for selected option */
    optionFilled: '●',
    /** Arrow indicator for highlighted option */
    optionArrow: '>',
    /** Empty square for action item */
    actionEmpty: '■',
    /** Filled triangle for selected action */
    actionSelected: '▼',
    /** X icon for removing selected items */
    removeIcon: '✕',
    /** Empty checkbox */
    checkboxEmpty: '□',
    /** Filled checkbox */
    checkboxFilled: '■',
    /** Checked checkbox */
    checkboxChecked: '✓',
} as const;

/**
 * Colors used for form styling
 */
export const COLORS = {
    /** Background color for action panel */
    background: '#222',
    /** Color when step is focused - golden yellow */
    focused: '#c9a227',
    /** Color when step is unfocused */
    unfocused: '#ffffff',
    /** Background color for selected action */
    selectedBackground: '#c9a227',
} as const;

/**
 * Get the appropriate step icon based on position and focus state
 */
export function getStepIcon(isFirst: boolean, isFocused: boolean): string {
    if (isFirst) {
        return isFocused ? ICONS.firstFocused : ICONS.firstUnfocused;
    }
    return isFocused ? ICONS.stepFocused : ICONS.stepUnfocused;
}

/**
 * Format a keyboard shortcut for display
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
    const parts: string[] = [];
    if (shortcut.modifiers?.includes('ctrl')) parts.push('^');
    if (shortcut.modifiers?.includes('shift')) parts.push('⇧');
    if (shortcut.modifiers?.includes('alt')) parts.push('⌥');
    if (shortcut.modifiers?.includes('meta')) parts.push('⌘');

    const keyName = shortcut.key.toUpperCase();
    if (keyName === 'RETURN') {
        parts.push('RETURN');
    } else {
        parts.push(keyName);
    }

    return parts.join('');
}

/**
 * Keyboard shortcut definition
 */
export interface KeyboardShortcut {
    modifiers?: Array<'ctrl' | 'shift' | 'alt' | 'meta'>;
    key: string;
}

/**
 * Form field values - generic object type
 */
export type FormValues = object;

/**
 * Validation function type
 */
export type ValidationFunction<T> = (value: T) => string | undefined | null;

/**
 * Props for form items that integrate with useForm
 */
export interface FormItemProps<T = string> {
    id: string;
    value: T;
    onChange: (value: T) => void;
    error?: string;
}

/**
 * Dropdown option definition
 */
export interface DropdownOption {
    value: string;
    title: string;
}

/**
 * Dropdown section definition
 */
export interface DropdownSection {
    title?: string;
    options: DropdownOption[];
}

/**
 * Action definition for ActionPanel
 */
export interface ActionDefinition {
    title: string;
    icon?: string;
    shortcut?: KeyboardShortcut;
    onAction?: () => void;
    section?: string;
}

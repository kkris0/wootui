import { TextAttributes } from '@opentui/core';
import { type ReactNode } from 'react';
import { Spinner } from '../../utils/spinner';
import type { WizardStepStatusType } from './types';
import { useWizardContext } from './wizard-context';

const ICONS = {
    firstUnfocused: '▪',
    firstFocused: '■',
    stepUnfocused: '◇',
    stepFocused: '◆',
    lineVertical: '│',
    lineCorner: '└',
    running: '◎',
    success: '✓',
    error: '✕',
} as const;

const COLORS = {
    focused: '#c9a227',
    unfocused: '#ffffff',
    locked: '#666666',
    success: '#22c55e',
    error: '#ef4444',
    running: '#3b82f6',
} as const;

export interface WizardStepProps {
    /** Title of the step */
    title: string;
    /** Index of this step */
    index: number;
    /** Whether this is the first step */
    isFirst: boolean;
    /** Whether this is the last visible step */
    isLast: boolean;
    /** Status of this step */
    status: WizardStepStatusType;
    /** Whether this step is locked */
    isLocked: boolean;
    /** Step content */
    children?: ReactNode;
}

/**
 * Get the appropriate step icon based on position, focus state, and status
 */
function getStepIcon(
    isFirst: boolean,
    isFocused: boolean,
    status: WizardStepStatusType
): { icon: string; color: string } {
    if (status === 'running') {
        return { icon: ICONS.running, color: COLORS.running };
    }
    if (status === 'success') {
        return { icon: ICONS.success, color: COLORS.success };
    }
    if (status === 'error') {
        return { icon: ICONS.error, color: COLORS.error };
    }

    if (isFirst) {
        return {
            icon: isFocused ? ICONS.firstFocused : ICONS.firstUnfocused,
            color: isFocused ? COLORS.focused : COLORS.unfocused,
        };
    }
    return {
        icon: isFocused ? ICONS.stepFocused : ICONS.stepUnfocused,
        color: isFocused ? COLORS.focused : COLORS.unfocused,
    };
}

/**
 * Wrapper for wizard steps with progress indicator and lock support
 */
export function WizardStep({
    title,
    index,
    isFirst,
    isLast,
    status,
    isLocked,
    children,
}: WizardStepProps) {
    const { focusedStepIndex, setFocusedStepIndex } = useWizardContext();
    const isFocused = focusedStepIndex === index;

    const { icon, color: iconColor } = getStepIcon(isFirst, isFocused, status);
    const titleColor = isLocked ? COLORS.locked : isFocused ? COLORS.focused : COLORS.unfocused;

    return (
        // biome-ignore lint/a11y/noStaticElementInteractions: Terminal UI handles keyboard separately
        <consoleButton
            label={title}
            isLast={isLast}
            labelColor={titleColor}
            icon={icon}
            iconColor={iconColor}
            minHeight={5}
            paddingLeft={3}
            isFocused={isFocused}
            onMouseDown={() => {
                if (!isLocked) {
                    setFocusedStepIndex(index);
                }
            }}
        >
            <box flexDirection="row" columnGap={1}>
                <text fg={titleColor} attributes={TextAttributes.BOLD}>
                    {title}
                </text>
                {status === 'running' && <Spinner color={COLORS.running} label="Processing..." />}
            </box>
            <box flexDirection="column" paddingTop={1}>
                <box>
                    {children}
                    <text key="spacer"> </text>
                </box>
            </box>
        </consoleButton>
    );
}

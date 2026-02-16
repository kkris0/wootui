import { TextAttributes } from '@opentui/core';
import type { ReactNode } from 'react';
import { COLORS, getStepIcon } from './constants';
import { useFormContext } from './form-context';

/** Action button configuration for a form step */
export interface FormStepAction {
    /** Label text for the action button */
    label: string;
    /** Click handler for the action */
    onAction: () => void;
}

export interface FormStepProps {
    /** Title of the step */
    title: string;
    /** Index of this step */
    index: number;
    /** Whether this is the first step */
    isFirst: boolean;
    /** Whether this is the last step */
    isLast: boolean;
    /** Step content */
    children?: ReactNode;
    /** Optional action button rendered right-aligned on the title row */
    action?: FormStepAction;
}

export function FormStep({ title, index, isFirst, isLast, children, action }: FormStepProps) {
    const { focusedStepIndex, setFocusedStepIndex } = useFormContext();
    const isFocused = focusedStepIndex === index;
    const color = isFocused ? COLORS.focused : COLORS.unfocused;

    const icon = getStepIcon(isFirst, isFocused);

    return (
        // biome-ignore lint/a11y/noStaticElementInteractions: Terminal UI handles keyboard separately
        <consoleButton
            label={title}
            isLast={isLast}
            labelColor={color}
            icon={icon}
            iconColor={color}
            minHeight={5}
            paddingLeft={3}
            isFocused={isFocused}
            bottomBorder={false}
            onMouseDown={() => setFocusedStepIndex(index)}
        >
            <box flexDirection="row" justifyContent="space-between" width="100%">
                <text fg={color} attributes={TextAttributes.BOLD}>
                    {title}
                </text>
                {action && (
                    // biome-ignore lint/a11y/noStaticElementInteractions: Terminal UI click handler
                    <box onMouseDown={action.onAction}>
                        <text fg={color} attributes={TextAttributes.DIM}>
                            {action.label}
                        </text>
                    </box>
                )}
            </box>
            <box flexDirection="column">
                <box>
                    {children}
                    <text key="spacer"> </text>
                </box>
            </box>
        </consoleButton>
    );
}

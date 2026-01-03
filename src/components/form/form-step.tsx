import { TextAttributes } from '@opentui/core';
import type { ReactNode } from 'react';
import { COLORS, getStepIcon } from './constants';
import { useFormContext } from './form-context';

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
}

export function FormStep({ title, index, isFirst, isLast, children }: FormStepProps) {
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
            <box flexDirection="row" columnGap={1}>
                <text fg={color} attributes={TextAttributes.BOLD}>
                    {title}
                </text>
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

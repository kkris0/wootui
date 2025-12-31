import { type ReactNode, Children } from 'react';
import { useFormContext } from './form-context';
import { COLORS, ICONS, getStepIcon } from './constants';

export interface FormStepProps {
    /** Title of the step */
    title: string;
    /** Index of this step */
    index: number;
    /** Whether this is the first step */
    isFirst: boolean;
    /** Whether this is the last step */
    isLast: boolean;
    /** Step content - each child gets its own line prefix */
    children?: ReactNode;
}

/**
 * Renders a single content line with the vertical line prefix
 */
function ContentLine({ color, children }: { color: string; children: ReactNode }) {
    return (
        <box flexDirection="row">
            <box width={2}>
                <text fg={color}>{ICONS.lineVertical}</text>
            </box>
            <box paddingLeft={1} flexGrow={1}>
                {children}
            </box>
        </box>
    );
}

/**
 * Base wrapper for form steps with progress indicator.
 * Each child element gets its own vertical line prefix.
 */
export function FormStep({ title, index, isFirst, isLast, children }: FormStepProps) {
    const { focusedStepIndex, setFocusedStepIndex } = useFormContext();
    const isFocused = focusedStepIndex === index;
    const color = isFocused ? COLORS.focused : COLORS.unfocused;

    const icon = getStepIcon(isFirst, isFocused);

    // Wrap each child with its own line prefix
    const childArray = Children.toArray(children);

    return (
        // biome-ignore lint/a11y/noStaticElementInteractions: Terminal UI handles keyboard separately
        <box flexDirection="column" onMouseDown={() => setFocusedStepIndex(index)}>
            {/* Main step row with icon and title */}
            <box flexDirection="row">
                <box width={2}>
                    <text fg={color}>{icon}</text>
                </box>
                <box paddingLeft={1}>
                    <text fg={color}>{title}</text>
                </box>
            </box>

            {/* Each child gets its own line prefix */}
            {childArray.map((child, idx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Children don't have stable keys
                <ContentLine key={idx} color={color}>
                    {child}
                </ContentLine>
            ))}

            {/* Final connector - corner for last step, vertical line for others */}
            <box flexDirection="row">
                <box width={2}>
                    <text fg={color}>{isLast ? ICONS.lineCorner : ICONS.lineVertical}</text>
                </box>
            </box>
        </box>
    );
}

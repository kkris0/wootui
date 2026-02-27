import { TextAttributes } from '@opentui/core';

interface StepErrorProps {
    message: string;
}

export function StepError({ message }: StepErrorProps) {
    return (
        <box flexDirection="column" padding={1} borderStyle="rounded" borderColor="#ef4444">
            <text fg="#ef4444" attributes={TextAttributes.BOLD}>
                Error
            </text>
            <text attributes={TextAttributes.DIM} marginTop={1}>
                {message}
            </text>
        </box>
    );
}

import { TextAttributes } from '@opentui/core';

export const LabelValue = ({
    label,
    value,
    color = '#ffffff',
}: {
    label: string;
    value: string | number;
    color?: string;
}) => (
    <box flexDirection="column" marginRight={2}>
        <text attributes={TextAttributes.DIM}>{label}</text>
        <text fg={color} attributes={TextAttributes.BOLD}>
            {String(value)}
        </text>
    </box>
);

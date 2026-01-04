import { TextAttributes } from '@opentui/core';
import { useEffect, useState } from 'react';

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

interface SpinnerProps {
    color?: string;
    label?: string;
}

export function Spinner({ color = '#3b82f6', label }: SpinnerProps) {
    const [frame, setFrame] = useState(0);
    useEffect(() => {
        const intervalId = setInterval(() => {
            setFrame(prevFrame => (prevFrame + 1) % FRAMES.length);
        }, 80);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <box flexDirection="row">
            <text fg={color} attributes={TextAttributes.BOLD}>
                {FRAMES[frame]}
            </text>
            {label && <text key="spacer"> </text>}
            {label && <text> {label}</text>}
        </box>
    );
}

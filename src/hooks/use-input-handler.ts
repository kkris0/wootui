import { useKeyboard } from '@opentui/react';

interface InputHandlerCallbacks {
    onTab?: () => void;
    onSubmit?: () => void;
    onActions?: () => void;
}

export function useInputHandler(callbacks: InputHandlerCallbacks) {
    useKeyboard(key => {
        if (key.name === 'tab') {
            callbacks.onTab?.();
        } else if (key.name === 'return') {
            callbacks.onSubmit?.();
        } else if (key.ctrl && key.name === 'k') {
            callbacks.onActions?.();
        }
    });
}

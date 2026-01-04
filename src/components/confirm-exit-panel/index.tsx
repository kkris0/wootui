import { TextAttributes } from '@opentui/core';
import { useKeyboard } from '@opentui/react';
import { useCallback, useState } from 'react';
import { ActionItem } from '@/components/action-panel/action-item';
import { COLORS } from '@/components/form/constants';

const PANEL_WIDTH = 50;

export type ConfirmAction = 'save' | 'discard' | 'cancel';

export interface ConfirmExitPanelProps {
    /** Handler called when user selects an action */
    onAction: (action: ConfirmAction) => void;
    /** Optional title override */
    title?: string;
}

interface ConfirmOption {
    id: ConfirmAction;
    title: string;
    shortcut?: string;
}

const OPTIONS: ConfirmOption[] = [
    { id: 'save', title: 'Save & Exit', shortcut: 's' },
    { id: 'discard', title: 'Discard Changes', shortcut: 'd' },
    { id: 'cancel', title: 'Cancel', shortcut: 'esc' },
];

/**
 * Confirm exit panel shown when settings form has unsaved changes
 */
export function ConfirmExitPanel({
    onAction,
    title = 'You have unsaved changes',
}: ConfirmExitPanelProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const executeAction = useCallback(
        (index: number) => {
            const option = OPTIONS[index];
            if (option) {
                onAction(option.id);
            }
        },
        [onAction]
    );

    useKeyboard(key => {
        if (key.name === 'escape') {
            onAction('cancel');
        } else if (key.name === 'up') {
            setSelectedIndex(i => Math.max(0, i - 1));
        } else if (key.name === 'down') {
            setSelectedIndex(i => Math.min(OPTIONS.length - 1, i + 1));
        } else if (key.name === 'return') {
            executeAction(selectedIndex);
        } else if (key.name === 's') {
            onAction('save');
        } else if (key.name === 'd') {
            onAction('discard');
        }
    });

    return (
        <box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
        >
            <box
                flexDirection="column"
                padding={1}
                borderStyle="rounded"
                width={PANEL_WIDTH}
                backgroundColor={COLORS.background}
            >
                {/* Header */}
                <box alignItems="flex-end" justifyContent="flex-end">
                    <text attributes={TextAttributes.DIM}>esc</text>
                </box>

                {/* Title */}
                <box marginTop={1}>
                    <text fg={COLORS.focused}>{title}</text>
                </box>

                {/* Options */}
                <box flexDirection="column" marginTop={2}>
                    {OPTIONS.map((option, index) => {
                        const isSelected = index === selectedIndex;

                        return (
                            <ActionItem
                                key={option.id}
                                title={option.title}
                                shortcut={option.shortcut ? { key: option.shortcut } : undefined}
                                isSelected={isSelected}
                                onMouseDown={() => executeAction(index)}
                            />
                        );
                    })}
                </box>

                {/* Footer */}
                <box flexDirection="row" marginTop={2} columnGap={4}>
                    <box flexDirection="row">
                        <text attributes={TextAttributes.BOLD}>↵</text>
                        <text attributes={TextAttributes.DIM}> select</text>
                    </box>
                    <box flexDirection="row">
                        <text attributes={TextAttributes.BOLD}>↑↓</text>
                        <text attributes={TextAttributes.DIM}> navigate</text>
                    </box>
                </box>
            </box>
        </box>
    );
}

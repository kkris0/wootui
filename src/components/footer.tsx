import { TextAttributes } from '@opentui/core';

export const Footer = ({ configurationOpen }: { configurationOpen: boolean }) => {
    if (configurationOpen) {
        return (
            <box flexDirection="row" columnGap={4}>
                <box flexDirection="row" alignItems="center">
                    <text attributes={TextAttributes.BOLD}>esc</text>
                    <text attributes={TextAttributes.DIM}> back</text>
                </box>
                <box flexDirection="row" alignItems="center">
                    <text attributes={TextAttributes.BOLD}>tab</text>
                    <text attributes={TextAttributes.DIM}> navigate</text>
                </box>
            </box>
        );
    }
    return (
        <box flexDirection="row" columnGap={4}>
            <box flexDirection="row" alignItems="center">
                <text attributes={TextAttributes.BOLD}>ctrl ↵</text>
                <text attributes={TextAttributes.DIM}> submit</text>
            </box>
            <box flexDirection="row" alignItems="center">
                <text attributes={TextAttributes.BOLD}>tab</text>
                <text attributes={TextAttributes.DIM}> navigate</text>
            </box>
            <box flexDirection="row" alignItems="center">
                <text attributes={TextAttributes.BOLD}>esc</text>
                <text attributes={TextAttributes.DIM}> reset</text>
            </box>
            <box flexDirection="row" alignItems="center">
                <text attributes={TextAttributes.BOLD}>^k</text>
                <text attributes={TextAttributes.DIM}> actions</text>
            </box>
        </box>
    );
};

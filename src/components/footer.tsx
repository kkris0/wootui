import { TextAttributes } from '@opentui/core';

const FooterItem = ({
    label,
    description,
    wrap = false,
}: {
    label: string;
    description: string;
    wrap?: boolean;
}) => {
    return (
        <box flexDirection="row" alignItems="center">
            {wrap && <text attributes={TextAttributes.DIM}>[</text>}
            <text attributes={TextAttributes.BOLD}>{label}</text>
            {wrap && <text attributes={TextAttributes.DIM}>]</text>}
            <text attributes={TextAttributes.DIM}> </text>
            <text attributes={TextAttributes.DIM}>{description}</text>
        </box>
    );
};

export const Footer = ({ configurationOpen }: { configurationOpen: boolean }) => {
    if (configurationOpen) {
        return (
            <box flexDirection="row" columnGap={4}>
                <FooterItem label="esc" description="back" />
                <FooterItem label="tab" description="navigate" />
            </box>
        );
    }
    return (
        <box flexDirection="row" columnGap={4}>
            <FooterItem label="ctrl ↵ " description="submit" />
            <FooterItem label="tab" description="navigate" />
            <FooterItem label="esc" description="reset" />
            <FooterItem label="^k" description="actions" />
        </box>
    );
};

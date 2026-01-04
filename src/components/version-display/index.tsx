import { TextAttributes } from '@opentui/core';
import { VERSION } from '@/utils/version';

export function VersionDisplay() {
    return <text attributes={TextAttributes.DIM}>{VERSION}</text>;
}

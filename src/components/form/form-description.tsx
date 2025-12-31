import { TextAttributes } from '@opentui/core';
import { FormStep } from './form-step';

export interface FormDescriptionProps {
    /** Title of the description */
    title: string;
    /** Text content to display */
    text?: string;
    /** Internal: step index (set by Form) */
    _index?: number;
    /** Internal: whether this is the first step */
    _isFirst?: boolean;
    /** Internal: whether this is the last step */
    _isLast?: boolean;
}

/**
 * Display-only step showing a title and description text
 */
export function FormDescription({
    title,
    text,
    _index = 0,
    _isFirst = false,
    _isLast = false,
}: FormDescriptionProps) {
    return (
        <FormStep
            title={title}
            index={_index}
            isFirst={_isFirst}
            isLast={_isLast}
        >
            {text && <text attributes={TextAttributes.DIM}>{text}</text>}
        </FormStep>
    );
}


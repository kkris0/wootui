import {
    type ReactNode,
    type ReactElement,
    useState,
    Children,
    isValidElement,
    useMemo,
    useCallback,
} from 'react';
import { TextAttributes } from '@opentui/core';
import { useKeyboard } from '@opentui/react';
import { ActionPanelContextProvider, type ActionPanelContextValue } from './action-panel-context';
import { ActionItem } from './action-item';
import { COLORS, type KeyboardShortcut } from '../form/constants';

const PANEL_WIDTH = 80;

// ============================================================================
// Action Components
// ============================================================================

export interface ActionProps {
    /** Action title */
    title: string;
    /** Icon to display */
    icon?: string;
    /** Keyboard shortcut */
    shortcut?: KeyboardShortcut;
    /** Action handler */
    onAction?: () => void;
    /** Submit handler */
    onSubmit?: () => void | Promise<void>;
    /** Target view to push */
    target?: ReactNode;
}

/**
 * Generic action component
 */
export function Action(_props: ActionProps) {
    // Declarative component - rendering handled by ActionPanel
    return null;
}

interface ActionSubmitFormProps {
    /** Action title */
    title: string;
    /** Icon to display */
    icon?: string;
    /** Keyboard shortcut */
    shortcut?: KeyboardShortcut;
    /** Submit handler */
    onSubmit?: () => void | Promise<void>;
}

/**
 * Submit form action
 */
function ActionSubmitForm(_props: ActionSubmitFormProps) {
    // Declarative component - rendering handled by ActionPanel
    return null;
}

interface ActionPushProps {
    /** Action title */
    title: string;
    /** Icon to display */
    icon?: string;
    /** Keyboard shortcut */
    shortcut?: KeyboardShortcut;
    /** Target view to push */
    target?: ReactNode;
}

/**
 * Push view action
 */
function ActionPush(_props: ActionPushProps) {
    // Declarative component - rendering handled by ActionPanel
    return null;
}

// Attach sub-components to Action
Action.SubmitForm = ActionSubmitForm;
Action.Push = ActionPush;

// ============================================================================
// ActionPanel.Section
// ============================================================================

export interface ActionPanelSectionProps {
    /** Section title (optional) */
    title?: string;
    /** Action items */
    children?: ReactNode;
}

/**
 * Section grouping for actions
 */
export function ActionPanelSection(_props: ActionPanelSectionProps) {
    // Declarative component - rendering handled by ActionPanel
    return null;
}

// ============================================================================
// ActionPanel
// ============================================================================

export interface ActionPanelProps {
    /** Action sections and items */
    children?: ReactNode;
}

interface ParsedAction {
    title: string;
    icon?: string;
    shortcut?: KeyboardShortcut;
    onAction?: () => void | Promise<void>;
    sectionTitle?: string;
    type: 'action' | 'submit' | 'push';
    target?: ReactNode;
}

/**
 * Parse ActionPanel children to extract actions
 */
function parseActionChildren(children: ReactNode): ParsedAction[] {
    const actions: ParsedAction[] = [];

    const parseAction = (
        child: ReactElement<ActionProps>,
        sectionTitle?: string
    ): ParsedAction | null => {
        if (child.type === Action) {
            return {
                title: child.props.title,
                icon: child.props.icon,
                shortcut: child.props.shortcut,
                onAction: child.props.onAction,
                sectionTitle,
                type: 'action',
            };
        } else if (child.type === ActionSubmitForm) {
            return {
                title: child.props.title,
                icon: child.props.icon,
                shortcut: child.props.shortcut,
                onAction: child.props.onSubmit,
                sectionTitle,
                type: 'submit',
            };
        } else if (child.type === ActionPush) {
            return {
                title: child.props.title,
                icon: child.props.icon,
                shortcut: child.props.shortcut,
                sectionTitle,
                type: 'push',
                target: child.props.target,
            };
        }
        return null;
    };

    Children.forEach(children, child => {
        if (!isValidElement(child)) return;

        // Check if it's a Section
        if (child.type === ActionPanelSection) {
            const sectionTitle = (child.props as ActionPanelSectionProps).title;
            Children.forEach((child.props as ActionPanelSectionProps).children, sectionChild => {
                if (isValidElement(sectionChild)) {
                    const action = parseAction(
                        sectionChild as ReactElement<ActionProps>,
                        sectionTitle
                    );
                    if (action) actions.push(action);
                }
            });
        } else {
            // Direct action child
            const action = parseAction(child as ReactElement<ActionProps>);
            if (action) actions.push(action);
        }
    });

    return actions;
}

/**
 * Filter actions by search query
 */
function filterActions(actions: ParsedAction[], query: string): ParsedAction[] {
    if (!query.trim()) return actions;
    const lowerQuery = query.toLowerCase();
    return actions.filter(action => action.title.toLowerCase().includes(lowerQuery));
}

/**
 * ActionPanel component - declarative container for actions
 * This component is meant to be passed to Form's actions prop
 */
export function ActionPanel({ children }: ActionPanelProps) {
    // This is a declarative component - actual rendering happens in ActionPanelOverlay
    return null;
}

// Attach Section to ActionPanel
ActionPanel.Section = ActionPanelSection;

// ============================================================================
// ActionPanelOverlay
// ============================================================================

export interface ActionPanelOverlayProps {
    /** ActionPanel children */
    children?: ReactNode;
    /** Close handler */
    onClose: () => void;
    /** Form submit handler (for Action.SubmitForm) */
    onSubmit?: () => void | Promise<void>;
    /** Push navigation handler (for Action.Push) */
    onPush?: (target: ReactNode) => void;
}

/**
 * ActionPanel overlay that renders as a modal
 */
export function ActionPanelOverlay({
    children,
    onClose,
    onSubmit,
    onPush,
}: ActionPanelOverlayProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Parse actions from ActionPanel children
    const allActions = useMemo(() => {
        // Children should be an ActionPanel element
        let actionPanelChildren: ReactNode = null;
        Children.forEach(children, child => {
            if (isValidElement(child) && child.type === ActionPanel) {
                actionPanelChildren = (child.props as ActionPanelProps).children;
            }
        });
        // If children is the ActionPanel's children directly
        if (!actionPanelChildren) {
            actionPanelChildren = children;
        }
        return parseActionChildren(actionPanelChildren);
    }, [children]);

    // Filter by search
    const filteredActions = useMemo(
        () => filterActions(allActions, searchQuery),
        [allActions, searchQuery]
    );

    // Execute action
    const executeAction = useCallback(
        async (index: number) => {
            const action = filteredActions[index];
            if (!action) return;

            if (action.type === 'submit' && onSubmit) {
                await onSubmit();
                onClose();
                return;
            }

            if (action.type === 'push' && action.target && onPush) {
                onPush(action.target);
                onClose();
                return;
            }

            if (action.onAction) {
                await action.onAction();
            }
            onClose();
        },
        [filteredActions, onClose, onSubmit, onPush]
    );

    // Keyboard handling
    useKeyboard(key => {
        if (key.name === 'escape') {
            onClose();
        } else if (key.name === 'up') {
            setSelectedIndex(i => Math.max(0, i - 1));
        } else if (key.name === 'down') {
            setSelectedIndex(i => Math.min(filteredActions.length - 1, i + 1));
        } else if (key.name === 'return') {
            executeAction(selectedIndex);
        }
    });

    // Context value
    const contextValue: ActionPanelContextValue = useMemo(
        () => ({
            selectedIndex,
            setSelectedIndex,
            executeAction,
            close: onClose,
            searchQuery,
            setSearchQuery,
        }),
        [selectedIndex, executeAction, onClose, searchQuery]
    );

    // Group actions by section for rendering
    const sections = useMemo(() => {
        const sectionMap = new Map<string | undefined, ParsedAction[]>();

        filteredActions.forEach(action => {
            const key = action.sectionTitle;
            if (!sectionMap.has(key)) {
                sectionMap.set(key, []);
            }
            sectionMap.get(key)!.push(action);
        });

        return Array.from(sectionMap.entries()).map(([title, actions]) => ({
            title,
            actions,
        }));
    }, [filteredActions]);

    // Track flat index for selection
    let flatIndex = 0;

    return (
        <ActionPanelContextProvider value={contextValue}>
            {/* Full-screen centering wrapper */}
            <box
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                justifyContent="center"
                alignItems="center"
            >
                {/* Panel container */}
                <box
                    flexDirection="column"
                    padding={1}
                    borderStyle="rounded"
                    width={PANEL_WIDTH}
                    backgroundColor={COLORS.background}
                >
                    {/* Header with escape hint */}
                    <box alignItems="flex-end" justifyContent="flex-end">
                        <text attributes={TextAttributes.DIM}>esc</text>
                    </box>

                    {/* Search input */}
                    <box marginTop={1}>
                        <input
                            placeholder="Search actions..."
                            value={searchQuery}
                            focused={true}
                            onInput={(val: string) => {
                                setSearchQuery(val);
                                setSelectedIndex(0);
                            }}
                            textColor={COLORS.focused}
                            focusedTextColor={COLORS.focused}
                            backgroundColor="transparent"
                            focusedBackgroundColor="transparent"
                        />
                    </box>

                    {/* Actions list */}
                    <box flexDirection="column" marginTop={2}>
                        {sections.map((section, sectionIdx) => (
                            <box
                                key={section.title ?? `section-${sectionIdx}`}
                                flexDirection="column"
                            >
                                {/* Section header */}
                                {section.title && (
                                    <box marginTop={sectionIdx > 0 ? 1 : 0}>
                                        <text fg={COLORS.focused}>{section.title}</text>
                                    </box>
                                )}

                                {/* Section actions */}
                                {section.actions.map(action => {
                                    const currentIndex = flatIndex++;
                                    const isSelected = currentIndex === selectedIndex;

                                    return (
                                        <ActionItem
                                            key={`${action.title}-${currentIndex}`}
                                            title={action.title}
                                            icon={action.icon}
                                            shortcut={action.shortcut}
                                            isSelected={isSelected}
                                            onMouseDown={() => executeAction(currentIndex)}
                                        />
                                    );
                                })}
                            </box>
                        ))}
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
        </ActionPanelContextProvider>
    );
}

// Re-exports
export { ActionItem } from './action-item';
export type { ActionItemProps } from './action-item';
export type { ActionPanelContextValue } from './action-panel-context';
export type { ActionSubmitFormProps, ActionPushProps };

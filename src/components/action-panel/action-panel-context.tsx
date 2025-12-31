import { createContext, useContext, type ReactNode } from 'react';

/**
 * Context value for action panel state
 */
export interface ActionPanelContextValue {
    /** Currently selected action index */
    selectedIndex: number;
    /** Set the selected action index */
    setSelectedIndex: (index: number) => void;
    /** Execute action at index */
    executeAction: (index: number) => void;
    /** Close the action panel */
    close: () => void;
    /** Search query */
    searchQuery: string;
    /** Set search query */
    setSearchQuery: (query: string) => void;
}

const ActionPanelContext = createContext<ActionPanelContextValue | null>(null);

/**
 * Hook to access action panel context
 */
export function useActionPanelContext(): ActionPanelContextValue | null {
    return useContext(ActionPanelContext);
}

/**
 * Provider component for action panel context
 */
export function ActionPanelContextProvider({
    children,
    value,
}: {
    children: ReactNode;
    value: ActionPanelContextValue;
}) {
    return <ActionPanelContext.Provider value={value}>{children}</ActionPanelContext.Provider>;
}

export { ActionPanelContext };


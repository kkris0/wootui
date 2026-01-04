import { Action, ActionPanel } from '@/components/action-panel';
import {
    createColumnsSelectionStep,
    createCsvPathStep,
    createResultsStep,
    createTargetLanguagesStep,
    createTokenAndPriceStep,
    createTranslateStep,
    type TranslateWizardValues,
} from '@/components/main-screen-steps';
import { Wizard } from '@/components/wizard';
import { useOpenOutputFolder } from '@/hooks/use-open-output-folder';

export interface MainScreenProps {
    onNavigateToSettings: () => void;
}

export function MainScreen({ onNavigateToSettings }: MainScreenProps) {
    const handleOpenOutputFolder = useOpenOutputFolder();

    const steps = [
        createCsvPathStep(),
        createColumnsSelectionStep(),
        createTargetLanguagesStep(),
        createTokenAndPriceStep(),
        createTranslateStep(),
        createResultsStep(),
    ];

    return (
        <box flexDirection="column" flexGrow={1} alignItems="flex-start" height="100%" width={65}>
            <box flexGrow={1} width="100%">
                <Wizard<TranslateWizardValues>
                    steps={steps}
                    initialValues={{
                        csvPath: '',
                        selectedMetaColumns: [],
                        targetLanguages: [],
                        overrideLanguages: [],
                    }}
                    actions={
                        <ActionPanel>
                            <ActionPanel.Section>
                                <Action.SubmitForm
                                    title="Continue"
                                    shortcut={{ modifiers: ['ctrl'], key: 'return' }}
                                />
                            </ActionPanel.Section>
                            <ActionPanel.Section title="Results">
                                <Action
                                    title="Open Output Folder"
                                    shortcut={{ modifiers: ['ctrl'], key: 'o' }}
                                    onAction={handleOpenOutputFolder}
                                />
                            </ActionPanel.Section>
                            <ActionPanel.Section title="Settings">
                                <Action
                                    title="Configure Settings..."
                                    shortcut={{ modifiers: ['ctrl'], key: ',' }}
                                    onAction={onNavigateToSettings}
                                />
                            </ActionPanel.Section>
                        </ActionPanel>
                    }
                />
            </box>
        </box>
    );
}

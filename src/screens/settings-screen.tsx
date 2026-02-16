import { useCallback, useMemo, useState } from 'react';
import { type ConfirmAction, ConfirmExitPanel } from '@/components/confirm-exit-panel';
import { Form } from '@/components/form';
import { appConfig } from '@/utils/config';
import { pickFolderSync } from '@/utils/folder-picker';

export interface SettingsScreenProps {
    onBack: () => void;
}

interface SettingsFormState {
    modelId: string;
    apiKey: string;
    batchSize: string;
    outputDir: string;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
    const [formState, setFormState] = useState<SettingsFormState>(() => ({
        modelId: appConfig.get('modelId'),
        apiKey: appConfig.get('apiKey'),
        batchSize: String(appConfig.get('batchSize')),
        outputDir: appConfig.get('outputDir'),
    }));

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const initialValues = useMemo<SettingsFormState>(
        () => ({
            modelId: appConfig.get('modelId'),
            apiKey: appConfig.get('apiKey'),
            batchSize: String(appConfig.get('batchSize')),
            outputDir: appConfig.get('outputDir'),
        }),
        []
    );

    const isDirty = useMemo(() => {
        return (
            formState.modelId !== initialValues.modelId ||
            formState.apiKey !== initialValues.apiKey ||
            formState.batchSize !== initialValues.batchSize ||
            formState.outputDir !== initialValues.outputDir
        );
    }, [formState, initialValues]);

    const handleSave = useCallback(() => {
        appConfig.set('modelId', formState.modelId);
        appConfig.set('apiKey', formState.apiKey);
        appConfig.set('batchSize', Number(formState.batchSize) || 5);
        appConfig.set('outputDir', formState.outputDir);
        onBack();
    }, [formState, onBack]);

    const handleConfirmAction = useCallback(
        (action: ConfirmAction) => {
            switch (action) {
                case 'save':
                    handleSave();
                    break;
                case 'discard':
                    onBack();
                    break;
                case 'cancel':
                    setIsConfirmOpen(false);
                    break;
            }
        },
        [handleSave, onBack]
    );

    const handleEscape = useCallback(() => {
        if (!isDirty) {
            onBack();
            return;
        }
        setIsConfirmOpen(true);
    }, [isDirty, onBack]);

    const updateField = useCallback(
        <K extends keyof SettingsFormState>(field: K, value: SettingsFormState[K]) => {
            setFormState(prev => ({ ...prev, [field]: value }));
        },
        []
    );

    return (
        <box
            flexDirection="column"
            flexGrow={1}
            justifyContent="center"
            alignItems="flex-start"
            width={65}
        >
            <Form
                isLoading={false}
                onEscape={isConfirmOpen ? undefined : handleEscape}
                enableSubmitShortcut={false}
                enableCommandPanelShortcut={false}
            >
                <Form.TextField
                    title="Model ID"
                    placeholder="gemini-2.5-pro"
                    description="Google Gemini model for AI translation. Affects translation quality and cost."
                    value={formState.modelId}
                    onChange={val => updateField('modelId', val)}
                />
                <Form.TextField
                    title="API Key"
                    placeholder="Enter your API key"
                    description="Google AI Studio API key. Required to access Gemini translation service."
                    value={formState.apiKey}
                    onChange={val => updateField('apiKey', val)}
                />
                <Form.TextField
                    title="Batch Size"
                    placeholder="10"
                    description="Products translated per API call. Higher = faster but less reliable (errors stop entire batch)."
                    value={formState.batchSize}
                    onChange={val => updateField('batchSize', val)}
                />
                <Form.TextField
                    title="Output Directory"
                    placeholder="~/Downloads"
                    description="Where WPML-ready translated CSVs are saved after translation completes."
                    value={formState.outputDir}
                    onChange={val => updateField('outputDir', val)}
                    action={{
                        label: 'SELECT OUTPUT FOLDER',
                        onAction: () => {
                            const folder = pickFolderSync('Select output directory');
                            if (folder) {
                                updateField('outputDir', folder);
                            }
                        },
                    }}
                />
            </Form>

            {isConfirmOpen && <ConfirmExitPanel onAction={handleConfirmAction} />}
        </box>
    );
}

import { TextAttributes } from '@opentui/core';
import type { TranslationResults } from '@/types/translation-result';
import { languageMap } from '@/utils/language-map';
import { Spinner } from '@/components/spinner';
import { LabelValue } from '@/components/label-value';
import type { WizardStepDefinition } from '@/components/wizard';
import { WizardStepStatus } from '@/components/wizard/types';
import type { TranslateWizardValues } from './types';

/**
 * Creates the results display step definition
 */
export function createResultsStep(): WizardStepDefinition<TranslateWizardValues> {
    return {
        id: 'results',
        title: 'Results',
        render: ctx => {
            const prevState = ctx.previousStepState;
            const results = prevState?.data as TranslationResults | undefined;

            if (prevState?.status === WizardStepStatus.RUNNING) {
                return <Spinner color="#3b82f6" label="Finalizing..." />;
            }

            if (prevState?.status === WizardStepStatus.ERROR) {
                return (
                    <box flexDirection="column">
                        <text fg="#ef4444" attributes={TextAttributes.BOLD}>
                            Translation Failed
                        </text>
                        <text attributes={TextAttributes.DIM} marginTop={1}>
                            {String(prevState.error ?? 'Unknown error')}
                        </text>
                    </box>
                );
            }

            if (prevState?.status === WizardStepStatus.SUCCESS && results) {
                return (
                    <box flexDirection="column">
                        <text fg="#22c55e" attributes={TextAttributes.BOLD}>
                            Translation Complete
                        </text>

                        <box flexDirection="row" columnGap={2} marginTop={1}>
                            <LabelValue
                                label="Total Cost"
                                value={`$${results.totalCost.toFixed(4)}`}
                                color="#22c55e"
                            />
                            <LabelValue
                                label="Input Tokens"
                                value={results.totalInputTokens.toLocaleString()}
                            />
                            <LabelValue
                                label="Output Tokens"
                                value={results.totalOutputTokens.toLocaleString()}
                            />
                            {results.totalReasoningTokens > 0 && (
                                <LabelValue
                                    label="Reasoning"
                                    value={results.totalReasoningTokens.toLocaleString()}
                                />
                            )}
                        </box>

                        <text attributes={TextAttributes.BOLD} marginTop={1}>
                            Per-Language Results:
                        </text>
                        {results.languageResults.map(result => (
                            <box key={result.language} flexDirection="column" marginTop={1}>
                                <box flexDirection="row" columnGap={2}>
                                    <text fg="#c9a227" attributes={TextAttributes.BOLD}>
                                        {languageMap[result.language] ?? result.language}
                                    </text>
                                    <text fg="#22c55e">${result.cost.toFixed(4)}</text>
                                    <text attributes={TextAttributes.DIM}>
                                        {result.inputTokens.toLocaleString()} in /{' '}
                                        {result.outputTokens.toLocaleString()} out
                                    </text>
                                </box>
                                <text attributes={TextAttributes.DIM} fg="#666666">
                                    {result.outputPath}
                                </text>
                            </box>
                        ))}

                        {/* Output Directory */}
                        <box flexDirection="column" marginTop={1}>
                            <text attributes={TextAttributes.DIM}>Output Directory:</text>
                            <text fg="#c9a227" attributes={TextAttributes.BOLD}>
                                {results.outputDir}
                            </text>
                        </box>

                        <box flexDirection="column" marginTop={1}>
                            <text attributes={TextAttributes.DIM} fg="#666666">
                                Press Ctrl+O to open output folder | Escape to start new translation
                            </text>
                        </box>
                    </box>
                );
            }

            return <Spinner color="#3b82f6" label="Waiting for translation..." />;
        },
    };
}

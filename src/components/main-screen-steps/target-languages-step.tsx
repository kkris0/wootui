import { TextAttributes } from '@opentui/core';
import { toast } from '@opentui-ui/toast';
import type { LanguageCode } from '@/types/language-code';
import { languageMap } from '@/utils/language-map';
import { Spinner } from '@/components/spinner';
import { wooCsvParser } from '@/utils/woo-csv';
import { Form } from '@/components/form';
import { Toggle } from '@/components/toggle';
import { TranslationMatrix } from '@/components/translation-matrix';
import type { WizardStepDefinition } from '@/components/wizard';
import { WizardStepStatus } from '@/components/wizard/types';
import type { CarryData, Step2Result, TranslateWizardValues } from './types';
import { FIXED_COLUMNS } from '@/components/main-screen-steps/types';

/**
 * Creates the target languages selection step definition
 */
export function createTargetLanguagesStep(): WizardStepDefinition<TranslateWizardValues> {
    return {
        id: 'target-languages',
        title: 'Target Languages',
        render: (ctx, recenterScrollbox) => {
            const prevState = ctx.previousStepState;
            const step2Data = prevState?.data as Step2Result | undefined;
            const parseSummary = step2Data?.parseSummary;

            if (prevState?.status === WizardStepStatus.RUNNING) {
                return <Spinner color="#3b82f6" label="Preparing products..." />;
            }

            if (prevState?.status === WizardStepStatus.ERROR) {
                return (
                    <box flexDirection="row">
                        <text fg="#ef4444" attributes={TextAttributes.BOLD}>
                            ❌ Error:{' '}
                        </text>
                        <text attributes={TextAttributes.DIM}>{String(prevState.error ?? '')}</text>
                    </box>
                );
            }

            const handleToggleOverride = (lang: LanguageCode, enabled: boolean) => {
                const current = ctx.values.overrideLanguages;
                const newOverrides = enabled ? [...current, lang] : current.filter(l => l !== lang);
                ctx.setValue('overrideLanguages', newOverrides);
            };

            if (prevState?.status === WizardStepStatus.SUCCESS && parseSummary) {
                return (
                    <box flexDirection="column">
                        <text attributes={TextAttributes.DIM}>
                            Select target languages and configure overrides.
                        </text>
                        <text key="spacer"> </text>

                        {ctx.isFocused && (
                            <>
                                <Form.Dropdown
                                    title=""
                                    values={ctx.values.targetLanguages}
                                    onChange={vals => {
                                        ctx.setValue('targetLanguages', vals as LanguageCode[]);
                                        recenterScrollbox?.();
                                    }}
                                    maxVisibleItems={8}
                                    isFocused={ctx.isFocused && !ctx.isLocked}
                                >
                                    <Form.Dropdown.Section title="Available Languages">
                                        {Object.entries(languageMap).map(([code, name]) => (
                                            <Form.Dropdown.Item
                                                key={code}
                                                value={code}
                                                title={name}
                                            />
                                        ))}
                                    </Form.Dropdown.Section>
                                </Form.Dropdown>
                                <box flexDirection="row" marginTop={1} columnGap={1}>
                                    <text attributes={TextAttributes.DIM}>↑ up</text>
                                    <text attributes={TextAttributes.DIM}>↓ down</text>
                                    <text attributes={TextAttributes.DIM}>↵ select</text>
                                </box>
                            </>
                        )}

                        {ctx.values.targetLanguages.length > 0 && (
                            <box flexDirection="column" marginTop={1}>
                                <text attributes={TextAttributes.BOLD} fg="#c9a227">
                                    Override Existing Translations
                                </text>
                                <text attributes={TextAttributes.DIM} fg="#666666">
                                    Enable to re-translate products that already have translations.
                                </text>
                                <box flexDirection="column" marginTop={1}>
                                    {ctx.values.targetLanguages.map(lang => (
                                        <Toggle
                                            key={lang}
                                            label={languageMap[lang] ?? lang}
                                            value={ctx.values.overrideLanguages.includes(lang)}
                                            onChange={val => handleToggleOverride(lang, val)}
                                            isFocused={false}
                                        />
                                    ))}
                                </box>
                            </box>
                        )}

                        <TranslationMatrix
                            parseSummary={parseSummary}
                            targetLanguages={ctx.values.targetLanguages}
                            overrideLanguages={ctx.values.overrideLanguages}
                        />
                    </box>
                );
            }
            return <Spinner color="#3b82f6" label="Preparing products..." />;
        },
        onSubmit: async (values, context) => {
            if (values.targetLanguages.length === 0) {
                toast.error('No target languages selected', {
                    description: 'Please select at least one target language',
                });
                throw new Error('No target languages selected');
            }
            const step2Data = context.previousStepState?.data as Step2Result | undefined;
            if (!step2Data?.parseSummary) {
                toast.error('CSV file not parsed', {
                    description: 'Please parse the CSV file first',
                });
                throw new Error('CSV file not parsed');
            }

            const { parseSummary } = step2Data;

            const { productsByLanguage, allUniqueAttributeNames } =
                await wooCsvParser.prepareProductsForTranslation(
                    parseSummary.attributeColumnMap,
                    parseSummary.productTranslationsPerLanguage,
                    parseSummary.productSourceTranslations,
                    FIXED_COLUMNS,
                    values.selectedMetaColumns,
                    values.targetLanguages,
                    values.overrideLanguages
                );

            const estimatesByLanguage = await wooCsvParser.prepareLanguageEstimates(
                productsByLanguage,
                values.targetLanguages
            );

            const carryData: CarryData = {
                parseSummary,
                productsByLanguage,
                allUniqueAttributeNames,
                estimatesByLanguage,
            };

            return carryData;
        },
    };
}

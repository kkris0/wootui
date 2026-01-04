import { TextAttributes } from '@opentui/core';
import type { LanguageCode } from '@/types/language-code';
import type { WooCsvParseSummary } from '@/types/woo-csv-parse-summary';
import { WpmlImportColumns } from '@/types/wpml-import-columns';
import { languageMap } from '@/utils/language-map';
import { Spinner } from '@/components/spinner';
import { Form } from '../form';
import { LabelValue } from '@/components/label-value';
import type { WizardStepDefinition } from '@/components/wizard';
import { WizardStepStatus } from '@/components/wizard/types';
import type { Step2Result, TranslateWizardValues } from './types';
import {
    DEFAULT_SEO_META,
    FIXED_COLUMNS,
    WPML_INTERNAL_COLUMNS,
} from '@/components/main-screen-steps/types';

/**
 * Creates the columns selection step definition
 */
export function createColumnsSelectionStep(): WizardStepDefinition<TranslateWizardValues> {
    return {
        id: 'columns-selection',
        title: 'Select Columns',
        render: (ctx, recenterScrollbox) => {
            const prevState = ctx.previousStepState;
            const summary = prevState?.data as WooCsvParseSummary | undefined;

            if (prevState?.status === WizardStepStatus.RUNNING) {
                return <Spinner color="#3b82f6" label="Parsing and analyzing CSV structure..." />;
            }

            if (prevState?.status === WizardStepStatus.ERROR) {
                return (
                    <box
                        flexDirection="row"
                        borderColor="#ef4444"
                        borderStyle="rounded"
                        padding={1}
                    >
                        <text fg="#ef4444" attributes={TextAttributes.BOLD}>
                            ❌ Error:{' '}
                        </text>
                        <text attributes={TextAttributes.DIM}>{String(prevState.error ?? '')}</text>
                    </box>
                );
            }

            if (prevState?.status === WizardStepStatus.SUCCESS && summary) {
                const sourceLangCode = summary.productSourceTranslations[0]?.[
                    WpmlImportColumns.ImportLanguageCode
                ] as string;
                const sourceLangName =
                    languageMap[sourceLangCode as LanguageCode] || sourceLangCode || 'Unknown';

                // Filter Meta: Exclude WPML internals
                const availableMeta = summary.headers.filter(
                    h => h.startsWith('Meta:') && !WPML_INTERNAL_COLUMNS.includes(h)
                );
                const uniqueAttributes = Array.from(
                    new Set(summary.attributeColumnMap.map(a => `Attribute ${a.attributeNum}`))
                );

                const sortedMeta = availableMeta.sort((a, b) => {
                    if (DEFAULT_SEO_META.includes(a)) return -1;
                    if (DEFAULT_SEO_META.includes(b)) return -1;
                    return 1;
                });

                return (
                    <box flexDirection="column">
                        <box
                            flexDirection="row"
                            marginBottom={1}
                            justifyContent="space-between"
                            width={60}
                        >
                            <LabelValue
                                label="Source Lang"
                                value={sourceLangName}
                                color="#22c55e"
                            />
                            <LabelValue
                                label="Products"
                                value={summary.productSourceTranslations.length}
                            />
                            <LabelValue
                                label="Translations"
                                value={summary.productExistingTranslations.length}
                                color="#fbbf24"
                            />
                        </box>

                        <box
                            flexDirection="row"
                            border={['top']}
                            borderColor="#aaaaaa"
                            borderStyle="single"
                        ></box>

                        <box flexDirection="column" marginTop={1} marginBottom={1}>
                            <text attributes={TextAttributes.BOLD}>
                                Fixed Columns (Always Included):
                            </text>
                            <text attributes={TextAttributes.DIM} fg="#aaaaaa">
                                {FIXED_COLUMNS.join(', ')}
                            </text>
                        </box>

                        <box flexDirection="column" marginBottom={1}>
                            <text attributes={TextAttributes.BOLD}>
                                {`Attributes Found (${uniqueAttributes.length}):`}
                            </text>
                            <text attributes={TextAttributes.DIM} fg="#aaaaaa">
                                {uniqueAttributes.length > 0
                                    ? uniqueAttributes.join(', ')
                                    : 'No attributes found'}
                            </text>
                        </box>

                        {ctx.isFocused && (
                            <>
                                <Form.Dropdown
                                    title=""
                                    values={ctx.values.selectedMetaColumns}
                                    onChange={vals => {
                                        ctx.setValue('selectedMetaColumns', vals as string[]);
                                        recenterScrollbox?.();
                                    }}
                                    maxVisibleItems={10}
                                    isFocused={!ctx.isLocked}
                                >
                                    <Form.Dropdown.Section title="Metadata (Default: SEO Only)">
                                        {sortedMeta.map(meta => (
                                            <Form.Dropdown.Item
                                                key={meta}
                                                value={meta}
                                                title={meta.replace('Meta: ', '')}
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
                    </box>
                );
            }

            return <Spinner color="#3b82f6" label="Waiting for CSV to be parsed..." />;
        },
        onSubmit: async (_values, ctx) => {
            const parseSummary = ctx.previousStepState?.data as WooCsvParseSummary | undefined;
            if (!parseSummary) throw new Error('CSV file not parsed');
            return { parseSummary } as Step2Result;
        },
    };
}

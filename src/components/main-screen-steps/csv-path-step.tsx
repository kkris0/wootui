import type { TranslateWizardValues } from '@/components/main-screen-steps/types';
import { DEFAULT_SEO_META } from '@/components/main-screen-steps/types';
import type { WizardStepDefinition } from '@/components/wizard';
import { pickFileSync } from '@/utils/folder-picker';
import { wooCsvParser } from '@/utils/woo-csv';

/**
 * Creates the CSV path input step definition
 */
export function createCsvPathStep(): WizardStepDefinition<TranslateWizardValues> {
    return {
        id: 'csv-path',
        title: 'WooCommerce CSV',
        action: ctx => ({
            label: 'SELECT CSV FILE',
            onAction: () => {
                const file = pickFileSync('Select WooCommerce CSV file', [
                    { name: 'CSV Files', extensions: ['csv'] },
                ]);
                if (file) {
                    ctx.setValue('csvPath', file);
                }
            },
        }),
        render: ctx => (
            <input
                placeholder="/path/to/woocommerce-export.csv"
                value={ctx.values.csvPath}
                focused={ctx.isFocused && !ctx.isLocked}
                onInput={(val: string) => ctx.setValue('csvPath', val)}
                onChange={(val: string) => ctx.setValue('csvPath', val)}
                onPaste={(event: { text: string }) => {
                    ctx.setValue('csvPath', ctx.values.csvPath + event.text);
                }}
                textColor="#ffffff"
                backgroundColor="transparent"
                focusedBackgroundColor="transparent"
                focusedTextColor="#ffffff"
            />
        ),
        onSubmit: async (values, ctx) => {
            if (!values.csvPath) {
                throw new Error('CSV path is required');
            }

            const summary = await wooCsvParser.parseWooProductsCsv(values.csvPath);

            const metaHeaders = summary.headers.filter(h => h.startsWith('Meta:'));

            const defaultSelection = [...metaHeaders.filter(h => DEFAULT_SEO_META.includes(h))];

            ctx.setValue('selectedMetaColumns', defaultSelection);

            return summary;
        },
    };
}

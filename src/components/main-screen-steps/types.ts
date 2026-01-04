import type { EstimateTokenAndPriceResult } from '@/types/estimate-token-and-price-result';
import type { LanguageCode } from '@/types/language-code';
import type { WooCsvParseSummary } from '@/types/woo-csv-parse-summary';
import { WpmlImportColumns } from '@/types/wpml-import-columns';
import type { AttributeName } from '@/utils/translate';

/**
 * Default SEO meta columns to pre-select
 */
export const DEFAULT_SEO_META = [
    'Meta: rank_math_description',
    'Meta: rank_math_focus_keyword',
    'Meta: _yoast_wpseo_focuskw',
    'Meta: _yoast_wpseo_metadesc',
];

/**
 * WPML internal columns that should be excluded from user selection
 */
export const WPML_INTERNAL_COLUMNS: readonly string[] = [
    WpmlImportColumns.SourceLanguageCode,
    WpmlImportColumns.ImportLanguageCode,
    WpmlImportColumns.TranslationGroup,
];

/**
 * Fixed columns that are always included in translation
 */
export const FIXED_COLUMNS = ['Name', 'Short description', 'Description', 'Tags'];

/**
 * Form values for the translation wizard
 */
export interface TranslateWizardValues {
    csvPath: string;
    selectedMetaColumns: string[];
    targetLanguages: LanguageCode[];
    overrideLanguages: LanguageCode[];
}

/**
 * Result from Step 2 (columns selection)
 */
export interface Step2Result {
    parseSummary: WooCsvParseSummary;
}

/**
 * Carry data passed through steps 3-5
 */
export interface CarryData {
    parseSummary: WooCsvParseSummary;
    productsByLanguage: Map<LanguageCode, Record<string, string | undefined>[]>;
    allUniqueAttributeNames: AttributeName[];
    estimatesByLanguage: Map<LanguageCode, EstimateTokenAndPriceResult>;
}

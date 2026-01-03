import { WpmlImportColumns } from './wpml-import-columns.ts';
import { LanguageCode } from './language-code.ts';

/**
 * WPML fixed columns for import/export
 */
export interface WpmlFixedColumns {
    [WpmlImportColumns.SourceLanguageCode]: LanguageCode;
    [WpmlImportColumns.ImportLanguageCode]: LanguageCode;
    [WpmlImportColumns.TranslationGroup]: string;
}

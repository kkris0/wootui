import type { AttributeColMap } from '../utils/attibute_parser.ts';
import type { WooRow } from '../utils/dynamic_schema.ts';
import type { WpmlFixedColumns } from './wpml-fixed-columns.ts';
import { LanguageCode } from './language-code.ts';
import type { ProductWithTranslationMeta } from '../utils/translate.ts';

/**
 * Summary of parsed WooCommerce CSV
 */
export interface WooCsvParseSummary {
    /** The parsed headers (the headers of the CSV) */
    headers: string[];
    /** Column map for attributes by their index in the header (ex. { attributeNum: '1', valueIndex: 1, nameIndex: 2 }) */
    attributeColumnMap: AttributeColMap[];
    /** Source products translations (source product aka translation, from which we translate to the target languages) */
    productSourceTranslations: WooRow<WpmlFixedColumns>[];
    /** Already translated products (the products that are already translated to the target languages - mapped by "Meta: _wpml_import_translation_group" to the source product) */
    productExistingTranslations: WooRow<WpmlFixedColumns>[];
    /** The products grouped by language they are to be translated to (key: language, value: products) */
    productTranslationsPerLanguage: Map<LanguageCode, ProductWithTranslationMeta[]>;
}

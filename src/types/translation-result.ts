import type { LanguageCode } from './language-code';

/**
 * Result for a single language translation
 */
export interface LanguageTranslationResult {
    language: LanguageCode;
    outputPath: string;
    inputTokens: number;
    outputTokens: number;
    reasoningTokens: number;
    cost: number;
}

/**
 * Complete translation results returned from the translate step
 */
export interface TranslationResults {
    languageResults: LanguageTranslationResult[];
    outputDir: string;
    totalInputTokens: number;
    totalOutputTokens: number;
    totalReasoningTokens: number;
    totalCost: number;
}

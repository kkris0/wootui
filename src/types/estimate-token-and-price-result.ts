/**
 * WPML import column keys
 */
export interface EstimateTokenAndPriceResult {
    wordCount: number;
    tokenCount: number;
    estimatedPrice: {
        total: number;
        input: number;
        output: number;
        perWordTotal: number;
        perWordInput: number;
        perWordOutput: number;
    };
    encodedProducts: string;
    systemPrompt: string;
    prompt: string;
}

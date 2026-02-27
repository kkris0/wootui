/**
 * Error thrown when CSV parsing fails
 */
export class WooCsvParseError extends Error {
    constructor(
        message: string,
        public readonly code:
            | 'FILE_NOT_FOUND'
            | 'INVALID_CSV'
            | 'VALIDATION_FAILED'
            | 'EMPTY_FILE'
            | 'NO_SOURCE_LANGUAGE_PRODUCTS'
    ) {
        super(message);
        this.name = 'WooCsvParseError';
    }
}

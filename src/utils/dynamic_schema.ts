import { z } from 'zod';

// ------------------------------------------------------------------
// 1. Define Reusable Validators (The "Building Blocks")
// ------------------------------------------------------------------

// WooCommerce booleans in CSV are usually "1", "0", or sometimes "yes"/"no"
const wooBoolean = z
    .string()
    .refine(val => ['1', '0', 'yes', 'no', 'true', 'false', ''].includes(val.toLowerCase()), {
        message: 'Must be 1, 0, yes, or no',
    });

// Numbers (Prices, Stock, Dimensions) come as strings in CSV
const wooNumber = z
    .string()
    .refine(val => val === '' || !isNaN(parseFloat(val)), { message: 'Must be a valid number' });

// Comma separated lists (Categories, Tags, Images)
const wooList = z.string();

// ------------------------------------------------------------------
// 2. Define the Map of "Known" Standard Columns
// ------------------------------------------------------------------
// This maps the exact header string to a specific Zod validator.

const standardColumnRules: Record<string, z.ZodTypeAny> = {
    // Identity
    ID: z.string().min(1), // ID is required
    Type: z.enum(['simple', 'variable', 'grouped', 'external', 'variation']),
    SKU: z.string(),
    Name: z.string(),
    Published: wooBoolean,
    'Is featured?': wooBoolean,
    'Visibility in catalogue': z.enum(['visible', 'catalog', 'search', 'hidden']),

    // Content
    'Short description': z.string(),
    Description: z.string(),

    // Pricing & Dates
    'Date sale price starts': z.string(), // Could add date regex validation here
    'Date sale price ends': z.string(),
    'Tax status': z.enum(['taxable', 'shipping', 'none', '']),
    'Tax class': z.string(),
    'Sale price': wooNumber,
    'Regular price': wooNumber,

    // Inventory
    'In stock?': wooBoolean,
    Stock: wooNumber,
    'Low stock amount': wooNumber,
    'Backorders allowed?': wooBoolean.or(z.enum(['notify'])),
    'Sold individually?': wooBoolean,

    // Dimensions (Note: Headers often include units like "Weight (kg)")
    // We handle exact matches here, but might need fuzzy matching in the generator
    'Weight (g)': wooNumber,
    'Weight (kg)': wooNumber,
    'Weight (lbs)': wooNumber,
    'Length (cm)': wooNumber,
    'Width (cm)': wooNumber,
    'Height (cm)': wooNumber,

    // Reviews & Notes
    'Allow customer reviews?': wooBoolean,
    'Purchase note': z.string(),

    // Taxonomy & Media
    Categories: wooList,
    Tags: wooList,
    'Shipping class': z.string(),
    Images: wooList,
    'Download limit': wooNumber,
    'Download expiry days': wooNumber,

    // Relations
    Parent: z.string(),
    'Grouped products': wooList,
    Upsells: wooList,
    'Cross-sells': wooList,
    'External URL': z.string().url().or(z.literal('')),
    'Button text': z.string(),
    Position: wooNumber,
};
export interface WooStandardRow {
    ID: string;
    Type: 'simple' | 'variable' | 'grouped' | 'external' | 'variation';
    SKU: string;
    Name: string;
    Published?: '1' | '0' | 'yes' | 'no';
    'Is featured?'?: '1' | '0';
    'Visibility in catalogue'?: 'visible' | 'catalog' | 'search' | 'hidden';
    'Short description'?: string;
    Description?: string;
    'Date sale price starts'?: string;
    'Date sale price ends'?: string;
    'Tax status'?: 'taxable' | 'shipping' | 'none';
    'Tax class'?: string;
    'In stock?'?: '1' | '0';
    Stock?: string; // CSVs often import numbers as strings initially
    'Low stock amount'?: string;
    'Backorders allowed?'?: '1' | '0' | 'notify';
    'Sold individually?'?: '1' | '0';
    'Allow customer reviews?'?: '1' | '0';
    'Purchase note'?: string;
    'Sale price'?: string;
    'Regular price'?: string;
    Categories?: string;
    Tags?: string;
    'Shipping class'?: string;
    Images?: string;
    'Download limit'?: string;
    'Download expiry days'?: string;
    Parent?: string;
    'Grouped products'?: string;
    Upsells?: string;
    'Cross-sells'?: string;
    'External URL'?: string;
    'Button text'?: string;
    Position?: string;
    // ... add other standard fixed columns here
}

// ------------------------------------------------------------------
// 3. The Dynamic Schema Generator
// ------------------------------------------------------------------
export type WooRow<CustomFields = {}> = WooStandardRow & CustomFields & Record<string, any>;

export const createWooProductSchema = <T extends Record<string, any> = {}>(headers: string[]) => {
    const shape: Record<string, z.ZodTypeAny> = {};

    headers.forEach(header => {
        // A. Check if it's a Standard Known Column
        if (standardColumnRules[header]) {
            shape[header] = standardColumnRules[header].optional(); // Make optional as cells might be empty
            return;
        }

        // B. Check for Dimensions (Fuzzy Match)
        // Handles "Weight (g)", "Weight (oz)", etc. without listing every unit
        if (/^(Weight|Length|Width|Height)/i.test(header)) {
            shape[header] = wooNumber.optional();
            return;
        }

        // C. Check for Attributes (Pattern Matching)
        // Matches: "Attribute 1 name", "Attribute 12 value(s)", "Attribute 5 global"
        const attributePattern = /^Attribute \d+ (name|value\(s\)|visible|global|default)$/i;
        if (attributePattern.test(header)) {
            if (
                header.toLowerCase().includes('visible') ||
                header.toLowerCase().includes('global')
            ) {
                shape[header] = wooBoolean.optional();
            } else {
                shape[header] = z.string().optional();
            }
            return;
        }

        // D. Check for Meta Fields
        // Matches: "Meta: _yoast_wpseo_title", "Blocksy Custom Data", etc.
        if (header.startsWith('Meta:') || header.startsWith('Blocksy')) {
            shape[header] = z.string().optional(); // Meta is almost always a string
            return;
        }

        // E. Fallback for unknown columns (Plugins often add random headers)
        // We allow them as strings to prevent the validation from failing on extra data
        shape[header] = z.string().optional();
    });

    // Create the object schema and allow unknown keys (passthrough) just in case,
    // though our logic above covers most keys.
    return z.object(shape).loose() as unknown as z.ZodType<WooRow<T>>;
};

// ------------------------------------------------------------------
// 4. Usage Example
// ------------------------------------------------------------------

// The headers provided in your prompt
const csvHeaders = [
    'ID',
    'Type',
    'SKU',
    'Name',
    'Published',
    'Is featured?',
    'Weight (g)',
    'Length (cm)',
    'Attribute 1 name',
    'Attribute 1 value(s)',
    'Attribute 1 visible',
    'Meta: _yoast_wpseo_focuskw',
    'Unknown Plugin Column',
];

// 1. Generate the Schema based on these specific headers
const dynamicSchema = createWooProductSchema(csvHeaders);

// 2. Simulate a Row of Data (parsed from CSV)
const validRow = {
    ID: '102',
    Type: 'simple',
    SKU: 'HOODIE-BLUE',
    Name: 'Blue Hoodie',
    Published: '1',
    'Is featured?': '0',
    'Weight (g)': '500',
    'Length (cm)': '20',
    'Attribute 1 name': 'Color',
    'Attribute 1 value(s)': 'Blue, Red',
    'Attribute 1 visible': '1',
    'Meta: _yoast_wpseo_focuskw': 'blue hoodie',
    'Unknown Plugin Column': 'some data',
};

// 3. Simulate an Invalid Row
const invalidRow = {
    ID: '103',
    Type: 'invalid_type', // Error: not in enum
    Published: 'maybe', // Error: not 1/0
    'Weight (g)': 'heavy', // Error: not a number
};

// 4. Validate
// const resultValid = dynamicSchema.safeParse(validRow);
// const resultInvalid = dynamicSchema.safeParse(invalidRow);
//
// console.log('Valid Row Success:', resultValid.success); // true
//
// if (!resultInvalid.success) {
//     console.log('Invalid Row Errors:', resultInvalid.error.format());
// }

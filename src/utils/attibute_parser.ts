export interface AttributeColMap {
    attributeNum: string; // e.g., "1", "2", "10"
    valueIndex: number; // Index of "Attribute X value(s)"
    nameIndex: number; // Index of "Attribute X name" (for context)
}

export interface TranslatableAttribute {
    attributeNum: string;
    key: string; // The Attribute Name (Context)
    value: string; // The Value to translate
}

export interface MetaColMap {
    metaKey: string;
    valueIndex: number;
}

export class AttibuteParser {
    private static ATTR_VALUE_REGEX = /^Attribute (\d+) value\(s\)$/;
    private static ATTR_NAME_REGEX = /^Attribute (\d+) name$/;

    static mapHeaders(headers: string[]): AttributeColMap[] {
        const attributeMap: AttributeColMap[] = [];

        headers.forEach((header, valueIndex) => {
            const match = this.ATTR_VALUE_REGEX.exec(header);

            if (match) {
                const attrNum = match[1];
                if (!attrNum) {
                    return;
                }

                const nameHeader = `Attribute ${attrNum} name`;
                const nameIndex = headers.indexOf(nameHeader);

                attributeMap.push({
                    attributeNum: attrNum, // number of the attribute, ex. "Attribute 1 value(s)" -> "1"
                    valueIndex, // index of the value column, ex. "Attribute 1 value(s)" index -> 1
                    nameIndex, // index of the name column, ex. "Attribute 1 name" index -> 2
                });
            }
        });

        return attributeMap;
    }

    static extractAttributeLabels(row: Record<string, string>): Record<string, string> {
        const attributeLabels: Record<string, string> = {};
        for (const [key, value] of Object.entries(row)) {
            if (!value) continue;
            const match = this.ATTR_NAME_REGEX.exec(key);
            if (match) {
                attributeLabels[key] = value ?? '';
            }
        }
        return attributeLabels;
    }

    static extractAttributes(row: string[], map: AttributeColMap[]): TranslatableAttribute[] {
        const extracted: TranslatableAttribute[] = [];

        for (const mapping of map) {
            const value = row[mapping.valueIndex];

            const nameContext =
                mapping.nameIndex > -1
                    ? row[mapping.nameIndex]
                    : `Attribute ${mapping.attributeNum}`;

            /* if (!value || value.trim() === '')
                    // 1. Skip if value is null/undefined or empty string
                    continue;
                    
                    if (value.trim() === '0')
                    // 2. Skip if value is "0" (common WP default for empty)
                    continue; 
                    if (!nameContext) continue;*/

            extracted.push({
                attributeNum: mapping.attributeNum,
                key: nameContext ?? '',
                value: value ?? '',
            });
        }

        return extracted;
    }
}

export class MetaParser {
    private static META_REGEX = /^Meta: (.+)$/;

    static mapHeaders(headers: string[]): MetaColMap[] {
        const metaMap: MetaColMap[] = [];

        headers.forEach((header, valueIndex) => {
            const match = this.META_REGEX.exec(header);
            if (match) {
                metaMap.push({
                    metaKey: match[0] || '', // TODO: Handle undefined case
                    valueIndex,
                });
            }
        });

        return metaMap;
    }

    static extractMeta(row: string[], metaMap: MetaColMap[]): Record<string, string> {
        const meta: Record<string, string> = {};

        for (const mapping of metaMap) {
            meta[mapping.metaKey] = row[mapping.valueIndex] || ''; // TODO: Handle undefined case
        }
        return meta;
    }
}

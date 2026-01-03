import os from 'node:os';
import path from 'node:path';
import type Conf from 'conf';
import type { ConfigSchema } from '../types/config';

/**
 * Returns the output directory for translated files.
 * Falls back to the user's Downloads folder if not configured.
 */
export function useOutputDir(config: Conf<ConfigSchema>): string {
    const configuredDir = config.get('outputDir');
    if (configuredDir && configuredDir.trim() !== '') {
        return configuredDir;
    }
    return path.join(os.homedir(), 'Downloads');
}

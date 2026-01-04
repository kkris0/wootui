import os from 'node:os';
import path from 'node:path';
import { appConfig } from '../utils/config';

/**
 * Returns the output directory for translated files.
 * Falls back to the user's Downloads folder if not configured.
 */
export function useOutputDir(): string {
    const configuredDir = appConfig.get('outputDir');
    if (configuredDir && configuredDir.trim() !== '') {
        return configuredDir;
    }
    return path.join(os.homedir(), 'Downloads');
}

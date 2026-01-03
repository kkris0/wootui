import { exec } from 'node:child_process';
import { toast } from '@opentui-ui/toast';
import type Conf from 'conf';
import type { ConfigSchema } from '../types/config';
import { useOutputDir } from './use-output-dir';

/**
 * Returns a function that opens the output directory in the system file explorer.
 * Supports macOS (open), Windows (explorer), and Linux (xdg-open).
 */
export function useOpenOutputFolder(config: Conf<ConfigSchema>): () => void {
    const outputDir = useOutputDir(config);

    return () => {
        const platform = process.platform;
        const command =
            platform === 'darwin'
                ? `open "${outputDir}"`
                : platform === 'win32'
                  ? `explorer "${outputDir}"`
                  : `xdg-open "${outputDir}"`;

        exec(command, error => {
            if (error) {
                toast.error('Failed to open folder', {
                    description: error.message,
                });
            }
        });
    };
}

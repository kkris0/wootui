import { exec } from 'node:child_process';
import { toast } from '@opentui-ui/toast';
import { useOutputDir } from './use-output-dir';

/**
 * Returns a function that opens the output directory in the system file explorer.
 * Supports macOS (open), Windows (explorer), and Linux (xdg-open).
 */
export function useOpenOutputFolder(): () => void {
    const outputDir = useOutputDir();

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

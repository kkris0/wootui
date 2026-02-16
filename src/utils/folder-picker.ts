import { execSync } from 'node:child_process';

/** File type filter for file picker dialogs */
export interface FileTypeFilter {
    /** Display name for the filter (e.g., "CSV Files") */
    name: string;
    /** File extensions without dots (e.g., ["csv", "txt"]) */
    extensions: string[];
}

/**
 * Opens a native file picker dialog and returns the selected file path.
 * Supports macOS (Finder), Windows (Explorer), and Linux (Zenity/KDialog).
 *
 * @param prompt - Optional prompt text for the dialog
 * @param filters - Optional file type filters
 * @returns The selected file path, or null if cancelled or an error occurred
 */
export function pickFileSync(prompt = 'Select a file', filters?: FileTypeFilter[]): string | null {
    const platform = process.platform;

    try {
        let result: string;

        if (platform === 'darwin') {
            // macOS: Use AppleScript to open Finder file picker
            const escapedPrompt = prompt.replace(/"/g, '\\"');
            // Build file type filter for AppleScript
            let typeFilter = '';
            if (filters && filters.length > 0) {
                const extensions = filters.flatMap(f => f.extensions);
                typeFilter = ` of type {${extensions.map(e => `"${e}"`).join(', ')}}`;
            }
            result = execSync(
                `osascript -e 'tell application "System Events" to activate' -e 'POSIX path of (choose file with prompt "${escapedPrompt}"${typeFilter})'`,
                { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
            );
        } else if (platform === 'win32') {
            // Windows: Use PowerShell OpenFileDialog
            const escapedPrompt = prompt.replace(/'/g, "''");
            let filterString = 'All files (*.*)|*.*';
            if (filters && filters.length > 0) {
                filterString = filters
                    .map(
                        f =>
                            `${f.name} (${f.extensions.map(e => `*.${e}`).join(';')})|${f.extensions.map(e => `*.${e}`).join(';')}`
                    )
                    .join('|');
            }
            result = execSync(
                `powershell -Command "Add-Type -AssemblyName System.Windows.Forms; $f = New-Object System.Windows.Forms.OpenFileDialog; $f.Title = '${escapedPrompt}'; $f.Filter = '${filterString}'; if ($f.ShowDialog() -eq 'OK') { $f.FileName }"`,
                { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
            );
        } else {
            // Linux: Try zenity first, fall back to kdialog
            const escapedPrompt = prompt.replace(/"/g, '\\"');
            let fileFilter = '';
            if (filters && filters.length > 0) {
                const patterns = filters.flatMap(f => f.extensions.map(e => `*.${e}`));
                fileFilter = patterns.map(p => `--file-filter="${p}"`).join(' ');
            }
            try {
                result = execSync(
                    `zenity --file-selection --title="${escapedPrompt}" ${fileFilter} 2>/dev/null`,
                    { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
                );
            } catch {
                // Zenity failed or not installed, try kdialog
                let kdialogFilter = '';
                if (filters && filters.length > 0) {
                    const patterns = filters.flatMap(f => f.extensions.map(e => `*.${e}`));
                    kdialogFilter = patterns.join(' ');
                }
                result = execSync(
                    `kdialog --getopenfilename ~ "${kdialogFilter}" --title "${escapedPrompt}" 2>/dev/null`,
                    { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
                );
            }
        }

        const trimmed = result.trim();

        return trimmed || null;
    } catch (error) {
        console.error('Failed to pick file', error);
        return null;
    }
}

/**
 * Opens a native folder picker dialog and returns the selected path.
 * Supports macOS (Finder), Windows (Explorer), and Linux (Zenity/KDialog).
 *
 * @param prompt - Optional prompt text for the dialog
 * @returns The selected folder path, or null if cancelled or an error occurred
 */
export function pickFolderSync(prompt = 'Select a folder'): string | null {
    const platform = process.platform;

    try {
        let result: string;

        if (platform === 'darwin') {
            // macOS: Use AppleScript to open Finder folder picker
            const escapedPrompt = prompt.replace(/"/g, '\\"');
            result = execSync(
                `osascript -e 'tell application "System Events" to activate' -e 'POSIX path of (choose folder with prompt "${escapedPrompt}")'`,
                { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
            );
        } else if (platform === 'win32') {
            // Windows: Use PowerShell FolderBrowserDialog
            const escapedPrompt = prompt.replace(/'/g, "''");
            result = execSync(
                `powershell -Command "Add-Type -AssemblyName System.Windows.Forms; $f = New-Object System.Windows.Forms.FolderBrowserDialog; $f.Description = '${escapedPrompt}'; if ($f.ShowDialog() -eq 'OK') { $f.SelectedPath }"`,
                { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
            );
        } else {
            // Linux: Try zenity first, fall back to kdialog
            const escapedPrompt = prompt.replace(/"/g, '\\"');
            try {
                result = execSync(
                    `zenity --file-selection --directory --title="${escapedPrompt}" 2>/dev/null`,
                    { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
                );
            } catch {
                // Zenity failed or not installed, try kdialog
                result = execSync(
                    `kdialog --getexistingdirectory ~ --title "${escapedPrompt}" 2>/dev/null`,
                    { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
                );
            }
        }

        const trimmed = result.trim().replace(/\/+$/, '');

        return trimmed || null;
    } catch (error) {
        console.error('Failed to pick folder', error);
        return null;
    }
}

import { resolve } from 'node:path';

const packageJsonPath = resolve(import.meta.dir, '../../package.json');
const versionTsPath = resolve(import.meta.dir, './version.ts');

async function generateVersion() {
    try {
        const packageJsonContent = await Bun.file(packageJsonPath).text();
        const packageJson = JSON.parse(packageJsonContent);
        const version = packageJson.version;

        if (!version) {
            throw new Error('No version field found in package.json');
        }

        const versionTsContent = `export const VERSION = "${version}" as const;\n`;
        await Bun.write(versionTsPath, versionTsContent);

        console.log(`✅ Version generated: ${version}`);
    } catch (error) {
        console.error('❌ Error generating version:', error);
        process.exit(1);
    }
}

generateVersion();

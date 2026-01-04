import Conf from 'conf';
import { homedir } from 'node:os';
import { join } from 'node:path';
import type { ConfigSchema } from '../types/config';

export const appConfig = new Conf<ConfigSchema>({
    projectName: 'wootui',
    defaults: {
        modelId: 'gemini-2.5-pro',
        apiKey: '',
        batchSize: 5,
        outputDir: join(homedir(), 'Downloads'),
    },
});

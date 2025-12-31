import { createCliRenderer } from '@opentui/core';
import { createRoot } from '@opentui/react';
import { useState, useCallback } from 'react';
import { COLORS } from './components/form/constants';
import { Toaster } from '@opentui-ui/toast/react';
import type { ConfigSchema } from './types/config';
import Conf from 'conf';
import { MainScreen } from './screens/main-screen';
import { SettingsScreen } from './screens/settings-screen';

type Screen = 'main' | 'settings';

const config = new Conf<ConfigSchema>({
    projectName: 'wootui',
    defaults: {
        modelId: 'gemini-2.5-pro',
        apiKey: '',
        batchSize: 5,
        outputDir: './output',
    },
});

function App() {
    const [activeScreen, setActiveScreen] = useState<Screen>('main');

    const navigateToSettings = useCallback(() => {
        setActiveScreen('settings');
    }, []);

    const navigateToMain = useCallback(() => {
        setActiveScreen('main');
    }, []);

    return (
        <box
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            flexGrow={1}
            backgroundColor={COLORS.background}
            padding={1}
        >
            {activeScreen === 'main' ? (
                <MainScreen onNavigateToSettings={navigateToSettings} config={config} />
            ) : (
                <SettingsScreen config={config} onBack={navigateToMain} />
            )}

            <Toaster
                position="bottom-center"
                stackingMode="single"
                toastOptions={{
                    style: {
                        backgroundColor: COLORS.background,
                        borderStyle: 'rounded',
                        borderColor: COLORS.focused,
                    },
                }}
                icons={{
                    loading: {
                        frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
                        interval: 80,
                    },
                }}
            />
        </box>
    );
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);

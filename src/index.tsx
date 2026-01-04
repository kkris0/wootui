import { createCliRenderer } from '@opentui/core';
import { createRoot } from '@opentui/react';
import { Toaster } from '@opentui-ui/toast/react';
import { useCallback, useState } from 'react';
import { Footer } from './components/footer';
import { COLORS } from './components/form/constants';
import { registerConsoleButton } from './components/step-box';
import { VersionDisplay } from './components/version-display';
import { MainScreen } from './screens/main-screen';
import { SettingsScreen } from './screens/settings-screen';

type Screen = 'main' | 'settings';

registerConsoleButton();

function App() {
    const [activeScreen, setActiveScreen] = useState<Screen>('main');

    const navigateToSettings = useCallback(() => {
        setActiveScreen('settings');
    }, []);

    const navigateToMain = useCallback(() => {
        setActiveScreen('main');
    }, []);

    return (
        <box flexDirection="column" flexGrow={1} backgroundColor={COLORS.background}>
            <box flexGrow={1} justifyContent="center" alignItems="center" padding={1}>
                {activeScreen === 'main' ? (
                    <MainScreen onNavigateToSettings={navigateToSettings} />
                ) : (
                    <SettingsScreen onBack={navigateToMain} />
                )}
            </box>

            <box
                flexDirection="row"
                width="100%"
                paddingBottom={1}
                paddingLeft={2}
                paddingRight={2}
            >
                <box flexGrow={1} />
                <Footer configurationOpen={activeScreen === 'settings'} />
                <box flexGrow={1} flexDirection="row" justifyContent="flex-end">
                    <VersionDisplay />
                </box>
            </box>

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

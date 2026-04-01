import { useState, useEffect } from "react";
import FirstTimeSetup from "./components/FirstTimeSetup";
import ReplayLibrary from "./components/ReplayLibrary";
import Sidebar from "./components/Sidebar";
import Settings from "./components/Settings";
import SingleReplay from "./components/SingleReplay";

function App() {
    const [replayFolder, setReplayFolder] = useState(null);
    const [theme, setTheme] = useState("blue");
    const [view, setView] = useState("library");
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [selectedReplay, setSelectedReplay] = useState(null);
    const [replayInfos, setReplayInfos] = useState([]);

    // Effects
    useEffect(() => {
        window.api.getReplayFolder().then(setReplayFolder);
    }, []);
    useEffect(() => {
        window.api.getTheme().then(setTheme);
    }, []);
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    useEffect(() => {
        if (replayFolder) {
            window.api.scanReplays().then(setReplayInfos);
        }
    }, [replayFolder]);

    //Check if we need to do first time setup;
    if (replayFolder === undefined) return null;
    if (replayFolder === null)
        return <FirstTimeSetup onComplete={setReplayFolder} theme={theme} setTheme={setTheme} />;

    //Main div
    return (
        <div className="relative flex h-screen w-full min-w-0">
            <Sidebar onOpenSettings={() => setSettingsOpen(true)}></Sidebar>

            <main className="flex-1 overflow-hidden">
                {view === "library" && (
                    <ReplayLibrary
                        replayInfos={replayInfos}
                        onOpenReplay={(replay) => {
                            setSelectedReplay(replay);
                            setView("singleReplay");
                        }}
                    />
                )}
                {view === "singleReplay" && (
                    <SingleReplay
                        onBack={() => setView("library")}
                        selectedReplay={selectedReplay}
                    ></SingleReplay>
                )}
            </main>

            {settingsOpen && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[var(--surface)] rounded-lg p-6 w-[600px]">
                        <Settings onBack={() => setSettingsOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;

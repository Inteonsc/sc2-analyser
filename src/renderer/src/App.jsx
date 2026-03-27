import { useState, useEffect } from "react";
import FirstTimeSetup from "./components/FirstTimeSetup";
import ReplayLibrary from "./components/ReplayLibrary";
import Sidebar from "./components/Sidebar";

function App() {
    const [replayFolder, setReplayFolder] = useState(null);
    const [theme, setTheme] = useState("blue");

    //add state replay folder
    // effect for getting replay folder for
    useEffect(() => {
        window.api.getReplayFolder().then(setReplayFolder);
    }, []);
    useEffect(() => {
        window.api.getTheme().then(setTheme);
    }, []);
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);
    if (replayFolder === undefined) return null;
    else if (replayFolder === null)
        return <FirstTimeSetup onComplete={setReplayFolder} theme={theme} setTheme={setTheme} />;
    else
        return (
            <div className="flex flex-grow h-full w-full">
                <Sidebar></Sidebar>
                <ReplayLibrary replayFolder={replayFolder} />{" "}
            </div>
        );
}

export default App;

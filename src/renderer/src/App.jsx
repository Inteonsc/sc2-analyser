import { useState, useEffect } from "react";
import FirstTimeSetup from "./components/FirstTimeSetup";
import ReplayLibrary from "./components/ReplayLibrary";

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
    else return <ReplayLibrary replayFolder={replayFolder} />;
}

export default App;

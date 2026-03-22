import { useState, useEffect } from "react";
function FirstTimeSetup({ onComplete, theme, setTheme }) {
    const [selectedPath, setSelectedPath] = useState("");
    async function handleBrowse() {
        const result = await window.api.pickReplayFolder();
        if (result) setSelectedPath(result);
    }
    function changeTheme(newTheme) {
        window.api.saveTheme(newTheme);
        setTheme(newTheme);
    }
    function saveButton() {
        console.log(selectedPath);
        window.api.saveReplayFolder(selectedPath);
        onComplete(selectedPath);
    }

    useEffect(() => {
        window.api.getDefaultPath().then(setSelectedPath);
    }, []);
    return (
        <div className="p-5 gap-4 inline-flex flex-col h-screen">
            <div className="flex flex-1 flex-col p-5 gap-4">
                <div className="flex gap-2 content-start items-center">
                    <h3 className="text-[var(--text)]">Theme - </h3>
                    <select
                        value={theme}
                        onChange={(e) => changeTheme(e.target.value)}
                        className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] px-3 py-2 rounded"
                    >
                        <option value="blue">Blue (default)</option>
                        <option value="neutral">Neutral</option>
                        <option value="light">Light</option>
                    </select>
                </div>
                <p className="text-[var(--text)]">
                    Select the folder containing your replays. This is usually your StarCraft II
                    accounts folder (Documents\StarCraft II\Accounts), which will scan all accounts
                    automatically. You can also select any other folder if you only want to analyse
                    specific replays.
                </p>
                <div className="flex gap-2 items-center">
                    <h3 className="text-[var(--text)]">Replay Folders Path - </h3>
                    <input
                        type="text"
                        value={selectedPath}
                        readOnly
                        className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)] px-3 py-2 outline-none focus:border-[var(--accent)] flex-1 cursor-default rounded"
                    />
                    <button
                        onClick={handleBrowse}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Browse
                    </button>
                </div>
            </div>
            <div className="flex justify-end p-5">
                <button
                    onClick={saveButton}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={!selectedPath}
                >
                    Save
                </button>
            </div>
        </div>
    );
}

export default FirstTimeSetup;

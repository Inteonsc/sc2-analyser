import ReplayLibraryItem from "./ReplayLibraryItem";
import { useState, useEffect } from "react";
function ReplayLibrary() {
    //todo call replays
    //todo display all in a table

    const [replayInfos, setReplayInfos] = useState([]);
    useEffect(() => {
        window.api.scanReplays().then(setReplayInfos);
    }, []);

    return (
        <div className="flex-1 overflow-y-auto">
            <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-[var(--surface)]">
                    <tr>
                        <th className="text-left px-4 py-2 text-[var(--text-muted)] font-semibold text-xs uppercase tracking-wider border-b border-[var(--border)]">
                            Result
                        </th>
                        <th className="text-left px-4 py-2 text-[var(--text-muted)] font-semibold text-xs uppercase tracking-wider border-b border-[var(--border)]">
                            Players
                        </th>
                        <th className="text-left px-4 py-2 text-[var(--text-muted)] font-semibold text-xs uppercase tracking-wider border-b border-[var(--border)]">
                            Map
                        </th>
                        <th className="text-left px-4 py-2 text-[var(--text-muted)] font-semibold text-xs uppercase tracking-wider border-b border-[var(--border)]">
                            Duration
                        </th>
                        <th className="text-left px-4 py-2 text-[var(--text-muted)] font-semibold text-xs uppercase tracking-wider border-b border-[var(--border)]">
                            Date
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {replayInfos.map((replayInfo, index) => (
                        <ReplayLibraryItem key={index} replayInfo={replayInfo} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default ReplayLibrary;

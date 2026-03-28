import { Settings } from "lucide-react";
function Sidebar({ onOpenSettings }) {
    return (
        <div className="w-1/4 h-full bg-[var(--surface)] flex flex-col justify-end border-r-4 border-[var(--border)] ">
            <div className="border-b-2 px-2 py-2 flex flex-col flex-grow">
                <h1>Saved Views</h1>
                <ul className="px-4">
                    <li>zvp</li>
                    <li>zvt</li>
                </ul>
            </div>
            <div className="px-2 py-2 flex flex-col flex-grow">
                <h1>Replays</h1>
                <ul className="px-4">
                    <li>vs Maru</li>
                    <li>vs Serral</li>
                </ul>
            </div>
            <div className="flex justify-end py-1 px-1 bg-[var(--surface2)] border-t-1 border-[var(--border)]">
                <Settings
                    size={45}
                    className="cursor-pointer px-1 py-1 rounded text-[var(--text-muted)] hover:text-[var(--text)]"
                    onClick={onOpenSettings}
                />
            </div>
        </div>
    );
}
export default Sidebar;

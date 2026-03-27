function Sidebar() {
    return (
        <div className="w-1/4 h-full bg-[var(--surface)] flex flex-col border-r-4 border-[var(--border)] ">
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
            <div className="flex justify-end py-4 px-4 rounded">
                <button>BOOM</button>
            </div>
        </div>
    );
}
export default Sidebar;

import { useState, useEffect } from "react";
import {
    createColumnHelper,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender
} from "@tanstack/react-table";

function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function getWinnerName(winner, players) {
    let winnerName;
    const winnerID = winner;
    if (winnerID !== undefined) winnerName = `${players?.[winnerID]?.name ?? "Unknown"} Won`;
    return winnerName ?? "Unknown Won";
}
//TODO team games and ffas, sort into teams
function getPlayerNames(players) {
    const names = [];
    for (const player of players) {
        if (player !== undefined) {
            if (player.name !== undefined) names.push(player.name);
            else names.push("unknown");
        }
    }
    return names;
}

const columnHelper = createColumnHelper();
const columns = [
    columnHelper.accessor((row) => getWinnerName(row.winner, row.players), {
        id: "Result",
        header: "Result"
    }),
    columnHelper.accessor((row) => getPlayerNames(row.players).join(", "), {
        id: "Players",
        header: "Players"
    }),
    columnHelper.accessor("map", {
        id: "Map",
        header: "Map"
    }),
    columnHelper.accessor((row) => formatDuration(row.duration), {
        id: "Duration",
        header: "Duration"
    }),
    columnHelper.accessor((row) => formatDate(row.date), { id: "Date", header: "Date" }),
    columnHelper.accessor("gamemode.gamemode", {
        id: "Gamemode",
        header: "Gamemode"
    })
];
function ReplayLibrary() {
    //todo call replays
    //todo display all in a table

    const [replayInfos, setReplayInfos] = useState([]);
    const [sorting, setSorting] = useState([{ id: "Date", desc: true }]);
    const [globalFilter, setGlobalFilter] = useState("");
    useEffect(() => {
        window.api.scanReplays().then(setReplayInfos);
    }, []);

    const table = useReactTable({
        data: replayInfos,
        columns,
        state: {
            sorting,
            globalFilter
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel()
    });

    return (
        <div className="flex-1 overflow-y-auto overflox-x-auto">
            <input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search..."
                className="mb-4 p-2 border rounded w-full"
            />
            <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-[var(--surface)]">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="text-left p-2 border-b cursor-pointer"
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}

                                    {header.column.getIsSorted()
                                        ? { asc: " 🔼", desc: " 🔽" }[header.column.getIsSorted()]
                                        : ""}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="hover:bg-[var(--surface2)] cursor-pointer">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="p-2 border-b">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default ReplayLibrary;

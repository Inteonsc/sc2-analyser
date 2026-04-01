// im done with tables so just vibe code and pray.

import { useState, useEffect, useRef } from "react";
import {
    createColumnHelper,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function getWinnerName(winner, players) {
    if (winner === undefined) return "Unknown Won";
    return `${players?.[winner]?.name ?? "Unknown"} Won`;
}

function getPlayerNames(players) {
    return players.filter(Boolean).map((p) => p?.name ?? "unknown");
}

// ─── Column definitions ───────────────────────────────────────────────────────

const columnHelper = createColumnHelper();

const columns = [
    columnHelper.accessor((row) => getWinnerName(row.winner, row.players), {
        id: "Result",
        header: "Result",
        size: 150,
        minSize: 50
    }),
    columnHelper.accessor((row) => getPlayerNames(row.players).join(", "), {
        id: "Players",
        header: "Players",
        size: 200,
        minSize: 100
    }),
    columnHelper.accessor("map", {
        id: "Map",
        header: "Map",
        size: 150,
        minSize: 50
    }),
    columnHelper.accessor((row) => formatDuration(row.duration), {
        id: "Duration",
        header: "Duration",
        size: 100,
        minSize: 50
    }),
    columnHelper.accessor("date", {
        id: "Date",
        header: "Date",
        cell: (info) => formatDate(info.getValue()),
        sortingFn: "datetime",
        size: 150,
        minSize: 50
    }),
    columnHelper.accessor("gamemode.gamemode", {
        id: "Gamemode",
        header: "Gamemode",
        size: 150,
        minSize: 50
    })
];

// Total of default sizes — used for proportional scaling
const defaultTotalSize = columns.reduce((sum, col) => sum + (col.size ?? 150), 0);

// Minimum table width before a horizontal scrollbar appears.
// Set this to roughly the smallest width where all columns are still readable.
const MIN_TABLE_WIDTH = defaultTotalSize;

// ─── Component ────────────────────────────────────────────────────────────────

function ReplayLibrary({ replayInfos, onOpenReplay }) {
    const [sorting, setSorting] = useState([{ id: "Date", desc: true }]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [resizingID, setResizingID] = useState(null);
    const scrollContainerRef = useRef(null);
    const prevWidthRef = useRef(0);

    const table = useReactTable({
        data: replayInfos,
        columns,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        columnResizeMode: "onChange"
    });

    // Proportional column resize when the window changes size.
    //
    // Behaviour:
    //   - First load  → distribute columns proportionally to fill the container
    //   - Window grows/shrinks → scale existing column widths by the same ratio
    //   - Manual column drag → column sizing state takes over; window resize
    //     continues to scale from whatever the user left it at
    //
    // Horizontal scrollbar only appears when the *total* column width exceeds
    // the container (i.e. the user manually dragged a column very wide).
    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;

        const observer = new ResizeObserver(([entry]) => {
            const width = entry.contentRect.width;
            if (width === 0) return;

            // Never scale columns smaller than MIN_TABLE_WIDTH.
            // Below that threshold, columns stay fixed and a scrollbar appears.
            const effectiveWidth = Math.max(width, MIN_TABLE_WIDTH);

            if (prevWidthRef.current === 0) {
                // First paint: fill container proportionally
                table.setColumnSizing(
                    Object.fromEntries(
                        columns.map((col) => [
                            col.id,
                            (col.size / defaultTotalSize) * effectiveWidth
                        ])
                    )
                );
            } else {
                // Subsequent resize: scale current widths by the change ratio.
                // Use effectiveWidth on both sides so columns don't keep
                // shrinking when the window is already below MIN_TABLE_WIDTH.
                const prevEffective = Math.max(prevWidthRef.current, MIN_TABLE_WIDTH);
                const ratio = effectiveWidth / prevEffective;
                const current = table.getState().columnSizing;
                table.setColumnSizing(
                    Object.fromEntries(
                        columns.map((col) => [col.id, (current[col.id] ?? col.size) * ratio])
                    )
                );
            }

            prevWidthRef.current = width;
        });

        observer.observe(el);
        return () => observer.disconnect();
        // table ref is stable; eslint-disable is safe here
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Virtualizer
    const rows = table.getRowModel().rows;

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => scrollContainerRef.current,
        estimateSize: () => 40,
        overscan: 10,
        measureElement: (el) => el?.getBoundingClientRect().height
    });

    const virtualItems = rowVirtualizer.getVirtualItems();
    const paddingTop = virtualItems[0]?.start ?? 0;
    const paddingBottom = rowVirtualizer.getTotalSize() - (virtualItems.at(-1)?.end ?? 0);

    return (
        <div className="flex flex-col h-full">
            {/* Search */}
            <input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search..."
                className="mb-4 p-2 border rounded w-full bg-[var(--surface)] border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)]"
            />

            {/* Scroll container — ref goes here, not on the table */}
            <div ref={scrollContainerRef} className="flex-1 overflow-auto min-h-0">
                {/*
                    width = table.getTotalSize() (sum of all column widths).
                    This means:
                      - When columns fill the window (normal case), no horizontal scroll.
                      - When a column is dragged wider than the window, scroll appears.
                    Do NOT use w-full here — that would ignore the column sizing.
                */}
                <table
                    className="border-collapse"
                    style={{ tableLayout: "fixed", width: table.getTotalSize() }}
                >
                    <thead className="sticky top-0 z-10 bg-[var(--surface)]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        style={{ width: header.getSize() }}
                                        className="relative text-left p-2 border-b border-[var(--border)] cursor-pointer select-none text-[var(--text-dim)]"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <span className="truncate block pr-2">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{ asc: " 🔼", desc: " 🔽" }[
                                                header.column.getIsSorted()
                                            ] ?? ""}
                                        </span>

                                        {/* Resize handle */}
                                        <div
                                            onMouseDown={header.getResizeHandler()}
                                            onTouchStart={header.getResizeHandler()}
                                            onMouseEnter={() => setResizingID(header.id)}
                                            onMouseLeave={() => setResizingID(null)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="absolute right-0 top-[10%] w-1 rounded-sm cursor-col-resize touch-none select-none transition-all duration-200"
                                            style={{
                                                height: "80%",
                                                background:
                                                    header.column.getIsResizing() ||
                                                    resizingID === header.id
                                                        ? "var(--accent)"
                                                        : "var(--border)",
                                                opacity:
                                                    header.column.getIsResizing() ||
                                                    resizingID === header.id
                                                        ? 1
                                                        : 0.3
                                            }}
                                        />
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {/* Top spacer */}
                        {paddingTop > 0 && (
                            <tr>
                                <td
                                    style={{ height: paddingTop, padding: 0 }}
                                    colSpan={columns.length}
                                />
                            </tr>
                        )}

                        {virtualItems.map((virtualRow) => {
                            const row = rows[virtualRow.index];
                            return (
                                <tr
                                    key={row.id}
                                    data-index={virtualRow.index}
                                    ref={rowVirtualizer.measureElement}
                                    className="border-b border-[var(--border)] hover:bg-[var(--surface2)] cursor-pointer"
                                    onClick={() => onOpenReplay(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            style={{ width: cell.column.getSize() }}
                                            className="p-2 text-[var(--text-dim)] truncate"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}

                        {/* Bottom spacer */}
                        {paddingBottom > 0 && (
                            <tr>
                                <td
                                    style={{ height: paddingBottom, padding: 0 }}
                                    colSpan={columns.length}
                                />
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ReplayLibrary;

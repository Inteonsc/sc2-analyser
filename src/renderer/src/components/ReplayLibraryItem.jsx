function ReplayLibraryItem({ replayInfo }) {
    const players = [];
    for (const player of replayInfo.players) {
        if (player !== undefined) {
            if (player.name !== undefined) players.push(player.name);
            else players.push("unknown");
        }
    }
    let winner;
    const winnerID = replayInfo.winner;
    if (winnerID !== undefined)
        winner = `${replayInfo?.players?.[winnerID]?.name ?? "Unknown"} Won`;

    const mins = Math.floor(replayInfo.duration / 60);
    const secs = Math.floor(replayInfo.duration % 60);
    const duration = `${mins}:${secs.toString().padStart(2, "0")}`;
    return (
        <tr className="border border-[var(--border)]">
            <td>{winner}</td>
            <td>{players.join(", ")}</td>
            <td>{replayInfo.map}</td>
            <td>{duration}</td>
            <td>{new Date(replayInfo.date).toLocaleDateString()}</td>
        </tr>
    );
}

export default ReplayLibraryItem;

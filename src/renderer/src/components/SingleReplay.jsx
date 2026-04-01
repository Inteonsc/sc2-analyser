import { useEffect, useState } from "react";
function SingleReplay({ onBack, selectedReplay }) {
    const [fullData, setFullData] = useState(null);

    useEffect(() => {
        window.api.openReplay(selectedReplay.path).then(setFullData);
    }, [selectedReplay.path]);

    if (!fullData) return <div>Loading...</div>;
    return (
        <div className="flex h-full w-full flex-col">
            <button
                onClick={onBack}
                className="self-start rounded bg-[var(--primary)] px-4 py-2 text-white mb-4"
            >
                Back to Library
            </button>
            <div className="flex-1 overflow-auto">
                <h1 className="text-2xl font-bold mb-4">{fullData.basicInfo.map}</h1>
                <pre className="whitespace-pre-wrap">{JSON.stringify(fullData, null, 2)}</pre>
            </div>
        </div>
    );
}

export default SingleReplay;

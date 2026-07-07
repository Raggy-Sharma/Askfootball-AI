import playerSilhouette from "@/assets/silhouette.png"

export function PlayerSilhouette () {

    return (
        <div className="flex flex-col items-center gap-2 animate-pulse">
            <div className="flex items-center justify-center bg-white/10 w-auto h-auto">
                <img src={playerSilhouette} alt="Player loading..." width={'240px'} height={'240px'} />
            </div>
            <div className="h-3 w- rounded bg-white/10" />   {/* name placeholder */}
            <div className="h-2 w-12 rounded bg-white/10" />   {/* rating placeholder */}
            <div className="h-2 w-12 rounded bg-white/10" />   {/* rating placeholder */}
        </div>
    );
}
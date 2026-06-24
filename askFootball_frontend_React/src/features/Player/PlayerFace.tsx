const PLAYER_FACE_CDN_BASE_URL = import.meta.env.VITE_SOFIFA_BASE_URL
export function PlayerFace({ playerId }) {
    const playerIdSplit1 = String(playerId).slice(0, 3)
    const playerIdSplit2 = String(playerId).slice(3, 6)
    const playerFaceUrl = `${PLAYER_FACE_CDN_BASE_URL}${playerIdSplit1}/${playerIdSplit2}/26_90.png`
    return (
        <div className="p-4 m-4">
            <img src={playerFaceUrl} alt={"Alt"} referrerPolicy="no-referrer" />
        </div>
    )
}
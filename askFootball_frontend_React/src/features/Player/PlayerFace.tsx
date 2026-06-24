const PLAYER_FACE_CDN_BASE_URL = import.meta.env.VITE_SOFIFA_BASE_URL
const VITE_PLAYER_FACE_VERSION_AND_DIMENSION = import.meta.env.VITE_PLAYER_FACE_VERSION_AND_DIMENSION
const PlayerFace = ({ playerId }) => {
    const append0: boolean = String(playerId).length < 6;
    const playerIdSplit1 = append0 ? `0${String(playerId).slice(0, 2)}` : String(playerId).slice(0, 3)
    const playerIdSplit2 = append0 ? String(playerId).slice(2, 6) : String(playerId).slice(3, 6)
    const playerFaceUrl = `${PLAYER_FACE_CDN_BASE_URL}${playerIdSplit1}/${playerIdSplit2}/${VITE_PLAYER_FACE_VERSION_AND_DIMENSION}`
    return (
        <div className="p-4 m-2">
            <img src={playerFaceUrl} alt={"Alt"} referrerPolicy="no-referrer" />
        </div>
    )
}

export default PlayerFace;
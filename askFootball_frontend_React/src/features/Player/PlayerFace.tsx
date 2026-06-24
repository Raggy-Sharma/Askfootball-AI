const PLAYER_FACE_CDN_BASE_URL = import.meta.env.VITE_SOFIFA_BASE_URL
const VITE_PLAYER_FACE_VERSION_AND_DIMENSION = import.meta.env.VITE_PLAYER_FACE_VERSION_AND_DIMENSION

type PlayerFaceProps = {
    playerId: number | string
    variant?: 'pitch' | 'default' | 'details'
}

const PlayerFace = ({ playerId, variant = 'default' }: PlayerFaceProps) => {
    const append0: boolean = String(playerId).length < 6
    const playerIdSplit1 = append0 ? `0${String(playerId).slice(0, 2)}` : String(playerId).slice(0, 3)
    const playerIdSplit2 = append0 ? String(playerId).slice(2, 6) : String(playerId).slice(3, 6)
    const playerFaceUrl = `${PLAYER_FACE_CDN_BASE_URL}${playerIdSplit1}/${playerIdSplit2}/${VITE_PLAYER_FACE_VERSION_AND_DIMENSION}`
    const sizeClass = variant === 'pitch' ? 'h-10 w-10' : variant === 'details' ? 'h-34 w-20' : 'h-12 w-12'

    return (
        <div className="shrink-0">
            <img
                src={playerFaceUrl}
                alt=""
                referrerPolicy="no-referrer"
                className={`${sizeClass} rounded-full object-cover`}
            />
        </div>
    )
}

export default PlayerFace

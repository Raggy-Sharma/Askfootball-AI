import { getImageSizeAndStyleClass } from "@/Utils/CommonUtils"
import PLAYER_FACE_LOADER_IMG from "@/assets/silhouette.png"
import { useEffect } from "react"

const PLAYER_FACE_CDN_BASE_URL = import.meta.env.VITE_SOFIFA_BASE_URL
const VITE_PLAYER_FACE_VERSION_AND_DIMENSION = import.meta.env.VITE_PLAYER_FACE_VERSION_AND_DIMENSION

type PlayerFaceProps = {
    playerId: number | string
    variant?: 'pitch' | 'compare' | 'details' | 'default'
    imageDimension?: any,
    isLoading?: boolean
}

const PlayerFace = ({ playerId, variant = 'default', imageDimension=VITE_PLAYER_FACE_VERSION_AND_DIMENSION, isLoading = false }: PlayerFaceProps) => {
    const append0: boolean = String(playerId).length < 6
    const playerIdSplit1 = append0 ? `0${String(playerId).slice(0, 2)}` : String(playerId).slice(0, 3)
    const playerIdSplit2 = append0 ? String(playerId).slice(2, 6) : String(playerId).slice(3, 6)
    const playerFaceUrl = `${PLAYER_FACE_CDN_BASE_URL}${playerIdSplit1}/${playerIdSplit2}/${imageDimension}`
    const sizeClass = getImageSizeAndStyleClass(variant)

    return (
        <div className="shrink-0">
            <img
                src={ isLoading ? PLAYER_FACE_LOADER_IMG : playerFaceUrl}
                alt=""
                referrerPolicy="no-referrer"
                className={`${sizeClass} ${isLoading ? "animate-pulse" : ""} object-cover`}
            />
        </div>
    )
}

export default PlayerFace

import useStore from '@/Store'
// import type { Player } from '@/features/Player/Player.types'
import PlayerFace from './PlayerFace'
import { getCoreAttributes } from '@/Utils/CommonUtils'

const PlayerDetails = () => {
    const selectedPlayer = useStore((state) => state.selectedPlayer)
    if (!selectedPlayer) {
        return null
    }
    const coreAttributes = getCoreAttributes(selectedPlayer.club_position === 'GK' ? selectedPlayer.gk_attributes : selectedPlayer.core_attributes ?? {})
    return (
        <>
            <h2 className="text-md mb-2 font-bold text-center">{selectedPlayer.display_name}</h2>
            <div className="flex flex-row justify-between items-center gap-2 mb-4">
                <PlayerFace playerId={selectedPlayer.player_id} variant="details" />
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold">Age: {selectedPlayer.age}</p>
                    {selectedPlayer.club_position !== 'SUB' && selectedPlayer.club_position !== 'RES' && <p className="text-sm font-bold">Position: {selectedPlayer.club_position}</p>}
                    <p className="text-sm font-bold">Overall: {selectedPlayer.overall}</p>
                    <p className="text-sm font-bold">Potential: {selectedPlayer.potential}</p>
                </div>
            </div>
            {(selectedPlayer.club_position === 'SUB' || selectedPlayer.club_position === 'RES') && (
                <p className="text-sm font-bold mb-4">
                    Positions: {selectedPlayer.positions.split(', ').join(' | ')}
                </p>
            )}
            <div className="grid grid-cols-2 gap-4">
                {
                    Object.keys(coreAttributes).map((key) => (
                        <p className="text-sm font-bold" key={`${selectedPlayer.player_id}-${key}`}>{key}: {coreAttributes[key]}</p>
                    ))
                }
            </div>
        </>
    )
}

export default PlayerDetails
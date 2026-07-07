import { useMemo } from 'react'
import PlayerFace from '@/features/Player/PlayerFace'
import useStore from '@/Store'
import { placePlayersOnPitch } from '@/Utils/CommonUtils'
import PitchMarkings from './PitchMarkings'

const SquadLayout = () => {
    const startingXI = useStore((state) => state.selectedClubStartingXI) ?? []
    const placed = useMemo(() => placePlayersOnPitch(startingXI), [startingXI])
    const setSelectedPlayer = useStore((state) => state.setSelectedPlayer)
    const selectedPlayer = useStore((state) => state.selectedPlayer)

    return (
        <div className="relative h-full min-h-0 w-full">
            <PitchMarkings />
            <div className="relative grid h-full min-h-0 w-full grid-cols-5 grid-rows-[repeat(8,minmax(0,1fr))] gap-1">
                {placed.map(({ player, slot }) => {
                    const isSelected = selectedPlayer?.player_id === player.player_id
                    return (
                        <div
                            key={player.player_id}
                            className={`flex min-h-0 cursor-pointer flex-col items-center justify-center gap-0.5 overflow-hidden rounded-md transition-all hover:scale-105 ${
                                isSelected ? 'bg-white/10' : ''
                            }`}
                            style={{ gridRow: slot.row, gridColumn: slot.col }}
                            onClick={() => setSelectedPlayer(player)}
                        >
                            <PlayerFace playerId={player.player_id} variant="pitch" />
                            <span className="max-w-full truncate text-center text-[0.625rem] font-medium leading-tight">
                                {player.display_name}
                            </span>
                            <span className="text-[0.6rem] uppercase leading-none opacity-70">
                                {player.club_position}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SquadLayout
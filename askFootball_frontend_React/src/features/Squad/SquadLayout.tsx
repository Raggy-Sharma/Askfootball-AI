import { useMemo } from 'react'
import { PlayerFace } from '@/features/Player/PlayerFace'
import useStore from '@/Store'
import { placePlayersOnPitch } from '@/Utils/CommonUtils'

const SquadLayout = () => {
    const startingXI = useStore((state) => state.selectedClubStartingXI) ?? []
    const placed = useMemo(() => placePlayersOnPitch(startingXI), [startingXI])

    return (
        <div className="grid h-full min-h-0 w-full grid-cols-5 grid-rows-8 gap-2">
            {placed.map(({ player, slot }) => (
                <div
                    key={player.player_id}
                    className="flex min-h-0 flex-col items-center justify-center"
                    style={{ gridRow: slot.row, gridColumn: slot.col }}
                >
                    <PlayerFace playerId={player.player_id} />
                    <span className="text-xs font-medium">{player.display_name}</span>
                    <span className="text-[10px] uppercase opacity-70">{player.club_position}</span>
                </div>
            ))}
        </div>
    )
}

export default SquadLayout

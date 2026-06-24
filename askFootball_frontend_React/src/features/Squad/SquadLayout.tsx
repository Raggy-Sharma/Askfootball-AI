import { useMemo } from 'react'
import pitchBg from '@/assets/AskFootballPitchBG.png'
import PlayerFace from '@/features/Player/PlayerFace'
import useStore from '@/Store'
import { placePlayersOnPitch } from '@/Utils/CommonUtils'

const SquadLayout = () => {
    const startingXI = useStore((state) => state.selectedClubStartingXI) ?? []
    const placed = useMemo(() => placePlayersOnPitch(startingXI), [startingXI])
    const setSelectedPlayer = useStore((state) => state.setSelectedPlayer)

    return (
        <div
            className="grid h-full min-h-0 w-full grid-cols-5 grid-rows-[repeat(8,minmax(0,1fr))] gap-1"
            style={{
                backgroundImage: `url(${pitchBg})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {placed.map(({ player, slot }) => (
                <div
                    key={player.player_id}
                    className="flex min-h-0 flex-col items-center justify-center gap-0.5 overflow-hidden cursor-pointer"
                    style={{ gridRow: slot.row, gridColumn: slot.col }}
                    onClick={() => setSelectedPlayer(player)}
                >
                    <PlayerFace playerId={player.player_id} variant="pitch" />
                    <span className="max-w-full truncate text-center text-[10px] font-medium leading-tight">
                        {player.display_name}
                    </span>
                    <span className="text-[9px] uppercase leading-none opacity-70">
                        {player.club_position}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default SquadLayout

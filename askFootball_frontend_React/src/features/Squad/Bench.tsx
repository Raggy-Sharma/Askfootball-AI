import useStore from '@/Store';
import PlayerFace from '@/features/Player/PlayerFace';
const Bench = () => {
    const selectedClubBench = useStore((state) => state.selectedClubBench);
    const setSelectedPlayer = useStore((state) => state.setSelectedPlayer);
    return (
        <div className="flex h-full min-h-0 flex-col">
            <h2 className="mb-2 shrink-0 text-sm font-bold">Substitues and Reserves</h2>
            <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                    {selectedClubBench?.map((player) => (
                        <div key={player.player_id} className="flex flex-col items-center justify-center cursor-pointer" onClick={() => setSelectedPlayer(player)}>
                            <PlayerFace playerId={player.player_id} />
                            <span className="text-xs font-medium">{player.display_name}</span>
                            <span className="text-[10px] uppercase opacity-70">{player.club_position}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Bench;
import useStore from '@/Store';
import PlayerFace from '@/features/Player/PlayerFace';
const Bench = () => {
    const selectedClubBench = useStore((state) => state.selectedClubBench);
    return (
        <div>
            <h1>Substitues and Reserves</h1>
            <div className="grid grid-cols-2 gap-2 overflow-y-auto">
                {selectedClubBench?.map((player) => (
                    <div key={player.player_id} className="flex flex-col items-center justify-center">
                        <PlayerFace playerId={player.player_id} />
                        <span className="text-xs font-medium">{player.display_name}</span>
                        <span className="text-[10px] uppercase opacity-70">{player.club_position}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Bench;
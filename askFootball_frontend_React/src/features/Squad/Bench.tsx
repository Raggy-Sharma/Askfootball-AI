import useStore from '@/Store';
import PlayerFace from '@/features/Player/PlayerFace';

const Bench = () => {
    const selectedClubBench = useStore((state) => state.selectedClubBench);
    const setSelectedPlayer = useStore((state) => state.setSelectedPlayer);
    const selectedPlayer = useStore((state) => state.selectedPlayer);

    return (
        <div className="flex h-full min-h-0 flex-col">
            <h2 className="mb-2 shrink-0 text-xs font-bold uppercase tracking-wide opacity-70">
                Bench
            </h2>
            <div className="min-h-0 flex-1 overflow-x-auto">
                <div className="flex h-full gap-3">
                    {selectedClubBench?.map((player) => {
                        const isSelected = selectedPlayer?.player_id === player.player_id;
                        return (
                            <div
                                key={player.player_id}
                                onClick={() => setSelectedPlayer(player)}
                                className={`flex w-20 shrink-0 cursor-pointer flex-col items-center justify-start gap-1 rounded-md p-2 transition-all hover:scale-105 ${
                                    isSelected ? 'bg-white/10 ring-1 ring-white/30' : ''
                                }`}
                            >
                                <PlayerFace playerId={player.player_id} variant="pitch" />
                                <span className="max-w-full truncate text-center text-[11px] font-medium leading-tight">
                                    {player.display_name}
                                </span>
                                <span className="text-[9px] uppercase leading-none opacity-70">
                                    {player.club_position}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Bench;
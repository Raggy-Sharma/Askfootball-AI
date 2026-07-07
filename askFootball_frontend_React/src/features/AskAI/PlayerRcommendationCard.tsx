import useStore from '@/Store';
import PlayerFace from '@/features/Player/PlayerFace';

const PlayerRecommendationCard = ({ player }: { player: any }) => {
  const setSelectedPlayer = useStore(s => s.setSelectedPlayer);
  return (
    <div onClick={() => setSelectedPlayer(player)}
      className="flex w-24 shrink-0 cursor-pointer flex-col items-center gap-1 rounded-md p-2 hover:scale-105 hover:bg-white/10 transition-all">
      <PlayerFace playerId={player.player_id} variant="pitch" />
      <span className="truncate max-w-full text-center text-[11px] font-medium">{player.display_name}</span>
      <span className="text-[10px] opacity-70">{player.overall} | {player.club_position}</span>
    </div>
  );
};

export default PlayerRecommendationCard;
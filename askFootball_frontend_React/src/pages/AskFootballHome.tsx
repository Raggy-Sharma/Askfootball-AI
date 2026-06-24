import { ClubSelector } from '@/features/Clubs/ClubSelector'
import PageHeader from '../features/PageHeader/PageHeader'
import Bench from '@/features/Squad/Bench'
import { FullSquad } from '@/features/Squad/FullSquad'
import useStore from '@/Store'
import PlayerDetails from '@/features/Player/PlayerDetails'

const AskFootballHome = () => {
  const selectedClub = useStore((state) => state.selectedClub)
  const selectedPlayer = useStore((state) => state.selectedPlayer)
  return (
    <div className="flex h-screen flex-col">
      <PageHeader />
      <div
        id="askfootball-home-container"
        className={`${selectedClub ? 'grid grid-cols-[1fr_4fr_1fr]' : 'flex flex-row items-center justify-center'} min-h-0 flex-1 gap-4 overflow-hidden p-4`}
      >
        <div className="flex h-full min-h-0 flex-col gap-2 overflow-hidden">
          <div className="shrink-0 rounded-md p-4">
            <ClubSelector />
          </div>
          {selectedClub && (
            <div className="min-h-0 flex-1 overflow-hidden rounded-md p-4">
              <Bench />
            </div>
          )}
        </div>
        {selectedClub && (
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-md p-4">
            <FullSquad />
          </div>
        )}
        {selectedPlayer && (
          <div className="min-h-0 overflow-hidden rounded-md p-4">
            <PlayerDetails />
          </div>
        )}
      </div>
    </div>
  )
}

export default AskFootballHome

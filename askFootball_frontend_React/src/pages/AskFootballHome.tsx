import { ClubSelector } from '@/features/Clubs/ClubSelector'
import PageHeader from '../features/PageHeader/PageHeader'
import { FullSquad } from '@/features/Squad/FullSquad'
import useStore  from '../Store'
const AskFootballHome = () => {
  const selectedClub = useStore((state) => state.selectedClub)
  return (
    <div className="flex h-screen flex-col">
      <PageHeader />
      <div
        id="askfootball-home-container"
        className={` ${selectedClub ? 'grid grid-cols-[1fr_4fr_1fr]' : 'flex flex-row justify-center items-center'}  min-h-0 flex-1  gap-4 p-4`}
      >
        <div className="min-h-0 overflow-hidden rounded-md p-4">
          <ClubSelector />
        </div>
        {selectedClub && <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-md p-4">
          <FullSquad />
        </div>}
        {selectedClub && <div className="min-h-0 overflow-hidden rounded-md p-4">
          {selectedClub.club_name} top player details loading...
        </div>}
      </div>
    </div>
  )
}

export default AskFootballHome

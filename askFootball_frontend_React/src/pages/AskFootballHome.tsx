import { ClubSelector } from '@/features/Clubs/ClubSelector'
import PageHeader from '../features/PageHeader/PageHeader'
import Bench from '@/features/Squad/Bench'
import { FullSquad } from '@/features/Squad/FullSquad'
import useStore from '@/Store'
import PlayerDetails from '@/features/Player/PlayerDetails'
import AskAI from '@/features/AskAI/AskAI'
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { useShallow } from 'zustand/react/shallow';

const AskFootballHome = () => {
  const selectedClub = useStore((state) => state.selectedClub)
  const selectedPlayer = useStore((state) => state.selectedPlayer)
  const isEdit = useStore((state) => state.isEdit);
  const isAiChatActive = useStore(state => state.isAiChatActive)
  
  const setIsEdit = useStore(state => state.setIsEdit);
  return (
    <div className="flex h-screen flex-col">
      <PageHeader />
      <div>
        {
          isEdit ? 
          <div className='w-1/4 my-4 ml-4'>
            <ClubSelector />
          </div>
           : 
          <div className='flex spacearound items-center'>
            <h2 className='text-md font-bold p-4'>{selectedClub.club_name}</h2>
            <EditTwoToneIcon onClick={() => setIsEdit(!isEdit)} className='cursor-pointer size-2'/>
          </div>

        }
      </div>
      <div
        id="askfootball-home-container"
        className={`${selectedClub ? isAiChatActive ? 'grid grid-cols-[0fr_3fr] transition duration-300 ease-in-out' :  'grid grid-cols-[3fr_1fr] transition duration-800 ease-in-out' : 'flex flex-row items-center justify-center'} min-h-0 flex-1 gap-4 overflow-hidden p-4`}
      >
        
        {selectedClub && (
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-md p-4">
            <FullSquad />
          </div>
        )}
        {selectedPlayer && (
          <div className={`${ isAiChatActive ? 'flex h-full min-h-0 flex-row' :  'flex h-full min-h-0 flex-col'}  overflow-hidden rounded-md`}>
            <div className="min-h-0 overflow-hidden rounded-md p-4">
              <PlayerDetails />
            </div>
            <div className="min-h-0 overflow-hidden rounded-md p-4 w-3/4">
              <AskAI />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AskFootballHome

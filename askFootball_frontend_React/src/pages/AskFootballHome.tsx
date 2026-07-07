import { ClubSelector } from '@/features/Clubs/ClubSelector'
import PageHeader from '../features/PageHeader/PageHeader'
import Bench from '@/features/Squad/Bench'
import { FullSquad } from '@/features/Squad/FullSquad'
import useStore from '@/Store'
import PlayerDetails from '@/features/Player/PlayerDetails'
import AskAI from '@/features/AskAI/AskAI'
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { useEffect } from 'react'

const AskFootballHome = () => {
  const selectedClub = useStore((state) => state.selectedClub)
  const selectedPlayer = useStore((state) => state.selectedPlayer)
  const isEdit = useStore((state) => state.isEdit);
  const isAiChatActive = useStore(state => state.isAiChatActive)
  
  const setIsEdit = useStore(state => state.setIsEdit);
  return (
    <>
      {!selectedClub ? (
        <div className="flex min-h-0 flex-1 p-5 h-dvh">
          {/* LEFT: club selector */}
          <div className="flex w-2/5 flex-col justify-center px-10">
            <h2 className="mb-2 text-2xl font-semibold">Choose your club</h2>
            <p className="mb-6 text-sm opacity-70">
              Pick a team to explore its squad, formation, and get AI-powered tactical analysis.
            </p>
            <div className="w-full max-w-sm">
              <ClubSelector />
            </div>
          </div>

          {/* RIGHT: app pitch */}
          <div className="flex w-3/5 flex-col justify-center px-12">
            <h1 className="mb-3 text-4xl font-bold">AskFootball AI</h1>
            <p className="mb-8 text-lg opacity-80">
              Your intelligent companion for EA FC 26 Career Mode.
            </p>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-1">⚽</span>
                <span><strong>See your squad in formation.</strong> View any club's starting XI laid out on the pitch, just like in-game.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1">🔍</span>
                <span><strong>Scout transfer targets.</strong> Ask the AI to find signings that fit your tactics, budget, and squad gaps.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1">🧠</span>
                <span><strong>Tactical analysis, grounded in data.</strong> Every recommendation is based on real player attributes, roles, and playstyles.</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
      <div className="flex h-screen flex-col bg-gradient-to-br from-[#0a1a2f] via-[#0d1117] to-[#0a0f1a] text-white">
        <PageHeader />
        <div>
          {
            isEdit ? 
            <div className='w-1/4 my-4 ml-4'>
              <ClubSelector />
            </div>
            : 
            <div className='flex spacearound items-center'>
              <h2 className='text-md font-bold p-4'>{selectedClub?.club_name}</h2>
              <EditTwoToneIcon onClick={() => setIsEdit(!isEdit)} className='cursor-pointer size-2'/>
            </div>

          }
        </div>
        <div
          id="askfootball-home-container"
          className={`${selectedClub ? isAiChatActive ? 'grid grid-cols-[0fr_3fr] transition duration-300 ease-in-out' :  'grid grid-cols-[3fr_1fr] transition duration-800 ease-in-out' : 'flex flex-row items-center justify-center'} min-h-0 flex-1 gap-4 overflow-hidden p-4`}
        >
          
          {selectedClub && (
            <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden rounded-md p-4">
              {/* Pitch takes the available space */}
              <div className="min-h-0 flex-1 overflow-hidden">
                <FullSquad />
              </div>
              {/* Bench strip — fixed height, only when NOT in AI chat mode */}
              {!isAiChatActive && (
                <div className="h-32 shrink-0 overflow-hidden">
                  <Bench />
                </div>
              )}
            </div>
          )}
          {selectedPlayer && (
            <div className={`${ isAiChatActive ? 'flex h-full min-h-0 flex-row' :  'flex h-full min-h-0 flex-col'}  overflow-hidden rounded-md`}>
              <div className="min-h-0 overflow-hidden rounded-md p-4">
                <PlayerDetails playerDetails={selectedPlayer}>
                  <div className="flex items-center justify-between mb-4">
                    <PlayerDetails.RatingPosition />
                    <div className="w-1/2"><PlayerDetails.Positions /></div>
                  </div>
                  <PlayerDetails.Title titleString={selectedPlayer.display_name} titleSize={"text-md font-extrabold"}/>
                  <div className="flex items-start justify-around gap-10">
                    <div className="flex flex-col gap-4 items-center w-1/2">
                      <PlayerDetails.PlayerFace variant="details" />
                      <PlayerDetails.Bio variant="details" textSize={"text-[9px]"}/>
                    </div>
                    <PlayerDetails.Summary />
                  </div>
                </PlayerDetails>
              </div>
              <div className="min-h-0 overflow-hidden rounded-md p-4 w-3/4">
                <AskAI />
              </div>
            </div>
          )}
        </div>
      </div>
    )}
    </>
  )
}

export default AskFootballHome

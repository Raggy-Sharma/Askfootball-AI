import { useEffect } from 'react'
import { useSquad } from './Squad.queries'
import useStore from '../../Store'
import SquadLayout from './SquadLayout'

export function Squad() {
    const selectedClub = useStore((state) => state.selectedClub)
    const setSelectedClubStartingXI = useStore((state) => state.setSelectedClubStartingXI)
    const setSelectedClubBench = useStore((state) => state.setSelectedClubBench)
    const setSelectedClubPlayers = useStore((state) => state.setSelectedClubPlayers)
    const { club_id: clubId, club_name: clubName } = selectedClub!
    const { data: squadData, isLoading, error } = useSquad(clubId)
    const playersList = squadData?.players
    const startingPlayersList = playersList?.filter(player => player.club_position !== 'SUB' && player.club_position !== 'RES')
    const startingXISet = new Set(startingPlayersList)
    const benchPlayersList = playersList?.filter(player => !startingXISet.has(player))

    useEffect(() => {
        setSelectedClubPlayers(playersList ?? [])
        setSelectedClubStartingXI(startingPlayersList ?? [])
        setSelectedClubBench(benchPlayersList ?? [])
    }, [playersList, startingPlayersList, benchPlayersList, setSelectedClubPlayers, setSelectedClubStartingXI, setSelectedClubBench])
    if(isLoading) return <div>Loading {clubName} squad...</div>
    if(error) return <div>Error loading {clubName} squad: {error.message}</div>
    return (
        <div className="flex h-full min-h-0 w-full flex-col">
            <h1 className="mb-2 shrink-0 text-lg font-semibold">{clubName} Starting XI</h1>
            <div className="min-h-0 flex-1">
                <SquadLayout />
            </div>
        </div>
    )
}

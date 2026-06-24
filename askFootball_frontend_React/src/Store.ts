import { create } from 'zustand'
import type { Club } from '@/features/Clubs/Clubs.types'
import type { Player } from '@/features/Player/Player.types'

type Store = {
    selectedClub: Club | null,
    setSelectedClub: (club: Club) => void,
    selectedClubStartingXI: Player[] | null,
    setSelectedClubStartingXI: (startingXI: Player[]) => void,
    selectedClubBench: Player[] | null,
    setSelectedClubBench: (bench: Player[]) => void,
    selectedClubPlayers: Player[] | null,
    setSelectedClubPlayers: (players: Player[]) => void,
}

const useStore = create<Store>((set) => ({
    selectedClub: null,
    setSelectedClub: (club: Club) => set({ selectedClub: club }),
    selectedClubStartingXI: null,
    setSelectedClubStartingXI: (startingXI: Player[]) => set({ selectedClubStartingXI: startingXI }),
    selectedClubBench: null,
    setSelectedClubBench: (bench: Player[]) => set({ selectedClubBench: bench }),
    selectedClubPlayers: null,
    setSelectedClubPlayers: (players: Player[]) => set({ selectedClubPlayers: players }),
}))

export default useStore
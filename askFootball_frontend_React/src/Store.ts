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
    selectedPlayer: Player | null,
    setSelectedPlayer: (player: Player | null) => void,
    isEdit: boolean,
    setIsEdit: (isEdit: boolean) => void
    isAiChatActive: boolean,
    setIsAIChatActive: (isAiChatActive: boolean) => void,
    askAIConversation: any,
    setAskAICoversation: (askAIConversation: any) => void
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
    selectedPlayer: null,
    setSelectedPlayer: (player: Player | null) => set({ selectedPlayer: player }),
    isEdit: true,
    setIsEdit: (isEdit: boolean) => set({ isEdit }),
    isAiChatActive: false,
    setIsAIChatActive: (isAiChatActive: boolean) => set({ isAiChatActive }),
    askAIConversation: [],
    setAskAICoversation: (askAIConversation: any) => set({ askAIConversation }),

}))

export default useStore
import { useQuery } from '@tanstack/react-query'
import { fetchSquad } from './Squad.api'

export const useSquad = (clubId: number) => {
    return useQuery({
        queryKey: ['squad', clubId],
        queryFn: () => fetchSquad(clubId),
        staleTime: Infinity,
    })
}
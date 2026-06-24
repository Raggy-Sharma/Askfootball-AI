import { useQuery } from '@tanstack/react-query'
import { fetchClubs } from './Clubs.api'

export const useClubs = (limit: number = undefined, offset: number = undefined) => {
    return useQuery({
        queryKey: ['clubs'],
        queryFn: () => fetchClubs(limit, offset),
    })
}
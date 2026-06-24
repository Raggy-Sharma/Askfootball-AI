import { http } from '../../lib/api/http'

export const fetchSquad = async (clubId: number) => {
    const response = await http<any>(`/clubs/${clubId}/squad/detailed`)
    return response.data
}
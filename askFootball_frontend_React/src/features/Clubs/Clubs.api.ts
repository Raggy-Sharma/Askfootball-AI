import { http } from "../../lib/api/http"
import type {Club} from './Clubs.types'

export const fetchClubs = async (limit: number = undefined, offset: number = undefined) => {
    const response = await http<{ data: Club[], count: number }>(`/clubs${limit ? `?limit=${limit}` : ''}${offset ? `&offset=${offset}` : ''}`)
    return response.data
}   
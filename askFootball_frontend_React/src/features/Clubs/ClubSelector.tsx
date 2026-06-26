import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'
import { useClubs } from './Clubs.queries'
import type { Club } from './Clubs.types'
import useStore from '../../Store'

export function ClubSelector() {
    const { data: clubsData, isLoading, error } = useClubs(50, 0)
    const setIsEdit = useStore(state => state.setIsEdit)
    const selectedClub = useStore((state) => state.selectedClub)
    const setAskAIConversation = useStore(state => state.setAskAICoversation)

    const setSelectedClub = useStore((state) => state.setSelectedClub)

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    const handleClubChange = (value: string) => {
        setIsEdit(value && false)
        setAskAIConversation([]);
        const selectedClub = clubsData?.find((club: Club) => club.club_name === value) ?? null
        setSelectedClub(selectedClub as Club)
    }

    return (
        <div className={`max-h-full overflow-y-auto flex-col gap-4  ${selectedClub ? 'justify-between items-center' : 'justify-center items-center'}`}>
            <Combobox items={clubsData} onValueChange={(value: string) => handleClubChange(value)}>
                <ComboboxInput placeholder="Select a club" />
                    <ComboboxContent>
                        {isLoading ? <ComboboxEmpty>Loading...</ComboboxEmpty> : <ComboboxEmpty>No items found.</ComboboxEmpty>}
                        <ComboboxList>
                        {(item) => (
                            <ComboboxItem key={item.club_id} value={item.club_name}>
                                {item.club_name}
                            </ComboboxItem>
                        )}
                        </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </div>
    )
}
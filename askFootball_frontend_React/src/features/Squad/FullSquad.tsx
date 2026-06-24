import pitchBg from '@/assets/AskFootballPitchBG.png'
import { Squad } from './Squad'

export function FullSquad() {
    return (
        <div className="flex h-full min-h-0 flex-col gap-4" style={{ backgroundImage: `url(${pitchBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
            <Squad />
        </div>
    )
}
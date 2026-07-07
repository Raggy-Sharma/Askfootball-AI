import ReactMarkdown from "react-markdown";
import useStore from "@/Store";
import PlayerRecommendationCard from "@/features/AskAI/PlayerRcommendationCard";
import type { Player } from '@/features/Player/Player.types'
import { Badge } from "@/components/ui/badge"
import { ComparePlayersDrawer } from "@/features/ComparePlayers/ComparePlayersModal"
import { useEffect } from "react";

export function RenderAIResponse ({ markdownText, refenrencedPlayers, follwupQuestions, followupQuestionClick, playerNameClick }) {
    useEffect(() => {
        console.log('refenrencedPlayers', refenrencedPlayers);
    }, refenrencedPlayers.length)    
    const selectedClubPlayers = useStore(state => state.selectedClubPlayers);

    const handlePlayerNameClick = (playerId: number) => {
        const selectedPlayer = selectedClubPlayers.filter((player: Player) => player.player_id === playerId)
        playerNameClick(selectedPlayer)
    };
    const markdownComponents = {
        p: ({ href, children }: any) => {
            if (typeof href === "string" && href.startsWith("afplayer:")) {
                const id = Number(href.slice("afplayer:".length));
                return (
                    <span
                        className="cursor-pointer font-semibold underline decoration-dotted underline-offset-2 hover:opacity-80"
                        onClick={() => handlePlayerNameClick(id)}
                    >
                        {children}
                    </span>
                );
            }
            return <span>{children}</span>;
        },
    };
    const handleFollowUpClick = (question: string, followupType: "comparePlayers" | "squadFit") => {
        followupQuestionClick(question, followupType)
    }
    return (
        <div className="flex flex-col gap-4 justify-center w-full">
            <>
                <ReactMarkdown components={markdownComponents}>
                    {markdownText}
                </ReactMarkdown>
            </>
            <div className="w-full flex overflow-x-auto min-w-0">
                {
                    refenrencedPlayers.map((player: Player) => <PlayerRecommendationCard player={player} />)
                }
            </div>
            <div className="w-full flex flex-row gap-5">
                {
                    follwupQuestions?.map((question, index) => (
                        question?.trim()?.toLowerCase()?.includes("compare") ? <ComparePlayersDrawer referencedPlayers={refenrencedPlayers}><Badge key={`followup-question-${index}`} variant="outline" className="p-4 cursor-pointer opacity-70 hover:scale-105 hover:opacity-100 transition-all duration-300" onClick={() => handleFollowUpClick(question, "comparePlayers")}>{question}</Badge></ComparePlayersDrawer> :
                        <Badge key={`followup-question-${index}`} variant="outline" className="p-4 cursor-pointer opacity-70 hover:scale-105 hover:opacity-100 transition-all duration-300" onClick={() => handleFollowUpClick(question, undefined)}>{question}</Badge>
                    ))
                }
            </div>
        </div>
    )
}
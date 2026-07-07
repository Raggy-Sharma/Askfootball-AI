import useStore from "@/Store";
import { RenderAIResponse } from "../AskAI/RenderAIResponse";
import PlayerDetails from "../Player/PlayerDetails";
import { useEffect } from "react";
import { PlayerSilhouette } from "../Player/PlayerSilhouette";
import { toTitleCase } from "@/Utils/CommonUtils"
export function ComparePlayersAILayout ({referencedPlayers}) {
    const isComparePlayersPending = useStore(state => state.isComparePlayersPending)
    const comparePlayersThread = useStore(state => state.comparePlayersThread) ?? []
    useEffect(() => {
        console.log('referencedPlayers from ComparePlayersAILayout', referencedPlayers)
    }, referencedPlayers.length)

    useEffect(() => {
        console.log("isComparePlayersPending", isComparePlayersPending);
    })
    
    return (
        <div className="flex flex-row w-full justify-center items-center h-full p-5 gap-10">
            <div className="w-1/3 h-full relative flex h-full min-h-0 flex-col border border-gray-300 rounded-md overflow-y-auto p-5">
                {
                    comparePlayersThread?.map((item, index) => 
                        <div key={`${item?.type}-${index}`}>
                            {
                                item?.type === "question" && 
                                <p className="mb-2 shrink-0 text-xs font-medium uppercase tracking-wide text-gray-500">{item.conversation}</p>
                            }
                            {
                                item?.type === "response" && 
                                <RenderAIResponse markdownText={item.conversation} refenrencedPlayers={item.referencedPlayers} follwupQuestions={item.followUps} playerNameClick={undefined} followupQuestionClick={undefined} />
                            }
                        </div>
                    )
                }
                {
                    isComparePlayersPending && <p className="text-left text-sm text-gray-500 mb-4 animate-pulse scroll-mb-[5px]" >Deriving comparison...</p>
                }
            </div>
            <div className="w-2/3 p-5 flex flex-row gap-5 justify-between">
                {
                    isComparePlayersPending ? 
                        <>
                            <div className="w-[240px] h-[240px]">
                                <PlayerSilhouette />
                            </div>
                            <div className="w-[240px] h-[240px]">
                                <PlayerSilhouette />
                            </div> 
                        </> :
                    comparePlayersThread[1]?.referencedPlayers?.map(player => (
                        <div className="w-1/2 h-100">
                            <PlayerDetails playerDetails={player}>
                                <div className="grid grid-cols-3">
                                    <div className="flex flex-col gap-4">
                                        <div className="text-4xl font-bold">
                                            {player.overall} | {player.positions}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">{player.display_name}</p> | <p className="text-xs">{player.nationality}</p>
                                        </div>
                                    </div>
                                    <div className="col-span-2 justify-self-center">
                                        <PlayerDetails.PlayerFace variant={"compare"} imageDimension={"26_240.png"}/>
                                    </div>
                                </div>
                            </PlayerDetails>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
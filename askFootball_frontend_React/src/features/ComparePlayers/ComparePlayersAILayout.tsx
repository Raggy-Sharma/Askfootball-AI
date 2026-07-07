import useStore from "@/Store";
import { RenderAIResponse } from "../AskAI/RenderAIResponse";
import PlayerDetails from "../Player/PlayerDetails";
import { useEffect } from "react";
import { PlayerSilhouette } from "../Player/PlayerSilhouette";
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
                        <div className="w-1/2" key={player.player_id}>
                            <PlayerDetails playerDetails={player}>
                                {/* Top row: rating/position (left) + positions box (right) */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex flex-col gap-4">
                                        <PlayerDetails.RatingPosition />
                                        <PlayerDetails.NameAndCountry titleSize={"text-3xl font-bold"} showFulName={true}/>
                                    </div>
                                    <div className="w-auto">
                                        <PlayerDetails.Positions />
                                    </div>
                                </div>
                    
                                {/* Name/country (left) + face (right) */}
                                <div className="flex items-center justify-between mb-4 gap-4">
                                    <div className="flex flex-col gap-10 w-1/2">
                                        <PlayerDetails.Summary />
                                        <div className="flex flex-col gap-3 rounded-md border border-green-400/40 bg-green-400/5 p-3">
                                            <PlayerDetails.MarketInfo />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4 w-1/2">
                                        <PlayerDetails.PlayerFace variant="compare" imageDimension="26_240.png" />
                                        <PlayerDetails.Bio textSize={"text-xs"} variant="compare"/>
                                        <PlayerDetails.SkillMoves />
                                        <PlayerDetails.WeakFoot />
                                        <PlayerDetails.Playstyles />
                                    </div>
                                </div>
                    
                                {/* Bio row */}
                                <div className="mb-4">
                                </div>
                    
                                {/* Summary (left) + Skills/Weakfoot/Playstyles/Market (right) */}
                                <div className="grid grid-cols-2 gap-4">
                                </div>
                            </PlayerDetails>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
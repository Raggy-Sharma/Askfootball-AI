import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAskAI } from "./AskAI.queries"
import useStore from "@/Store";
import { useEffect, useState, useRef } from "react";
import { SendSharp } from "@mui/icons-material";
import { getContextualQuestions } from "@/Utils/CommonUtils";
import { RenderAIResponse } from "./RenderAIResponse";
import type { Player } from "../Player/Player.types";


const AskAI = () => {
    const selectedClub = useStore((state) => state.selectedClub)
    const { mutate, isPending, isError, error } = useAskAI();
    const [followUpQuestion, setFollowUpQuestion] = useState<string>("")
    const [selectedQuestion, setSelectedQuestion] = useState<string>("")
    const selectedPlayer = useStore((state) => state.selectedPlayer)
    const setIsAIChatActive = useStore(state => state.setIsAIChatActive)
    const askAIConversation = useStore(state => state.askAIConversation);
    const setAskAIConversation = useStore(state => state.setAskAICoversation);
    const isAiChatActive = useStore(state => state.isAiChatActive)
    const setSelectedPlayer = useStore(state => state.setSelectedPlayer)
    const setIsComparePlayersPending = useStore(state => state.setIsComparePlayersPending)
    const setComparePlayersThread = useStore(state => state.setComparePlayersThread)
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => { 
        setSelectedQuestion("");
    }, [selectedPlayer]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [askAIConversation.length]);
    const handleQuestionClick = (question: {key: string, displayValue: string, value: string}) => {
        const questionId = crypto.randomUUID()
        setAskAIConversation([...askAIConversation, {id: `question-${questionId}`, type: "question", conversation: question.value}]);
        setIsAIChatActive(true)
        const normalizeQuestion = question.value.replace("this player",  `${selectedPlayer?.display_name}`).replace("this team",  `${selectedClub.club_name}`).replace("this squad", `${selectedClub.club_name}`)
        setSelectedQuestion(normalizeQuestion);
        mutate(normalizeQuestion, {
            onSuccess: (data: {response: string, referenced_players: Player[], follow_ups: string[]}) => {
              const responseId = crypto.randomUUID()
              setAskAIConversation([...askAIConversation, {id: `question-${questionId}`, type: "question", conversation: question.value}, {id: `response-${responseId}`, type: "response", conversation: data.response, referencedPlayers: data.referenced_players, followUps: data.follow_ups}])
            }
        });
    }

    const handleSendFollowup = (followupQuestionFromTag?: string, followupQuestionType?: "comparePlayers" | "squadFit" | undefined ) => {
        const question = followupQuestionFromTag ? followupQuestionFromTag?.trim() : followUpQuestion.trim();
        let compareThread = []
        if (!question) return;
        const questionId = crypto.randomUUID()
        if(followupQuestionType === "comparePlayers") {
            setIsComparePlayersPending(true)
            compareThread = [...compareThread, {id: questionId, type: "question", conversation: question}]
            setComparePlayersThread([...compareThread])
        }
        setAskAIConversation([...askAIConversation, {id: `question-${questionId}`, type:"question", conversation: question}])
        setFollowUpQuestion("");
        mutate(question, {
            onSuccess: (data: {response: string, referenced_players: Player[], follow_ups: string[]}) => {
                const responseId = crypto.randomUUID()
                if(followupQuestionType === "comparePlayers") {
                    setIsComparePlayersPending(false)
                    setComparePlayersThread([...compareThread, {id: `response-${responseId}`, type: "response", conversation: data.response, referencedPlayers: data.referenced_players, followUps: data.follow_ups}])
                } 
                setAskAIConversation([...askAIConversation, {id: `question-${questionId}`, type:"question", conversation: question}, {id: `response-${responseId}`, type: "response", conversation: data.response, referencedPlayers: data.referenced_players, followUps: data.follow_ups}])
            }
        });
    }
    if (isError) {
        return <p className="text-center text-sm text-red-500">Error: {error.message}</p>
    }
    const questions = selectedPlayer
    ? getContextualQuestions(selectedPlayer.club_position)
    : [];

    return (
        <div className="flex flex-col h-full">
            <h2 className="mb-3 shrink-0 text-center text-lg font-bold">Ask AI</h2>
            <div className="flex h-full min-h-0 flex-1 flex-col">

                {
                    askAIConversation.length > 0 && (
                        <div className="relative flex h-full min-h-0 flex-col border border-gray-300 rounded-md overflow-hidden">
                            <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-4 scroll-my-[10px]" ref={bottomRef}>
                                {askAIConversation.map((item, index) => (
                                    <div key={`${item.type}-${index}`} ref={bottomRef}>
                                        {
                                            item.type === "question" && 
                                            <p className="mb-2 shrink-0 text-xs font-medium uppercase tracking-wide text-gray-500">{item.conversation}</p>
                                        }
                                        {
                                            item.type === "response" && 
                                            <RenderAIResponse markdownText={item.conversation} refenrencedPlayers={item.referencedPlayers} follwupQuestions={item.followUps} followupQuestionClick={(question, followupType) => handleSendFollowup(question, followupType)} playerNameClick={(currentPlayer: Player) => setSelectedPlayer(currentPlayer)}/>
                                        }
                                    </div>
                                ))}
                                {
                                    isPending &&
                                    <p className="text-left text-sm text-gray-500 mb-4 animate-pulse scroll-mb-[5px]" ref={bottomRef}>Scouting...</p>
                                }
                            </div>
                            <div className="flex shrink-0 items-center gap-2 border-t border-gray-300 p-2">
                                <Input
                                    type="text"
                                    placeholder="Ask a follow-up..."
                                    value={followUpQuestion}
                                    onChange={(e) => setFollowUpQuestion(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendFollowup()}
                                    className="flex-1"
                                />
                                <SendSharp className="cursor-pointer" onClick={handleSendFollowup} />
                            </div>
                        </div>
                    )
                }
                {
                    !isAiChatActive && !selectedQuestion && (
                        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden border border-gray-300 rounded-md p-4 overflow-y-auto">
                            <p className="mb-2 shrink-0 text-xs font-medium uppercase tracking-wide text-gray-500">
                                Try asking
                            </p>
                            <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
                                {questions.map((question) => (
                                    <li key={question.key} className="mb-2 hover:translate-x-1 hover:scale-105 transition-all duration-300">
                                        <Badge variant="outline" className="p-4 cursor-pointer" onClick={() => handleQuestionClick(question)}>{question?.displayValue}</Badge>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default AskAI

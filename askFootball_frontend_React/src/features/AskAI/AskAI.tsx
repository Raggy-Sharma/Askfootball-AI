import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAskAI } from "./AskAI.queries"
import useStore from "@/Store";
import { useEffect, useState, useRef } from "react";
import { SendSharp } from "@mui/icons-material";
const commonQuestions = [
    {key: "common_question_1", displayValue: "How important is this player?", value: "How important is this player in this team?"},
    {key: "common_question_2", displayValue: "Where does this player add value?", value: "Where does this player add value to this team?"},
    {key: "common_question_3", displayValue: "Which traits affect match results?", value: "Which traits affect match results in this team?"},
    {key: "common_question_4", displayValue: "How well does this player fit?", value: "How well does this player fit in this team?"},
    {key: "common_question_5", displayValue: "How well does this player fit?", value: "How well does this player fit in this team?"},
]

const AskAI = () => {
    const selectedClub = useStore((state) => state.selectedClub)
    const { mutate, isPending, isError, error } = useAskAI();
    const [aiResponse, setAiResponse] = useState<{question: string, response: string}[]>([]) 
    const [followUpQuestion, setFollowUpQuestion] = useState<string>("")
    const [selectedQuestion, setSelectedQuestion] = useState<string>("")
    const selectedPlayer = useStore((state) => state.selectedPlayer)
    const setIsAIChatActive = useStore(state => state.setIsAIChatActive)
    const askAIConversation = useStore(state => state.askAIConversation);
    const setAskAIConversation = useStore(state => state.setAskAICoversation);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => { 
        setSelectedQuestion("");
        setAiResponse([]);
    }, [selectedPlayer]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [askAIConversation.length]);
    const handleQuestionClick = (question: {key: string, displayValue: string, value: string}) => {
        setAskAIConversation([...askAIConversation, question.value]); 
        setIsAIChatActive(true)
        const normalizeQuestion = question.value.replace("this player",  `${selectedPlayer?.display_name}`).replace("this team",  `${selectedClub.club_name}`)
        setSelectedQuestion(normalizeQuestion);
        mutate(normalizeQuestion, {
            onSuccess: (data) => {
              setAiResponse((prev) => [...prev, { question: normalizeQuestion, response: data.response }]);
              setAskAIConversation([...askAIConversation, question.value, data.response])
            }
        });
    }

    const handleSendFollowup = () => {
        const question = followUpQuestion.trim();
        if (!question) return;
        setAskAIConversation([...askAIConversation, question])
        setFollowUpQuestion("");
        mutate(question, {
            onSuccess: (data) => {
                setAiResponse((prev) => [...prev, { question, response: data.response }]);
                setAskAIConversation([...askAIConversation, question, data.response])
            }
        });
    }
    if (isError) {
        return <p className="text-center text-sm text-red-500">Error: {error.message}</p>
    }
    return (
        <div className="flex flex-col h-full">
            <h2 className="mb-3 shrink-0 text-center text-lg font-bold">Ask AI</h2>
            <div className="flex h-full min-h-0 flex-1 flex-col">

                {
                    askAIConversation.length > 0 && (
                        <div className="relative flex h-full min-h-0 flex-col border border-gray-300 rounded-md overflow-hidden">
                            <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-4 scroll-my-[10px]" ref={bottomRef}>
                                {askAIConversation.map((item, index) => (
                                    <div key={`${item.question}-${index}`} ref={bottomRef}>
                                        <p className="mb-2 shrink-0 text-xs font-medium uppercase tracking-wide text-gray-500">
                                            {item}
                                        </p>
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
                    aiResponse.length === 0 && !selectedQuestion && (
                        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden border border-gray-300 rounded-md p-4 overflow-y-auto">
                            <p className="mb-2 shrink-0 text-xs font-medium uppercase tracking-wide text-gray-500">
                                Try asking
                            </p>
                            <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
                                {commonQuestions.map((question) => (
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

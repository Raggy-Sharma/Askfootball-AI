import { useMutation } from "@tanstack/react-query"
import { sendQuestion } from "./AskAI.api"

export const useAskAI = () => {
    return useMutation({
        mutationFn: sendQuestion,
    })
}

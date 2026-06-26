import { http } from "@/lib/api/http"

type ChatResponse = { response: string }

export const sendQuestion = async (question: string) => {
    return http<ChatResponse>("/chat", {
        method: "POST",
        body: JSON.stringify({ message: question }),
    })
}

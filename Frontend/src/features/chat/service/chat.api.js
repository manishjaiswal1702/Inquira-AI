import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})


export const sendMessage = async ({ message, chatId, files = [] }) => {
    const formData = new FormData()
    formData.append("message", message)
    if (chatId) {
        formData.append("chat", chatId)
    }
    
    // Add files if provided
    files.forEach((file) => {
        formData.append("files", file)
    })

    const response = await api.post("/api/chats/message", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return response.data
}

export const getChats = async () => {
    const response = await api.get("/api/chats")
    return response.data
}

export const getMessages = async (chatId) => {
    const response = await api.get(`/api/chats/${chatId}/messages`)
    return response.data
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chats/delete/${chatId}`)
    return response.data
}

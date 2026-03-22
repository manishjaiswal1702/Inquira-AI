import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages } from "../service/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, updateLastMessage, addMessages } from "../chat.slice";
import { useDispatch } from "react-redux";
import { appendToLastMessage, replaceTempChat } from "../chat.slice";



export const useChat = () => {

    const dispatch = useDispatch()

    async function handleSendMessage({ message, chatId, files = [] }) {
        try {
            dispatch(setLoading(true))

            // For new chats, don't show optimistic updates until server responds
            // This prevents temporary messages from appearing before chat creation
            if (!chatId) {
                // 1️⃣ temporary chat id (UI ke liye)
                const tempChatId = "temp-" + Date.now()

                // 2️⃣ UI instantly show karo (IMPORTANT)
                dispatch(createNewChat({
                    chatId: tempChatId,
                    title: "New Chat",
                }))
                dispatch(setCurrentChatId(tempChatId))

                dispatch(addNewMessage({
                    chatId: tempChatId,
                    content: message,
                    role: "user",
                }))

                dispatch(addNewMessage({
                    chatId: tempChatId,
                    content: "Thinking...",
                    role: "ai",
                }))


                try {
                    // 3️⃣ server call AFTER UI update
                    const data = await sendMessage({ message, chatId, files })
                    const { chat, aiMessage } = data

                    // 4️⃣ replace temp chatId with real chatId
                    dispatch(setCurrentChatId(chat._id))

                    dispatch(replaceTempChat({
                        tempChatId,
                        newChat: chat
                    }))

                    dispatch(setCurrentChatId(chat._id))

                    dispatch(updateLastMessage({
                        chatId: chat._id,
                        content: "",
                        role: "ai",
                    }))

                    const fullText = aiMessage.content
                    let index = 0

                    const interval = setInterval(() => {
                        if (index < fullText.length) {
                            dispatch(appendToLastMessage({
                                chatId: chat._id,
                                content: fullText[index],
                            }))
                            index++
                        } else {
                            clearInterval(interval)
                        }
                    }, 5)

                } catch (error) {
                    dispatch(updateLastMessage({
                        chatId: tempChatId,
                        content: "Something went wrong",
                        role: "ai",
                    }))
                }

                dispatch(setLoading(false))
                return
            }

            // For existing chats: optimistic update
            dispatch(addNewMessage({
                chatId,
                content: message,
                role: "user",
            }))
            dispatch(addNewMessage({
                chatId,
                content: "Thinking...",
                role: "ai",
            }))

            // Send to server
            const data = await sendMessage({ message, chatId, files })
            const { aiMessage } = data

            setTimeout(() => {

            dispatch(updateLastMessage({
                chatId,
                content: "",
                role: "ai",
            }))

            // Update the thinking message with actual AI response
            const fulltext = aiMessage.content
            let index = 0
            const interval = setInterval(() => {
                if (index < fulltext.length) {
                    dispatch(appendToLastMessage({
                        chatId,
                        content: fulltext[index],
                    }))
                    index++
                } else {
                    clearInterval(interval)
                }
            }, 5)

            }, 300) // Simulate thinking delay

            dispatch(setLoading(false))
        } catch (error) {
            dispatch(setLoading(false))
            dispatch(setError(error.response?.data?.message || "Failed to send message"))
        }
    }

    async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await getChats()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[chat._id] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt,
            }
            return acc
        }, {})))
        dispatch(setLoading(false))
    }

    async function handleOpenChat(chatId, chats) {

        console.log(chats[chatId]?.messages.length)

        if (chats[chatId]?.messages.length === 0) {
            const data = await getMessages(chatId)
            const { messages } = data

            const formattedMessages = messages.map(msg => ({
                content: msg.content,
                role: msg.role,
            }))

            dispatch(addMessages({
                chatId,
                messages: formattedMessages,
            }))
        }
        dispatch(setCurrentChatId(chatId))
    }

    function handleNewChat() {
        dispatch(setCurrentChatId(null))
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleNewChat
    }

}
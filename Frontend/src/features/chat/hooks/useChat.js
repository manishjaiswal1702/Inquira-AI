import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages} from "../service/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, updateLastMessage, addMessages } from "../chat.slice";
import { useDispatch } from "react-redux";


export const useChat = () => {

    const dispatch = useDispatch()


    async function handleSendMessage({ message, chatId, files = [] }) {
        try {
            dispatch(setLoading(true))

            // For new chats, don't show optimistic updates until server responds
            // This prevents temporary messages from appearing before chat creation
            if (!chatId) {
                // Send to server first to create chat
                const data = await sendMessage({ message, chatId, files })
                const { chat, aiMessage } = data

                // Create new chat in Redux and set current chat immediately
                dispatch(createNewChat({
                    chatId: chat._id,
                    title: chat.title,
                }))
                dispatch(setCurrentChatId(chat._id))

                // Show user message and temporary AI typing indicator first
                dispatch(addNewMessage({
                    chatId: chat._id,
                    content: message,
                    role: "user",
                }))
                dispatch(addNewMessage({
                    chatId: chat._id,
                    content: "Thinking...",
                    role: "ai",
                }))

                dispatch(setLoading(false))

                // Replace thinking placeholder with final AI response
                setTimeout(() => {
                    dispatch(updateLastMessage({
                        chatId: chat._id,
                        content: aiMessage.content,
                        role: aiMessage.role,
                    }))
                }, 400)

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

            // Update the thinking message with actual AI response
            dispatch(updateLastMessage({
                chatId,
                content: aiMessage.content,
                role: aiMessage.role,
            }))

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
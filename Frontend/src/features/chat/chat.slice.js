import { createSlice } from '@reduxjs/toolkit';


const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload

            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    id: chatId,
                    title,
                    messages: [],
                    lastUpdated: new Date().toISOString(),
                }
            } else {
                state.chats[chatId].lastUpdated = new Date().toISOString()
            }
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role } = action.payload
            if (!state.chats[chatId]) return
            state.chats[chatId].messages.push({ content, role })
            state.chats[chatId].lastUpdated = new Date().toISOString()
        },
        updateLastMessage: (state, action) => {
            const { chatId, content, role } = action.payload
            if (state.chats[chatId]?.messages?.length > 0) {
                const lastIndex = state.chats[chatId].messages.length - 1
                state.chats[chatId].messages[lastIndex] = { content, role }
                state.chats[chatId].lastUpdated = new Date().toISOString()
            }
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload
            state.chats[chatId].messages = messages
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
            // Clear temporary chat when switching to a new chat
            if (state.chats[null] && action.payload !== null) {
                delete state.chats[null]
            }
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        appendToLastMessage: (state, action) => {
            const { chatId, content } = action.payload
            const messages = state.chats[chatId]?.messages
            if (!messages || messages.length === 0) return

            const lastMessage = messages[messages.length - 1]
            lastMessage.content += content
        },
        replaceTempChat: (state, action) => {
            const { tempChatId, newChat } = action.payload

            // temp chat ke messages le lo
            const tempMessages = state.chats[tempChatId]?.messages || []

            // temp chat delete karo
            delete state.chats[tempChatId]

            // new chat add karo with same messages
            state.chats[newChat._id] = {
                id: newChat._id,
                title: newChat.title,
                messages: tempMessages,
                lastUpdated: new Date().toISOString(),
            }
        },
    }
})

export const { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, updateLastMessage, addMessages, appendToLastMessage, replaceTempChat } = chatSlice.actions
export default chatSlice.reducer


// chats = {
//     "docker and AWS": {
//         messages: [
//             {
//                 role: "user",
//                 content: "What is docker?"
//             },
//             {
//                 role: "ai",
//                 content: "Docker is a platform that allows developers to automate the deployment of applications inside lightweight, portable containers. It provides an efficient way to package and distribute software, ensuring consistency across different environments."
//             }
//         ],
//         id: "docker and AWS",
//         lastUpdated: "2024-06-20T12:34:56Z",
//     }

// }

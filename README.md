# 🚀 Inquira AI

**Inquira AI** is a full-stack AI-powered chat application inspired by ChatGPT, designed to provide a smooth, real-time conversational experience with streaming responses and modern UI.

---

## 🌟 Features

- 💬 Real-time AI Chat Interface  
- ⚡ Streaming Responses (Typing Effect)  
- 🤖 “Thinking…” State before AI response  
- 🔄 Auto Scroll like ChatGPT  
- 🧠 Multi-Model AI Support (Gemini + Mistral)  
- 🌐 Internet Access via Tavily API  
- 📁 File Attachment Support  
- 📜 Chat History Management  
- 🔐 Secure Authentication with Email Verification  
- 🎨 Modern UI with Gradient Effects  

---

## 🏗️ Frontend Architecture

The frontend follows a **4-layer architecture** for scalability and maintainability:

- **Component Layer** → UI rendering  
- **Hook Layer** → Business logic  
- **Service Layer** → API handling  
- **API Layer** → External API calls  

---

## 🛠️ Tech Stack

### Frontend:
- React.js  
- Redux Toolkit  
- Tailwind CSS  

### Backend:
- Node.js  
- Express.js  

### Real-time:
- Socket.io  

### AI & APIs:
- Gemini API  
- Mistral API  
- Tavily API (for real-time internet access)  

---

## ⚙️ How It Works

1. User sends a message  
2. Message is instantly shown (Optimistic UI)  
3. “Thinking…” state is displayed  
4. AI response is streamed character-by-character  
5. Chat history is stored for future use  

---

## 🧠 Key Learnings

- Managing complex state with Redux  
- Handling async operations & race conditions  
- Implementing optimistic UI updates  
- Integrating multiple LLM APIs  
- Designing scalable frontend architecture  
- Improving UX with real-time feedback  

---

## 🐞 Challenges Faced

- Duplicate messages due to async state updates  
- Sync issues between temporary and real chats  
- Implementing smooth streaming responses  
- Managing chat history efficiently  
- Handling edge cases for new vs existing chats  

---

## 🔐 Authentication

- Email verification required before login  
- Ensures secure access to the application  

---

## 🚀 Future Improvements

- 🔴 Stop Generation Button  
- 🔁 Regenerate Response  
- 🧠 Context Memory Improvements  
- 🎤 Voice Input  
- 📊 Analytics Dashboard  

---

## 🤝 Contributing

Feel free to fork this project and contribute!

---

## 📬 Contact

If you have any suggestions or feedback, feel free to connect with me.

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!

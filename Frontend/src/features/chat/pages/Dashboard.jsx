import { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { useAuth } from '../../../features/auth/hook/useAuth'
import { useNavigate } from 'react-router'
import remarkGfm from 'remark-gfm'
import { Plus, Home, Zap, Compass, BookOpen, History, MessageSquare, Lightbulb, Paperclip, LogOut, Trash2 } from 'lucide-react'


const Dashboard = () => {
  const { initializeSocketConnection, handleSendMessage, handleGetChats, handleOpenChat, handleNewChat: newChatHandler, handleDeleteChat } = useChat()
  const { handleLogout } = useAuth()
  const navigate = useNavigate()
  const [chatInput, setChatInput] = useState('')
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const user = useSelector((state) => state.auth.user)
  const [showGreeting, setShowGreeting] = useState(true)
  const fileInputRef = useRef(null)
  const [attachedFiles, setAttachedFiles] = useState([])
  const textareaRef = useRef(null)
  const bottomRef = useRef(null)

  // Get user initials for avatar
  const getInitials = (username) => {
    if (!username) return 'U'
    return username
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogoutClick = async () => {
    await handleLogout()
    navigate('/login')
  }

  useEffect(() => {
    initializeSocketConnection()
    handleGetChats()
  }, [])

  useEffect(() => {
    setShowGreeting(!currentChatId)
  }, [currentChatId])

  const messagesContainerRef = useRef(null)

  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    container.scrollTop = container.scrollHeight
  }, [currentChatId, chats[currentChatId]?.messages?.length])

  const handleSubmitMessage = (event) => {
    event.preventDefault()

    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage && attachedFiles.length === 0) {
      return
    }

    handleSendMessage({
      message: trimmedMessage,
      chatId: currentChatId,
      files: attachedFiles
    })
    setChatInput('')
    setAttachedFiles([])

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const openChat = (chatId) => {
    handleOpenChat(chatId, chats)
  }

  const handleNewChat = () => {
    newChatHandler()
    setChatInput('')
    setAttachedFiles([])
  }

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files || [])
    setAttachedFiles([...attachedFiles, ...files])
  }

  const handleRemoveFile = (index) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index))
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSubmitMessage(event)
    }
  }

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chats[currentChatId]?.messages?.length])


  const quickActions = [
    {
      icon: BookOpen,
      title: 'Quick Digest',
      description: 'Skip the long reads—get straight to the key points.'
    },
    {
      icon: MessageSquare,
      title: 'Write with Ease',
      description: 'From blogs to stories, let ideas flow effortlessly.'
    },
    {
      icon: Lightbulb,
      title: 'Ask & Know',
      description: 'Your questions answered, anytime, anywhere.'
    }
  ]

  return (
    <main className='min-h-screen w-full bg-[#0f0f1e] text-white flex'>
      {/* Sidebar - Fixed */}
      <aside className='hidden md:flex md:fixed md:left-0 md:top-0 md:h-screen w-64 bg-[#1a1a2e] border-r border-white/10 flex-col p-4 z-50'>
        {/* Logo/Brand */}
        <div className='mb-8'>
          <div className='flex items-center gap-2 mb-6'>
            <div className='w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-sm'>
              ◉
            </div>
            <h1 className='text-xl font-bold'>Inquira AI</h1>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className='group w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center gap-3 transition-all duration-200 shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98]'
          >
            <div className='flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 group-hover:bg-white/15 transition'>
              <Plus size={18} />
            </div>

            <span className='text-sm'>New Chat</span>

            <span className='ml-auto text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-white/80 group-hover:bg-white/15 transition'>
              N
            </span>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className='space-y-1 mb-8'>
          {[
            { icon: Home, label: 'Home' },
            { icon: Zap, label: 'Image Generator' },
            { icon: Compass, label: 'Explore' },
            { icon: BookOpen, label: 'Library' },
            { icon: History, label: 'History' }
          ].map((item) => (
            <button
              key={item.label}
              className='w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition'
            >
              <item.icon size={18} />
              <span className='text-sm font-medium'>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Recent Chats Section */}
        <div
          className='mb-8 flex-1 overflow-y-auto'
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style>{` .no-scrollbar::-webkit-scrollbar { display: none; } `}</style>
          <h3 className='text-xs uppercase text-white/50 font-semibold mb-3'>All Chats</h3>
          <div className='space-y-1 no-scrollbar'>
            {Object.values(chats)
              .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
              .map((chat) => (
                <div
                  key={chat.id}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${chat.id === currentChatId ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <button
                    onClick={() => openChat(chat.id)}
                    className='flex-1 text-left truncate'
                  >
                    {chat.title}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteChat(chat.id)
                    }}
                    className='opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-opacity'
                    title='Delete chat'
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className='border-t border-white/10 pt-4 space-y-2 overflow-hidden'>
          <button className='w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition'>
            <div className='w-9 aspect-square rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold shrink-0'>
              {getInitials(user?.username || 'User')}
            </div>
            <div className='flex-1 text-left'>
              <p className='text-sm font-medium'>{user?.username || 'User'}</p>
              <p className='text-xs text-white/50'>{user?.email || 'user@example.com'}</p>
            </div>
          </button>
          <button
            onClick={handleLogoutClick}
            className='w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition'
          >
            <LogOut size={18} />
            <span className='text-sm font-medium'>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content - Offset by sidebar */}
      <section className='flex-1 md:ml-64 flex flex-col'>
        {showGreeting ? (
          // Greeting Screen
          <div className='flex-1 flex flex-col items-center justify-center px-4 py-8'>
            {/* Logo */}
            <div className='mb-8'>
              <div className='w-16 h-16 rounded-2xl bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl'>
                ◉
              </div>
            </div>

            {/* Greeting Text */}
            <h2 className='text-4xl md:text-5xl font-bold mb-2 text-center'>What's on your mind today?</h2>

            {/* Search/Input Area */}
            <div className='w-full max-w-2xl mt-12 mb-12'>
              {/* Attached Files Display */}
              {attachedFiles.length > 0 && (
                <div className='mb-3 flex flex-wrap gap-2'>
                  {attachedFiles.map((file, index) => (
                    <div key={index} className='flex items-center gap-2 bg-[#1a1a2e] border border-white/20 rounded-lg px-3 py-2'>
                      <Paperclip size={14} className='text-orange-400' />
                      <span className='text-xs text-white/70 truncate max-w-xs'>{file.name}</span>
                      <button
                        type='button'
                        onClick={() => handleRemoveFile(index)}
                        className='ml-1 text-white/50 hover:text-white transition'
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmitMessage} className='relative'>
                <div className='flex items-center gap-2 bg-[#1a1a2e] border border-white/20 rounded-2xl px-3 py-2 focus-within:border-orange-500/50 focus-within:bg-[#242438] transition'>
                  {/* File Upload Button */}
                  <input
                    ref={fileInputRef}
                    type='file'
                    multiple
                    onChange={handleFileSelect}
                    className='hidden'
                    accept='*/*'
                  />
                  <div className='absolute left-2 bottom-[10px] flex items-center gap-2'>
                    <button
                      type='button'
                      onClick={() => fileInputRef.current?.click()}
                      className='p-2 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition'
                    >
                      <Paperclip size={18} />
                    </button>
                  </div>

                  {/* Text Input */}
                  <textarea
                    rows={1}
                    value={chatInput}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                      setChatInput(e.target.value)
                      e.target.style.height = 'auto'
                      e.target.style.height = e.target.scrollHeight + 'px'
                    }}
                    placeholder='Ask Anything...'
                    className='flex-1 bg-transparent text-white outline-none resize-none overflow-hidden placeholder:text-white/40 py-2 pl-10 pr-10'
                  />
                </div>

                {/* Toolbar buttons */}
                <div className='absolute right-2 bottom-2.5 flex items-center gap-2'>
                  <button
                    type='submit'
                    disabled={!chatInput.trim() && attachedFiles.length === 0}
                    className='p-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/30 rounded-lg transition disabled:cursor-not-allowed'
                  >
                    <span>⬆</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Action Cards */}
            <div className='w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4'>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className='p-6 bg-[#1a1a2e] border border-white/10 rounded-2xl hover:border-orange-500/30 hover:bg-[#242438] transition text-left'
                >
                  <action.icon size={24} className='text-orange-400 mb-3' />
                  <h3 className='font-semibold text-white mb-1'>{action.title}</h3>
                  <p className='text-sm text-white/50'>{action.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Chat Screen
          <div className='flex-1 flex flex-col relative overflow-hidden'>
            {/* Messages */}
            {/* Messages */}
            <div
              ref={messagesContainerRef}
              className='messages flex-1 overflow-y-auto space-y-4 px-6 py-8 pb-40'
              style={{
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {chats[currentChatId]?.messages?.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm md:text-base ${message.role === 'user'
                      ? 'rounded-br-none bg-orange-500/20 text-white border border-orange-500/30'
                      : 'rounded-bl-none bg-[#1a1a2e] text-white/90 border border-white/10'
                      }`}
                  >
                    {message.role === 'user' ? (
                      <p>{message.content}</p>
                    ) : message.content === 'Thinking...' ? (
                      // Animated thinking indicator
                      <div className='flex items-center gap-1.5'>
                        <span className='text-white/60'>AI is thinking</span>
                        <div className='flex gap-1'>
                          <span className='w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce' style={{ animationDelay: '0s' }}></span>
                          <span className='w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce' style={{ animationDelay: '0.2s' }}></span>
                          <span className='w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce' style={{ animationDelay: '0.4s' }}></span>
                        </div>
                      </div>
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
                          ul: ({ children }) => <ul className='mb-2 list-disc pl-5'>{children}</ul>,
                          ol: ({ children }) => <ol className='mb-2 list-decimal pl-5'>{children}</ol>,
                          code: ({ children }) => <code className='rounded bg-white/10 px-1 py-0.5 text-sm'>{children}</code>,
                          pre: ({ children }) => <pre className='mb-2 overflow-x-auto rounded-xl bg-black/30 p-3 text-xs'>{children}</pre>
                        }}
                        remarkPlugins={[remarkGfm]}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input Footer */}
            <div className='fixed bottom-0 left-0 md:left-64 right-0 z-50 border-t border-white/10 bg-linear-to-t from-[#0f0f1e] to-[#0f0f1e]/80 px-6 py-4'>
              <form onSubmit={handleSubmitMessage} className='max-w-3xl mx-auto'>
                {/* Attached Files Display */}
                {attachedFiles.length > 0 && (
                  <div className='mb-3 flex flex-wrap gap-2'>
                    {attachedFiles.map((file, index) => (
                      <div key={index} className='flex items-center gap-2 bg-[#1a1a2e] border border-white/20 rounded-lg px-3 py-2'>
                        <Paperclip size={14} className='text-orange-400' />
                        <span className='text-xs text-white/70 truncate max-w-xs'>{file.name}</span>
                        <button
                          type='button'
                          onClick={() => handleRemoveFile(index)}
                          className='ml-1 text-white/50 hover:text-white transition'
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className='relative'>
                  <div className='flex items-center gap-2 bg-[#1a1a2e] border border-white/20 rounded-2xl px-3 py-2 focus-within:border-orange-500/50 focus-within:bg-[#242438] transition'>

                    {/* File Upload */}
                    <input
                      ref={fileInputRef}
                      type='file'
                      multiple
                      onChange={handleFileSelect}
                      className='hidden'
                      accept='*/*'
                    />

                    <div className='absolute left-2 bottom-2.5 flex items-center gap-2'>
                      <button
                        type='button'
                        onClick={() => fileInputRef.current?.click()}
                        className='p-2 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition'
                      >
                        <Paperclip size={18} />
                      </button>
                    </div>

                    {/* Textarea */}
                    <textarea
                      ref={textareaRef}
                      rows={1}
                      value={chatInput}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => {
                        setChatInput(e.target.value)
                        e.target.style.height = 'auto'
                        e.target.style.height = e.target.scrollHeight + 'px'
                      }}
                      placeholder='Ask a follow-up...'
                      className='flex-1 bg-transparent text-white outline-none resize-none overflow-hidden placeholder:text-white/40 py-2 pl-10 pr-10'
                    />
                  </div>

                  {/* Right Side Buttons (inside input like top) */}
                  <div className='absolute right-2 bottom-2.5 flex items-center gap-2'>

                    <button
                      type='submit'
                      disabled={!chatInput.trim() && attachedFiles.length === 0}
                      className='p-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/30 rounded-lg transition disabled:cursor-not-allowed'
                    >
                      ⬆
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default Dashboard
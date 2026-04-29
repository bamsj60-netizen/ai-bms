import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import WelcomeScreen from '@/components/WelcomeScreen';
import MessageBubble from '@/components/MessageBubble';
import ChatInput from '@/components/ChatInput';
import LoadingBubble from '@/components/LoadingBubble';
import Toast from '@/components/Toast';
import type { ToastType } from '@/components/Toast';
import { useChat } from '@/hooks/useChat';
import { useTheme } from '@/hooks/useTheme';
import { useSpeech } from '@/hooks/useSpeech';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    chats,
    activeId,
    activeChat,
    isTyping,
    currentImage,
    personality,
    selectedModel,
    setCurrentImage,
    setPersonality,
    setSelectedModel,
    createNewChat,
    switchChat,
    deleteChat,
    clearAllChats,
    sendMessage,
    markMessageNotNew,
  } = useChat();
  const { speakingIdx, toggleSpeech } = useSpeech();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' as ToastType, visible: false });
  const viewportRef = useRef<HTMLDivElement>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [activeChat?.messages, isTyping]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    if (toastTimeoutRef.current !== null) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type, visible: true });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  const handleCopy = useCallback((idx: number) => {
    const chat = chats.find(c => c.id === activeId);
    if (!chat) return;
    const text = chat.messages[idx]?.content;
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      showToast('Disalin!', 'success');
    }).catch(() => {
      const helper = document.createElement('textarea');
      helper.value = text;
      document.body.appendChild(helper);
      helper.select();
      document.execCommand('copy');
      document.body.removeChild(helper);
      showToast('Disalin!', 'success');
    });
  }, [chats, activeId, showToast]);

  const handleQuickMessage = useCallback((msg: string) => {
    sendMessage(msg, null);
  }, [sendMessage]);

  const handleToggleSpeech = useCallback((idx: number, text: string) => {
    toggleSpeech(idx, text);
  }, [toggleSpeech]);

  const handleMarkNotNew = useCallback((chatId: number, idx: number) => {
    markMessageNotNew(chatId, idx);
  }, [markMessageNotNew]);

  return (
    <div className="flex h-screen overflow-hidden relative">
      <AnimatedBackground />
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
      <Sidebar
        chats={chats}
        activeId={activeId}
        theme={theme}
        personality={personality}
        selectedModel={selectedModel}
        onNewChat={createNewChat}
        onSwitchChat={switchChat}
        onDeleteChat={deleteChat}
        onClearAll={clearAllChats}
        onToggleTheme={toggleTheme}
        onChangePersonality={setPersonality}
        onChangeModel={setSelectedModel}
        onQuickMessage={handleQuickMessage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 flex flex-col min-w-0 h-full relative z-10">
        <ChatHeader
          modelName={selectedModel}
          onToggleSidebar={() => setSidebarOpen(true)}
        />
        <div
          ref={viewportRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 no-scrollbar"
        >
          {(!activeChat || activeChat.messages.length === 0) ? (
            <WelcomeScreen onQuickMessage={handleQuickMessage} />
          ) : (
            <AnimatePresence mode="popLayout">
              {activeChat.messages.map((msg, idx) => (
                <MessageBubble
                  key={`${activeChat.id}-${idx}`}
                  message={msg}
                  index={idx}
                  isSpeaking={speakingIdx === idx}
                  onCopy={handleCopy}
                  onToggleSpeech={handleToggleSpeech}
                  onMarkNotNew={(i) => handleMarkNotNew(activeChat.id, i)}
                />
              ))}
              {isTyping && <LoadingBubble key="loading" />}
            </AnimatePresence>
          )}
        </div>
        <ChatInput
          onSend={sendMessage}
          isTyping={isTyping}
          currentImage={currentImage}
          onImageChange={setCurrentImage}
        />
      </main>
    </div>
  );
}

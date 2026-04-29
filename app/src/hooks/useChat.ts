import { useState, useCallback, useEffect } from 'react';
import type { Chat, ChatMessage } from '@/types';
import { GROQ_API_KEY, BMS_KNOWLEDGE, PERSONALITY_PROMPTS, MODEL_PERSONALITY } from '@/lib/constants';

const STORAGE_KEY = 'bms_pro_v4_storage';

export function useChat() {
  const [chats, setChats] = useState<Chat[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [personality, setPersonality] = useState<'formal' | 'fun' | 'toxic'>('formal');
  const [selectedModel, setSelectedModel] = useState('GPT OSS 120B');

  // Persist chats
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  const activeChat = chats.find(c => c.id === activeId) || null;

  const createNewChat = useCallback(() => {
    const id = Date.now();
    const chat: Chat = {
      id,
      title: 'Diskusi Baru',
      messages: [],
      model: selectedModel,
    };
    setChats(prev => [chat, ...prev]);
    setActiveId(id);
    return id;
  }, [selectedModel]);

  const switchChat = useCallback((id: number) => {
    setActiveId(id);
  }, []);

  const deleteChat = useCallback((id: number) => {
    setChats(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (activeId === id) {
        setActiveId(filtered[0]?.id || null);
      }
      return filtered;
    });
  }, [activeId]);

  const clearAllChats = useCallback(() => {
    setChats([]);
    setActiveId(null);
  }, []);

  const addMessage = useCallback((chatId: number, message: ChatMessage) => {
    setChats(prev =>
      prev.map(c => {
        if (c.id === chatId) {
          const updatedMessages = [...c.messages, message];
          const title = c.title === 'Diskusi Baru' && message.role === 'user'
            ? message.content.substring(0, 24)
            : c.title;
          return { ...c, messages: updatedMessages, title };
        }
        return c;
      })
    );
  }, []);

  const markMessageNotNew = useCallback((chatId: number, msgIndex: number) => {
    setChats(prev =>
      prev.map(c => {
        if (c.id === chatId) {
          const updated = c.messages.map((m, i) =>
            i === msgIndex ? { ...m, isNew: false } : m
          );
          return { ...c, messages: updated };
        }
        return c;
      })
    );
  }, []);

  const sendMessage = useCallback(async (content: string, image: string | null) => {
    if (!content.trim() && !image) return;

    let chatId = activeId;
    if (!chatId) {
      chatId = createNewChat();
    }

    const userMsg: ChatMessage = { role: 'user', content, image };
    addMessage(chatId, userMsg);
    setCurrentImage(null);
    setIsTyping(true);

    try {
      const chat = chats.find(c => c.id === chatId);
      const modelName = chat?.model || selectedModel;

      let sysPrompt = 'Kamu adalah BMS AI Professional, asisten cerdas umum yang powerful. ';
      sysPrompt += 'PENTING: Hanya berikan informasi detail tentang BMS STORE atau BMS STUDIO jika user bertanya tentang hal tersebut. Jika pertanyaan user bersifat umum, jawablah secara natural tanpa membawa-bawa BMS.\n';
      sysPrompt += 'PENGETAHUAN KHUSUS (Gunakan jika relevan): \n' + BMS_KNOWLEDGE + '\n';

      // Add model-specific personality
      const modelPersonality = MODEL_PERSONALITY[modelName];
      if (modelPersonality) {
        sysPrompt += `\n${modelPersonality}\n`;
      }

      // Add user-selected personality
      const isUncensored = modelName.includes('Uncensored') || modelName.includes('Dark') || personality === 'toxic';
      sysPrompt += PERSONALITY_PROMPTS[isUncensored ? 'toxic' : personality] || PERSONALITY_PROMPTS.formal;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: sysPrompt },
            ...(chat?.messages.slice(-6) || []).map(m => ({
              role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
              content: m.content,
            })),
            { role: 'user', content },
          ],
          temperature: isUncensored ? 1.0 : 0.7,
        }),
      });

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'Maaf, terjadi kesalahan. Silakan coba lagi.';

      const aiMsg: ChatMessage = { role: 'ai', content: aiResponse, isNew: true };
      addMessage(chatId, aiMsg);
    } catch (err) {
      const errorMsg: ChatMessage = {
        role: 'ai',
        content: '⚠️ Gangguan pada Engine BMS AI. Coba lagi nanti.',
      };
      addMessage(chatId, errorMsg);
    } finally {
      setIsTyping(false);
    }
  }, [activeId, chats, selectedModel, personality, createNewChat, addMessage]);

  return {
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
  };
}

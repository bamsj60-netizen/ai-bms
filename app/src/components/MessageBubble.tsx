import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Volume2, VolumeX, Bot, User } from 'lucide-react';
import type { ChatMessage } from '@/types';

interface MessageBubbleProps {
  message: ChatMessage;
  index: number;
  isSpeaking: boolean;
  onCopy: (idx: number) => void;
  onToggleSpeech: (idx: number, text: string) => void;
  onMarkNotNew?: (idx: number) => void;
}

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/### (.*?)\n/g, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
    .replace(/## (.*?)\n/g, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
    .replace(/# (.*?)\n/g, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
    .replace(/- (.*?)\n/g, '<li class="ml-4 flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span><span>$1</span></li>')
    .replace(/(\d+)\. (.*?)\n/g, '<li class="ml-4 flex items-start gap-2"><span class="text-blue-500 font-bold shrink-0">$1.</span><span>$2</span></li>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-black/30 rounded-lg p-3 my-2 overflow-x-auto"><code class="text-[11px] font-mono">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-[11px] font-mono">$1</code>')
    .replace(/\n/g, '<br>');
}

export default function MessageBubble({
  message,
  index,
  isSpeaking,
  onCopy,
  onToggleSpeech,
  onMarkNotNew,
}: MessageBubbleProps) {
  const isAI = message.role === 'ai';
  const contentRef = useRef<HTMLDivElement>(null);
  const [displayedText, setDisplayedText] = useState(message.isNew ? '' : message.content);
  const [showActions, setShowActions] = useState(!message.isNew);
  const [isTyping, setIsTyping] = useState(message.isNew || false);

  useEffect(() => {
    if (message.isNew && isAI) {
      const words = message.content.split(' ');
      let currentIndex = 0;
      setDisplayedText('');
      setShowActions(false);
      setIsTyping(true);

      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedText(words.slice(0, currentIndex + 1).join(' '));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          setShowActions(true);
          onMarkNotNew?.(index);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [message.isNew, message.content, isAI, index, onMarkNotNew]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.1] }}
      className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`msg-container ${isAI ? 'ai-msg' : 'user-msg'} shadow-lg`}>
        {/* Role indicator */}
        <div className="flex items-center gap-2 mb-2 opacity-50">
          {isAI ? (
            <>
              <Bot className="w-3 h-3" />
              <span className="text-[9px] font-bold uppercase tracking-wider">BMS AI</span>
            </>
          ) : (
            <>
              <User className="w-3 h-3" />
              <span className="text-[9px] font-bold uppercase tracking-wider">You</span>
            </>
          )}
        </div>

        {/* Image attachment */}
        {message.image && (
          <img
            src={message.image}
            alt="Attachment"
            className="max-w-[280px] rounded-2xl mb-4 border border-white/10"
          />
        )}

        {/* Message content */}
        <div
          ref={contentRef}
          className={`text-[13px] leading-relaxed ${isTyping ? 'ai-typing-cursor' : ''}`}
          dangerouslySetInnerHTML={{ __html: formatMarkdown(displayedText) }}
        />

        {/* AI Actions */}
        {isAI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showActions ? 1 : 0, visibility: showActions ? 'visible' : 'hidden' }}
            transition={{ duration: 0.3 }}
            className="flex gap-2 mt-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onCopy(index)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-all"
              title="Salin Teks"
            >
              <Copy className="w-3 h-3" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onToggleSpeech(index, message.content)}
              className={`voice-btn w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isSpeaking
                  ? 'voice-active'
                  : 'bg-white/10 hover:bg-purple-600'
              }`}
              title={isSpeaking ? 'Berhenti' : 'Dengarkan'}
            >
              {isSpeaking ? (
                <VolumeX className="w-3 h-3" />
              ) : (
                <Volume2 className="w-3 h-3" />
              )}
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

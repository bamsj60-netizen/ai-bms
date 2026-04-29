import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, X, ImagePlus, Mic } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string, image: string | null) => void;
  isTyping: boolean;
  currentImage: string | null;
  onImageChange: (img: string | null) => void;
}

export default function ChatInput({
  onSend,
  isTyping,
  currentImage,
  onImageChange,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = useCallback(() => {
    const val = input.trim();
    if ((!val && !currentImage) || isTyping) return;
    onSend(val, currentImage);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [input, currentImage, isTyping, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
    setInput(el.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onImageChange(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Browser tidak mendukung voice input');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + (prev ? ' ' : '') + transcript);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
          textareaRef.current.focus();
        }
      }, 0);
    };

    recognition.start();
  };

  return (
    <div className="p-4 md:p-8 shrink-0">
      <div className="max-w-5xl mx-auto">
        {/* Image Preview */}
        {currentImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-4 glass rounded-2xl inline-flex items-center gap-4 p-3 animate-bounce-subtle"
          >
            <div className="relative w-16 h-16">
              <img
                src={currentImage}
                alt="Preview"
                className="w-full h-full object-cover rounded-2xl border border-white/10"
              />
              <button
                onClick={() => onImageChange(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="pr-4">
              <p className="text-xs font-bold text-blue-500">Gambar Terlampir</p>
            </div>
          </motion.div>
        )}

        {/* Input Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative glass rounded-[2.8rem] p-3 shadow-2xl border border-white/10 focus-within:border-blue-500/50 transition-all duration-500"
        >
          <div className="flex items-end gap-2">
            {/* File Upload */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors shrink-0"
            >
              <ImagePlus className="w-6 h-6" />
            </motion.button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            {/* Voice Input */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleVoiceInput}
              className={`w-10 h-12 flex items-center justify-center transition-colors shrink-0 ${
                isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-purple-500'
              }`}
            >
              <Mic className="w-5 h-5" />
            </motion.button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Tanya sesuatu..."
              rows={1}
              className="flex-1 bg-transparent border-none focus:ring-0 py-3.5 px-2 text-sm md:text-base outline-none resize-none no-scrollbar min-h-[44px] max-h-[200px]"
              disabled={isTyping}
            />

            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={isTyping || (!input.trim() && !currentImage)}
              className={`w-14 h-14 rounded-[1.8rem] flex items-center justify-center shadow-xl transition-all shrink-0 ${
                isTyping || (!input.trim() && !currentImage)
                  ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-tr from-blue-600 to-indigo-700 text-white active:scale-90'
              }`}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Footer text */}
        <p className="text-center mt-4 opacity-20 text-[9px] font-black uppercase tracking-[0.4em]">
          Official Intelligence of BMS STUDIO
        </p>
      </div>
    </div>
  );
}

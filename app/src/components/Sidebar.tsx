import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  MessageSquare,
  Trash2,
  Moon,
  Sun,
  ChevronRight,
  Store,
  Code2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { AI_MODELS } from '@/lib/constants';
import type { Chat } from '@/types';

interface SidebarProps {
  chats: Chat[];
  activeId: number | null;
  theme: 'dark' | 'light';
  personality: string;
  selectedModel: string;
  onNewChat: () => void;
  onSwitchChat: (id: number) => void;
  onDeleteChat: (id: number) => void;
  onClearAll: () => void;
  onToggleTheme: () => void;
  onChangePersonality: (p: 'formal' | 'fun' | 'toxic') => void;
  onChangeModel: (m: string) => void;
  onQuickMessage: (msg: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  chats,
  activeId,
  theme,
  personality,
  selectedModel,
  onNewChat,
  onSwitchChat,
  onDeleteChat,
  onClearAll,
  onToggleTheme,
  onChangePersonality,
  onChangeModel,
  onQuickMessage,
  isOpen,
  onClose,
}: SidebarProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClear = () => {
    onClearAll();
    setShowClearConfirm(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-black font-outfit tracking-tighter">
                BMS <span className="text-blue-500">AI</span>
              </h1>
              <p className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-40">
                Pro Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNewChat}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xl btn-hover transition-all"
          >
            <Plus className="w-4 h-4" />
            Obrolan Baru
          </motion.button>

          <a
            href="https://discord.gg/aUxTkhTCRF"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-2xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xl btn-hover transition-all"
            style={{ backgroundColor: '#5865F2' }}
          >
            <MessageSquare className="w-4 h-4" />
            Komunitas Discord
          </a>

          <a
            href="https://wa.me/6285808702230"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-2xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xl btn-hover transition-all"
            style={{ backgroundColor: '#22c55e' }}
          >
            <Zap className="w-4 h-4" />
            Hubungi CS (Admin)
          </a>
        </div>

        {/* History Label */}
        <label className="text-[9px] font-bold uppercase tracking-widest opacity-30 px-2 mb-2 block">
          Riwayat Sesi
        </label>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2 no-scrollbar">
        <AnimatePresence>
          {chats.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`p-4 rounded-2xl cursor-pointer flex items-center justify-between group transition-all ${
                activeId === chat.id
                  ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
              onClick={() => {
                onSwitchChat(chat.id);
                onClose();
              }}
            >
              <span className="text-[11px] font-bold truncate pr-3 flex-1">
                {chat.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {chats.length === 0 && (
          <div className="text-center py-8 opacity-20">
            <p className="text-[11px]">Belum ada riwayat chat</p>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="p-6 border-t border-white/5 space-y-4 bg-black/10">
        {/* Personality Selector */}
        <div className="space-y-2">
          <label className="text-[9px] font-bold uppercase tracking-widest opacity-30 px-2 block">
            Gaya Balasan
          </label>
          <select
            value={personality}
            onChange={(e) => onChangePersonality(e.target.value as 'formal' | 'fun' | 'toxic')}
            className="bms-select w-full rounded-xl p-3 text-[11px] font-semibold outline-none transition-all"
          >
            <option value="formal">Sopan & Professional</option>
            <option value="fun">Asik & Friendly</option>
            <option value="toxic">Toxic Gaul SMA (Uncensored)</option>
          </select>
        </div>

        {/* Model Selector */}
        <div className="space-y-2">
          <label className="text-[9px] font-bold uppercase tracking-widest opacity-30 px-2 block">
            Kategori Kemampuan
          </label>
          <select
            value={selectedModel}
            onChange={(e) => onChangeModel(e.target.value)}
            className="bms-select w-full rounded-xl p-3 text-[10px] font-semibold outline-none transition-all"
          >
            {AI_MODELS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* BMS Info Cards */}
        <div className="pt-4 border-t border-white/5 space-y-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => onQuickMessage('Apa itu BMS STORE?')}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-500">
                <Store className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-tighter">BMS STORE</span>
                <span className="text-[8px] opacity-40">Digital Products</span>
              </div>
            </div>
            <ChevronRight className="w-3 h-3 text-gray-600" />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => onQuickMessage('Apa itu BMS STUDIO?')}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-purple-500/30 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-500">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-tighter">BMS STUDIO</span>
                <span className="text-[8px] opacity-40">Roblox Developer</span>
              </div>
            </div>
            <span className="text-[8px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-bold">PRO</span>
          </motion.div>
        </div>

        {/* Theme Toggle & Reset */}
        <div className="flex items-center gap-2 pt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleTheme}
            className="flex-1 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all shadow-inner"
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-blue-400" />
            ) : (
              <Sun className="w-4 h-4 text-orange-400" />
            )}
          </motion.button>

          {showClearConfirm ? (
            <div className="flex-[2] flex items-center gap-1">
              <button
                onClick={handleClear}
                className="flex-1 h-10 text-[9px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest transition-all bg-red-500/10 rounded-xl"
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 h-10 text-[9px] font-black opacity-50 hover:opacity-100 uppercase tracking-widest transition-all"
              >
                Batal
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex-[2] text-[9px] h-10 font-black opacity-30 hover:opacity-100 hover:text-red-500 uppercase tracking-widest transition-all"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : '-100%',
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-[320px] glass flex flex-col fixed inset-y-0 left-0 z-50 lg:relative lg:transform-none border-r border-white/5"
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
}
